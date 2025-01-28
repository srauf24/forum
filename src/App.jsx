import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Navbar from './components/layout/Navbar';
import DailyCronTest from './components/cron/DailyCronTest';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import CreatePost from './components/posts/CreatePost';
import { FirebaseProvider } from './contexts/FirebaseContext';
import MemberList from './components/members/MemberList';
import ReadingList from './components/reading-list/ReadingList';
// Add import
import BooksList from './components/books/BooksList';
import About from './components/pages/About';
import MyStats from './components/pages/MyStats';
import Progress from './components/pages/Progress';
// Add import at the top
import ProtectedRoute from './components/auth/ProtectedRoute';
import Recommendations from './components/recommendations/Recommendations';
import { SpeedInsights } from "@vercel/speed-insights/react";// In your Routes component
import { Analytics } from '@vercel/analytics/react';
// Add import
import DailyCronTest from './components/api/DailyCronTest';

// Add to Routes
<Route
  path="/admin/cron-test"
  element={
    <ProtectedRoute>
      <DailyCronTest />
    </ProtectedRoute>
  }
/>
function App() {
  return (
    <FirebaseProvider>
      <Router>
        <SpeedInsights />
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
                <Route path="/progress" element={<Progress />} />
                <Route path="/signin" element={<SignIn />} />
                <Route
                  path="/admin/cron-test"
                  element={
                    <ProtectedRoute>
                      <DailyCronTest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-stats"
                  element={
                    <ProtectedRoute>
                      <MyStats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reading-list"
                  element={
                    <ProtectedRoute>
                      <ReadingList />
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
                <Route path="/" element={<PostList />} />
                <Route path="/admin/cron-test" element={<DailyCronTest />} /> {/* Add this route */}
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;