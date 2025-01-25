import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';

function PostDetail() {
  const { id } = useParams();
  const { db } = useFirebase();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold text-indigo-900 mb-4">{post.title}</h1>
      <div className="text-lg text-indigo-700 mb-6">
        Book: {post.bookTitle} by {post.bookAuthor}
      </div>
      <div className="prose max-w-none mb-8">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>
      <div className="text-sm text-indigo-500 mb-8">
        Posted on {post.createdAt?.toDate().toLocaleDateString()}
        <span className="ml-4">❤️ {post.likes}</span>
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