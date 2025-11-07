// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Quests from './pages/Quests'
import QuestDetail from './pages/QuestDetail'
import Badges from './pages/Badges'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'

import Notification from './components/common/Notification'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
             
<Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/lessons" element={
                  <ProtectedRoute>
                    <Lessons />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/:id" element={
                  <ProtectedRoute>
                    <LessonDetail />
                  </ProtectedRoute>
                } />
                <Route path="/quests" element={
                  <ProtectedRoute>
                    <Quests />
                  </ProtectedRoute>
                } />
                <Route path="/quests/:id" element={
                  <ProtectedRoute>
                    <QuestDetail />
                  </ProtectedRoute>
                } />
                <Route path="/badges" element={
                  <ProtectedRoute>
                    <Badges />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Notification />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App


