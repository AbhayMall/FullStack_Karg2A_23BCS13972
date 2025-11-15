// src/components/dashboard/StatsCard.jsx
import React from 'react'

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-200',
    success: 'bg-success-50 text-success-600 border-success-200',
    warning: 'bg-warning-50 text-warning-600 border-warning-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  }

  return (
    <div className={`card p-4 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}

export default StatsCard