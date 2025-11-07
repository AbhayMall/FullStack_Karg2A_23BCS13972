// src/services/leaderboard.js
import api from './api'

export const leaderboardService = {
  getGlobalLeaderboard: async () => {
    const response = await api.get('/leaderboard/global')
    return response.data?.data
  }
}
