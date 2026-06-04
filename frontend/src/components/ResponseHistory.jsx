import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function ResponseHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/responses/my')
      .then(res => setItems(res.data || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load responses'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 bg-white rounded shadow text-gray-500">Loading…</div>
  if (error) return <div className="p-4 bg-white rounded shadow text-red-500">{error}</div>
  if (!items.length) return <div className="p-4 bg-white rounded shadow text-gray-500">No responses yet.</div>

  return (
    <div className="space-y-3">
      {items.map(it => (
        <div key={it._id} className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{new Date(it.createdAt).toLocaleString()}</span>
            {it.sentimentScore != null && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                it.sentimentScore >= 0.6
                  ? 'bg-green-100 text-green-700'
                  : it.sentimentScore >= 0.4
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {it.sentimentScore >= 0.6 ? 'Positive' : it.sentimentScore >= 0.4 ? 'Neutral' : 'Negative'} — {(it.sentimentScore * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {it.answers?.length || 0} answer{it.answers?.length !== 1 ? 's' : ''} · {it.department}
          </div>
        </div>
      ))}
    </div>
  )
}
