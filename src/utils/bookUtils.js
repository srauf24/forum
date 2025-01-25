import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const addBook = async (db, bookData) => {
  try {
    const bookRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      createdAt: serverTimestamp(),
      discussionCount: 0
    });
    return bookRef.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};