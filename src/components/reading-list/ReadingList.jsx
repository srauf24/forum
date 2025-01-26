import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

// Export the add function
export const addToReadingList = async (db, userId, book) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      readingList: arrayUnion(book)
    });
    return true;
  } catch (error) {
    console.error('Error adding book:', error);
    return false;
  }
};

function ReadingList() {
  const { user, db } = useFirebase();
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadingList = async () => {
      if (!user) return;
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().readingList) {
        setReadingList(userDoc.data().readingList);
      }
      setLoading(false);
    };

    fetchReadingList();
  }, [user, db]);

  const removeFromList = async (book) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        readingList: arrayRemove(book)
      });
      setReadingList(current => current.filter(b => b.title !== book.title));
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        Your Reading List
      </h1>
      <p className="text-lg text-gray-600 mb-12 font-light">
        Books you've saved for later
      </p>

      {readingList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100/50">
          <h3 className="text-2xl font-light text-gray-800 mb-4">
            Your reading list is empty
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Add books from recommendations to start building your list
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {readingList.map((book, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 
                border border-gray-100/50"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {book.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="font-medium text-indigo-600">by {book.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-gray-600 font-medium">{book.genre}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {book.description}
              </p>
              <button
                onClick={() => removeFromList(book)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove from list
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReadingList;