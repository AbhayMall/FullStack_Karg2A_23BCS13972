// src/services/quests.js
import api from './api'

export const questService = {
  getAllQuests: async () => {
    const response = await api.get('/quests')
    return response.data?.data
  },

  getQuestById: async (id) => {
    const response = await api.get(`/quests/${id}`)
    return response.data?.data
  },

  completeQuest: async (questId) => {
    const response = await api.post(`/quests/${questId}/complete`)
    return response.data?.data
  },
  
  submitQuiz: async (questId, answers) => {
    const response = await api.post(`/quests/${questId}/submit-quiz`, answers)
    return response.data?.data
  },

  createQuest: async (questData) => {
    const response = await api.post('/admin/quests', questData)
    return response.data?.data
  },
  // Add to src/services/quests.js
  updateQuest: async (id, questData) => {
    const response = await api.put(`/admin/quests/${id}`, questData)
    return response.data?.data
  },

  deleteQuest: async (id) => {
    const response = await api.delete(`/admin/quests/${id}`)
    return response.data?.data
  }
}
