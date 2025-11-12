import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth.js';
import pool from '../../src/utils/db.js';

// Mock database
jest.mock('../../src/utils/db.js', () => ({
  query: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(password === hash.replace('hashed_', ''))),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload, secret) => 'mock_token'),
  verify: jest.fn((token, secret) => ({ id: 1, username: 'testuser' })),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('skal returnere 400 hvis brukernavn er for kort', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          password: 'password123',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Brukernavn');
    });

    it('skal returnere 400 hvis passord er for kort', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: '12345',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Passord');
    });

    it('skal returnere 400 hvis e-post er ugyldig', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('E-post');
    });

    it('skal returnere 409 hvis bruker allerede eksisterer', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          password: 'password123',
          email: 'test@example.com',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('eksisterer');
    });

    it('skal registrere ny bruker med gyldig data', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Bruker eksisterer ikke
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Insert success

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          email: 'newuser@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('POST /api/auth/login', () => {
    it('skal returnere 400 hvis brukernavn mangler', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('skal returnere 401 hvis bruker ikke eksisterer', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });

    it('skal returnere 401 hvis passord er feil', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: 'testuser', password_hash: 'hashed_wrongpassword' }],
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'correctpassword',
        });

      expect(response.status).toBe(401);
    });

    it('skal logge inn bruker med gyldig data', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: 'testuser', password_hash: 'hashed_password123' }],
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  });
});

