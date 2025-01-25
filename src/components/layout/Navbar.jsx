import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

function Navbar() {
  const { user, signIn, signOut } = useFirebase();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              BookClub
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/about" className="text-gray-600 hover:text-indigo-600">
                About
              </Link>
              {user && (
                <Link to="/my-stats" className="text-gray-600 hover:text-indigo-600">
                  My Progress
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <button onClick={signOut} className="text-gray-600 hover:text-indigo-600">
                Sign Out
              </button>
            ) : (
              <button onClick={signIn} className="text-gray-600 hover:text-indigo-600">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;