import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const seedPosts = [
  {
    title: "Insights from 'Why We Sleep'",
    bookTitle: "Why We Sleep",
    bookAuthor: "Matthew Walker",
    content: "The research on sleep cycles and their impact on health is fascinating. What changes have you made to your sleep habits after reading this book?",
    userName: "Dorthy A.",
    userPhoto: null,
    upVotes: 15,
    downVotes: 2,
    commentCount: 8,
    interactions: 25,
  },
  {
    title: "Discussion: 'Atomic Habits' Impact",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    content: "The concept of 1% improvements really changed my perspective on habit formation. Which habit stacking strategies have worked best for you?",
    userName: "Ryan R.",
    userPhoto: null,
    upVotes: 22,
    downVotes: 1,
    commentCount: 12,
    interactions: 35,
  },
  {
    title: "Thoughts on 'The Body: A Guide for Occupants'",
    bookTitle: "The Body: A Guide for Occupants",
    bookAuthor: "Bill Bryson",
    content: "Bryson's explanation of the immune system is incredibly engaging. Which chapter surprised you the most with new information?",
    userName: "Linda R.",
    userPhoto: null,
    upVotes: 18,
    downVotes: 3,
    commentCount: 9,
    interactions: 30,
  },
  {
    title: "Discussing 'How Not to Die'",
    bookTitle: "How Not to Die",
    bookAuthor: "Michael Greger",
    content: "The evidence-based approach to nutrition in this book is eye-opening. What dietary changes have you implemented after reading it?",
    userName: "Jack B.",
    userPhoto: null,
    upVotes: 25,
    downVotes: 4,
    commentCount: 15,
    interactions: 44,
  }
];

const seedDatabase = async () => {
  try {
    for (const post of seedPosts) {
      await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: serverTimestamp(),
        voters: {}
      });
    }
    console.log('Seed posts added successfully!');
  } catch (error) {
    console.error('Error adding seed posts:', error);
  }
};

export default seedDatabase;