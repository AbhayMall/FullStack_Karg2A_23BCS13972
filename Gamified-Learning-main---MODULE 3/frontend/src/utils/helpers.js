// src/utils/helpers.js
export const formatXP = (xp) => {
  if (xp >= 1000) {
    return (xp / 1000).toFixed(1) + 'k'
  }
  return xp.toString()
}

export const calculateLevel = (xp) => {
  return Math.floor(xp / 1000) + 1
}

export const calculateProgress = (xp) => {
  const level = calculateLevel(xp)
  const xpForCurrentLevel = (level - 1) * 1000
  const xpForNextLevel = level * 1000
  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
  return Math.min(progress, 100)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}