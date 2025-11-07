// src/components/common/Notification.jsx
import React from 'react'
import { useApp } from '../../context/AppContext'

const Notification = () => {
  const { notification } = useApp()

  if (!notification) return null

  const bgColor = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error1: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }[notification.type]

  const icon = {
    success: '✅',
    error: '❌',
    error1:'✅',
    warning: '⚠️',
    info: 'ℹ️'
  }[notification.type]

  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${bgColor} animate-slide-in`}>
      <div className="flex items-center space-x-2">
        <span>{icon}</span>
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  )
}

export default Notification