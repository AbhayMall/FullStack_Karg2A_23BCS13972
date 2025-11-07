import React, { useEffect, useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { questService } from '../services'
import QuestList from '../components/quests/QuestList'

const Quests = () => {
  const { quests, setQuests, showNotification } = useApp()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true)
      const data = await questService.getAllQuests()
      setQuests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching quests:', error)
      showNotification('Failed to load quests', 'error')
      setQuests([])
    } finally {
      setLoading(false)
    }
  }, [setQuests, showNotification])

  useEffect(() => {
    fetchQuests()
  }, [fetchQuests])

  const filteredQuests = filter === 'all' 
    ? quests 
    : quests.filter(quest => quest.difficulty === filter)

  const handleQuestUpdate = () => {
    fetchQuests()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quests</h1>
          <p className="text-gray-600">Complete multi-step challenges to earn bonus XP</p>
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

      <QuestList 
        quests={filteredQuests}
        onQuestUpdate={handleQuestUpdate}
      />
    </div>
  )
}

export default Quests
