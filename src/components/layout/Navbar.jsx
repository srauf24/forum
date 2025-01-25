import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

function Navbar() {
  const { user, signIn, signOut } = useFirebase();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Book Club Forum
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-indigo-600">
                  {user.displayName || user.email}
                </span>
                <Link
                  to="/create"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Create Post
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;