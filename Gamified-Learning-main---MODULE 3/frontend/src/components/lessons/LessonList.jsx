// src/components/lessons/LessonList.jsx
import React from 'react'
import LessonCard from './LessonCard'

const LessonList = ({ lessons = [], onLessonComplete }) => {
  const list = Array.isArray(lessons) ? lessons : []

  if (list.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons available</h3>
        <p className="text-gray-500">Check back later for new learning content.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onComplete={onLessonComplete}
        />
      ))}
    </div>
  )
}

export default LessonList
