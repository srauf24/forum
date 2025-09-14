import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  getDocs,
  startAfter,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const checkAndUpdateCommentCount = async (postDoc) => {
  const postData = postDoc.data();
  const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
  const commentsQuery = query(commentsRef);
  const commentsSnap = await getDocs(commentsQuery);

  if (commentsSnap.size !== postData.commentCount) {
    await updateDoc(postDoc.ref, {
      commentCount: commentsSnap.size
    });
    return commentsSnap.size;
  }
  return postData.commentCount;
};

export const subscribeToPosts = (callback) => {
  const postsQuery = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  return onSnapshot(postsQuery, async (snapshot) => {
    const postsData = await Promise.all(snapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const commentCount = await checkAndUpdateCommentCount(doc);
      return {
        id: doc.id,
        ...postData,
        commentCount,
        createdAt: postData.createdAt
      };
    }));
    const lastPost = snapshot.docs[snapshot.docs.length - 1];
    const hasMore = snapshot.docs.length === 5;
    callback({ postsData, lastPost, hasMore });
  });
};

export const loadMorePosts = async (lastPost) => {
  const nextQuery = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    startAfter(lastPost),
    limit(5)
  );

  const snapshot = await getDocs(nextQuery);
  const newPosts = await Promise.all(snapshot.docs.map(async (doc) => {
    const postData = doc.data();
    const commentCount = await checkAndUpdateCommentCount(doc);
    return {
      id: doc.id,
      ...postData,
      commentCount,
      createdAt: postData.createdAt
    };
  }));
  const newLastPost = snapshot.docs[snapshot.docs.length - 1];
  const hasMore = snapshot.docs.length === 5;
  return { newPosts, newLastPost, hasMore };
};
