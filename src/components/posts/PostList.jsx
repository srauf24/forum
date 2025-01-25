import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, limit } from 'firebase/firestore';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike, BiComment } from 'react-icons/bi';import UserStats from '../user/UserStats';
function PostList() {
  const { user, db, calculateLevel } = useFirebase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optimize query with pagination and limit
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(postsQuery, {
      next: (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Remove the toDate() call here since we'll handle it in the render
          createdAt: doc.data().createdAt
        }));
        setPosts(postsData);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);

  // Add loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col space-y-6 max-w-5xl mx-auto px-4">
        <div className="animate-pulse space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 max-w-5xl mx-auto px-4">
      {/* Header section remains the same */}
      
      {/* Posts list with optimizations */}
      <div className="flex flex-col space-y-6">
        {posts?.map(post => (
          <div 
            key={post.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl 
              transition-all duration-300 border border-gray-100/50 will-change-transform"
          >
            {/* Post content with optimized image loading */}
            <div className="flex items-center space-x-4 mb-6">
              {post.userPhoto ? (
                <img 
                  src={post.userPhoto} 
                  alt=""
                  loading="lazy"
                  className="w-14 h-14 rounded-full ring-4 ring-indigo-50"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-50 to-white 
                  flex items-center justify-center ring-4 ring-indigo-50">
                  <span className="text-2xl font-medium text-indigo-600">
                    {post.userName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-indigo-600">
                  Level {calculateLevel(post.interactions || 0)}
                </div>
              </div>
            </div>

            <Link to={`/post/${post.id}`} className="group block">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 
                transition-colors duration-300">
                {post.title}
              </h2>
              <div className="text-sm font-medium text-indigo-600 mb-4 flex items-center space-x-2">
                <span>Book:</span>
                <span className="text-gray-700">{post.bookTitle} by {post.bookAuthor}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{post.content}</p>
            </Link>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-8">
                <span className="text-sm text-gray-600">Posted by {post.userName}</span>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVote(post.id, post.voters, 'up');
                    }}
                    disabled={!user}
                    className={`flex items-center space-x-1 text-lg hover:scale-110 transition-transform disabled:opacity-50
                      ${post.voters?.[user?.uid] === 'up' ? 'text-indigo-600' : 'text-gray-500'}`}
                    title={user ? "Like" : "Sign in to vote"}
                  >
                    {post.voters?.[user?.uid] === 'up' ? <BiSolidLike /> : <BiLike />}
                    <span className="text-sm">
                      {post.upVotes || 0}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVote(post.id, post.voters, 'down');
                    }}
                    disabled={!user}
                    className={`flex items-center space-x-1 text-lg hover:scale-110 transition-transform disabled:opacity-50
                      ${post.voters?.[user?.uid] === 'down' ? 'text-indigo-600' : 'text-gray-500'}`}
                    title={user ? "Dislike" : "Sign in to vote"}
                  >
                    {post.voters?.[user?.uid] === 'down' ? <BiSolidDislike /> : <BiDislike />}
                    <span className="text-sm">
                      {post.downVotes || 0}
                    </span>
                  </button>
                  <Link 
                    to={`/post/${post.id}`}
                    className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 
                      transition-colors hover:scale-110"
                  >
                    <BiComment className="text-lg" />
                    <span className="text-sm">
                      {post.commentCount || 0}
                    </span>
                  </Link>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {post.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;