// src/components/quests/QuestDetail.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { questService } from '../../services'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../utils/constants'
import LoadingSpinner from '../common/LoadingSpinner'

const QuestDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useApp()
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  React.useEffect(() => {
    const fetchQuest = async () => {
      try {
        setLoading(true)
        const data = await questService.getQuestById(id)
        setQuest(data)
        // Initialize answers array with -1 (no answer selected)
        if (data?.questions && data.questions.length > 0) {
          setAnswers(new Array(data.questions.length).fill(-1))
        } else {
          setAnswers(Array.isArray(data?.steps) ? data.steps.map(() => false) : [])
        }
      } catch (error) {
        console.error('Error fetching quest:', error)
        showNotification('Failed to load quest', 'error')
        navigate('/quests')
      } finally {
        setLoading(false)
      }
    }

    fetchQuest()
  }, [id, navigate, showNotification])

  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  
  // Check if all questions are answered (for quests with quiz questions)
  const hasQuestions = quest?.questions && quest.questions.length > 0
  const allAnswered = hasQuestions 
    ? answers.length > 0 && answers.every(ans => ans !== -1)
    : answers.length > 0 && answers.every(Boolean)

  const handleToggle = (idx) => (e) => {
    const checked = e.target.checked
    setAnswers((prev) => prev.map((v, i) => (i === idx ? checked : v)))
  }
  
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => prev.map((ans, i) => (i === questionIndex ? optionIndex : ans)))
  }

  const handleSubmit = async () => {
    if (!allAnswered) {
      showNotification('Please answer all questions', 'error')
      return
    }
    
    try {
      setCompleting(true)
      
      // If quest has quiz questions, submit quiz answers
      if (hasQuestions) {
        const result = await questService.submitQuiz(id, answers)
        
        if (result.success) {
          showNotification(`Quest completed! You earned ${result.xpAwarded} XP!`, 'success')
          navigate('/quests')
        } else {
          setShowResults(true)
          showNotification(result.message || 'Some answers are incorrect. Please try again.', 'error')
        }
      } else {
        // Legacy: complete quest without quiz
        await questService.completeQuest(id)
        showNotification('Quest completed! XP earned!', 'success')
        navigate('/quests')
      }
    } catch (error) {
      console.error('Error completing quest:', error)
      const msg = 'quest completed'
      showNotification(msg, 'error1')
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

  if (!quest) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Quest not found</h2>
        <p className="text-gray-500">The quest you're looking for doesn't exist.</p>
      </div>
    )
  }

  const difficultyColor = DIFFICULTY_COLORS[quest.difficulty] || 'bg-gray-500'
  const completedSteps = quest.steps?.filter(step => step.isCompleted).length || 0
  const totalSteps = quest.steps?.length || 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6 mb-6">
        <button
          onClick={() => navigate('/quests')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          ← Back to Quests
        </button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {quest.title}
            </h1>
            <p className="text-gray-600 text-lg">{quest.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${difficultyColor}`}>
              {DIFFICULTY_LABELS[quest.difficulty]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">⭐</div>
            <div className="font-medium text-gray-900">
              {hasQuestions ? `${quest.questions.length * 10} XP (max)` : `${quest.xpReward} XP`}
            </div>
            <div className="text-sm text-gray-500">Reward</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">📋</div>
            <div className="font-medium text-gray-900">{totalSteps}</div>
            <div className="text-sm text-gray-500">Total Steps</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">🎯</div>
            <div className="font-medium text-gray-900">{completedSteps}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>
              {hasQuestions 
                ? `${answers.filter(ans => ans !== -1).length}/${quest.questions.length} questions answered`
                : `${answers.filter(Boolean).length}/${totalSteps} steps answered`
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-primary-600 transition-all duration-300"
              style={{ 
                width: hasQuestions
                  ? `${(answers.filter(ans => ans !== -1).length / Math.max(quest.questions.length, 1)) * 100}%`
                  : `${(answers.filter(Boolean).length / Math.max(totalSteps, 1)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quiz Questions Section */}
      {hasQuestions ? (
        <div className="card p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Questions</h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              +10 XP per correct answer. Max {quest.questions.length * 10} XP.
            </p>
            <div className="text-sm font-medium text-primary-700">
              Current XP (preview): {answers.filter((ans, idx) => ans === quest.questions[idx]?.correctAnswerIndex).length * 10}
            </div>
          </div>
          <div className="space-y-6">
            {quest.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="p-5 border-2 rounded-lg bg-white border-gray-200 hover:border-primary-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  Question {qIndex + 1}: {question.questionText}
                </h3>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[qIndex] === oIndex
                          ? 'bg-primary-50 border-primary-500'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={answers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                        className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    answers[qIndex] === question.correctAnswerIndex
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {answers[qIndex] === question.correctAnswerIndex ? (
                      <span>✅ Correct!</span>
                    ) : (
                      <span>❌ Incorrect. Try again!</span>
                    )}
                    {question.explanation && (
                      <p className="text-sm mt-1 opacity-90">{question.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Steps Section (Legacy) */
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quest Steps</h2>
          <div className="space-y-4">
            {quest.steps?.map((step, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  step.isCompleted
                    ? 'bg-success-50 border-success-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 ${
                    step.isCompleted
                      ? 'bg-success-500 border-success-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step.isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      step.isCompleted ? 'text-success-700' : 'text-gray-900'
                    }`}>
                      {step.description}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {step.type === 'LESSON_COMPLETION' ? 'Complete the lesson to proceed' : 'Complete this step'}
                    </p>
                  </div>
                  <label className="ml-auto text-sm flex items-center space-x-2">
                    <input type="checkbox" onChange={handleToggle(index)} checked={answers[index] || false} />
                    <span>Mark answer</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {hasQuestions && !allAnswered ? (
        <div className="text-center mt-8 text-gray-600">
          Select an option for every question to enable submit.
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={completing || (!hasQuestions && !allAnswered)}
            className={`px-8 py-3 text-lg flex items-center space-x-2 rounded-lg ${
              allAnswered 
                ? 'btn-primary hover:opacity-90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {completing ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <span>
                  {hasQuestions 
                    ? `Submit Quiz` 
                    : 'Submit Answers'
                  }
                </span>
                <span>🏆</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuestDetail