// src/services/index.js
import api from './api'
export { authService } from './auth'
export { lessonService } from './lessons'
export { questService } from './quests'
export { badgeService } from './badges'
export { leaderboardService } from './leaderboard'
export { progressService } from './progress'

// Add analytics service
export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data?.data
  }
}
