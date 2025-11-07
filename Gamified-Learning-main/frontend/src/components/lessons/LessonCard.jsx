// src/components/lessons/LessonCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../utils/constants'

const LessonCard = ({ lesson }) => {
  const difficultyColor = DIFFICULTY_COLORS[lesson.difficulty] || 'bg-gray-500'

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {lesson.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {lesson.description}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${difficultyColor}`}>
          {DIFFICULTY_LABELS[lesson.difficulty]}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          ⏱️ {lesson.estimatedMinutes} min • ⭐ {lesson.xpValue} XP
        </div>
        <Link
          to={`/lessons/${lesson.id}`}
          className="btn-primary text-center py-2 px-4"
        >
          Open Lesson
        </Link>
      </div>
    </div>
  )
}

export default LessonCard
