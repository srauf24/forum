import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useState } from 'react';
import './Layout.css';  // Add this line

function Navbar() {
  const { user, signIn, signOut } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg w-full fixed top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              BookClub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              About
            </Link>
            {user && (
              <>
                <Link to="/my-stats" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  My Progress
                </Link>
                <Link
                  to="/reading-list"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-full
                    hover:bg-indigo-50 transition-all duration-300 font-medium"
                >
                  Reading List
                </Link>
                <Link to="/recommendations" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Recommendations
                </Link>
              </>
            )}
            <Link to="/members" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Members
            </Link>
            <Link to="/books" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Trending Books
            </Link>
            {user ? (
              <button onClick={signOut} className="ml-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium">
                Sign Out
              </button>
            ) : (
              <button onClick={signIn} className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors duration-200"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                About
              </Link>
              {user && (
                <>
                  <Link to="/my-stats" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                    My Progress
                  </Link>
                  <Link to="/reading-list" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                    Reading List
                  </Link>
                  <Link to="/recommendations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                    Recommendations
                  </Link>
                </>
              )}
              <Link to="/members" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                Members
              </Link>
              <Link to="/books" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                Trending Books
              </Link>
              {user ? (
                <button onClick={signOut} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                  Sign Out
                </button>
              ) : (
                <button onClick={signIn} className="w-full mt-2 px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200">
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;