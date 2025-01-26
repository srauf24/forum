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
import Progress from './components/pages/Progress';
// Add import at the top
import ProtectedRoute from './components/auth/ProtectedRoute';
import Recommendations from './components/recommendations/Recommendations';

// In your Routes component
<Route path="/progress" element={<Progress />} />
import { Analytics } from '@vercel/analytics/react';
function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Analytics />
        <div className="flex flex-col min-h-screen w-screen">
          <Navbar />
          <main className="flex-1 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/books" element={<BooksList />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/about" element={<About />} />
                // Update these routes in your Routes component
                <Route 
                  path="/my-stats" 
                  element={
                    <ProtectedRoute>
                      <MyStats />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recommendations" 
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } 
                />
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