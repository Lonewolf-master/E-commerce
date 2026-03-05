import request from 'supertest';
import app from '../app';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

// Mock DB
jest.mock('../db', () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
  },
}));

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 Created for a valid user registration', async () => {
      (db.query.users.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securePassword123',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return 409 Conflict if the user already exists', async () => {
      (db.query.users.findFirst as jest.Mock).mockResolvedValue({ id: 1, email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'securePassword123',
          name: 'Existing User',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 OK and a token for valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('securePassword123', 10);

      (db.query.users.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'user',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'securePassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 Unauthorized for invalid credentials', async () => {
      (db.query.users.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 200 OK and user details for a valid token', async () => {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET || 'your-secret-key');

      (db.query.users.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('user@example.com');
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
    });

    it('should return 401 Unauthorized for an invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });
  });
});
