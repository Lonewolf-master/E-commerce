import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  clerkId: z.string().min(1, 'Clerk ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.date().optional(),
});

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  category: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  createdAt: z.date().optional(),
});

export const orderSchema = z.object({
  id: z.number().optional(),
  userId: z.number().int().min(1, 'User ID is required'),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid total amount format'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  createdAt: z.date().optional(),
});

export const orderItemSchema = z.object({
  id: z.number().optional(),
  orderId: z.number().int().min(1, 'Order ID is required').optional(),
  productId: z.number().int().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
});
