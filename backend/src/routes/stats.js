import express from 'express';
import pool from '../utils/db.js';

const router = express.Router();

// Get overall statistics
router.get('/overview', async (req, res) => {
  try {
    const { category, location_type, location_name } = req.query;

    let query = `
      SELECT 
        COUNT(DISTINCT p.id) as total_polls,
        COUNT(DISTINCT v.id) as total_votes,
        COUNT(DISTINCT c.id) as total_comments,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN p.location_type = 'by' THEN p.id END) as polls_by_city,
        COUNT(DISTINCT CASE WHEN p.location_type = 'land' THEN p.id END) as polls_national
      FROM polls p
      LEFT JOIN votes v ON p.id = v.poll_id
      LEFT JOIN comments c ON p.id = c.poll_id
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
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

    const result = await pool.query(query, params);

    // Get polls by city
    const cityQuery = `
      SELECT 
        p.location_name as city,
        COUNT(DISTINCT p.id) as poll_count,
        COUNT(DISTINCT v.id) as vote_count,
        COUNT(DISTINCT v.user_id) as unique_voters
      FROM polls p
      LEFT JOIN votes v ON p.id = v.poll_id
      WHERE p.location_type = 'by' AND p.location_name IS NOT NULL
      GROUP BY p.location_name
      ORDER BY vote_count DESC
      LIMIT 20
    `;
    const cityResult = await pool.query(cityQuery);

    // Get polls by category
    const categoryQuery = `
      SELECT 
        p.category,
        COUNT(DISTINCT p.id) as poll_count,
        COUNT(DISTINCT v.id) as vote_count
      FROM polls p
      LEFT JOIN votes v ON p.id = v.poll_id
      WHERE p.category IS NOT NULL
      GROUP BY p.category
      ORDER BY vote_count DESC
    `;
    const categoryResult = await pool.query(categoryQuery);

    res.json({
      overview: result.rows[0],
      by_city: cityResult.rows,
      by_category: categoryResult.rows,
    });
  } catch (error) {
    console.error('Stats feil:', error);
    res.status(500).json({ error: 'Serverfeil ved henting av statistikk' });
  }
});

// Get comparison between cities
router.get('/city-comparison', async (req, res) => {
  try {
    const { cities } = req.query; // comma-separated list
    const cityList = cities ? cities.split(',') : [];

    if (cityList.length === 0) {
      return res.status(400).json({ error: 'Må oppgi minst én by' });
    }

    const query = `
      SELECT 
        p.location_name as city,
        COUNT(DISTINCT p.id) as poll_count,
        COUNT(DISTINCT v.id) as total_votes,
        COUNT(DISTINCT v.user_id) as unique_voters,
        COUNT(DISTINCT CASE WHEN p.category IS NOT NULL THEN p.id END) as categorized_polls
      FROM polls p
      LEFT JOIN votes v ON p.id = v.poll_id
      WHERE p.location_type = 'by' AND p.location_name = ANY($1)
      GROUP BY p.location_name
      ORDER BY total_votes DESC
    `;

    const result = await pool.query(query, [cityList]);

    res.json({ comparison: result.rows });
  } catch (error) {
    console.error('By-sammenligning feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;
