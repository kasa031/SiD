import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { pollCreationLimiter } from '../middleware/security.js';
import { validatePollTitle, validateLocationName, sanitizeString } from '../utils/validation.js';

const router = express.Router();

// Hent alle polls (med søk og filtrering)
router.get('/', async (req, res) => {
  try {
    const { search, location_type, location_name, politician_name } = req.query;
    let query = `
      SELECT 
        p.id, p.title, p.description, p.location_type, p.location_name,
        p.category, p.created_at, p.ends_at,
        u.username as creator_username, u.profile_picture_url as creator_picture,
        (SELECT COUNT(*) FROM poll_options WHERE poll_id = p.id) as options_count,
        (SELECT COUNT(*) FROM votes WHERE poll_id = p.id) as total_votes
      FROM polls p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.is_deleted = FALSE
    `;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (req.query.category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(req.query.category);
    }

    if (location_type) {
      paramCount++;
      query += ` AND p.location_type = $${paramCount}`;
      params.push(location_type);
    }

    if (location_name) {
      paramCount++;
      query += ` AND p.location_name = $${paramCount}`;
      params.push(location_name);
    }

    if (politician_name) {
      paramCount++;
      query += ` AND p.id IN (
        SELECT poll_id FROM politician_tags WHERE politician_name ILIKE $${paramCount}
      )`;
      params.push(`%${politician_name}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);

    // Hent options for hver poll
    const pollsWithOptions = await Promise.all(
      result.rows.map(async (poll) => {
        const optionsResult = await pool.query(
          'SELECT id, option_text, votes_count FROM poll_options WHERE poll_id = $1 ORDER BY id',
          [poll.id]
        );

        const tagsResult = await pool.query(
          'SELECT politician_name FROM politician_tags WHERE poll_id = $1',
          [poll.id]
        );

        return {
          ...poll,
          options: optionsResult.rows,
          politician_tags: tagsResult.rows.map(t => t.politician_name),
        };
      })
    );

    res.json({ polls: pollsWithOptions });
  } catch (error) {
    console.error('Hent polls feil:', error);
    res.status(500).json({ error: 'Serverfeil ved henting av polls' });
  }
});

// Hent en enkelt poll
router.get('/:id', async (req, res) => {
  try {
    const pollId = parseInt(req.params.id);

    const pollResult = await pool.query(
      `SELECT 
        p.id, p.title, p.description, p.location_type, p.location_name, p.category,
        p.created_at, p.ends_at,
        u.username as creator_username, u.profile_picture_url as creator_picture
      FROM polls p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.id = $1 AND p.is_deleted = FALSE`,
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    const poll = pollResult.rows[0];

    // Hent options
    const optionsResult = await pool.query(
      'SELECT id, option_text, votes_count FROM poll_options WHERE poll_id = $1 ORDER BY id',
      [pollId]
    );

    // Hent politician tags
    const tagsResult = await pool.query(
      'SELECT politician_name FROM politician_tags WHERE poll_id = $1',
      [pollId]
    );

    res.json({
      poll: {
        ...poll,
        options: optionsResult.rows,
        politician_tags: tagsResult.rows.map(t => t.politician_name),
      },
    });
  } catch (error) {
    console.error('Hent poll feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// Opprett ny poll (kun innloggede brukere)
router.post('/', authenticateToken, pollCreationLimiter, async (req, res) => {
  try {
    let { title, description, location_type, location_name, options, politician_tags, category } = req.body;
    const userId = req.user.id;

    // Validate title
    const titleError = validatePollTitle(title);
    if (titleError) {
      return res.status(400).json({ error: titleError });
    }

    // Validate location_name if provided
    if (location_type === 'by' && location_name) {
      const locationError = validateLocationName(location_name);
      if (locationError) {
        return res.status(400).json({ error: locationError });
      }
    }

    // Sanitize inputs
    title = sanitizeString(title);
    description = description ? sanitizeString(description) : null;
    location_name = location_name ? sanitizeString(location_name) : null;
    
    // Validate and sanitize options
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'Tittel og minst 2 alternativer er påkrevd' 
      });
    }

    if (!location_type || !['by', 'land'].includes(location_type)) {
      return res.status(400).json({ 
        error: 'location_type må være "by" eller "land"' 
      });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Oppdater user stats først
      await client.query(
        `INSERT INTO user_stats (user_id, total_polls_created)
         VALUES ($1, 1)
         ON CONFLICT (user_id) 
         DO UPDATE SET total_polls_created = user_stats.total_polls_created + 1`,
        [userId]
      );

      // Opprett poll
      const pollResult = await client.query(
        `INSERT INTO polls (creator_id, title, description, location_type, location_name, category)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [userId, title, description || null, location_type, location_name || null, category || null]
      );

      const pollId = pollResult.rows[0].id;

      // Opprett options (use sanitized options)
      const sanitizedOptions = options
        .map(opt => sanitizeString(String(opt)))
        .filter(opt => opt.length > 0);
      
      for (const optionText of sanitizedOptions) {
        await client.query(
          'INSERT INTO poll_options (poll_id, option_text) VALUES ($1, $2)',
          [pollId, optionText]
        );
      }

      // Opprett politician tags (use sanitized tags)
      let sanitizedTags = [];
      if (politician_tags && Array.isArray(politician_tags)) {
        sanitizedTags = politician_tags
          .map(tag => sanitizeString(String(tag)))
          .filter(tag => tag.length > 0 && tag.length <= 100);
      }
      
      if (sanitizedTags.length > 0) {
        for (const politicianName of sanitizedTags) {
          await client.query(
            'INSERT INTO politician_tags (poll_id, politician_name) VALUES ($1, $2)',
            [pollId, politicianName]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Poll opprettet',
        poll_id: pollId,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Opprett poll feil:', error);
    res.status(500).json({ error: 'Serverfeil ved opprettelse av poll' });
  }
});

// Rapporter en poll
router.post('/:id/report', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.id);
    const userId = req.user.id;
    const { reason, description } = req.body;

    // Valider reason
    const validReasons = ['spam', 'inappropriate', 'offensive', 'other'];
    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({ 
        error: 'Ugyldig grunn. Må være: spam, inappropriate, offensive, eller other' 
      });
    }

    // Sjekk om poll eksisterer og ikke er slettet
    const pollCheck = await pool.query(
      'SELECT id FROM polls WHERE id = $1 AND is_deleted = FALSE',
      [pollId]
    );

    if (pollCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    // Sjekk om bruker allerede har rapportert denne poll
    const existingReport = await pool.query(
      'SELECT id FROM poll_reports WHERE poll_id = $1 AND user_id = $2',
      [pollId, userId]
    );

    if (existingReport.rows.length > 0) {
      return res.status(409).json({ error: 'Du har allerede rapportert denne poll' });
    }

    // Opprett rapport
    const sanitizedDescription = description ? sanitizeString(description) : null;
    await pool.query(
      'INSERT INTO poll_reports (poll_id, user_id, reason, description) VALUES ($1, $2, $3, $4)',
      [pollId, userId, reason, sanitizedDescription]
    );

    res.status(201).json({ message: 'Poll rapportert. Takk for din tilbakemelding.' });
  } catch (error) {
    console.error('Rapporter poll feil:', error);
    res.status(500).json({ error: 'Serverfeil ved rapportering av poll' });
  }
});

// Slett en poll (kun eier)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.id);
    const userId = req.user.id;

    // Sjekk om poll eksisterer og at bruker er eier
    const pollResult = await pool.query(
      'SELECT id, creator_id FROM polls WHERE id = $1 AND is_deleted = FALSE',
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    if (pollResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: 'Du har ikke tilgang til å slette denne poll' });
    }

    // Soft delete - marker som slettet
    await pool.query(
      'UPDATE polls SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2',
      [userId, pollId]
    );

    res.json({ message: 'Poll slettet' });
  } catch (error) {
    console.error('Slett poll feil:', error);
    res.status(500).json({ error: 'Serverfeil ved sletting av poll' });
  }
});

// Sjekk om bruker er eier av poll
router.get('/:id/is-owner', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.id);
    const userId = req.user.id;

    const pollResult = await pool.query(
      'SELECT creator_id FROM polls WHERE id = $1 AND is_deleted = FALSE',
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    const isOwner = pollResult.rows[0].creator_id === userId;
    res.json({ is_owner: isOwner });
  } catch (error) {
    console.error('Sjekk eier feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;

