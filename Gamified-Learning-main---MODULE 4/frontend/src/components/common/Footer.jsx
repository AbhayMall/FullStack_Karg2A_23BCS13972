// src/components/common/Footer.jsx
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">GL</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Gamified Learning
            </span>
          </div>
          <div className="text-sm text-gray-600">
            &copy; 2024 Gamified Learning Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer