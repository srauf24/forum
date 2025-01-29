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

    // Add API key validation
    if (!process.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not found');
    }
    console.log('Initializing Gemini API...');
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a passionate book reviewer sharing your latest read. Choose ONE random book from any genre or time period (avoid The Midnight Library or recently reviewed books). Write an engaging, personal review. Respond ONLY with a JSON object in this EXACT format:
                {
                "title": "[Book title]",
                "content": "[Write an enthusiastic, personal review that:
                           - Starts with 'Hey bookworms! 📚' or similar engaging opener
                           - Mentions the book and author naturally in the first sentence
                           - Gives a spoiler-free overview
                           - Shares your personal connection and feelings
                           - Includes 2-3 relevant emojis naturally throughout
                           - Ends with why others should read it]",
                "tags": ["books", "reading", "bookreview"],
                "relatedBook": "[Exact book title]",
                "relatedAuthor": "[Author's full name]"
                }
                Important: Choose any book EXCEPT The Midnight Library. Make it feel like a fresh, genuine discovery.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();

    console.log('Raw response:', responseText); // Debug log
    
    let topic;
    try {
      topic = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse AI response');
    }

    // Validate single book/author
    if (Array.isArray(topic.relatedBook) || Array.isArray(topic.relatedAuthor)) {
      throw new Error('Response must contain a single book and author');
    }

    await db.collection('posts').add({
      title: `📚✨ ${topic.title}`,
      content: topic.content,
      createdAt: new Date(),
      type: 'book-review',
      author: 'BookForum Bot',
      userName: 'AI Agent',
      authorId: 'system',
      photoURL: 'https://api.dicebear.com/7.x/bottts/png?seed=bookbot&backgroundColor=b6e3f4',
      voters: {},
      commentCount: 0,
      bookTitle: topic.relatedBook || '',
      bookAuthor: topic.relatedAuthor || ''
    });
    console.log('Daily discussion created successfully')
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ error: error.message });
  }
}