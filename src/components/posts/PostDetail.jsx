import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db, user } = useFirebase();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleVote = async (increment) => {
    if (!user) return;
    
    try {
      const postRef = doc(db, 'posts', id);
      const newVotes = (post.votes || 0) + increment;
      const voters = { ...post.voters, [user.uid]: increment };
      
      await updateDoc(postRef, {
        votes: newVotes,
        voters: voters
      });
    } catch (error) {
      console.error('Error updating votes:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [db, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-indigo-600">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">{post.title}</h1>
          <div className="text-sm text-indigo-600 mt-2">
            Posted by {post.authorName}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(1)}
              disabled={!user}
              className="text-2xl text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
            >
              ▲
            </button>
            <span className="text-xl font-semibold text-indigo-700">
              {post.votes || 0}
            </span>
            <button
              onClick={() => handleVote(-1)}
              disabled={!user}
              className="text-2xl text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
            >
              ▼
            </button>
          </div>
          {user && user.uid === post.authorId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <div className="border-t pt-8">
        <CommentForm postId={id} />
        <div className="mt-8">
          <CommentList postId={id} />
        </div>
      </div>
    </div>
  );
}

export default PostDetail;