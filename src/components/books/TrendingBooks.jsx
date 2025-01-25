import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';

function TrendingBooks() {
  const { db } = useFirebase();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const booksQuery = query(
      collection(db, 'posts'),
      orderBy('interactions', 'desc'),
      limit(6)
    );

    const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 
          bg-clip-text text-transparent">
          Trending Books
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover what our community is reading and discussing right now
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map(book => (
          <div key={book.id} 
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl 
              transition-all duration-300 border border-gray-100/50">
            {/* Book Cover & Title */}
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-indigo-50 to-white">
                {book.bookCover ? (
                  <img 
                    src={book.bookCover} 
                    alt={book.bookTitle}
                    className="object-cover w-full h-full transform group-hover:scale-105 
                      transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 
                transition-colors duration-300">
                {book.bookTitle}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                by {book.bookAuthor}
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-indigo-600">👥</span>
                    <span className="text-sm text-gray-600">
                      {book.interactions || 0} discussions
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {book.createdAt?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingBooks;