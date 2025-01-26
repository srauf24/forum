import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../../../firebase/config';

export default async function handler(req, res) {
  // Verify cron job secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate discussion topic
    const result = await model.generateContent(`Create an engaging book discussion topic`);
    
    // Add to Firestore
    await db.collection('discussions').add({
      title: result.response.text(),
      createdAt: new Date(),
      type: 'daily',
      engagement: 0
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate discussion' });
  }
}