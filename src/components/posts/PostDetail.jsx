import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import UserStats from '../user/UserStats';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike } from 'react-icons/bi';

function PostDetail() {
  const { id } = useParams();
  const { user, db } = useFirebase();
  const navigate = useNavigate();
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col space-y-4">
          {/* User info and delete button row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src={post.userPhoto} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium text-lg">{post.userName}</div>
                <UserStats userId={post.userId} compact={true} />
              </div>
            </div>
            {user && user.uid === post.userId && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
          
          {/* Title and book info */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">{post.title}</h1>
            <div className="text-sm text-indigo-600">
              Book: {post.bookTitle} by {post.bookAuthor}
            </div>
          </div>
          
          {/* Content */}
          <p className="text-gray-800">{post.content}</p>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <CommentForm postId={id} />
        <div className="mt-8">
          <CommentList postId={id} />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-indigo-500 flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-6">
          <span>Posted by {post.userName}</span>
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote('up')}
                disabled={!user}
                className={`text-lg hover:scale-110 transition-transform disabled:opacity-50
                  ${post.voters?.[user?.uid] === 'up' ? 'text-indigo-600' : 'text-gray-500'}`}
                title={user ? "Like" : "Sign in to vote"}
              >
                {post.voters?.[user?.uid] === 'up' ? <BiSolidLike /> : <BiLike />}
              </button>
              <span className="text-xs font-medium w-4 text-center">
                {post.upVotes || 0}
              </span>
            </div>
            <div className="flex items-center space-x-1 ml-6">
              <button
                onClick={() => handleVote('down')}
                disabled={!user}
                className={`text-lg hover:scale-110 transition-transform disabled:opacity-50
                  ${post.voters?.[user?.uid] === 'down' ? 'text-indigo-600' : 'text-gray-500'}`}
                title={user ? "Dislike" : "Sign in to vote"}
              >
                {post.voters?.[user?.uid] === 'down' ? <BiSolidDislike /> : <BiDislike />}
              </button>
              <span className="text-xs font-medium w-4 text-center">
                {post.downVotes || 0}
              </span>
            </div>
          </div>
        </div>
        <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
      </div>

      {/* ... comments section ... */}
    </div>
  );
}

export default PostDetail;