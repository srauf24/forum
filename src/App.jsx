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
import { Analytics } from '@vercel/analytics/react';
function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Analytics />
        <div className="flex flex-col min-h-screen w-screen">
          {/* Temporary seed button - remove after use */}
          <button 
            onClick={seedDatabase}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full"
          >
            Seed Data
          </button>
          <Navbar />
          <main className="flex-1 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
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
          </main>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;