import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FirebaseProvider } from './contexts/FirebaseContext'
import Navbar from './components/layout/Navbar'
import PostList from './components/posts/PostList'
import CreatePost from './components/posts/CreatePost'
import PostDetail from './components/posts/PostDetail'

function App() {
  return (
    <FirebaseProvider>
      <Router> 
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto mt-8 px-4">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FirebaseProvider>
  )
}

export default App