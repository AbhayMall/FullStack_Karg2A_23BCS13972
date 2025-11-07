// src/services/lessons.js
import api from './api'

export const lessonService = {
  getAllLessons: async () => {
    const response = await api.get('/lessons')
    return response.data?.data
  },

  getLessonById: async (id) => {
    const response = await api.get(`/lessons/${id}`)
    return response.data?.data
  },

  completeLesson: async (lessonId) => {
    const response = await api.post(`/progress/lessons/${lessonId}/complete`)
    return response.data?.data
  },

  createLesson: async (lessonData) => {
    const response = await api.post('/admin/lessons', lessonData)
    return response.data?.data
  },
  // Add to src/services/lessons.js
  updateLesson: async (id, lessonData) => {
    const response = await api.put(`/admin/lessons/${id}`, lessonData)
    return response.data?.data
  },

  deleteLesson: async (id) => {
    const response = await api.delete(`/admin/lessons/${id}`)
    return response.data?.data
  }
}
