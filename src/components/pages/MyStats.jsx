import { useFirebase } from '../../contexts/FirebaseContext';
import UserStats from '../user/UserStats';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function MyStats() {
  const { user, badges, stats } = useFirebase();

  const getProgressPercentage = (badgeKey) => {
    switch (badgeKey) {
      case 'BOOKWORM':
        return Math.min(((stats.posts || 0) / 10) * 100, 100);
      case 'CONTRIBUTOR':
        return Math.min(((stats.comments || 0) / 50) * 100, 100);
      case 'LITERARY_LUMINARY':
        return Math.min(((stats.totalInteractions || 0) / 500) * 100, 100);
      case 'INFLUENCER':
        return Math.min(((stats.totalInteractions || 0) / 1000) * 100, 100);
      default:
        return 0;
    }
  };

  const getBadgeProgress = (badgeKey) => {
    switch (badgeKey) {
      case 'BOOKWORM':
        return `${stats.posts || 0}/10 posts created`;
      case 'CONTRIBUTOR':
        return `${stats.comments || 0}/50 comments made`;
      case 'LITERARY_LUMINARY':
        return `${stats.totalInteractions || 0}/500 total interactions`;
      case 'INFLUENCER':
        return `${stats.totalInteractions || 0}/1000 total interactions`;
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">My Progress</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {Object.entries(badges).map(([key, badge]) => {
            const isAchieved = stats?.achievements?.includes(key);
            const progress = getProgressPercentage(key);
            
            return (
              <div 
                key={key}
                className="flex flex-col p-4 hover:bg-indigo-50 rounded-lg group relative transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl relative">
                      <span className="relative z-10">{badge.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-indigo-900">{badge.name}</div>
                      <div className="text-sm text-indigo-600">
                        {getBadgeProgress(key)}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${isAchieved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {isAchieved ? 'Achieved!' : 'In Progress'}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isAchieved ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="absolute invisible group-hover:visible bg-indigo-900 text-white text-xs p-2 rounded 
                  -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg">
                  {key === 'BOOKWORM' && 'Create 10 posts'}
                  {key === 'CONTRIBUTOR' && 'Make 50 comments'}
                  {key === 'LITERARY_LUMINARY' && 'Get 500 interactions on a single post'}
                  {key === 'INFLUENCER' && 'Reach 1000 total interactions'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyStats;