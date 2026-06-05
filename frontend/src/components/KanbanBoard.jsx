import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Card from './ui/Card'

const COLUMNS = [
  { key: 'positive', label: 'Positive', headerCls: 'text-mint',    countCls: 'bg-mint/[0.14] text-mint border-mint/30' },
  { key: 'neutral',  label: 'Neutral',  headerCls: 'text-warning', countCls: 'bg-warning/[0.14] text-warning border-warning/30' },
  { key: 'negative', label: 'Negative', headerCls: 'text-danger',  countCls: 'bg-danger/[0.14] text-danger border-danger/30' },
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
          grouped[classify(response.sentimentScore ?? 0.5)].push(response)
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

  if (loading) return <p className="text-text-1 p-4">Loading…</p>
  if (error)   return <p className="text-danger p-4">{error}</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(col => (
        <div key={col.key} className="flex flex-col gap-3">
          {/* column header */}
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.09em] ${col.headerCls}`}>{col.label}</h3>
            <span className={`inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold border ${col.countCls}`}>
              {groups[col.key].length}
            </span>
          </div>

          {/* cards */}
          <div className="flex flex-col gap-2.5 min-h-[120px]">
            {groups[col.key].length === 0 && (
              <div className="rounded-card border border-dashed border-border p-4 text-sm text-text-2 text-center">
                No responses
              </div>
            )}
            {groups[col.key].map(resp => (
              <Card key={resp._id} className="p-4 cursor-grab active:cursor-grabbing" hoverable>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-2 mb-2">{resp.department}</p>
                {resp.answers?.slice(0, 2).map((a, i) => (
                  <p key={i} className="text-sm text-text-1 line-clamp-2 mb-1">{a.answer}</p>
                ))}
                <p className="text-[11px] text-text-2 mt-2">
                  Score: {resp.sentimentScore != null ? `${(resp.sentimentScore * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
