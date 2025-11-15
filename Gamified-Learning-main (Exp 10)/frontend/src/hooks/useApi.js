// src/hooks/useApi.js
import { useState, useEffect } from 'react'

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result.data)
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}