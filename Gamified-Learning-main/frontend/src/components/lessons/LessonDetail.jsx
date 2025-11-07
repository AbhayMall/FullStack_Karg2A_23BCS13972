// src/components/lessons/LessonDetail.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { lessonService } from '../../services'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../utils/constants'
import LoadingSpinner from '../common/LoadingSpinner'

const LessonDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showNotification } = useApp()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  React.useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true)
        const data = await lessonService.getLessonById(id)
        setLesson(data)
      } catch (error) {
        console.error('Error fetching lesson:', error)
        showNotification('Failed to load lesson', 'error')
        navigate('/lessons')
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id, navigate, showNotification])

  const [completed, setCompleted] = useState(() => localStorage.getItem(`lesson_done_${id}`) === '1')
  const [isChecked, setIsChecked] = useState(() => localStorage.getItem(`lesson_checked_${id}`) === '1')

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked
    setIsChecked(checked)
    localStorage.setItem(`lesson_checked_${id}`, checked ? '1' : '0')
  }

  const handleCompleteLesson = async () => {
    if (!isChecked) {
      showNotification('Please mark the checkbox to confirm you have completed the lesson', 'error')
      return
    }
    try {
      setCompleting(true)
      await lessonService.completeLesson(id)
      localStorage.setItem(`lesson_done_${id}`, '1')
      setCompleted(true)
      showNotification('Lesson completed! XP earned!', 'success')
      navigate('/lessons')
    } catch (error) {
      console.error('Error completing lesson:', error)
      showNotification('Failed to complete lesson', 'error')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h2>
        <p className="text-gray-500">The lesson you're looking for doesn't exist.</p>
      </div>
    )
  }

  const difficultyColor = DIFFICULTY_COLORS[lesson.difficulty] || 'bg-gray-500'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6 mb-6">
        <button
          onClick={() => navigate('/lessons')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          ← Back to Lessons
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600 text-lg">{lesson.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${difficultyColor}`}>
              {DIFFICULTY_LABELS[lesson.difficulty]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">⏱️</div>
            <div className="font-medium text-gray-900">{lesson.estimatedMinutes} min</div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">⭐</div>
            <div className="font-medium text-gray-900">{lesson.xpValue} XP</div>
            <div className="text-sm text-gray-500">Base Reward</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">🔥</div>
            <div className="font-medium text-gray-900">+{user?.currentStreak || 0}%</div>
            <div className="text-sm text-gray-500">Streak Bonus</div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Content</h2>
        <div className="prose max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>
      </div>

      {!completed && (
        <div className="card p-4 mb-6 bg-blue-50 border border-blue-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              disabled={completed}
            />
            <span className="text-gray-700 font-medium">
              I have read and understood this lesson content
            </span>
          </label>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleCompleteLesson}
          disabled={completing || completed || !isChecked}
          className={`px-8 py-3 text-lg flex items-center space-x-2 rounded-lg ${
            completed 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : !isChecked
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {completing ? (
            <LoadingSpinner size="small" />
          ) : completed ? (
            <>
              <span>Completed</span>
              <span>✅</span>
            </>
          ) : (
            <>
              <span>Complete Lesson & Earn {lesson.xpValue} XP</span>
              <span>🎯</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default LessonDetail