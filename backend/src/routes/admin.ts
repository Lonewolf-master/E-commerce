import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { db } from '../db';
import { products, orders } from '../db/schema';
import { authenticate, authorizeAdmin, AuthRequest } from '../middleware/auth';
import { sql } from 'drizzle-orm';

dotenv.config();

const router = Router();

// Admin Login
router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // For simplicity in this prototype, we'll return a token with admin role
    // In production, use generateToken utility
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 0, role: 'admin' }, process.env.JWT_SECRET || 'secret');
    return res.status(200).json({ success: true, token, message: 'Admin logged in successfully' });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin password' });
});

// Get Dashboard Stats (Protected)
router.get('/stats', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const productCount = await db.select({ count: sql`count(*)` }).from(products);
    const orderCount = await db.select({ count: sql`count(*)` }).from(orders);
    const totalRevenue = await db.select({ sum: sql`sum(total_amount)` }).from(orders);

    res.status(200).json({
      products: productCount[0].count,
      orders: orderCount[0].count,
      revenue: totalRevenue[0].sum || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CRUD: List Products
router.get('/products', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const allProducts = await db.select().from(products);
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// CRUD: Create Product
router.post('/products', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  const { name, description, price, category, imageUrl, stock } = req.body;
  try {
    await db.insert(products).values({ name, description, price, category, imageUrl, stock });
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// CRUD: Delete Product
router.delete('/products/:id', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const productId = parseInt(id);
    await db.delete(products).where(sql`id = ${productId}`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// CRUD: List Orders
router.get('/orders', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const allOrders = await db.select().from(orders);
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// CRUD: Update Order Status
router.patch('/orders/:id', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const orderId = parseInt(id);
    await db.update(orders).set({ status }).where(sql`id = ${orderId}`);
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
