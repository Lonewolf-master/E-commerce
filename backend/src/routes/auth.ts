import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { eq } from 'drizzle-orm';
import { userSchema } from '../models/schema';

const router = Router();

// Register Route
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Validate Input
  const result = userSchema.safeParse({ email, password, name });
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create User
    await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      name,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find User
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify Password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate Token
    const token = generateToken({ userId: user.id, role: user.role });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
