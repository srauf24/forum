import { Navigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

function ProtectedRoute({ children }) {
  const { user } = useFirebase();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}

export default ProtectedRoute;