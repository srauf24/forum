import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll add Firebase fetch logic here later
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post?.title}</h1>
        <div className="prose max-w-none">
          <p className="text-gray-700">{post?.content}</p>
        </div>
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {/* Comments section will be added here */}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;