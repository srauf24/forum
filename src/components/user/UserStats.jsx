import { useState, useEffect } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function UserStats({ userId }) {
  const { db, calculateLevel, calculateProgress } = useFirebase();
  const [stats, setStats] = useState({
    level: 1,
    progress: 0,
    achievements: [],
    totalUpvotes: 0,
    streak: 0
  });

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
      
      <div className="flex flex-col gap-2">
        {Object.entries(badges).map(([key, badge]) => {
          const progress = {
            BOOKWORM: { current: stats.posts || 0, goal: 10 },
            CONTRIBUTOR: { current: stats.comments || 0, goal: 50 },
            LITERARY_LUMINARY: { current: stats.totalInteractions || 0, goal: 500 },
            INFLUENCER: { current: stats.totalInteractions || 0, goal: 1000 }
          }[key];
          
          const isAchieved = stats.achievements.includes(key);
          
          return (
            <div key={key} className={`flex items-center justify-between p-2 rounded-lg ${
              isAchieved ? 'bg-indigo-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <span>{badge.icon}</span>
                <span className={`text-sm ${isAchieved ? 'text-indigo-700' : 'text-gray-600'}`}>
                  {badge.name}
                </span>
              </div>
              <span className="text-xs font-medium">
                {progress.current}/{progress.goal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserStats;