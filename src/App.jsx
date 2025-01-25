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
        <div className="min-h-screen bg-gray-50 w-screen overflow-x-hidden">
          <Navbar />
          <div className="p-8 w-full">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/mystats" element={<MyStats />} />
              <Route path="/about" element={<About />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/books" element={<BooksList />} />
              <Route path="/members" element={<MemberList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;