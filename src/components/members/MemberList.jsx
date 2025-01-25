import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseContext';

function MemberList() {
  const { db } = useFirebase();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('lastSeen', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">Community Members</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map(member => (
            <div key={member.id} 
              className="flex items-center space-x-4 p-4 hover:bg-indigo-50 rounded-lg transition-colors">
              {member.photoURL ? (
                <img 
                  src={member.photoURL} 
                  alt={member.displayName} 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-indigo-600">
                    {member.displayName?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{member.displayName}</h3>
                <p className="text-sm text-indigo-600">
                  {member.lastSeen?.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemberList;