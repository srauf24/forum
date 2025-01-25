import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Navbar from './components/layout/Navbar';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import CreatePost from './components/posts/CreatePost';
import { FirebaseProvider } from './contexts/FirebaseContext';
import MemberList from './components/members/MemberList';
// Add import
import BooksList from './components/books/BooksList';
import About from './components/pages/About';
import MyStats from './components/pages/MyStats';

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/books" element={<BooksList />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about" element={<About />} />
              <Route path="/my-stats" element={<MyStats />} />
              <Route path="/members" element={<MemberList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;