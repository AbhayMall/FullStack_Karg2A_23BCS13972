// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { lessonService, progressService } from '../../services'
import { calculateLevel, calculateProgress, formatXP } from '../../utils/helpers'
import StatsCard from './StatsCard'
import ProgressBar from './ProgressBar'
import StreakCounter from './StreakCounter'

const Dashboard = () => {
  const { user } = useAuth()
  const { showNotification } = useApp()
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalQuests: 0,
    completedQuests: 0,
    totalBadges: 0
  })
  // no blocking loader on dashboard
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        // Fetch lessons and progress in parallel
        const [lessonsData, progressData] = await Promise.all([
          lessonService.getAllLessons(),
          progressService.getUserProgress()
        ])

        const lessons = Array.isArray(lessonsData) ? lessonsData : []
        const progress = Array.isArray(progressData) ? progressData : []

        const completedLessons = progress.filter(p => p.isCompleted).length
        
        setStats({
          totalLessons: lessons.length,
          completedLessons,
          totalQuests: 0, // You'll need to implement this
          completedQuests: 0, // You'll need to implement this
          totalBadges: user?.unlockedBadges?.length || 0
        })

        // Set recent activity (last 5 completed lessons)
        const recentProgress = progress
          .filter(p => p.isCompleted)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5)
        
        setRecentActivity(recentProgress)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        showNotification('Failed to load dashboard data', 'error')
      } finally {
        // no-op: we don't block render with loaders
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, showNotification])


  const level = calculateLevel(user?.totalXP || 0)
  const progress = calculateProgress(user?.totalXP || 0)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600 mb-4">
          Continue your learning journey and unlock new achievements.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level Progress */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Level Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Level {level}</span>
                <span className="text-primary-600 font-medium">
                  {formatXP(user?.totalXP || 0)} XP
                </span>
              </div>
              <ProgressBar progress={progress} />
              <p className="text-xs text-gray-500">
                {1000 - (user?.totalXP || 0) % 1000} XP to next level
              </p>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <StreakCounter streak={user?.currentStreak || 0} />
          </div>

          {/* Daily Goal */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Goal</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">XP Earned Today</span>
                <span className="text-success-600 font-medium">
                  {user?.xpEarnedToday || 0} / {user?.dailyXPCap || 1000}
                </span>
              </div>
              <ProgressBar 
                progress={((user?.xpEarnedToday || 0) / (user?.dailyXPCap || 1000)) * 100}
                color="success"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total XP"
          value={formatXP(user?.totalXP || 0)}
          icon="🏆"
          color="primary"
        />
        <StatsCard
          title="Lessons Completed"
          value={`${stats.completedLessons}/${stats.totalLessons}`}
          icon="📚"
          color="success"
        />
        <StatsCard
          title="Current Streak"
          value={`${user?.currentStreak || 0} days`}
          icon="🔥"
          color="warning"
        />
        <StatsCard
          title="Badges Earned"
          value={stats.totalBadges}
          icon="🎖️"
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <span className="text-success-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed Lesson</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-success-600 font-medium">+{activity.xpEarned} XP</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activity. Start learning!</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard