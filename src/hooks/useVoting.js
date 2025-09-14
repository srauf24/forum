import { useFirebase } from '../contexts/FirebaseContext';
import { handleVote as voteHandler } from '../services/voteService';

export const useVoting = () => {
  const { user } = useFirebase();

  const handleVote = async (postId, voteType, post) => {
    await voteHandler(postId, user?.uid, voteType, post);
  };

  return { handleVote };
};
