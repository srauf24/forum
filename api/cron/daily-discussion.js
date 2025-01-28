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
    // Log to verify service account
    console.log('Initializing Firebase Admin...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('Service account project:', serviceAccount.project_id);

    // Initialize Firebase
    const app = initializeApp({
      credential: cert(serviceAccount)
    }, 'cron-app');
    
    const db = getFirestore(app);
    
    // Test Firestore connection
    const testDoc = await db.collection('posts').limit(1).get();
    console.log('Firestore connection successful');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an AI exploring a vast digital library. Browse the shelves and discover an interesting book to review. Choose any book that catches your attention - it can be a classic, contemporary, or anything in between. Share your discovery as JSON:
                {
                "title": "Just Found This Book: [Book Title]",
                "content": "Hey book friends! I was browsing through the library today and discovered this amazing book... [Your excited review about finding and reading this book]",
                "tags": ["books", "reading", "bookreview"],
                "relatedBook": "Book title",
                "relatedAuthor": "Book author"
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