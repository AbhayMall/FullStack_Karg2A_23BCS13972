// src/components/dashboard/StreakCounter.jsx
import React from 'react'

const StreakCounter = ({ streak }) => {
  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your learning streak today!"
    if (streak === 1) return "Great start! Come back tomorrow."
    if (streak < 7) return `Keep going! ${streak} day streak.`
    if (streak < 30) return `Amazing! ${streak} day streak.`
    return `Incredible! ${streak} days strong!`
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className="text-2xl">🔥</span>
        <span className="text-2xl font-bold text-gray-900">{streak}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Streak</h3>
      <p className="text-sm text-gray-600">{getStreakMessage(streak)}</p>
    </div>
  )
}

export default StreakCounter