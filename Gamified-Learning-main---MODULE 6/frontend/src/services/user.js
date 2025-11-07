// src/services/user.js
import api from './api'

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data?.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    return response.data?.data
  },

  getUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data?.data
  }
}
