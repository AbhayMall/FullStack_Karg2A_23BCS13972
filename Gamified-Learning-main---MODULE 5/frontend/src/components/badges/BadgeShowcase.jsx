// src/components/badges/BadgeShowcase.jsx
import React from 'react'

const BadgeShowcase = ({ unlockedBadges }) => {
  if (!unlockedBadges || unlockedBadges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🎖️</div>
        <p className="text-gray-500">No badges earned yet. Keep learning!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {unlockedBadges.slice(0, 12).map((badge) => (
        <div
          key={badge.id}
          className="text-center group relative"
          title={`${badge.name}: ${badge.description}`}
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-1 text-lg shadow-md">
            {badge.icon}
          </div>
          <p className="text-xs text-gray-600 truncate">{badge.name}</p>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              <div className="font-semibold">{badge.name}</div>
              <div>{badge.description}</div>
            </div>
            <div className="w-3 h-3 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      ))}
      
      {unlockedBadges.length > 12 && (
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1 text-lg text-gray-500">
            +{unlockedBadges.length - 12}
          </div>
          <p className="text-xs text-gray-500">More badges</p>
        </div>
      )}
    </div>
  )
}

export default BadgeShowcase