// src/components/badges/BadgeList.jsx
import React from 'react'
import BadgeCard from './BadgeCard'
import LoadingSpinner from '../common/LoadingSpinner'

const BadgeList = ({ badges, unlockedBadges, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎖️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No badges available</h3>
        <p className="text-gray-500">Badges will be added soon!</p>
      </div>
    )
  }

  const unlockedBadgeIds = new Set(unlockedBadges?.map(badge => badge.id) || [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          isUnlocked={unlockedBadgeIds.has(badge.id)}
        />
      ))}
    </div>
  )
}

export default BadgeList