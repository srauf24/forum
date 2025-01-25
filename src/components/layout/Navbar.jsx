import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

function Navbar() {
  const { user, signIn, signOut } = useFirebase();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
              BookForum
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/books" className="text-indigo-600 hover:text-indigo-800">
                Trending Books
              </Link>
              <Link to="/members" className="text-indigo-600 hover:text-indigo-800">
                Members
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Post
                </Link>
                <span className="text-indigo-600 font-medium">Hello, {user.displayName}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;