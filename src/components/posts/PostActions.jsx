import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

function PostActions({ post }) {
  const { user, db } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    upVotes: post.upVotes,  // Remove the || 0 to allow negative values
    downVotes: post.downVotes,
    commentCount: post.commentCount
  });

  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);
    
    // Listen to post updates
    const unsubPost = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStats(prev => ({
          ...prev,
          upVotes: data.upVotes,  // Allow negative values
          downVotes: data.downVotes
        }));
      }
    });

    // Listen to comments count
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', post.id)
    );
    
    const unsubComments = onSnapshot(commentsQuery, async (snapshot) => {
      const actualCount = snapshot.size;
      setStats(prev => ({
        ...prev,
        commentCount: actualCount
      }));

      // Update post document with actual comment count
      try {
        const postDoc = await getDoc(postRef);
        if (postDoc.exists() && postDoc.data().commentCount !== actualCount) {
          await updateDoc(postRef, { commentCount: actualCount });
        }
      } catch (error) {
        console.error('Error updating comment count:', error);
      }
    });

    return () => {
      unsubPost();
      unsubComments();
    };
  }, [db, post.id]);

  const handleVote = async (isUpvote) => {
    if (!user || isLoading) return;
    setIsLoading(true);

    try {
      const postRef = doc(db, 'posts', post.id);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) return;
      
      const currentPost = postSnap.data();
      const currentUpVotes = currentPost.upVotes || 0;
      const currentDownVotes = currentPost.downVotes || 0;

      await updateDoc(postRef, {
        upVotes: isUpvote ? currentUpVotes - 1 : currentUpVotes,  // Decrease for upvote
        downVotes: !isUpvote ? currentDownVotes - 1 : currentDownVotes  // Decrease for downvote
      });
    } catch (error) {
      console.error('Error updating votes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => handleVote(true)}
        disabled={isLoading || !user}
        className={`flex items-center space-x-1 ${
          user ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400'
        }`}
      >
        <span>{stats.upVotes}</span>
        <span>👍</span>
      </button>

      <button 
        onClick={() => handleVote(false)}
        disabled={isLoading || !user}
        className={`flex items-center space-x-1 ${
          user ? 'text-rose-600 hover:text-rose-700' : 'text-gray-400'
        }`}
      >
        <span>{stats.downVotes}</span>
        <span>👎</span>
      </button>

      <div className="flex items-center space-x-1 text-gray-600">
        <span>{stats.commentCount}</span>
        <span>💬</span>
      </div>
    </div>
  );
}

export default PostActions;