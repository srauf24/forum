import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  limit, 
  writeBatch, 
  deleteField,
  serverTimestamp 
} from 'firebase/firestore';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike, BiComment } from 'react-icons/bi';
import { getDocs, startAfter } from 'firebase/firestore';
function PostList() {
  const { user, db, calculateLevel } = useFirebase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add these state variables at the top with other states
  const [hasMore, setHasMore] = useState(true);
  const [lastPost, setLastPost] = useState(null);

  useEffect(() => {
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
          createdAt: doc.data().createdAt
        }));
        setPosts(postsData);
        setLastPost(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 5);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    const nextQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      startAfter(lastPost),
      limit(5)
    );

    try {
      const snapshot = await getDocs(nextQuery);
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
      }));
      
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLastPost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 5);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this at the bottom of your posts list, just before the closing div
  {hasMore && (
    <button 
      onClick={loadMorePosts}
      className="w-full py-4 text-center text-gray-600 hover:text-indigo-600 transition-colors"
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Load More Discussions'}
    </button>
  )}

  const handleVote = async (postId, currentVoters, voteType) => {
    if (!user) return;
    
    const postRef = doc(db, 'posts', postId);
    const userVote = currentVoters?.[user.uid];
    
    const batch = writeBatch(db);
    
    // Remove old vote if exists
    if (userVote) {
      batch.update(postRef, {
        [`${userVote}Votes`]: increment(-1),
        interactions: increment(-1),
        [`voters.${user.uid}`]: deleteField()
      });
    }
    
    // Add new vote if different from old vote
    if (!userVote || userVote !== voteType) {
      batch.update(postRef, {
        [`${voteType}Votes`]: increment(1),
        interactions: increment(1),
        [`voters.${user.uid}`]: voteType
      });
    }
    
    try {
      await batch.commit();
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

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
      {/* Header section */}
      <div className="flex justify-between items-center py-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Recent Discussions
          </h1>
          <p className="text-gray-600">Join the conversation about your favorite books</p>
        </div>
        {user ? (
          <Link
            to="/create-post"
            className="px-8 py-4 bg-[#6366F1] text-white text-lg font-medium rounded-full
              shadow-lg hover:bg-[#5558E5] transition-all duration-300"
          >
            Create a Post +
          </Link>
        ) : (
          <Link
            to="/signin"
            className="px-8 py-4 bg-[#6366F1] text-white text-lg font-medium rounded-full
              shadow-lg hover:bg-[#5558E5] transition-all duration-300"
          >
            Sign in to Post
          </Link>
        )}
      </div>
      
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
                    {post.userName?.charAt(0)?.toUpperCase()}
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

        {/* Add Load More button here */}
        {hasMore && (
          <button 
            onClick={loadMorePosts}
            className="w-full py-4 mt-4 text-center text-gray-600 hover:text-indigo-600 
              transition-colors bg-white rounded-xl border border-gray-100 hover:border-indigo-100"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Discussions'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PostList;