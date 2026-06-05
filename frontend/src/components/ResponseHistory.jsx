import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Card from './ui/Card'

function pill(score) {
  if (score >= 0.6) return { cls: 'bg-mint/[0.14] text-mint border-mint/30', label: 'Positive' }
  if (score >= 0.4) return { cls: 'bg-warning/[0.14] text-warning border-warning/30', label: 'Neutral' }
  return { cls: 'bg-danger/[0.14] text-danger border-danger/30', label: 'Negative' }
}

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

  if (loading) return <Card className="p-6 text-text-1">Loading…</Card>
  if (error)   return <Card className="p-6 text-danger">{error}</Card>
  if (!items.length) return <Card className="p-6 text-text-1">No responses yet.</Card>

  return (
    <div className="space-y-3">
      {items.map(it => {
        const p = it.sentimentScore != null ? pill(it.sentimentScore) : null
        return (
          <Card key={it._id} className="p-4" hoverable>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-2">
                {new Date(it.createdAt).toLocaleString()}
              </span>
              {p && (
                <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold border ${p.cls}`}>
                  {p.label} — {(it.sentimentScore * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-sm text-text-1">
              {it.answers?.length || 0} answer{it.answers?.length !== 1 ? 's' : ''} · {it.department}
            </p>
          </Card>
        )
      })}
    </div>
  )
}
