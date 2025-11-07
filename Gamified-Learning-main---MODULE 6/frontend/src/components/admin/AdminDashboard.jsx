// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { analyticsService } from '../../services'
import StatsCard from '../dashboard/StatsCard'
import AnalyticsCharts from './AnalyticsCharts'
import LoadingSpinner from '../common/LoadingSpinner'

const AdminDashboard = () => {
  const { showNotification } = useApp()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await analyticsService.getAnalytics()
        setAnalytics(response)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        showNotification('Failed to load analytics', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [showNotification])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform performance and user engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Students"
          value={analytics?.studentsCount?.toLocaleString() || '0'}
          icon="👩‍🎓"
          color="primary"
        />
        <StatsCard
          title="Lessons"
          value={analytics?.lessonsCount?.toLocaleString() || '0'}
          icon="📚"
          color="warning"
        />
        <StatsCard
          title="Quests"
          value={analytics?.questsCount?.toLocaleString() || '0'}
          icon="🏆"
          color="purple"
        />
        <StatsCard
          title="Total XP Earned"
          value={(analytics?.totalXPEarned?.toLocaleString() || '0') + ' XP'}
          icon="⭐"
          color="success"
        />
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts analytics={analytics} />
    </div>
  )
}

export default AdminDashboard
