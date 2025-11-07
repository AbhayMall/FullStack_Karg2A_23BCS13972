import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/global.css';
import './Login.css';

function EnhancedLogin() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!credentials.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!credentials.password) {
            setError('Password is required');
            return false;
        }
        if (credentials.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', credentials);
            
            // Store JWT token
            localStorage.setItem('token', response.data.token);
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Show success message
            toast.success(`Welcome back, ${response.data.user.username}! 🚀`);
            
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setCredentials({
            username: 'demo@example.com',
            password: 'demo123'
        });
        
        // Auto-submit after a short delay
        setTimeout(() => {
            const form = document.querySelector('.login-form');
            if (form) form.requestSubmit();
        }, 500);
    };

    return (
        <div className="login-container animate-fadeIn">
            <div className="login-background">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>
            
            <div className="login-card animate-slideInUp">
                <div className="login-header">
                    <div className="logo">
                        <span className="logo-icon">🎯</span>
                        <span className="logo-text">LearningTracker</span>
                    </div>
                    <h1>Welcome Back!</h1>
                    <p>Ready to continue your learning adventure?</p>
                </div>
                
                {error && (
                    <div className="error-message animate-slideInDown">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            <span className="label-icon">👤</span>
                            Username or Email
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-input"
                                value={credentials.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username or email"
                                required
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <span className="label-icon">🔒</span>
                            Password
                        </label>
                        <div className="input-wrapper password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-input"
                                value={credentials.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-primary btn-lg login-button ${loading ? 'btn-loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In 🚀'}
                    </button>
                    
                    <div className="form-divider">
                        <span>or</span>
                    </div>
                    
                    <button 
                        type="button" 
                        className="btn btn-outline demo-button"
                        onClick={handleDemoLogin}
                        disabled={loading}
                    >
                        <span className="demo-icon">⚡</span>
                        Try Demo Account
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>
                        New to learning? {' '}
                        <Link to="/register" className="register-link">
                            Create an account 🌟
                        </Link>
                    </p>
                    <div className="features-preview">
                        <div className="feature-item">
                            <span>🏆</span> Earn Badges
                        </div>
                        <div className="feature-item">
                            <span>🔥</span> Track Streaks
                        </div>
                        <div className="feature-item">
                            <span>📈</span> Level Up
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnhancedLogin;