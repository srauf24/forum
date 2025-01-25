import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike } from 'react-icons/bi';

function PostList() {
  const { db, user } = useFirebase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleVote = async (postId, voters, voteType) => {
    if (!user) return;
    
    try {
      const postRef = doc(db, 'posts', postId);
      const currentVote = voters?.[user.uid] || null;
      let updates = {};

      if (currentVote === voteType) {
        // Remove vote if clicking the same button
        updates = {
          [`${voteType}Votes`]: increment(-1),
          voters: { ...voters, [user.uid]: null }
        };
      } else {
        // Add new vote and remove old vote if exists
        updates = {
          [`${voteType}Votes`]: increment(1),
          ...(currentVote && { [`${currentVote}Votes`]: increment(-1) }),
          voters: { ...voters, [user.uid]: voteType }
        };
      }
      
      await updateDoc(postRef, updates);
    } catch (error) {
      console.error('Error updating votes:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-indigo-900">Recent Book Discussions</h1>
      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-1">
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-xl font-semibold text-indigo-800 mb-2">{post.title}</h2>
                  <div className="text-sm text-indigo-600 mb-3">
                    Book: {post.bookTitle} by {post.bookAuthor}
                  </div>
                  <p className="text-gray-800 line-clamp-2">{post.content}</p>
                  <div className="mt-4 text-sm text-indigo-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>Posted by {post.authorName}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleVote(post.id, post.voters, 'up');
                          }}
                          disabled={!user}
                          className={`text-lg hover:scale-110 transition-transform disabled:opacity-50
                            ${post.voters?.[user?.uid] === 'up' ? 'text-indigo-600' : 'text-gray-500'}`}
                          title={user ? "Like" : "Sign in to vote"}
                        >
                          {post.voters?.[user?.uid] === 'up' ? <BiSolidLike /> : <BiLike />}
                        </button>
                        <span className="text-xs font-medium">
                          {post.upVotes || 0}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleVote(post.id, post.voters, 'down');
                          }}
                          disabled={!user}
                          className={`text-lg hover:scale-110 transition-transform disabled:opacity-50 ml-2
                            ${post.voters?.[user?.uid] === 'down' ? 'text-indigo-600' : 'text-gray-500'}`}
                          title={user ? "Dislike" : "Sign in to vote"}
                        >
                          {post.voters?.[user?.uid] === 'down' ? <BiSolidDislike /> : <BiDislike />}
                        </button>
                        <span className="text-xs font-medium">
                          {post.downVotes || 0}
                        </span>
                      </div>
                    </div>
                    <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;