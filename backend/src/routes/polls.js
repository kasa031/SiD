import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Hent alle polls (med søk og filtrering)
router.get('/', async (req, res) => {
  try {
    const { search, location_type, location_name, politician_name } = req.query;
    let query = `
      SELECT 
        p.id, p.title, p.description, p.location_type, p.location_name,
        p.created_at, p.ends_at,
        u.username as creator_username, u.profile_picture_url as creator_picture,
        (SELECT COUNT(*) FROM poll_options WHERE poll_id = p.id) as options_count,
        (SELECT COUNT(*) FROM votes WHERE poll_id = p.id) as total_votes
      FROM polls p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
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
        p.id, p.title, p.description, p.location_type, p.location_name,
        p.created_at, p.ends_at,
        u.username as creator_username, u.profile_picture_url as creator_picture
      FROM polls p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.id = $1`,
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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, location_type, location_name, options, politician_tags } = req.body;
    const userId = req.user.id;

    if (!title || !options || options.length < 2) {
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

      // Opprett poll
      const pollResult = await client.query(
        `INSERT INTO polls (creator_id, title, description, location_type, location_name)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [userId, title, description || null, location_type, location_name || null]
      );

      const pollId = pollResult.rows[0].id;

      // Opprett options
      for (const optionText of options) {
        await client.query(
          'INSERT INTO poll_options (poll_id, option_text) VALUES ($1, $2)',
          [pollId, optionText]
        );
      }

      // Opprett politician tags
      if (politician_tags && politician_tags.length > 0) {
        for (const politicianName of politician_tags) {
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

export default router;

