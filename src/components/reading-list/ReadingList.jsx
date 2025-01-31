import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import AddBookForm from './AddBookForm';

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
  // Update the initial state first
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '0',
    pagesPerDay: ''
  });

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

    const today = new Date();
    const daysToFinish = Math.ceil((newBook.totalPages - newBook.currentPage) / (newBook.pagesPerDay || 1));
    const finishDate = new Date(today.setDate(today.getDate() + daysToFinish));

    const book = {
      ...newBook,
      description: `Manually added book: ${newBook.title} by ${newBook.author}`,
      genre: 'Unspecified',
      progress: {
        totalPages: parseInt(newBook.totalPages) || 0,
        currentPage: parseInt(newBook.currentPage) || 0,
        pagesPerDay: parseInt(newBook.pagesPerDay) || 0,
        startDate: new Date().toISOString(),
        estimatedFinishDate: finishDate.toISOString()
      }
    };

    const success = await addToReadingList(db, user.uid, book);
    if (success) {
      setReadingList(current => [...current, book]);
      setNewBook({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '0',
        pagesPerDay: '',
        readingFrequency: 'daily'
      });
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
        <form onSubmit={handleAddBook} className="mb-8 bg-white rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                id="title"
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter book title"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter author name"
                required
              />
            </div>
            <div>
              <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 mb-1">
                Total Pages
              </label>
              <input
                type="number"
                id="totalPages"
                value={newBook.totalPages}
                onChange={(e) => setNewBook(prev => ({ ...prev, totalPages: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter total pages"
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 mb-1">
                Current Page
              </label>
              <input
                type="number"
                id="currentPage"
                value={newBook.currentPage}
                onChange={(e) => setNewBook(prev => ({ ...prev, currentPage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter current page"
                required
                min="0"
                max={newBook.totalPages}
              />
            </div>
            <div>
              <label htmlFor="pagesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Pages Per Day
              </label>
              <input
                type="number"
                id="pagesPerDay"
                value={newBook.pagesPerDay}
                onChange={(e) => setNewBook(prev => ({ ...prev, pagesPerDay: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter pages per day"
                required
                min="1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Add Book
          </button>
        </form>
      )}

      {/* Update the book card display */}
      {readingList.map((book, index) => (
        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 
          border border-gray-100 hover:border-indigo-100 transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {book.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <span className="font-medium text-indigo-600">by {book.author}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-200"></span>
            <span className="text-gray-600 font-medium">{book.genre}</span>
          </div>

          {book.progress && (
            <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(book.progress.currentPage / book.progress.totalPages) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Page {book.progress.currentPage} of {book.progress.totalPages}</span>
                <span>{Math.round((book.progress.currentPage / book.progress.totalPages) * 100)}% Complete</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Daily Goal: {book.progress.pagesPerDay} pages</p>
                <p>Estimated finish date: {new Date(book.progress.estimatedFinishDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Existing description and remove button */}
        </div>
      ))}
    </div>
  );
}

export default ReadingList;