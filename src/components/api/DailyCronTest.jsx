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

            const prompt = `Generate a thought-provoking book discussion topic focusing on specific books, their themes, or literary concepts. Return ONLY a raw JSON object without any markdown formatting. Format:
                {
                "title": "Discussion title (must reference books or reading)",
                "content": "Detailed discussion prompt that encourages reader engagement",
                "tags": ["book-related", "topic", "tags"],
                "relatedBook": "Specific book title if applicable",
                "relatedAuthor": "Book author if applicable"
                }`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text()
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            console.log('Cleaned response:', responseText);
            const topic = JSON.parse(responseText);

            // Validate single book/author
            if (Array.isArray(topic.relatedBook) || Array.isArray(topic.relatedAuthor)) {
                throw new Error('Response must contain a single book and author');
            }

            // Update Firestore code
            const docRef = await addDoc(collection(db, 'posts'), {
                title: `📚 Daily Discussion: ${topic.title}`,
                content: topic.content,
                createdAt: new Date(),
                type: 'daily-discussion',
                author: 'BookForum Bot',
                userName: 'AI Bot',
                authorId: 'system',
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
            <h2 className="text-xl font-bold mb-4">Cron Job Test Panel</h2>
            <button
                onClick={generateDiscussion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Test Discussion Generation
            </button>
            <div className="mt-2">Status: {status}</div>
        </div>
    );
}

export default DailyCronTest;