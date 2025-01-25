// When creating a new post
const newPost = {
  title: title.trim(),
  content: content.trim(),
  bookTitle: bookTitle.trim(),
  bookAuthor: bookAuthor.trim(),
  userId: user.uid,
  userName: user.displayName,
  userPhoto: user.photoURL,
  createdAt: serverTimestamp(),
  upVotes: 0,
  downVotes: 0,
  commentCount: 0,
  interactions: 0,
  voters: {}
};