// src/pages/Badges.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'

const TIERS = [
  { name: 'Bronze', threshold: 500, icon: '🥉', color: 'bg-amber-200 text-amber-800' },
  { name: 'Silver', threshold: 1000, icon: '🥈', color: 'bg-gray-200 text-gray-800' },
  { name: 'Platinum', threshold: 1500, icon: '🎖️', color: 'bg-slate-200 text-slate-800' },
  { name: 'Gold', threshold: 2000, icon: '🥇', color: 'bg-yellow-200 text-yellow-800' },
  { name: 'Diamond', threshold: 5000, icon: '💎', color: 'bg-cyan-200 text-cyan-800' },
  { name: 'Ruby', threshold: 10000, icon: '💠', color: 'bg-rose-200 text-rose-800' },
]

const Badges = () => {
  const { user } = useAuth()
  const xp = user?.totalXP || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
        <p className="text-gray-600">Earn badges as your XP grows</p>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIERS.map((tier) => {
            const unlocked = xp >= tier.threshold
            return (
              <div key={tier.name} className={`p-4 border rounded-lg flex items-center justify-between ${unlocked ? 'bg-white' : 'bg-gray-50 opacity-80'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${tier.color}`}>
                    {tier.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{tier.name}</div>
                    <div className="text-sm text-gray-500">Reach {tier.threshold.toLocaleString()} XP</div>
                  </div>
                </div>
                <div>
                  <input type="checkbox" readOnly checked={unlocked} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Badges
