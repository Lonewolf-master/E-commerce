import { Router, Request, Response } from 'express';
import { db } from '../db';
import { products } from '../db/schema';
import { getProductRecommendations } from '../services/ai';

const router = Router();

router.post('/recommend', async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Fetch all products to give Gemini context
    const allProducts = await db.select().from(products);
    
    const recommendation = await getProductRecommendations(query, allProducts);
    
    res.status(200).json(recommendation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

export default router;
