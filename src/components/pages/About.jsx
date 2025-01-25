import React from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';

function About() {
  const { user, signIn } = useFirebase();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      navigate('/');  // Redirect to PostList if logged in
    } else {
      signIn();  // Sign in if not logged in
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 
            bg-clip-text text-transparent">
            Welcome to BookClub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A community where book lovers come together to share their reading journey
            and discover new literary adventures.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl 
            transition-all duration-300 border border-gray-100/50">
            <div className="text-3xl text-indigo-600 mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Your Thoughts</h3>
            <p className="text-gray-600 leading-relaxed">
              Create discussions about your favorite books, share reviews, and connect
              with readers who share your literary interests.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl 
            transition-all duration-300 border border-gray-100/50">
            <div className="text-3xl text-indigo-600 mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Earn Achievements</h3>
            <p className="text-gray-600 leading-relaxed">
              Get recognized for your contributions to the community. Unlock special
              badges as you participate and engage with other readers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl 
            transition-all duration-300 border border-gray-100/50">
            <div className="text-3xl text-indigo-600 mb-4">💭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Join Discussions</h3>
            <p className="text-gray-600 leading-relaxed">
              Engage in meaningful conversations about books, authors, and genres.
              Discover new perspectives and insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl 
            transition-all duration-300 border border-gray-100/50">
            <div className="text-3xl text-indigo-600 mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Your Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your reading journey, set goals, and celebrate your literary
              achievements with our community.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-50 to-indigo-100 
          rounded-2xl p-12 shadow-inner">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your journey with fellow book lovers today. Share your stories,
            discover new reads, and become part of our growing community.
          </p>
          <button 
            onClick={handleAction}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
              px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 
              transition-all duration-300 font-medium shadow-lg 
              hover:shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            {user ? 'Go to Discussions' : 'Sign In to Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;