import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const sample = [
  { week: 'W1', score: 0.4 },
  { week: 'W2', score: 0.55 },
  { week: 'W3', score: 0.6 },
  { week: 'W4', score: 0.5 },
]

export default function SentimentChart({ data = sample }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-semibold mb-2">Sentiment Trend</h3>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="week" />
            <YAxis domain={[0,1]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
