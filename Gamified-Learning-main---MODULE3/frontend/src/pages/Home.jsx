// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: '📚',
      title: 'Interactive Lessons',
      description: 'Engage with carefully crafted learning materials across various topics.'
    },
    {
      icon: '🎮',
      title: 'Gamified Learning',
      description: 'Earn XP, complete quests, and unlock achievements as you learn.'
    },
    {
      icon: '🏆',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress analytics.'
    },
    {
      icon: '👥',
      title: 'Community Leaderboard',
      description: 'Compete with fellow learners and climb the ranks.'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn Smarter, Not Harder
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your learning experience with gamification. Earn rewards, complete quests, 
          and track your progress in an engaging educational platform.
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Gamified Learning?
          </h2>
          <p className="text-gray-600 text-lg">
            Experience education like never before with our engaging features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-12 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Learning Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold">1k+</div>
              <div className="text-primary-100">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-primary-100">Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-primary-100">Quests</div>
            </div>
            <div>
              <div className="text-3xl font-bold">25+</div>
              <div className="text-primary-100">Badges</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home