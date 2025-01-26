import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../../../firebase/config';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a thought-provoking book discussion topic. 
      Return as JSON with format: {
        "title": "Discussion title",
        "content": "Detailed discussion prompt",
        "tags": ["relevant", "topic", "tags"],
        "relatedBook": "Optional book title",
        "relatedAuthor": "Optional author name"
      }`;

    const result = await model.generateContent(prompt);
    const topic = JSON.parse(result.response.text());
    
    // Add to Firestore
    await db.collection('posts').add({
      title: topic.title,
      content: topic.content,
      createdAt: new Date(),
      type: 'daily-discussion',
      author: 'BookForum Bot',
      authorId: 'system',
      voters: {},
      commentCount: 0,
      bookTitle: topic.relatedBook || '',
      bookAuthor: topic.relatedAuthor || '',
      tags: ['daily-discussion', ...(topic.tags || [])]
    });

    res.status(200).json({ success: true, topic });
  } catch (error) {
    console.error('Daily discussion generation failed:', error);
    res.status(500).json({ error: 'Failed to generate discussion' });
  }
}