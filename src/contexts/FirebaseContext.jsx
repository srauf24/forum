import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
  where  // Add this import
} from 'firebase/firestore';

const FirebaseContext = createContext(null);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const badges = {
  BOOKWORM: { icon: "📚", name: "Bookworm", goal: 10 },
  CONTRIBUTOR: { icon: "✍️", name: "Contributor", goal: 50 },
  LITERARY_LUMINARY: { icon: "🌟", name: "Literary Luminary", goal: 500 },
  INFLUENCER: { icon: "👑", name: "Influencer", goal: 1000 }
};

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [stats, setStats] = useState({
    achievements: [],
    level: 1,
    progress: 0,
    totalInteractions: 0,
    posts: 0,
    comments: 0
  });

  // Add stats tracking
  useEffect(() => {
    if (!user) return;

    const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.uid));
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', user.uid));

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      let totalInteractions = 0;
      let achievements = [];
      const postsCount = snapshot.size;
      
      if (postsCount >= 10) achievements.push('BOOKWORM');
      
      snapshot.docs.forEach(doc => {
        const post = doc.data();
        const postInteractions = (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
        totalInteractions += postInteractions;
        
        if (postInteractions >= 500) achievements.push('LITERARY_LUMINARY');
      });
      
      if (totalInteractions >= 1000) achievements.push('INFLUENCER');

      setStats(prev => ({
        ...prev,
        posts: postsCount,
        achievements: [...new Set([...prev.achievements, ...achievements])],
        totalInteractions,
        level: calculateLevel(totalInteractions),
        progress: calculateProgress(totalInteractions)
      }));
    });

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentsCount = snapshot.size;
      if (commentsCount >= 50) {
        setStats(prev => ({
          ...prev,
          comments: commentsCount,
          achievements: [...new Set([...prev.achievements, 'CONTRIBUTOR'])]
        }));
      } else {
        setStats(prev => ({
          ...prev,
          comments: commentsCount
        }));
      }
    });

    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, [user, db]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Store or update user data in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastSeen: serverTimestamp(),
      }, { merge: true }); // merge: true will update existing fields and keep others
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  const calculateLevel = (interactions) => {
    return Math.floor(Math.sqrt(interactions / 10)) + 1;
  };
  
  const calculateProgress = (interactions) => {
    const currentLevel = calculateLevel(interactions);
    const nextLevelPoints = (currentLevel * currentLevel) * 10;
    const currentLevelPoints = ((currentLevel - 1) * (currentLevel - 1)) * 10;
    const progress = ((interactions - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };

  // Add posts fetching
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <FirebaseContext.Provider value={{ 
      db, 
      user, 
      signIn, 
      signOut, 
      loading,
      calculateLevel,
      calculateProgress,
      badges,
      stats,
      posts, // Add posts to context
      postsLoading // Add postsLoading to context
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}