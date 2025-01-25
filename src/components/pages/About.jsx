import React from 'react';

function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">About BookForum</h1>
      
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Our Purpose</h2>
        <p className="text-gray-700 mb-4">
          BookForum is a community-driven platform where book enthusiasts can share their thoughts,
          discuss their favorite reads, and discover new literary treasures. We believe in fostering
          meaningful discussions about books while rewarding active participation.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Level System</h2>
        <p className="text-gray-700 mb-4">
          Your level reflects your contribution to the community. You gain experience through:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
          <li>Creating posts</li>
          <li>Receiving upvotes</li>
          <li>Writing comments</li>
          <li>Engaging in discussions</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Achievements</h2>
        <div className="grid gap-4">
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold text-indigo-900">Bookworm</h3>
              <p className="text-sm text-gray-600">Create 10 book discussions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">✍️</span>
            <div>
              <h3 className="font-semibold text-indigo-900">Contributor</h3>
              <p className="text-sm text-gray-600">Write 50 comments</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">🌟</span>
            <div>
              <h3 className="font-semibold text-indigo-900">Literary Luminary</h3>
              <p className="text-sm text-gray-600">Receive 500 total interactions on your discussions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-semibold text-indigo-900">Influencer</h3>
              <p className="text-sm text-gray-600">Reach 1,000 total interactions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;