import request from 'supertest';
import app from '../app';

// Mock the clerkAuth middleware
jest.mock('../middleware/auth', () => ({
  clerkAuth: (req: any, res: any, next: any) => next(),
  requireAuth: (req: any, res: any, next: any) => next(),
  requireAdmin: (req: any, res: any, next: any) => next(),
}));

describe('GET /health', () => {
  it('should return 200 OK and a health status message', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      message: 'Backend is running',
    });
  });
});
