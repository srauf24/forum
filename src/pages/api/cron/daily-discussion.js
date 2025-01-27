import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../../../firebase/config';

async function logCronExecution(status, details) {
  try {
    await db.collection('system_logs').add({
      type: 'cron_job',
      timestamp: new Date(),
      status: status,
      details: details,
      jobType: 'daily-discussion'
    });
  } catch (error) {
    console.error('Logging failed:', error);
  }
}

export default async function handler(req, res) {
  // Add method check at the start
  if (req.method !== 'GET') {
    await logCronExecution('unauthorized', { error: 'Invalid method' });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await logCronExecution('started', { timestamp: new Date().toISOString() });

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    await logCronExecution('unauthorized', { error: 'Invalid authorization' });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Update this line
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    
    console.log('📚 Generated topic:', topic);

    // Add to Firestore
    const docRef = await db.collection('posts').add({
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

    console.log('✅ Discussion posted successfully, id:', docRef.id);
    await logCronExecution('success', {
      postId: docRef.id,
      topic: topic.title
    });

    res.status(200).json({ success: true, topic, postId: docRef.id });
  } catch (error) {
    await logCronExecution('error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to generate discussion' });
  }
}