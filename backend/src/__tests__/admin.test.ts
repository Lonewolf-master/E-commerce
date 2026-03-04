import request from 'supertest';
import app from '../app';
import dotenv from 'dotenv';

dotenv.config();

// Mock the clerkAuth middleware
jest.mock('../middleware/auth', () => ({
  clerkAuth: (req: any, res: any, next: any) => next(),
}));

describe('POST /api/admin/login', () => {
  it('should return 200 OK for a valid admin password', async () => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const response = await request(app)
      .post('/api/admin/login')
      .send({ password: adminPassword });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return 401 Unauthorized for an invalid admin password', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({ password: 'wrong-password' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
