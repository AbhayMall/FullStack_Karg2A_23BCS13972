// src/components/admin/QuestForm.jsx
import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { questService } from '../../services'
import LoadingSpinner from '../common/LoadingSpinner'

const emptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswerIndex: 0,
  explanation: ''
})

const QuestForm = ({ onSuccess, initialData }) => {
  const { showNotification } = useApp()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'EASY',
    xpReward: initialData?.xpReward || 500,
    steps: initialData?.steps || [{ description: '', type: 'LESSON_COMPLETION', targetId: '' }],
    questions: initialData?.questions?.length ? initialData.questions : [emptyQuestion()]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'xpReward' ? parseInt(value) || 0 : value
    }))
  }

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setFormData(prev => ({ ...prev, steps: updatedSteps }))
  }

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { description: '', type: 'LESSON_COMPLETION', targetId: '' }]
    }))
  }

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, steps: updatedSteps }))
    }
  }

  // Questions handlers
  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...formData.questions]
    updated[qIndex] = { ...updated[qIndex], [field]: value }
    setFormData(prev => ({ ...prev, questions: updated }))
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.questions]
    const opts = [...updated[qIndex].options]
    opts[oIndex] = value
    updated[qIndex].options = opts
    setFormData(prev => ({ ...prev, questions: updated }))
  }

  const addQuestion = () => {
    setFormData(prev => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }))
  }

  const removeQuestion = (qIndex) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== qIndex) }))
    }
  }

  const addOption = (qIndex) => {
    const updated = [...formData.questions]
    updated[qIndex].options = [...updated[qIndex].options, '']
    setFormData(prev => ({ ...prev, questions: updated }))
  }

  const removeOption = (qIndex, oIndex) => {
    const updated = [...formData.questions]
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex)
      // Adjust correctAnswerIndex if needed
      if (updated[qIndex].correctAnswerIndex >= updated[qIndex].options.length) {
        updated[qIndex].correctAnswerIndex = 0
      }
      setFormData(prev => ({ ...prev, questions: updated }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const questData = {
        ...formData,
        isActive: true,
        prerequisites: [],
        requiredLessonIds: []
      }

      if (initialData) {
        await questService.updateQuest(initialData.id, questData)
        showNotification('Quest updated successfully!', 'success')
      } else {
        await questService.createQuest(questData)
        showNotification('Quest created successfully!', 'success')
      }
      
      onSuccess?.()
    } catch (error) {
      console.error('Error saving quest:', error)
      showNotification('Failed to save quest', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {initialData ? 'Edit Quest' : 'Create New Quest'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter quest title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty *
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="input-field"
          placeholder="Enter quest description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          XP Reward *
        </label>
        <input
          type="number"
          name="xpReward"
          value={formData.xpReward}
          onChange={handleChange}
          required
          min="1"
          className="input-field"
        />
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Quest Steps *
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-4">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Step description"
                />
                <select
                  value={step.type}
                  onChange={(e) => handleStepChange(index, 'type', e.target.value)}
                  className="input-field"
                >
                  <option value="LESSON_COMPLETION">Complete Lesson</option>
                  <option value="QUIZ">Pass Quiz</option>
                  <option value="CUSTOM">Custom Task</option>
                </select>
                {step.type === 'LESSON_COMPLETION' && (
                  <input
                    type="text"
                    value={step.targetId}
                    onChange={(e) => handleStepChange(index, 'targetId', e.target.value)}
                    className="input-field"
                    placeholder="Lesson ID"
                  />
                )}
              </div>
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            MCQ Questions
          </label>
          <button
            type="button"
            onClick={addQuestion}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Question
          </button>
        </div>

        <div className="space-y-6">
          {formData.questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question {qIndex + 1}</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    className="input-field"
                    placeholder="Enter question text"
                    required
                  />
                </div>
                {formData.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-600 hover:text-red-700 p-2">🗑️</button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswerIndex === oIndex}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', oIndex)}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                    {q.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-red-600 hover:text-red-700 p-2">✖</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-primary-600 hover:text-primary-700">+ Add Option</button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  className="input-field"
                  placeholder="Add answer explanation"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSuccess?.()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading && <LoadingSpinner size="small" />}
          <span>{initialData ? 'Update Quest' : 'Create Quest'}</span>
        </button>
      </div>
    </form>
  )
}

export default QuestForm
