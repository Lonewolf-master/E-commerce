import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

export const clerkAuth = ClerkExpressWithAuth();

export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  // Assuming 'role' is stored in publicMetadata/sessionClaims
  if (!req.auth?.userId || req.auth?.sessionClaims?.metadata?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};
