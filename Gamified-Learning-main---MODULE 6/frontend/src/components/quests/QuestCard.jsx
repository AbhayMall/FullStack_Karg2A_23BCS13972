// src/components/quests/QuestCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../utils/constants'

const QuestCard = ({ quest }) => {
  const difficultyColor = DIFFICULTY_COLORS[quest.difficulty] || 'bg-gray-500'
  const completedSteps = quest.steps?.filter(step => step.isCompleted).length || 0
  const totalSteps = quest.steps?.length || 0
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {quest.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {quest.description}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${difficultyColor} ml-2`}>
          {DIFFICULTY_LABELS[quest.difficulty]}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-4">
        {quest.steps?.map((step, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
              step.isCompleted 
                ? 'bg-success-500 border-success-500 text-white' 
                : 'bg-white border-gray-300'
            }`}>
              {step.isCompleted && '✓'}
            </div>
            <span className={step.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}>
              {step.description}
            </span>
          </div>
        ))}
      </div>

      {/* Rewards and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>⭐ {quest.xpReward} XP</span>
          <span>📋 {totalSteps} steps</span>
        </div>
        <Link to={`/quests/${quest.id}`} className="btn-primary px-4 py-2 text-sm">Open Quest</Link>
      </div>
    </div>
  )
}

export default QuestCard