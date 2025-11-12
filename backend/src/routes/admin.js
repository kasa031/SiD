import express from 'express';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// Alle admin routes krever autentisering og admin-rettigheter
router.use(authenticateToken);
router.use(requireAdmin);

// Hent alle rapporterte polls
router.get('/reports', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT 
        pr.id, pr.poll_id, pr.reason, pr.description, pr.status,
        pr.created_at, pr.reviewed_at,
        u.username as reporter_username,
        p.title as poll_title, p.creator_id,
        u2.username as poll_creator_username,
        (SELECT COUNT(*) FROM poll_reports WHERE poll_id = pr.poll_id) as report_count
      FROM poll_reports pr
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN polls p ON pr.poll_id = p.id
      LEFT JOIN users u2 ON p.creator_id = u2.id
      WHERE 1=1
    `;
    const params = [];
    
    if (status) {
      query += ` AND pr.status = $1`;
      params.push(status);
    }
    
    query += ' ORDER BY pr.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ reports: result.rows });
  } catch (error) {
    console.error('Hent rapporter feil:', error);
    res.status(500).json({ error: 'Serverfeil ved henting av rapporter' });
  }
});

// Oppdater status på en rapport
router.put('/reports/:id', async (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const { status } = req.body;
    const adminId = req.user.id;

    const validStatuses = ['pending', 'reviewed', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Ugyldig status. Må være: pending, reviewed, eller resolved' 
      });
    }

    const updateQuery = status === 'pending'
      ? 'UPDATE poll_reports SET status = $1, reviewed_by = NULL, reviewed_at = NULL WHERE id = $2'
      : 'UPDATE poll_reports SET status = $1, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP WHERE id = $2';

    const params = status === 'pending' 
      ? [status, reportId]
      : [status, reportId, adminId];

    await pool.query(updateQuery, params);

    res.json({ message: 'Rapport status oppdatert' });
  } catch (error) {
    console.error('Oppdater rapport feil:', error);
    res.status(500).json({ error: 'Serverfeil ved oppdatering av rapport' });
  }
});

// Slett en poll som admin (hard delete)
router.delete('/polls/:id', async (req, res) => {
  try {
    const pollId = parseInt(req.params.id);
    const adminId = req.user.id;

    // Sjekk om poll eksisterer
    const pollResult = await pool.query(
      'SELECT id FROM polls WHERE id = $1',
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll ikke funnet' });
    }

    // Hard delete - sletter faktisk fra databasen (CASCADE vil slette relaterte data)
    await pool.query('DELETE FROM polls WHERE id = $1', [pollId]);

    res.json({ message: 'Poll slettet permanent av administrator' });
  } catch (error) {
    console.error('Admin slett poll feil:', error);
    res.status(500).json({ error: 'Serverfeil ved sletting av poll' });
  }
});

// Hent statistikk for admin
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM polls WHERE is_deleted = FALSE'),
      pool.query('SELECT COUNT(*) as count FROM votes'),
      pool.query('SELECT COUNT(*) as count FROM comments'),
      pool.query('SELECT COUNT(*) as count FROM poll_reports WHERE status = $1', ['pending']),
      pool.query('SELECT COUNT(*) as count FROM poll_reports'),
    ]);

    res.json({
      total_users: parseInt(stats[0].rows[0].count),
      total_polls: parseInt(stats[1].rows[0].count),
      total_votes: parseInt(stats[2].rows[0].count),
      total_comments: parseInt(stats[3].rows[0].count),
      pending_reports: parseInt(stats[4].rows[0].count),
      total_reports: parseInt(stats[5].rows[0].count),
    });
  } catch (error) {
    console.error('Hent admin stats feil:', error);
    res.status(500).json({ error: 'Serverfeil ved henting av statistikk' });
  }
});

// Sjekk om bruker er admin
router.get('/check', async (req, res) => {
  res.json({ is_admin: true });
});

export default router;

