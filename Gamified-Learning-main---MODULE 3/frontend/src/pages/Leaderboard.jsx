// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { leaderboardService } from '../services'
import Leaderboard from '../components/leaderboard/Leaderboard'

const LeaderboardPage = () => {
  const { user } = useAuth()
  const { showNotification } = useApp()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const data = await leaderboardService.getGlobalLeaderboard()
        setLeaderboard(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        showNotification('Failed to load leaderboard', 'error')
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [showNotification])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">Compete with other learners and climb the ranks</p>
      </div>

      <Leaderboard 
        leaderboard={leaderboard}
        loading={loading}
        currentUser={user}
      />
    </div>
  )
}

export default LeaderboardPage