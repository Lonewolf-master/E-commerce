import { userSchema, productSchema, orderSchema, orderItemSchema } from '../models/schema';

describe('Zod Schema Validation', () => {
  describe('userSchema', () => {
    it('should validate a valid user', () => {
      const validUser = {
        password: 'securePassword123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const invalidUser = {
        password: 'securePassword123',
        email: 'invalid-email',
      };
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    it('should validate a valid product', () => {
      const validProduct = {
        name: 'Cool Gadget',
        price: '99.99',
        stock: 10,
      };
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should fail on negative stock', () => {
      const invalidProduct = {
        name: 'Broken Gadget',
        price: '10.00',
        stock: -1,
      };
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('orderSchema', () => {
    it('should validate a valid order', () => {
      const validOrder = {
        userId: 1,
        totalAmount: '150.50',
        status: 'pending',
      };
      const result = orderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });
  });

  describe('orderItemSchema', () => {
    it('should validate a valid order item', () => {
      const validOrderItem = {
        productId: 1,
        quantity: 2,
        price: '50.00',
      };
      const result = orderItemSchema.safeParse(validOrderItem);
      expect(result.success).toBe(true);
    });
  });
});
