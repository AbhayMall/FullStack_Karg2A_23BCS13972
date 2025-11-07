// src/components/admin/LessonForm.jsx
import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { lessonService } from '../../services'
import LoadingSpinner from '../common/LoadingSpinner'

const LessonForm = ({ onSuccess, initialData }) => {
  const { showNotification } = useApp()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    difficulty: initialData?.difficulty || 'EASY',
    xpValue: initialData?.xpValue || 100,
    estimatedMinutes: initialData?.estimatedMinutes || 30,
    tags: initialData?.tags?.join(', ') || '',
    orderIndex: initialData?.orderIndex || 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'xpValue' || name === 'estimatedMinutes' || name === 'orderIndex' 
        ? parseInt(value) || 0 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const lessonData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: true
      }

      if (initialData) {
        await lessonService.updateLesson(initialData.id, lessonData)
        showNotification('Lesson updated successfully!', 'success')
      } else {
        await lessonService.createLesson(lessonData)
        showNotification('Lesson created successfully!', 'success')
      }
      
      onSuccess?.()
      setFormData({
        title: '',
        description: '',
        content: '',
        difficulty: 'EASY',
        xpValue: 100,
        estimatedMinutes: 30,
        tags: '',
        orderIndex: 0
      })
    } catch (error) {
      console.error('Error saving lesson:', error)
      showNotification('Failed to save lesson', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {initialData ? 'Edit Lesson' : 'Create New Lesson'}
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
            placeholder="Enter lesson title"
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
          placeholder="Enter lesson description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={6}
          className="input-field"
          placeholder="Enter lesson content (HTML supported)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            XP Value *
          </label>
          <input
            type="number"
            name="xpValue"
            value={formData.xpValue}
            onChange={handleChange}
            required
            min="1"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Minutes *
          </label>
          <input
            type="number"
            name="estimatedMinutes"
            value={formData.estimatedMinutes}
            onChange={handleChange}
            required
            min="1"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Index
          </label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="input-field"
          placeholder="programming, basics, introduction"
        />
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
          <span>{initialData ? 'Update Lesson' : 'Create Lesson'}</span>
        </button>
      </div>
    </form>
  )
}

export default LessonForm