import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PostList from '../posts/PostList';
import { FirebaseProvider } from '../../contexts/FirebaseContext';

vi.mock('../../hooks/usePosts', () => ({
  usePosts: () => ({ posts: [], loading: false, hasMore: false, loadMore: () => {} }),
}));

vi.mock('../../hooks/useVoting', () => ({
  useVoting: () => ({ handleVote: () => {} }),
}));

describe('PostList', () => {
  it('renders the header', () => {
    render(
      <MemoryRouter>
        <FirebaseProvider>
          <PostList />
        </FirebaseProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Recent Discussions')).toBeInTheDocument();
  });
});
