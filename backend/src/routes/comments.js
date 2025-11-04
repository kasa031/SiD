import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Hent kommentarer for en poll
router.get('/poll/:pollId', async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);

    const result = await pool.query(
      `SELECT 
        c.id, c.content, c.created_at,
        u.id as user_id, u.username, u.profile_picture_url
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.poll_id = $1
      ORDER BY c.created_at DESC`,
      [pollId]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Hent kommentarer feil:', error);
    res.status(500).json({ error: 'Serverfeil ved henting av kommentarer' });
  }
});

// Legg til kommentar (kun innloggede brukere)
router.post('/poll/:pollId', authenticateToken, async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Kommentar kan ikke være tom' });
    }

    // Sjekk om poll eksisterer
    const pollResult = await pool.query('SELECT id FROM polls WHERE id = $1', [pollId]);
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Opprett kommentar
      const result = await client.query(
        `INSERT INTO comments (poll_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, content, created_at`,
        [pollId, userId, content.trim()]
      );

      // Oppdater user stats
      await client.query(
        `INSERT INTO user_stats (user_id, total_comments)
         VALUES ($1, 1)
         ON CONFLICT (user_id) 
         DO UPDATE SET total_comments = user_stats.total_comments + 1`,
        [userId]
      );

      await client.query('COMMIT');

      // Hent brukerinfo for kommentaren
      const userResult = await pool.query(
        'SELECT id, username, profile_picture_url FROM users WHERE id = $1',
        [userId]
      );

      res.status(201).json({
        message: 'Kommentar lagt til',
        comment: {
          ...result.rows[0],
          user_id: userResult.rows[0].id,
          username: userResult.rows[0].username,
          profile_picture_url: userResult.rows[0].profile_picture_url,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }


export default router;

