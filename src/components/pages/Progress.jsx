
import MyStats from './MyStats';

function Progress() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-600 bg-clip-text text-transparent">
            Your Reading Journey
          </h1>
          <p className="mt-3 text-gray-600">
            Track your achievements and contributions to our literary community
          </p>
        </div>
        
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-indigo-50">
          <MyStats />
        </div>
      </div>
    </div>
  );
}

export default Progress;