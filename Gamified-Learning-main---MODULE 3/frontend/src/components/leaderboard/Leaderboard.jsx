// src/components/leaderboard/Leaderboard.jsx
import React from 'react'
import LeaderboardCard from './LeaderboardCard'
import LoadingSpinner from '../common/LoadingSpinner'

const Leaderboard = ({ leaderboard, loading, currentUser }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const list = Array.isArray(leaderboard) ? leaderboard : []
  if (list.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leaderboard data</h3>
        <p className="text-gray-500">Be the first to start learning!</p>
      </div>
    )
  }

  // Find current user's position
  const currentUserRank = list.findIndex(entry => 
    entry.username === currentUser?.username
  ) + 1

  return (
    <div className="space-y-4">
      {/* Current User Stats */}
      {currentUser && currentUserRank > 0 && (
        <div className="card p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {currentUser.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Position</h3>
                <p className="text-sm text-gray-600">
                  Rank #{currentUserRank} • {currentUser.totalXP} XP • {currentUser.currentStreak} day streak
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">#{currentUserRank}</div>
              <div className="text-sm text-primary-600">Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {list.map((entry, index) => (
          <LeaderboardCard
            key={entry.username || index}
            entry={entry}
            rank={index + 1}
            isCurrentUser={entry.username === currentUser?.username}
          />
        ))}
      </div>
    </div>
  )
}

export default Leaderboard