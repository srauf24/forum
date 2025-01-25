import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function UserStats({ userId, compact = false }) {
  const { db, calculateLevel, calculateProgress } = useFirebase();
  
  // Return early if no userId is provided
  if (!userId) {
    return null;
  }

  const [stats, setStats] = useState({
    level: 1,
    progress: 0,
    totalInteractions: 0,
    totalUpvotes: 0,
    achievements: [],
    posts: 0
  });

  const [showProgress, setShowProgress] = useState(false);

  // Remove duplicate useEffects and keep only one
  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      let totalUpvotes = 0;
      let totalInteractions = 0;
      let achievements = [];

      snapshot.docs.forEach(doc => {
        const post = doc.data();
        totalUpvotes += (post.upVotes || 0);
        totalInteractions += (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
      });

      if (totalUpvotes >= 100) achievements.push('POPULAR_POST');
      if (snapshot.size >= 10) achievements.push('BOOKWORM');
      if (totalInteractions >= 500) achievements.push('LITERARY_LUMINARY');
      if (totalInteractions >= 1000) achievements.push('INFLUENCER');

      setStats(prev => ({
        ...prev,
        level: calculateLevel(totalInteractions),
        progress: calculateProgress(totalInteractions),
        achievements: [...new Set([...prev.achievements, ...achievements])],
        totalUpvotes,
        totalInteractions,
        posts: snapshot.size
      }));
    });

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      if (snapshot.size >= 50) {
        setStats(prev => ({
          ...prev,
          achievements: [...new Set([...prev.achievements, 'CONTRIBUTOR'])]
        }));
      }
    });

    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, [db, userId, calculateLevel, calculateProgress]);

  useEffect(() => {
    // Query posts for this user
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      let totalUpvotes = 0;
      let totalInteractions = 0;
      let achievements = [];

      snapshot.docs.forEach(doc => {
        const post = doc.data();
        totalUpvotes += (post.upVotes || 0);
        totalInteractions += (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
      });

      if (totalUpvotes >= 100) achievements.push('POPULAR_POST');
      if (snapshot.size >= 10) achievements.push('BOOKWORM');

      // Update stats with level calculations
      const level = calculateLevel(totalInteractions);
      const progress = calculateProgress(totalInteractions);

      if (totalInteractions >= 1000) achievements.push('INFLUENCER');

      setStats(prev => ({
        ...prev,
        level,
        progress,
        achievements: [...new Set([...prev.achievements, ...achievements])],
        totalUpvotes
      }));
    });

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      if (snapshot.size >= 50) {
        setStats(prev => ({
          ...prev,
          achievements: [...new Set([...prev.achievements, 'CONTRIBUTOR'])]
        }));
      }
    });

    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, [db, userId, calculateLevel, calculateProgress]);

  
  useEffect(() => {
    // Query posts for this user
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      let totalUpvotes = 0;
      let totalInteractions = 0;
      let achievements = [];

      snapshot.docs.forEach(doc => {
        const post = doc.data();
        totalUpvotes += (post.upVotes || 0);
        totalInteractions += (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
      });

      if (totalUpvotes >= 100) achievements.push('POPULAR_POST');
      if (snapshot.size >= 10) achievements.push('BOOKWORM');

      // Update stats with level calculations
      const level = calculateLevel(totalInteractions);
      const progress = calculateProgress(totalInteractions);

      if (totalInteractions >= 1000) achievements.push('INFLUENCER');

      setStats(prev => ({
        ...prev,
        level,
        progress,
        achievements: [...new Set([...prev.achievements, ...achievements])],
        totalUpvotes
      }));
    });

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      if (snapshot.size >= 50) {
        setStats(prev => ({
          ...prev,
          achievements: [...new Set([...prev.achievements, 'CONTRIBUTOR'])]
        }));
      }
    });

    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, [db, userId, calculateLevel, calculateProgress]);

  // Achievement badges in order from easiest to hardest
  const badges = {
    BOOKWORM: { icon: "📚", name: "Bookworm", goal: 10 },
    CONTRIBUTOR: { icon: "✍️", name: "Contributor", goal: 50 },
    LITERARY_LUMINARY: { icon: "🌟", name: "Literary Luminary", goal: 500 },
    INFLUENCER: { icon: "👑", name: "Influencer", goal: 1000 }
  };
  
  // Update the useEffect to track all stats
  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
  
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      let totalInteractions = 0;
      let achievements = [];
      
      // Track post count for Bookworm
      if (snapshot.size >= 10) achievements.push('BOOKWORM');
      
      // Track interactions for Literary Luminary and Influencer
      snapshot.docs.forEach(doc => {
        const post = doc.data();
        const postInteractions = (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
        totalInteractions += postInteractions;
        
        if (postInteractions >= 500) achievements.push('LITERARY_LUMINARY');
      });
      
      if (totalInteractions >= 1000) achievements.push('INFLUENCER');
  
      setStats(prev => ({
        ...prev,
        posts: snapshot.size,
        totalInteractions,
        achievements: [...new Set([...prev.achievements, ...achievements])]
      }));
    });
  
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      if (snapshot.size >= 50) {
        setStats(prev => ({
          ...prev,
          achievements: [...new Set([...prev.achievements, 'CONTRIBUTOR'])]
        }));
      }
    });
  
    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, [db, userId, calculateLevel, calculateProgress]);

  if (compact) {
    return (
      <div className="text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span>Level {stats.level}</span>
          <div className="flex gap-1">
            {Object.entries(badges).map(([key, badge]) => {
              const isAchieved = stats.achievements.includes(key);
              return isAchieved && (
                <span 
                  key={key}
                  title={badge.name}
                  className="cursor-help"
                >
                  {badge.icon}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Level {stats.level}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Next level: {stats.progress.toFixed(0)}% complete
          </div>
        </div>
        <div className="text-2xl">{stats.totalUpvotes} ❤️</div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(badges).map(([key, badge]) => {
          const isAchieved = stats.achievements.includes(key);
          return isAchieved && (
            <div 
              key={key}
              className="flex items-center bg-indigo-50 px-2 py-0.5 rounded-full"
              title={badge.name}
            >
              <span>{badge.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserStats;