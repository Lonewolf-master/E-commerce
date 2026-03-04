import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // In a real app, we'd issue a JWT or session here.
    // For this prototype, we'll just return success.
    return res.status(200).json({ success: true, message: 'Admin logged in successfully' });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin password' });
});

export default router;
