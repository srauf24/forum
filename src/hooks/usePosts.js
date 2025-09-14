import { useState, useEffect, useCallback } from 'react';
import { subscribeToPosts, loadMorePosts as fetchMorePosts } from '../services/postService';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastPost, setLastPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPosts(({ postsData, lastPost, hasMore }) => {
      setPosts(postsData);
      setLastPost(lastPost);
      setHasMore(hasMore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { newPosts, newLastPost, hasMore: newHasMore } = await fetchMorePosts(lastPost);
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLastPost(newLastPost);
      setHasMore(newHasMore);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [lastPost, hasMore, loading]);

  return { posts, loading, hasMore, loadMore };
};
