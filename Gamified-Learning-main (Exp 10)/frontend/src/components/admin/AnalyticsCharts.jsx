// src/components/admin/AnalyticsCharts.jsx
import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const AnalyticsCharts = ({ analytics }) => {
  // Mock data - in real app, this would come from the API
  const userGrowthData = [
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 200 },
    { month: 'Apr', users: 280 },
    { month: 'May', users: 350 },
    { month: 'Jun', users: 420 }
  ]

  const xpDistributionData = [
    { range: '0-1k', users: 120 },
    { range: '1k-5k', users: 85 },
    { range: '5k-10k', users: 45 },
    { range: '10k+', users: 15 }
  ]

  const activityData = [
    { day: 'Mon', lessons: 45, quests: 12 },
    { day: 'Tue', lessons: 52, quests: 18 },
    { day: 'Wed', lessons: 48, quests: 15 },
    { day: 'Thu', lessons: 60, quests: 22 },
    { day: 'Fri', lessons: 55, quests: 20 },
    { day: 'Sat', lessons: 35, quests: 10 },
    { day: 'Sun', lessons: 30, quests: 8 }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Total Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* XP Distribution Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">XP Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={xpDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="users" 
              fill="#10b981" 
              name="Number of Users"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Activity Chart */}
      <div className="card p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="lessons" 
              fill="#3b82f6" 
              name="Lessons Completed"
            />
            <Bar 
              dataKey="quests" 
              fill="#f59e0b" 
              name="Quests Completed"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AnalyticsCharts