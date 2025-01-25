import { useFirebase } from '../../contexts/FirebaseContext';
import UserStats from '../user/UserStats';
import { Navigate } from 'react-router-dom';

function MyStats() {
  const { user } = useFirebase();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">My Progress</h1>
      <UserStats userId={user.uid} />
    </div>
  );
}

export default MyStats;