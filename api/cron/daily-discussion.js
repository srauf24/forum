import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only if not already initialized
let app;
let db;

try {
  if (getApps().length === 0) {
    console.log('Initializing Firebase Admin...');
    console.log('Env var exists:', !!process.env.VITE_FIREBASE_SERVICE_ACCOUNT_KEY);
    
    try {
      const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log('Service account parsed successfully');
      
      app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase app initialized');
    } catch (parseError) {
      console.error('Service account parse error:', parseError);
      throw parseError;
    }
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase app');
  }
  
  db = getFirestore(app);
  console.log('Firestore initialized');
} catch (error) {
  console.error('Detailed initialization error:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  throw error;
}

export default async function handler(req, res) {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    // Test Firestore connection
    const testDoc = await db.collection('posts').limit(1).get();
    console.log('Firestore connection successful');

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an AI exploring a vast digital library. Choose ONE book to review. Respond ONLY with a JSON object in this EXACT format:
                {
                "title": "[The exact book title you're reviewing]",
                "content": "[Your excited review about finding and reading this book]",
                "tags": ["books", "reading", "bookreview"],
                "relatedBook": "[The exact same book title as in the title field]",
                "relatedAuthor": "[Author's name]"
                }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();

    const topic = JSON.parse(responseText);

    // Validate single book/author
    if (Array.isArray(topic.relatedBook) || Array.isArray(topic.relatedAuthor)) {
      throw new Error('Response must contain a single book and author');
    }

    await db.collection('posts').add({
      title: `📚✨: ${topic.title}`,
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