import { useEffect, useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';

function DailyCronTest() {
  const [status, setStatus] = useState('idle');
  const { user } = useFirebase();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cron Job Test Panel</h2>
      <button 
        onClick={async () => {
          setStatus('running');
          try {
            const response = await fetch('/api/cron/daily-discussion', {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_CRON_SECRET}`
              }
            });
            const data = await response.json();
            setStatus(data.success ? 'success' : 'error');
          } catch (error) {
            setStatus('error');
            console.error('Test failed:', error);
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Cron Job
      </button>
      <div className="mt-2">Status: {status}</div>
    </div>
  );
}

export default DailyCronTest;