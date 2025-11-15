// src/components/leaderboard/LeaderboardCard.jsx
import React from 'react'

const LeaderboardCard = ({ entry, rank, isCurrentUser }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-300'
      case 2: return 'bg-gray-100 border-gray-300'
      case 3: return 'bg-orange-100 border-orange-300'
      default: return 'bg-white border-gray-200'
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <div className={`card p-4 border-l-4 ${
      isCurrentUser ? 'border-primary-500 bg-primary-50' : getRankColor(rank)
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            rank <= 3 ? 'text-lg' : 'text-sm'
          } ${
            rank === 1 ? 'bg-yellow-200 text-yellow-800' :
            rank === 2 ? 'bg-gray-200 text-gray-800' :
            rank === 3 ? 'bg-orange-200 text-orange-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getRankIcon(rank)}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isCurrentUser ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {entry.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className={`font-semibold ${
                isCurrentUser ? 'text-primary-700' : 'text-gray-900'
              }`}>
                {entry.username}
                {isCurrentUser && ' (You)'}
              </h3>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>🔥 {entry.currentStreak} days</span>
                <span>🎖️ {entry.badgeCount} badges</span>
              </div>
              {entry.topBadgeTier && (
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    entry.topBadgeTier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    entry.topBadgeTier === 'silver' ? 'bg-gray-100 text-gray-800' :
                    entry.topBadgeTier === 'bronze' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {entry.topBadgeTier === 'gold' ? '🥇' : entry.topBadgeTier === 'silver' ? '🥈' : '🥉'}
                    <span className="ml-1">{entry.topBadgeName || (entry.topBadgeTier.charAt(0).toUpperCase() + entry.topBadgeTier.slice(1))} Badge</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* XP */}
        <div className="text-right">
          <div className={`text-lg font-bold ${
            isCurrentUser ? 'text-primary-600' : 'text-gray-900'
          }`}>
            {entry.totalXP.toLocaleString()} XP
          </div>
          <div className="text-xs text-gray-500">
            Level {Math.floor(entry.totalXP / 1000) + 1}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardCard