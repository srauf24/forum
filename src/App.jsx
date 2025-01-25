import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Navbar from './components/layout/Navbar';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import CreatePost from './components/posts/CreatePost';
import { FirebaseProvider } from './contexts/FirebaseContext';

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<CreatePost />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;