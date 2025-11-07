// src/components/dashboard/ProgressBar.jsx
import React from 'react'

const ProgressBar = ({ progress, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600'
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-300`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar