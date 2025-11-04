import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all badges
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM badges ORDER BY requirement_value ASC'
    );
    res.json({ badges: result.rows });
  } catch (error) {
    console.error('Hent badges feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// Get user badges
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query(
      `SELECT 
        b.id, b.name, b.description, b.icon_url,
        ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC`,
      [userId]
    );

    res.json({ badges: result.rows });
  } catch (error) {
    console.error('Hent bruker badges feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// Check and award badges (called after votes/polls/comments)
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user stats
    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [userId]
    );

    let stats = statsResult.rows[0];
    if (!stats) {
      // Create user stats if doesn't exist
      await pool.query(
        'INSERT INTO user_stats (user_id) VALUES ($1)',
        [userId]
      );
      stats = { total_votes: 0, total_polls_created: 0, total_comments: 0 };
    }

    // Get all badges
    const badgesResult = await pool.query('SELECT * FROM badges');

    const newBadges = [];

    for (const badge of badgesResult.rows) {
      // Check if user already has this badge
      const existingBadge = await pool.query(
        'SELECT id FROM user_badges WHERE user_id = $1 AND badge_id = $2',
        [userId, badge.id]
      );

      if (existingBadge.rows.length > 0) continue;

      // Check if requirement is met
      let hasRequirement = false;
      switch (badge.requirement_type) {
        case 'votes':
          hasRequirement = stats.total_votes >= badge.requirement_value;
          break;
        case 'polls_created':
          hasRequirement = stats.total_polls_created >= badge.requirement_value;
          break;
        case 'comments':
          hasRequirement = stats.total_comments >= badge.requirement_value;
          break;
      }

      if (hasRequirement) {
        // Award badge
        await pool.query(
          'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)',
          [userId, badge.id]
        );
        newBadges.push(badge);
      }
    }

    res.json({ new_badges: newBadges });
  } catch (error) {
    console.error('Sjekk badges feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;
