import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';

function MemberList() {
  const { db, calculateLevel } = useFirebase();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('lastSeen', 'desc'),
      limit(6)
    );

    const unsubscribe = onSnapshot(usersQuery, async (snapshot) => {
      const membersData = await Promise.all(snapshot.docs.map(async (doc) => {
        const userData = doc.data();
        
        // Fetch posts and their comments
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', doc.id)
        );
        const postsSnap = await getDocs(postsQuery);
        
        // Track likes, dislikes, and comments separately
        let totalLikes = 0;
        let totalDislikes = 0;
        let totalComments = 0;
        
        postsSnap.forEach(post => {
          const postData = post.data();
          totalLikes += (postData.upVotes || 0);
          totalDislikes += (postData.downVotes || 0);
          totalComments += (postData.commentCount || 0);
        });

        const commentsQuery = query(
          collection(db, 'comments'),
          where('userId', '==', doc.id)
        );
        const commentsSnap = await getDocs(commentsQuery);
        totalComments += commentsSnap.size;

        const totalInteractions = totalLikes + totalDislikes + totalComments;

        return {
          id: doc.id,
          ...userData,
          posts: postsSnap.size,
          comments: totalComments,
          likes: totalLikes,
          dislikes: totalDislikes,
          interactions: totalInteractions,
          achievements: calculateAchievements(postsSnap.size, totalComments, totalInteractions)
        };
      }));

      setMembers(membersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 
          bg-clip-text text-transparent">
          Our Community Members
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Meet our amazing readers and contributors who make this community special
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members?.map(member => (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl 
            transition-all duration-300 border border-gray-100/50">
            <div className="flex items-center space-x-4">
              {member.photoURL ? (
                <img 
                  src={member.photoURL} 
                  alt={member.displayName} 
                  className="w-16 h-16 rounded-full ring-4 ring-indigo-50"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-white 
                  flex items-center justify-center ring-4 ring-indigo-50">
                  <span className="text-2xl font-medium text-indigo-600">
                    {member.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.displayName}
                </h3>
                <div className="text-sm font-medium text-indigo-600">
                  Level {calculateLevel(member.stats?.interactions || 0)}  {/* Update to use stats.interactions */}
                </div>
              </div>
            </div>

            {/* Member Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {member.posts || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {member.likes || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600">
                  {member.dislikes || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Dislikes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {member.achievements?.length || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Badges</div>
              </div>
            </div>

            {/* Achievement Badges */}
            {member.achievements?.length > 0 && (
              <div className="mt-6 flex gap-2">
                {member.achievements.map((achievement, index) => (
                  <div key={index} 
                    className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center
                      transition-all duration-200 hover:scale-110">
                    <span className="text-lg">{achievement.icon}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;