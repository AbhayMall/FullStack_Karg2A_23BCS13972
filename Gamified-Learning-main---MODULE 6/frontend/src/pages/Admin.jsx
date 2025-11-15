// src/pages/Admin.jsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/admin/AdminDashboard'
import LessonForm from '../components/admin/LessonForm'
import QuestForm from '../components/admin/QuestForm'

const Admin = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">You need administrator privileges to access this page.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'lessons', name: 'Manage Lessons', icon: '📚' },
    { id: 'quests', name: 'Manage Quests', icon: '🏆' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage platform content and view analytics</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Lessons</h2>
            </div>
            <LessonForm onSuccess={() => setActiveTab('dashboard')} />
          </div>
        )}
        {activeTab === 'quests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Quests</h2>
            </div>
            <QuestForm onSuccess={() => setActiveTab('dashboard')} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin