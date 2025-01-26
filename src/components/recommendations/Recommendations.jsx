import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Recommendations() {
  const { user, db } = useFirebase();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReadingHistory = async () => {
      if (!user) return;

      const postsRef = collection(db, 'posts');
      const userInteractionsQuery = query(postsRef, where('voters.' + user.uid, '!=', null));
      const snapshot = await getDocs(userInteractionsQuery);

      const books = new Set();
      snapshot.docs.forEach(doc => {
        const post = doc.data();
        books.add({ title: post.bookTitle, author: post.bookAuthor });
      });

      if (books.size > 0) {
        const recs = await getRecommendations(Array.from(books));
        setRecommendations(recs);
      }
      setLoading(false);
    };

    fetchUserReadingHistory();
  }, [user, db]);

  const getRecommendations = async (books) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    const prompt = `You are a book recommendation system with three expert personas:
      - A Classic Literature Professor
      - A Contemporary Fiction Expert
      - A Genre Specialist
  
      Based on these books: ${books.map(b => `"${b.title}" by ${b.author}`).join(', ')}
  
      Generate exactly 5 book recommendations. Return ONLY a JSON array without any additional text or markdown formatting.
      Each object in the array must follow this exact format:
      {
        "title": "Book Title",
        "author": "Author Name",
        "description": "The experts' collective reasoning for this recommendation",
        "genre": "Primary genre",
        "yearPublished": "Year",
        "recommendedBy": "Name of the expert(s) who recommended this book"
      }
  
      Consider:
      - Thematic connections
      - Writing style similarities
      - Reader experience level
      - Genre preferences
      - Historical context
  
      IMPORTANT: Return ONLY the JSON array, no other text.`;
  
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      console.log('Raw response:', response?.text());
      return [];
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Book Recommendations
      </h1>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-lg text-gray-600 mb-4">
            Interact with book discussions to get personalized recommendations
          </p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            Browse Discussions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((book, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
              <div className="flex items-center space-x-2 mb-4">
                <p className="text-sm text-indigo-600">by {book.author}</p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-500">{book.genre}</p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-500">{book.yearPublished}</p>
              </div>
              <p className="text-gray-600 mb-4">{book.description}</p>
              <p className="text-sm text-indigo-500 italic">Recommended by: {book.recommendedBy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;