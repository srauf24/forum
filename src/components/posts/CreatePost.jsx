import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function CreatePost() {
  const { db, user } = useFirebase();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    bookTitle: '',
    bookAuthor: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'posts'), {
        ...formData,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        upVotes: 0,
        downVotes: 0,
        commentCount: 0
      });
      
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Create New Post</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-indigo-700">Post Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700">Book Title</label>
          <input
            type="text"
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700">Book Author</label>
          <input
            type="text"
            name="bookAuthor"
            value={formData.bookAuthor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;