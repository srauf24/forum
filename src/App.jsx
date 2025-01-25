import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Forum App</h1>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to our Forum</h2>
          <p className="text-gray-600">Start creating and sharing posts with the community.</p>
        </div>
      </main>
    </div>
  )
}

export default App
