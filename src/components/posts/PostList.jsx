import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function PostList() {
  const { db } = useFirebase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [db]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-indigo-900">Recent Book Discussions</h1>
      <div className="grid gap-6">
        {posts.map(post => (
          <Link 
            key={post.id} 
            to={`/post/${post.id}`}
            className="block bg-indigo-50 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">{post.title}</h2>
            <div className="text-sm text-indigo-600 mb-3">
              Book: {post.bookTitle} by {post.bookAuthor}
            </div>
            <p className="text-gray-800 line-clamp-2">{post.content}</p>
            <div className="mt-4 text-sm text-indigo-500">
              {post.createdAt?.toDate().toLocaleDateString()}
              <span className="ml-4">❤️ {post.likes}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PostList;