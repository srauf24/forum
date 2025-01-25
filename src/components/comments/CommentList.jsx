import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function CommentList({ postId }) {
  const { db } = useFirebase();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, `posts/${postId}/comments`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching comments:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, postId]);

  if (loading) {
    return <div className="text-indigo-600">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-indigo-800">Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="bg-indigo-50 rounded-lg p-4">
            <p className="text-gray-800">{comment.content}</p>
            <div className="mt-2 text-sm text-indigo-600">
              {comment.createdAt?.toDate().toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;