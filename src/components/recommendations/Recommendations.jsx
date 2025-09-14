import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addToReadingList } from '../reading-list/ReadingList';

function Recommendations() {
  const { user, db } = useFirebase();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedBooks, setAddedBooks] = useState(new Set()); // Add this line

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
  
    let response; // Declare response here
    try {
      const result = await model.generateContent(prompt);
      response = result.response;
      const cleanedResponse = response.text().replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error getting recommendations:', error);
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
  const handleAddToList = async (book) => {
    if (!user) return;
    
    const success = await addToReadingList(db, user.uid, book);
    if (success) {
      setAddedBooks(current => new Set([...current, book.title]));
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        Your Book Recommendations
      </h1>
      <p className="text-lg text-gray-600 mb-12 font-light">
        Curated selections based on your literary interests
      </p>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-sm">
          <h3 className="text-2xl font-light text-gray-800 mb-4">
            Waiting to discover your taste
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Interact with book discussions to receive personalized recommendations
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 
              text-white text-lg font-medium rounded-full hover:from-indigo-700 hover:to-indigo-800 
              transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Explore Discussions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map((book, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 
                border border-gray-100/50 backdrop-blur-sm hover:border-indigo-100/50"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {book.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="font-medium text-indigo-600">by {book.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-gray-600 font-medium">{book.genre}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-gray-600">{book.yearPublished}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">
                {book.description}
              </p>
              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleAddToList(book)}
                  disabled={addedBooks.has(book.title)}
                  className={`flex items-center space-x-2 ${
                    addedBooks.has(book.title)
                      ? 'text-green-600 cursor-default'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    {addedBooks.has(book.title) ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">
                    {addedBooks.has(book.title) ? 'Added to list' : 'Add to Reading List'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;