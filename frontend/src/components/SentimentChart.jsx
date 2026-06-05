import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'

function scoreColor(score) {
  if (score >= 0.6) return '#00D9A3'
  if (score >= 0.4) return '#FFB347'
  return '#FF6B6B'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-2/90 backdrop-blur-[8px] border border-violet/50 rounded-[9px] px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-xs whitespace-nowrap pointer-events-none">
      <p className="text-text-1 mb-0.5">{label}</p>
      <p className="font-semibold text-text-0">{(payload[0].value * 100).toFixed(1)}%</p>
    </div>
  )
}

export default function SentimentChart({ data = [], xKey = 'department', title = 'Sentiment' }) {
  return (
    <div>
      {title && <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-1 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2D3E" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#8B8FA8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: '#8B8FA8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="avgScore" radius={[5, 5, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.avgScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
