// src/components/quests/QuestList.jsx
import React from 'react'
import QuestCard from './QuestCard'

const QuestList = ({ quests = [], onQuestUpdate }) => {
  const list = Array.isArray(quests) ? quests : []
  if (list.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No quests available</h3>
        <p className="text-gray-500">New quests will be added soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onUpdate={onQuestUpdate}
        />
      ))}
    </div>
  )
}

export default QuestList
