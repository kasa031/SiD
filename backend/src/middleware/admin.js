import pool from '../utils/db.js';

// Middleware for å sjekke om bruker er admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ikke autentisert' });
    }

    // Sjekk om bruker er admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }

    if (!userResult.rows[0].is_admin) {
      return res.status(403).json({ error: 'Kun administratorer har tilgang til denne funksjonen' });
    }

    next();
  } catch (error) {
    console.error('Admin check feil:', error);
    res.status(500).json({ error: 'Serverfeil ved admin-sjekk' });
  }
};

