import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFirebase } from '../../contexts/FirebaseContext';

function ProtectedRoute({ children }) {
  const { user } = useFirebase();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;