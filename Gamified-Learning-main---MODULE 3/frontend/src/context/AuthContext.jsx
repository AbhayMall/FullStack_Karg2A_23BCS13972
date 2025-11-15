// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const resp = await authService.getCurrentUser()
        // resp is ApiResponse: { success, message, data }
        setUser(resp?.data || null)
      } catch (error) {
        console.error('Token verification failed:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    if (token) verifyToken()
    else setLoading(false)
  }, [token])

  const login = async (credentials) => {
    try {
      const resp = await authService.login(credentials)
      // resp is ApiResponse; token and user fields are inside resp.data
      const payload = resp?.data || {}
      const token = payload.token
      const userData = { ...payload }
      delete userData.token

      if (!token) throw new Error('No token in response')

      setToken(token)
      setUser(userData)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      }
    }
  }

  const register = async (userInput) => {
    try {
      const resp = await authService.register(userInput)
      const payload = resp?.data || {}
      const token = payload.token
      const userData = { ...payload }
      delete userData.token

      if (!token) throw new Error('No token in response')

      setToken(token)
      setUser(userData)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
