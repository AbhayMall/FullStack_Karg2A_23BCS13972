import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './Dashboard.css';

// Placeholder imports - components would be created
import Lessons from './lessons/Lessons';
import Quests from './quests/Quests';
import Badges from './badges/Badges';
import Leaderboard from './Leaderboard';
import Profile from './Profile';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalXp: 0,
    currentStreak: 0,
    completedLessons: 0,
    unlockedBadges: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch user stats
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎮 Learning Tracker</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link">Overview</Link>
          <Link to="/dashboard/lessons" className="nav-link">Lessons</Link>
          <Link to="/dashboard/quests" className="nav-link">Quests</Link>
          <Link to="/dashboard/badges" className="nav-link">Badges</Link>
          <Link to="/dashboard/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/dashboard/profile" className="nav-link">Profile</Link>
        </nav>
      </header>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<DashboardOverview stats={stats} />} />
          <Route path="/lessons/*" element={<Lessons />} />
          <Route path="/quests/*" element={<Quests />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

const DashboardOverview = ({ stats }) => {
  return (
    <div className="dashboard-overview">
      <h2>Your Learning Progress</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total XP</h3>
          <div className="stat-value">{stats.totalXp}</div>
        </div>
        <div className="stat-card">
          <h3>Current Streak</h3>
          <div className="stat-value">{stats.currentStreak} days</div>
        </div>
        <div className="stat-card">
          <h3>Lessons Completed</h3>
          <div className="stat-value">{stats.completedLessons}</div>
        </div>
        <div className="stat-card">
          <h3>Badges Unlocked</h3>
          <div className="stat-value">{stats.unlockedBadges}</div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/dashboard/lessons" className="action-btn">Start Learning</Link>
          <Link to="/dashboard/quests" className="action-btn">View Quests</Link>
          <Link to="/dashboard/badges" className="action-btn">My Badges</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;