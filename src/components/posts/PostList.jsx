import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike } from 'react-icons/bi';
import UserStats from '../user/UserStats';
function PostList() {
  const { user, db, calculateLevel, badges, posts, postsLoading, stats } = useFirebase();

  const handleVote = async (postId, voters, voteType) => {
    // ... add vote handling logic here
  };

  return (
    <div className="flex flex-col space-y-8 max-w-5xl mx-auto px-4">
      {/* Header section */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 
          bg-clip-text text-transparent">
          Recent Discussions
        </h1>
        {user && (
          <Link
            to="/create-post"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
              px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 
              transition-all duration-300 flex items-center space-x-3 font-medium 
              shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            <span className="text-white text-lg">Create Post</span>
            <span className="text-white text-2xl">+</span>
          </Link>
        )}
      </div>

      {/* User stats card */}
      {user && (
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100/50 
            backdrop-blur-sm bg-white/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Achievements</h3>
            <div className="flex gap-6">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-white 
                    flex items-center justify-center shadow-sm border border-indigo-100/50
                    transition-all duration-300 hover:scale-110 hover:shadow-md"
                >
                  {stats?.achievements[i] && (
                    <span className="text-2xl">{badges[stats.achievements[i]]?.icon}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="flex flex-col space-y-6">
        {posts?.map(post => (
          <div key={post.id} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl 
              transition-all duration-300 p-8 border border-gray-100/50">
            <div className="flex items-center space-x-4 mb-6">
              {post.userPhoto ? (
                <img src={post.userPhoto} alt="" 
                  className="w-14 h-14 rounded-full ring-4 ring-indigo-50" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-50 to-white 
                  flex items-center justify-center ring-4 ring-indigo-50">
                  <span className="text-indigo-600 text-xl font-medium">
                    {post.userName?.charAt(0)?.toUpperCase() || ' '}
                  </span>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-indigo-600">
                  Level {calculateLevel(post.interactions || 0)}
                </div>
              </div>
            </div>

            <Link to={`/post/${post.id}`} className="group block">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 
                transition-colors duration-300">
                {post.title}
              </h2>
              <div className="text-sm font-medium text-indigo-600 mb-4 flex items-center space-x-2">
                <span>Book:</span>
                <span className="text-gray-700">{post.bookTitle} by {post.bookAuthor}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{post.content}</p>
            </Link>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-8">
                <span className="text-sm text-gray-600">Posted by {post.userName}</span>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVote(post.id, post.voters, 'up');
                    }}
                    disabled={!user}
                    className={`text-lg hover:scale-110 transition-transform disabled:opacity-50
                      ${post.voters?.[user?.uid] === 'up' ? 'text-indigo-600' : 'text-gray-500'}`}
                    title={user ? "Like" : "Sign in to vote"}
                  >
                    {post.voters?.[user?.uid] === 'up' ? <BiSolidLike /> : <BiLike />}
                    <span className="text-xs font-medium ml-1">
                      {post.upVotes || 0}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVote(post.id, post.voters, 'down');
                    }}
                    disabled={!user}
                    className={`text-lg hover:scale-110 transition-transform disabled:opacity-50
                      ${post.voters?.[user?.uid] === 'down' ? 'text-indigo-600' : 'text-gray-500'}`}
                    title={user ? "Dislike" : "Sign in to vote"}
                  >
                    {post.voters?.[user?.uid] === 'down' ? <BiSolidDislike /> : <BiDislike />}
                    <span className="text-xs font-medium ml-1">
                      {post.downVotes || 0}
                    </span>
                  </button>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {post.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;