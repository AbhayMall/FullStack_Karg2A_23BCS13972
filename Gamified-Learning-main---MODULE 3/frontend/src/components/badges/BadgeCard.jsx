// src/components/badges/BadgeCard.jsx
import React from 'react'
import { BADGE_RARITY_COLORS } from '../../utils/constants'

const BadgeCard = ({ badge, isUnlocked }) => {
  const rarityColor = BADGE_RARITY_COLORS[badge.rarity] || 'bg-gray-400'

  return (
    <div className={`card p-6 text-center transition-all duration-300 ${
      isUnlocked 
        ? 'border-2 border-yellow-400 shadow-lg' 
        : 'opacity-60 grayscale'
    }`}>
      {/* Badge Icon */}
      <div className={`w-20 h-20 rounded-full ${rarityColor} flex items-center justify-center mx-auto mb-4 text-2xl`}>
        {badge.icon}
      </div>

      {/* Badge Info */}
      <h3 className={`font-semibold text-lg mb-2 ${
        isUnlocked ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {badge.name}
      </h3>
      
      <p className={`text-sm mb-3 ${
        isUnlocked ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {badge.description}
      </p>

      {/* Condition */}
      <div className={`text-xs px-3 py-1 rounded-full ${
        isUnlocked 
          ? 'bg-success-100 text-success-800' 
          : 'bg-gray-100 text-gray-500'
      }`}>
        {getConditionText(badge)}
      </div>

      {/* XP Bonus */}
      {badge.xpBonus > 0 && (
        <div className="mt-3 text-xs text-warning-600 font-medium">
          +{badge.xpBonus} XP Bonus
        </div>
      )}

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-lg flex items-center justify-center">
          <div className="text-gray-500 text-sm font-medium">🔒 Locked</div>
        </div>
      )}
    </div>
  )
}

const getConditionText = (badge) => {
  switch (badge.conditionType) {
    case 'STREAK_DAYS':
      return `Reach ${badge.conditionValue} day streak`
    case 'TOTAL_LESSONS':
      return `Complete ${badge.conditionValue} lessons`
    case 'TOTAL_XP':
      return `Earn ${badge.conditionValue} total XP`
    case 'QUEST_COMPLETION':
      return `Complete ${badge.conditionValue} quests`
    default:
      return 'Complete requirements'
  }
}

export default BadgeCard