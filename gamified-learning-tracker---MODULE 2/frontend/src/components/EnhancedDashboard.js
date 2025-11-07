import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/global.css';
import './Dashboard.css';

function EnhancedDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentLessons, setRecentLessons] = useState([]);
    const [badges, setBadges] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [newLevel, setNewLevel] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Fetch comprehensive dashboard data
            const [userRes, statsRes, lessonsRes, badgesRes, leaderboardRes] = await Promise.all([
                axios.get('/api/auth/me', config),
                axios.get('/api/user/stats', config),
                axios.get('/api/lessons/recommended?limit=5', config),
                axios.get('/api/badges/user/recent?limit=6', config),
                axios.get('/api/leaderboard?limit=5', config)
            ]);

            setUser(userRes.data);
            setStats(statsRes.data);
            setRecentLessons(lessonsRes.data);
            setBadges(badgesRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (error) {
            setError('Failed to load dashboard data');
            console.error('Dashboard error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const completeLesson = async (lessonId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/lessons/${lessonId}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const { xpGained, levelUp, totalXp, currentStreak } = response.data;
            
            // Update local state immediately for better UX
            setStats(prev => ({
                ...prev,
                totalXp,
                currentStreak,
                lessonsCompleted: prev.lessonsCompleted + 1
            }));
            
            // Show success feedback
            if (levelUp) {
                setNewLevel(Math.floor(Math.sqrt(totalXp / 100)) + 1);
                setShowLevelUpModal(true);
                toast.success(`🎉 Level Up! +${xpGained} XP`, { autoClose: 5000 });
            } else {
                toast.success(`✅ Lesson completed! +${xpGained} XP`, { autoClose: 3000 });
            }
            
            // Refresh dashboard data
            setTimeout(() => fetchDashboardData(), 1000);
            
        } catch (error) {
            console.error('Error completing lesson:', error);
            toast.error('Failed to complete lesson');
        }
    };

    const calculateLevelProgress = () => {
        if (!stats) return 0;
        const currentLevel = stats.level || 1;
        const currentLevelXp = Math.pow(currentLevel - 1, 2) * 100;
        const nextLevelXp = Math.pow(currentLevel, 2) * 100;
        const progress = ((stats.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        return Math.min(100, Math.max(0, progress));
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            1: 'var(--success-500)',
            2: 'var(--warning-400)',
            3: 'var(--warning-500)',
            4: 'var(--error-400)',
            5: 'var(--error-500)'
        };
        return colors[difficulty] || 'var(--gray-400)';
    };

    const getBadgeRarityClass = (rarity) => {
        return `badge-${rarity?.toLowerCase() || 'common'}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchDashboardData}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard animate-fadeIn">
            {/* Level Up Modal */}
            {showLevelUpModal && (
                <div className="modal-overlay" onClick={() => setShowLevelUpModal(false)}>
                    <div className="level-up-modal animate-bounce">
                        <div className="level-up-content">
                            <h2>🎉 LEVEL UP! 🎉</h2>
                            <div className="new-level">Level {newLevel}</div>
                            <p>Congratulations! You've reached a new level!</p>
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => setShowLevelUpModal(false)}
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Header */}
            <div className="dashboard-header animate-slideInDown">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.username}! 👋</h1>
                    <p className="welcome-subtitle">Ready to continue your learning journey?</p>
                </div>
                
                <div className="level-section">
                    <div className="level-info">
                        <span className="level-badge">Level {stats?.level || 1}</span>
                        <div className="xp-info">
                            <span className="current-xp">{stats?.totalXp || 0} XP</span>
                            <span className="xp-to-next">{stats?.xpToNextLevel || 0} to next level</span>
                        </div>
                    </div>
                    <div className="progress-container">
                        <div className="progress">
                            <div 
                                className="progress-bar" 
                                style={{ width: `${calculateLevelProgress()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid animate-slideInUp">
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <h3>Total XP</h3>
                        <p className="stat-value">{stats?.totalXp || 0}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <h3>Streak</h3>
                        <p className="stat-value">{stats?.currentStreak || 0} days</p>
                        <small>Best: {stats?.longestStreak || 0} days</small>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>Lessons</h3>
                        <p className="stat-value">{stats?.lessonsCompleted || 0}</p>
                        <small>Completed</small>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <h3>Badges</h3>
                        <p className="stat-value">{stats?.badgesCount || 0}</p>
                        <small>Earned</small>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Recommended Lessons */}
                <section className="lessons-section">
                    <div className="section-header">
                        <h2>🎯 Recommended for You</h2>
                        <p>Lessons picked just for your current level</p>
                    </div>
                    
                    <div className="lessons-list">
                        {recentLessons.length > 0 ? recentLessons.map(lesson => (
                            <div key={lesson.id} className="lesson-card card">
                                <div className="lesson-header">
                                    <h3>{lesson.title}</h3>
                                    <div className="lesson-badges">
                                        <span 
                                            className="difficulty-badge badge"
                                            style={{ backgroundColor: getDifficultyColor(lesson.difficulty) }}
                                        >
                                            Level {lesson.difficulty}
                                        </span>
                                        <span className="xp-badge badge badge-success">
                                            +{lesson.xpReward} XP
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="lesson-description">{lesson.description}</p>
                                
                                <div className="lesson-meta">
                                    <div className="meta-item">
                                        <span className="meta-icon">⏱️</span>
                                        <span>{lesson.estimatedTimeMinutes} min</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-icon">📂</span>
                                        <span>{lesson.category}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    className="btn btn-primary btn-lg lesson-complete-btn"
                                    onClick={() => completeLesson(lesson.id)}
                                >
                                    Start Learning 🚀
                                </button>
                            </div>
                        )) : (
                            <div className="empty-state">
                                <p>🎉 You've completed all available lessons!</p>
                                <p>Check back later for new content.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    {/* Recent Badges */}
                    <section className="badges-section">
                        <div className="section-header">
                            <h3>🏅 Recent Badges</h3>
                        </div>
                        
                        <div className="badges-grid">
                            {badges.length > 0 ? badges.slice(0, 6).map(badge => (
                                <div key={badge.id} className={`badge-item ${getBadgeRarityClass(badge.rarity)}`}>
                                    <div className="badge-icon">
                                        {badge.iconUrl ? (
                                            <img src={badge.iconUrl} alt={badge.name} />
                                        ) : (
                                            <span className="default-badge-icon">🏆</span>
                                        )}
                                    </div>
                                    <div className="badge-info">
                                        <h4>{badge.name}</h4>
                                        <p>{badge.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="empty-badges">Complete lessons to earn badges! 🎯</p>
                            )}
                        </div>
                    </section>

                    {/* Leaderboard */}
                    <section className="leaderboard-section">
                        <div className="section-header">
                            <h3>🏆 Top Learners</h3>
                        </div>
                        
                        <div className="leaderboard-list">
                            {leaderboard.map((player, index) => (
                                <div key={player.id} className={`leaderboard-item ${player.id === user?.id ? 'current-user' : ''}`}>
                                    <div className="rank">
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                        {index > 2 && `#${index + 1}`}
                                    </div>
                                    <div className="player-info">
                                        <span className="username">{player.username}</span>
                                        <span className="xp">{player.totalXp} XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default EnhancedDashboard;