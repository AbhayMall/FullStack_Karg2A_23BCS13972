// src/pages/Lessons.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { lessonService } from '../services'
import LessonList from '../components/lessons/LessonList'

const Lessons = () => {
  const { lessons, setLessons, showNotification } = useApp()
  const [, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true)
      const data = await lessonService.getAllLessons()
      setLessons(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
      showNotification('Failed to load lessons', 'error')
      setLessons([])
    } finally {
      setLoading(false)
    }
  }, [setLessons, showNotification])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const list = Array.isArray(lessons) ? lessons : []
  const filteredLessons = filter === 'all' 
    ? list 
    : list.filter(lesson => lesson.difficulty === filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600">Expand your knowledge with interactive lessons</p>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <LessonList 
        lessons={filteredLessons}
        onLessonComplete={() => {
          showNotification('Lesson completed!', 'success')
          fetchLessons()
        }}
      />
    </div>
  )
}

export default Lessons
