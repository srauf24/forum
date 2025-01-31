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
  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

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

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    const book = {
      ...newBook,
      description: `Manually added book: ${newBook.title} by ${newBook.author}`,
      genre: 'Unspecified'
    };

    const success = await addToReadingList(db, user.uid, book);
    if (success) {
      setReadingList(current => [...current, book]);
      setNewBook({ title: '', author: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
            Your Reading List
          </h1>
          <p className="text-lg text-gray-600 font-light italic">
            Your personal library of literary treasures
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
            rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 
            shadow-lg hover:shadow-xl text-sm font-medium transform hover:scale-105"
        >
          {showForm ? 'Cancel' : '+ Add New Book'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBook} className="mb-8 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Book Title
              </label>
              <input
                type="text"
                id="title"
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Enter book title..."
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Enter author name..."
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
              rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 
              shadow-lg hover:shadow-xl text-sm font-medium transform hover:scale-105"
          >
            Add to Collection
          </button>
        </form>
      )}

      {readingList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-light text-gray-800 mb-4">
            Begin Your Reading Journey
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Start curating your personal collection of literary masterpieces
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {readingList.map((book, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 
                border border-gray-100 hover:border-indigo-100 transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {book.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="font-medium text-indigo-600">by {book.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-200"></span>
                <span className="text-gray-600 font-medium">{book.genre}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                {book.description}
              </p>
              <button
                onClick={() => removeFromList(book)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2
                  transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove from collection
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReadingList;