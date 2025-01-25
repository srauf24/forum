import { createContext, useContext } from 'react';
import { db } from '../config/firebase';

// Create a new React Context for Firebase
const FirebaseContext = createContext(null);

// Provider component that wraps your app and makes Firebase available to any
// child component that calls useFirebase()
export function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use the Firebase context
export function useFirebase() {
  return useContext(FirebaseContext);
}