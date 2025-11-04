import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../env') });

const router = express.Router();

// Registrering
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Brukernavn og passord er påkrevd' });
    }

    // Sjekk om bruker eksisterer
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Brukernavn eksisterer allerede' });
    }

    // Hash passord
    const passwordHash = await bcrypt.hash(password, 10);

    // Opprett bruker
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, passwordHash, email || null]
    );

    const user = result.rows[0];

    // Generer JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Bruker opprettet',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registreringsfeil:', error);
    res.status(500).json({ error: 'Serverfeil ved registrering' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Brukernavn og passord er påkrevd' });
    }

    // Finn bruker
    const result = await pool.query(
      'SELECT id, username, password_hash, email, profile_picture_url FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ugyldig brukernavn eller passord' });
    }

    const user = result.rows[0];

    // Sjekk passord
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Ugyldig brukernavn eller passord' });
    }

    // Generer JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Innlogging vellykket',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
      },
    });
  } catch (error) {
    console.error('Innloggingsfeil:', error);
    res.status(500).json({ error: 'Serverfeil ved innlogging' });
  }
});

// Hent brukerinfo (beskyttet route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Ingen token gitt' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Hent brukerinfo feil:', error);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

export default router;

