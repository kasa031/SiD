import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Stem på en poll
router.post('/:pollId', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);
    const { option_id } = req.body;
    const userId = req.user.id;

    if (!option_id) {
      return res.status(400).json({ error: 'option_id er påkrevd' });
    }

    // Sjekk om poll eksisterer
    const pollResult = await pool.query('SELECT id FROM polls WHERE id = $1', [pollId]);
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    // Sjekk om option tilhører poll
    const optionResult = await pool.query(
      'SELECT id FROM poll_options WHERE id = $1 AND poll_id = $2',
      [option_id, pollId]
    );
    if (optionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alternativ ikke funnet' });
    }

    // Sjekk om bruker allerede har stemt
    const existingVote = await pool.query(
      'SELECT id FROM votes WHERE poll_id = $1 AND user_id = $2',
      [pollId, userId]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).json({ error: 'Du har allerede stemt på denne poll' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Opprett stemme
      await client.query(
        'INSERT INTO votes (poll_id, user_id, option_id) VALUES ($1, $2, $3)',
        [pollId, userId, option_id]
      );

      // Oppdater vote count
      await client.query(
        'UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = $1',
        [option_id]
      );

      // Oppdater user stats
      await client.query(
        `INSERT INTO user_stats (user_id, total_votes)
         VALUES ($1, 1)
         ON CONFLICT (user_id) 
         DO UPDATE SET total_votes = user_stats.total_votes + 1`,
        [userId]
      );

      await client.query('COMMIT');

      res.json({ message: 'Stemme registrert', check_badges: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Stemmefeil:', error);
    res.status(500).json({ error: 'Serverfeil ved stemmegiving' });
  }
});

// Sjekk om bruker har stemt på en poll
router.get('/:pollId/status', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT option_id FROM votes WHERE poll_id = $1 AND user_id = $2',
      [pollId, userId]
    );

    res.json({
      has_voted: result.rows.length > 0,
      option_id: result.rows.length > 0 ? result.rows[0].option_id : null,
    });
  } catch (error) {
    console.error('Sjekk stemmestatus feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;

