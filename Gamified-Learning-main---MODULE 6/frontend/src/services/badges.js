// src/services/badges.js
import api from './api'

export const badgeService = {
  getAllBadges: async () => {
    const response = await api.get('/badges')
    return response.data?.data
  },

  getUserBadges: async () => {
    const response = await api.get('/badges/user')
    return response.data?.data
  }
}
