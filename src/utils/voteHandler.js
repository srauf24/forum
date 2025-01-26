import { doc, updateDoc, getDoc } from 'firebase/firestore';

export const handleVote = async (db, postId, userId, isUpvote) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) return;
  
  const post = postSnap.data();
  const upVotes = post.upVotes || 0;
  const downVotes = post.downVotes || 0;

  // Ensure we don't go below 0
  const newUpVotes = isUpvote ? Math.max(0, upVotes + 1) : upVotes;
  const newDownVotes = !isUpvote ? Math.max(0, downVotes + 1) : downVotes;

  await updateDoc(postRef, {
    upVotes: newUpVotes,
    downVotes: newDownVotes
  });
};