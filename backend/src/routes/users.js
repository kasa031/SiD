import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Kun bilder (JPEG, PNG, GIF) er tillatt'));
    }
  },
});

// Upload profilbilde
router.post('/profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Ingen fil opplastet' });
    }

    const userId = req.user.id;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Oppdater brukerens profilbilde URL
    await pool.query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
      [fileUrl, userId]
    );

    res.json({
      message: 'Profilbilde opplastet',
      profile_picture_url: fileUrl,
    });
  } catch (error) {
    console.error('Profilbilde opplastingsfeil:', error);
    res.status(500).json({ error: 'Serverfeil ved opplasting' });
  }
});

// Hent brukerprofil
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const result = await pool.query(
      `SELECT id, username, email, profile_picture_url, created_at,
       (SELECT COUNT(*) FROM polls WHERE creator_id = $1) as polls_count,
       (SELECT COUNT(*) FROM votes WHERE user_id = $1) as votes_count
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Hent brukerprofil feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;

