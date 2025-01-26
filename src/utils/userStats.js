import { collection, query, where, getDocs } from 'firebase/firestore';

export const calculateUserStats = async (db, userId) => {
  // Get posts count
  const postsQuery = query(
    collection(db, 'posts'),
    where('userId', '==', userId)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const postsCount = postsSnapshot.size;

  // Get interactions (comments + votes)
  const interactionsCount = postsSnapshot.docs.reduce((acc, doc) => {
    const post = doc.data();
    return acc + (post.upVotes || 0) + (post.downVotes || 0) + (post.commentCount || 0);
  }, 0);

  // Calculate badges based on activity
  const badgesCount = calculateBadges(postsCount, interactionsCount);

  return {
    posts: postsCount,
    interactions: interactionsCount,
    badges: badgesCount
  };
};

const calculateBadges = (posts, interactions) => {
  let badges = 0;
  if (posts >= 5) badges++; // Contributor Badge
  if (posts >= 20) badges++; // Active Writer Badge
  if (interactions >= 10) badges++; // Engaged Reader Badge
  if (interactions >= 50) badges++; // Community Leader Badge
  return badges;
};