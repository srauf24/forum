import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';
import { onSnapshot } from 'firebase/firestore';
import { analyzeReviews } from '../../utils/sentimentAnalyzer';

function BooksList() {
  const { db } = useFirebase();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('upVotes', 'desc'),
      limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksMap = new Map();
      const postsMap = new Map();
      
      snapshot.docs.forEach(doc => {
        const post = doc.data();
        const bookKey = `${post.bookTitle}-${post.bookAuthor}`;
        
        // Store posts for sentiment analysis
        if (!postsMap.has(bookKey)) {
          postsMap.set(bookKey, []);
        }
        postsMap.get(bookKey).push(post);
        
        if (!booksMap.has(bookKey)) {
          booksMap.set(bookKey, {
            title: post.bookTitle,
            author: post.bookAuthor,
            upVotes: post.upVotes || 0,
            downVotes: post.downVotes || 0,
            discussionCount: post.commentCount || 0,
            sentiment: null
          });
        } else {
          const book = booksMap.get(bookKey);
          book.upVotes += (post.upVotes || 0);
          book.downVotes += (post.downVotes || 0);
          book.discussionCount += (post.commentCount || 0);
        }
      });

      // Add sentiment analysis
      for (const [key, posts] of postsMap.entries()) {
        const book = booksMap.get(key);
        book.sentiment = analyzeReviews(posts);
      }

      const booksArray = Array.from(booksMap.values())
        .sort((a, b) => (b.upVotes - b.downVotes) - (a.upVotes - a.downVotes));
      
      setBooks(booksArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-indigo-900 mb-4">Trending Books</h2>
      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={`${book.title}-${book.author}`} className="flex items-center space-x-3">
            <div className="w-8 text-center text-indigo-600 font-medium">
              #{index + 1}
            </div>
            <div>
              <h3 className="text-gray-900 font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <div className="text-xs text-indigo-500">
                {book.discussionCount} discussion{book.discussionCount !== 1 ? 's' : ''} · 
                {book.upVotes - book.downVotes} votes
              </div>
              {book.sentiment && (
                <div className="text-sm text-gray-900 mt-1">
                  This book <strong>{book.sentiment.readerMood}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;