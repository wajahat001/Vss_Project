import React, { useEffect, useState } from 'react'
import api from '../lib/api'

const COLUMNS = [
  { key: 'positive', label: 'Positive', color: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700' },
  { key: 'neutral',  label: 'Neutral',  color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  { key: 'negative', label: 'Negative', color: 'bg-red-50 border-red-200',    badge: 'bg-red-100 text-red-700' },
]

function classify(score) {
  if (score >= 0.6) return 'positive'
  if (score >= 0.4) return 'neutral'
  return 'negative'
}

export default function KanbanBoard() {
  const [groups, setGroups] = useState({ positive: [], neutral: [], negative: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/responses/my')
        const grouped = { positive: [], neutral: [], negative: [] }
        for (const response of res.data) {
          const bucket = classify(response.sentimentScore ?? 0.5)
          grouped[bucket].push(response)
        }
        setGroups(grouped)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load responses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-gray-500 p-6">Loading…</p>
  if (error) return <p className="text-red-600 p-6">{error}</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {COLUMNS.map(col => (
        <div key={col.key} className={`rounded-lg border ${col.color} p-4 min-h-[200px]`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">{col.label}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
              {groups[col.key].length}
            </span>
          </div>
          <div className="space-y-3">
            {groups[col.key].length === 0 && (
              <p className="text-sm text-gray-400 italic">No responses</p>
            )}
            {groups[col.key].map(resp => (
              <div key={resp._id} className="bg-white rounded shadow-sm p-3 space-y-1">
                <p className="text-xs text-gray-400 font-medium uppercase">{resp.department}</p>
                {resp.answers?.slice(0, 2).map((a, i) => (
                  <p key={i} className="text-sm text-gray-700 line-clamp-2">{a.answer}</p>
                ))}
                <p className="text-xs text-gray-400 mt-1">
                  Score: {resp.sentimentScore != null ? `${(resp.sentimentScore * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
