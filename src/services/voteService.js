import { doc, increment, writeBatch, deleteField } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

export const handleVote = async (postId, userId, voteType, post) => {
  if (!userId) {
    toast.error('You must be logged in to vote.');
    return;
  }

  const postRef = doc(db, 'posts', postId);
  const userVote = post.voters?.[userId];

  const batch = writeBatch(db);

  if (userVote) {
    const currentVotes = (userVote === 'up' ? post.upVotes : post.downVotes) || 0;
    if (currentVotes > 0) {
      batch.update(postRef, {
        [`${userVote}Votes`]: increment(-1),
        interactions: increment(-1),
        [`voters.${userId}`]: deleteField(),
      });
    }
  }

  if (!userVote || userVote !== voteType) {
    batch.update(postRef, {
      [`${voteType}Votes`]: increment(1),
      interactions: increment(1),
      [`voters.${userId}`]: voteType,
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error updating vote:', error);
    toast.error('There was an error casting your vote.');
  }
};
