import { Link } from 'react-router-dom';

function Navbar() {
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
            <Link
              to="/create"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;