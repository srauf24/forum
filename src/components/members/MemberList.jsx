import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';

function MemberList() {
  const { db } = useFirebase();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberStats = async (userId) => {
      // Get posts stats
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
      const postsSnap = await onSnapshot(postsQuery, (snapshot) => {
        let postsCount = 0;
        let votesCount = 0;
        
        snapshot.docs.forEach(doc => {
          postsCount++;
          const post = doc.data();
          votesCount += (post.upVotes || 0) + (post.downVotes || 0);
        });
        
        // Get comments stats
        const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
        onSnapshot(commentsQuery, (commentsSnap) => {
          const commentsCount = commentsSnap.size;
          
          // Update member stats
          setMembers(prev => prev.map(member => {
            if (member.id === userId) {
              return {
                ...member,
                stats: {
                  posts: postsCount,
                  comments: commentsCount,
                  interactions: postsCount + commentsCount + votesCount
                }
              };
            }
            return member;
          }));
        });
      });
    };

    // Fetch users and their stats
    const usersQuery = query(collection(db, 'users'), orderBy('lastSeen', 'desc'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastSeen: doc.data().lastSeen?.toDate(),
        stats: {
          posts: 0,
          comments: 0,
          interactions: 0
        }
      }));
      
      setMembers(membersData);
      // Fetch stats for each member
      membersData.forEach(member => fetchMemberStats(member.id));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">Community Members</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Interactions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-indigo-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-600">
                          {member.displayName?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div className="font-medium text-gray-900">
                      {member.displayName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.lastSeen?.toLocaleDateString() || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.stats.posts}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.stats.comments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.stats.interactions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberList;