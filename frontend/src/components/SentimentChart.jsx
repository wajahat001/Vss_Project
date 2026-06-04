import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'

function scoreColor(score) {
  if (score >= 0.6) return '#22c55e'
  if (score >= 0.4) return '#eab308'
  return '#ef4444'
}

export default function SentimentChart({ data = [], xKey = 'department', title = 'Sentiment' }) {
  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={v => `${(v * 100).toFixed(1)}%`} />
          <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={scoreColor(entry.avgScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
