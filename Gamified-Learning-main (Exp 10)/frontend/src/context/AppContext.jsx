// src/context/AppContext.jsx
import React, { createContext, useState, useContext } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [lessons, setLessons] = useState([])
  const [quests, setQuests] = useState([])
  const [badges, setBadges] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const value = {
    lessons,
    setLessons,
    quests,
    setQuests,
    badges,
    setBadges,
    userProgress,
    setUserProgress,
    loading,
    setLoading,
    notification,
    showNotification
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}