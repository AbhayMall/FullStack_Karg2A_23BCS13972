// src/services/progress.js
import api from './api'

export const progressService = {
  getUserProgress: async () => {
    const response = await api.get('/progress/user')
    return response.data?.data
  },

  getCompletedLessons: async () => {
    const response = await api.get('/progress/completed')
    return response.data?.data
  }
}
