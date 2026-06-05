import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Card from './ui/Card'
import Icon from './ui/Icon'

const COLS = [
  { key: 'pos', title: 'Positive', tone: '0,217,163',   icon: 'smile' },
  { key: 'neu', title: 'Neutral',  tone: '255,179,71',  icon: 'meh' },
  { key: 'neg', title: 'Negative', tone: '255,107,107', icon: 'frown' },
]

function sentimentOf(score) {
  return score >= 0.66 ? 'pos' : score >= 0.45 ? 'neu' : 'neg'
}

function ScoreBadge({ score }) {
  const s = sentimentOf(score)
  const col = s === 'pos' ? '#00D9A3' : s === 'neu' ? '#FFB347' : '#FF6B6B'
  return <span style={{ fontWeight: 600, color: col, fontSize: 13, fontFamily: 'monospace' }}>{score.toFixed(2)}</span>
}

export default function KanbanBoard() {
  const [cards, setCards] = useState([])
  const [dragId, setDragId] = useState(null)
  const [over, setOver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/responses/my')
        const mapped = res.data.map(r => ({
          id: r._id,
          dept: r.department,
          score: r.sentimentScore ?? 0.5,
          text: r.answers?.map(a => a.answer).join(' · ') || '—',
          week: new Date(r.createdAt).toLocaleDateString(),
          sentiment: sentimentOf(r.sentimentScore ?? 0.5),
        }))
        setCards(mapped)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load responses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function onDrop(colKey) {
    if (!dragId) return
    setCards(cs => cs.map(c => c.id === dragId ? { ...c, sentiment: colKey } : c))
    setDragId(null); setOver(null)
  }

  if (loading) return <p className="text-text-1 p-4">Loading…</p>
  if (error)   return <p className="text-danger p-4">{error}</p>

  return (
    <div>
      {/* page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Response Board</h1>
          <p className="text-text-1 text-sm mt-1.5">Triage anonymized feedback by sentiment. Drag a card between columns to re-tag it.</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
          <Icon name="lock" size={13} /> Department &amp; role only
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLS.map(col => {
          const colCards = cards.filter(c => c.sentiment === col.key)
          return (
            <div key={col.key}
              onDragOver={e => { e.preventDefault(); setOver(col.key) }}
              onDragLeave={e => { if (e.currentTarget === e.target) setOver(null) }}
              onDrop={() => onDrop(col.key)}
              style={{
                background: `rgba(${col.tone},0.05)`,
                border: `1px solid rgba(${col.tone},${over === col.key ? '0.5' : '0.18'})`,
                borderRadius: 14,
                padding: 12,
                minHeight: 200,
                transition: 'border-color .15s',
                outline: over === col.key ? `1.5px dashed rgba(${col.tone},0.6)` : 'none',
                outlineOffset: -4,
              }}>
              {/* col header */}
              <div className="flex items-center justify-between px-2 pb-3 pt-1.5">
                <span className="flex items-center gap-2 font-semibold text-[14.5px]"
                  style={{ color: `rgb(${col.tone})` }}>
                  <Icon name={col.icon} size={17} /> {col.title}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px',
                  borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: `rgba(${col.tone},0.16)`, color: `rgb(${col.tone})`,
                }}>
                  {colCards.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {colCards.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '22px 0', color: '#5D6178', fontSize: 12.5,
                    border: `1px dashed rgba(${col.tone},0.3)`, borderRadius: 10,
                  }}>
                    Drop cards here
                  </div>
                )}
                {colCards.map(c => (
                  <Card key={c.id}
                    className={`p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 ${dragId === c.id ? 'opacity-40 scale-[0.98]' : ''}`}
                    style={{ background: '#1E2235' }}
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onDragEnd={() => { setDragId(null); setOver(null) }}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold bg-violet/[0.12] text-violet-2 border border-violet/[0.28]">
                        {c.dept}
                      </span>
                      <span className="flex items-center gap-2">
                        <ScoreBadge score={c.score} />
                        <span className="text-text-2"><Icon name="grip" size={15} /></span>
                      </span>
                    </div>
                    <p style={{
                      fontSize: 13, lineHeight: 1.55, color: '#F0F0F5',
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {c.text}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="flex items-center gap-1.5 text-text-1 text-[11px] font-medium">
                        <Icon name="lock" size={12} style={{ color: '#00D9A3' }} /> Anonymous
                      </span>
                      <span className="text-text-2 text-[11.5px]">{c.week}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
