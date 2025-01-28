import { useEffect, useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, addDoc } from 'firebase/firestore'; // Add this import

function DailyCronTest() {
    const [status, setStatus] = useState('idle');
    const { user, db } = useFirebase();

    const generateDiscussion = async () => {
        setStatus('running');
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
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

            console.log('Cleaned response:', responseText);
            const topic = JSON.parse(responseText);

            // Validate single book/author
            if (Array.isArray(topic.relatedBook) || Array.isArray(topic.relatedAuthor)) {
                throw new Error('Response must contain a single book and author');
            }

            // Update Firestore code
            const docRef = await addDoc(collection(db, 'posts'), {
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

            setStatus('success');
            console.log('Generated post:', topic);
        } catch (error) {
            setStatus('error');
            console.error('Test failed:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Book Review Generator</h2>
            <button
                onClick={generateDiscussion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Generate Book Review
            </button>
            <div className="mt-2">Status: {status}</div>
        </div>
    );
}

export default DailyCronTest;