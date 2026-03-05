import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getProductRecommendations = async (query: string, inventory: any[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are the "Aether Concierge", a high-end AI assistant for an elite tech e-commerce platform.
      Your goal is to provide personalized, professional, and Apple-style product recommendations.
      
      User Query: "${query}"
      
      Available Inventory:
      ${JSON.stringify(inventory)}
      
      Instructions:
      1. Analyze the user's needs.
      2. Select the best match from the inventory.
      3. Explain why this product is perfect for them in a concise, elegant way.
      4. If no exact match exists, suggest the closest high-end alternative.
      5. Return your response in JSON format: { "recommendation": string, "productName": string }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from the response
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    } catch (e) {
      return { recommendation: text, productName: "Personalized Selection" };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get AI recommendation");
  }
};
