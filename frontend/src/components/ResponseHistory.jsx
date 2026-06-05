import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Card from './ui/Card'
import Icon from './ui/Icon'

function sentimentOf(score) { return score >= 0.66 ? 'pos' : score >= 0.45 ? 'neu' : 'neg' }
const sentColors = { pos: '#00D9A3', neu: '#FFB347', neg: '#FF6B6B' }
const pillMap = {
  pos: { cls: 'bg-mint/[0.14] text-mint border-mint/30', icon: 'smile', label: 'Positive' },
  neu: { cls: 'bg-warning/[0.14] text-warning border-warning/30', icon: 'meh', label: 'Neutral' },
  neg: { cls: 'bg-danger/[0.14] text-danger border-danger/30', icon: 'frown', label: 'Negative' },
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
    <div>
      {/* timeline */}
      <div className="relative pl-7">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5"
          style={{ background: 'linear-gradient(180deg, rgba(108,99,255,0.5), rgba(42,45,62,0.6))' }} />

        <div className="space-y-3">
          {items.map((it, i) => {
            const s = it.sentimentScore != null ? sentimentOf(it.sentimentScore) : null
            const pill = s ? pillMap[s] : null
            const dotColor = s ? sentColors[s] : '#5D6178'
            const date = new Date(it.createdAt)
            const weekLabel = `Wk ${Math.ceil(date.getDate() / 7)}`

            return (
              <div key={it._id} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                {/* timeline dot */}
                <span style={{
                  position: 'absolute', left: -28, top: 22,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#0F1117',
                  border: `2.5px solid ${dotColor}`,
                  boxShadow: `0 0 12px ${dotColor}55`,
                }} />
                <Card hoverable className="p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-base font-semibold">{weekLabel}</span>
                          <span className="inline-flex items-center h-5 px-2 rounded-[6px] text-[11px] font-semibold bg-white/[0.06] text-text-1 gap-1">
                            <Icon name="calendar" size={11} /> {date.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-text-1 text-sm">
                          <span className="flex items-center gap-1">
                            <Icon name="check" size={13} style={{ color: '#00D9A3' }} />
                            {it.answers?.length || 0} answers
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-medium">
                            <Icon name="lock" size={12} style={{ color: '#00D9A3' }} /> Anonymous
                          </span>
                        </div>
                      </div>
                    </div>
                    {pill && (
                      <span className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold border ${pill.cls}`}>
                        <Icon name={pill.icon} size={13} stroke={2.2} /> {pill.label}
                        {it.sentimentScore != null && ` — ${(it.sentimentScore * 100).toFixed(0)}%`}
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* privacy note */}
      <Card className="mt-5 p-4 flex items-center gap-3 bg-white/[0.04] backdrop-blur-[12px]">
        <Icon name="shield" size={20} style={{ color: '#00D9A3', flexShrink: 0 }} />
        <span className="text-text-1 text-sm">
          We store <strong className="text-text-0">that</strong> you submitted, never <strong className="text-text-0">what</strong> you submitted.
          The sentiment shown here is computed anonymously and never linked to your profile.
        </span>
      </Card>
    </div>
  )
}
