import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import aiRouter from './routes/ai';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://lonewolf-master.github.io'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

export default app;
