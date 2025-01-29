import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Navbar from './components/layout/Navbar';
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
// Add import
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
        <div className="flex flex-col min-h-screen w-screen">
          <Navbar />
          <main className="flex-1 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
              <Routes>
                <Route path="/" element={
                  <div className="max-w-full sm:max-w-3xl mx-auto">
                    <PostList />
                  </div>
                } />
                <Route path="/books" element={
                  <div className="max-w-full sm:max-w-4xl mx-auto">
                    <BooksList />
                  </div>
                } />
                <Route path="/post/:id" element={
                  <div className="max-w-full sm:max-w-2xl mx-auto">
                    <PostDetail />
                  </div>
                } />
                <Route path="/create-post" element={
                  <div className="max-w-full sm:max-w-2xl mx-auto">
                    <CreatePost />
                  </div>
                } />
                <Route path="/about" element={
                  <div className="max-w-full sm:max-w-3xl mx-auto">
                    <About />
                  </div>
                } />
                <Route path="/progress" element={
                  <div className="max-w-full sm:max-w-2xl mx-auto">
                    <Progress />
                  </div>
                } />
                <Route path="/signin" element={
                  <div className="max-w-full sm:max-w-md mx-auto">
                    <SignIn />
                  </div>
                } />
                <Route path="/admin/cron-test" element={
                  <ProtectedRoute>
                    <div className="max-w-full sm:max-w-2xl mx-auto">
                      <DailyCronTest />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/my-stats" element={
                  <ProtectedRoute>
                    <div className="max-w-full sm:max-w-2xl mx-auto">
                      <MyStats />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/reading-list" element={
                  <ProtectedRoute>
                    <div className="max-w-full sm:max-w-3xl mx-auto">
                      <ReadingList />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/recommendations" element={
                  <ProtectedRoute>
                    <div className="max-w-full sm:max-w-3xl mx-auto">
                      <Recommendations />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/members" element={
                  <div className="max-w-full sm:max-w-4xl mx-auto">
                    <MemberList />
                  </div>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;