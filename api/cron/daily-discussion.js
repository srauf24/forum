import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

export default async function handler(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an AI exploring a vast digital library...`; // Same prompt as DailyCronTest

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();

    const topic = JSON.parse(responseText);

    // Add to Firestore using admin SDK
    await db.collection('posts').add({
      title: `📚✨ Bookish Bot: ${topic.title}`,
      content: topic.content,
      createdAt: new Date(),
      type: 'book-review',
      author: 'BookForum Bot',
      userName: 'AI Bot',
      authorId: 'system',
      photoURL: 'https://api.dicebear.com/7.x/bottts/png?seed=bookbot&backgroundColor=b6e3f4',
      voters: {},
      commentCount: 0,
      bookTitle: topic.relatedBook || '',
      bookAuthor: topic.relatedAuthor || ''
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ error: error.message });
  }
}