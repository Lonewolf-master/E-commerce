import { requireAuth, requireAdmin } from '../middleware/auth';

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {
      auth: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('requireAuth', () => {
    it('should call next() if userId is present', () => {
      mockReq.auth.userId = 'user_123';
      requireAuth(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if userId is missing', () => {
      requireAuth(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('requireAdmin', () => {
    it('should call next() if user is admin', () => {
      mockReq.auth.userId = 'admin_123';
      mockReq.auth.sessionClaims = { metadata: { role: 'admin' } };
      requireAdmin(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      mockReq.auth.userId = 'user_123';
      mockReq.auth.sessionClaims = { metadata: { role: 'user' } };
      requireAdmin(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden: Admin access required' });
    });
  });
});
