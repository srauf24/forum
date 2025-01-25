import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike } from 'react-icons/bi';
import UserStats from '../user/UserStats';
function PostList() {
  const { user, db, calculateLevel, badges, posts, postsLoading, stats } = useFirebase();

  return (
    <div className="flex flex-col space-y-6">
      {/* Add header section with create post button */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-indigo-900">Recent Discussions</h1>
        {user && (
          <Link
            to="/create-post"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>Create Post</span>
            <span className="text-xl">+</span>
          </Link>
        )}
      </div>

      {/* User stats card */}
      {user && (
        <div className="max-w-sm">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">Badges:</div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  {stats?.achievements[i] && (
                    <span>{badges[stats.achievements[i]]?.icon}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Posts list */}
      <div className="flex flex-col space-y-4">
        {posts?.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              {post.userPhoto ? (
                <img src={post.userPhoto} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-medium">
                    {post.userName?.charAt(0)?.toUpperCase() || ' '}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{post.userName}</div>
                <div className="text-sm text-gray-500">Level {calculateLevel(post.interactions || 0)}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <Link to={`/post/${post.id}`} className="group">
                <h2 className="text-2xl font-semibold text-indigo-800 mb-3 group-hover:text-indigo-600">{post.title}</h2>
                <div className="text-sm text-indigo-600 mb-4">
                  Book: {post.bookTitle} by {post.bookAuthor}
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
              </Link>
              <div className="mt-4 text-sm text-indigo-500 flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-6">
                  <span>Posted by {post.userName}</span>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-1">
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
                      </button>
                      <span className="text-xs font-medium w-4 text-center">
                        {post.upVotes || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 ml-6">
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
                      </button>
                      <span className="text-xs font-medium w-4 text-center">
                        {post.downVotes || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;