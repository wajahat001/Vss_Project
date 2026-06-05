import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import SentimentChart from '../components/SentimentChart'
import Card from '../components/ui/Card'

function pill(score) {
  if (score >= 0.6) return 'bg-mint/[0.14] text-mint border border-mint/30'
  if (score >= 0.4) return 'bg-warning/[0.14] text-warning border border-warning/30'
  return 'bg-danger/[0.14] text-danger border border-danger/30'
}
function pillLabel(score) {
  return score >= 0.6 ? 'Positive' : score >= 0.4 ? 'Neutral' : 'Negative'
}

function StatCard({ label, value, sub, accent }) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1 mb-3">{label}</p>
      <p className={`text-3xl font-semibold tracking-tight leading-none ${accent || 'text-text-0'}`}>{value}</p>
      {sub && <p className="text-sm text-text-1 mt-1.5">{sub}</p>}
    </Card>
  )
}

export default function Dashboard() {
  const [deptData, setDeptData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [deptRes, trendRes] = await Promise.all([
          api.get('/api/sentiment/dashboard'),
          api.get('/api/sentiment/trends'),
        ])
        setDeptData(deptRes.data)
        setTrendData(trendRes.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalResponses = deptData.reduce((sum, d) => sum + (d.count || 0), 0)
  const sorted = [...deptData].sort((a, b) => b.avgScore - a.avgScore)
  const topDept = sorted[0]
  const bottomDept = sorted[sorted.length - 1]

  if (loading) return <p className="text-text-1 p-6">Loading…</p>
  if (error)   return <p className="text-danger p-6">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-0">Sentiment Dashboard</h1>
        <p className="text-text-1 text-sm mt-1">Live anonymised feedback across your organisation</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Responses" value={totalResponses} />
        {topDept && (
          <StatCard label="Top Department" value={topDept.department} sub={`${(topDept.avgScore * 100).toFixed(1)}% sentiment`} accent="text-mint" />
        )}
        {bottomDept && bottomDept !== topDept && (
          <StatCard label="Needs Attention" value={bottomDept.department} sub={`${(bottomDept.avgScore * 100).toFixed(1)}% sentiment`} accent="text-danger" />
        )}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SentimentChart data={deptData} xKey="department" title="By Department" />
        </Card>
        <Card className="p-5">
          <SentimentChart data={trendData} xKey="week" title="Week-by-Week Trend" />
        </Card>
      </div>

      {/* table */}
      {deptData.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Department', 'Responses', 'Avg Sentiment', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-text-1 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptData.map(d => (
                  <tr key={d.department} className="border-b border-border/60 last:border-0 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-text-0">{d.department}</td>
                    <td className="px-4 py-3 text-sm text-text-1">{d.count}</td>
                    <td className="px-4 py-3 text-sm text-text-0">{(d.avgScore * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold ${pill(d.avgScore)}`}>
                        {pillLabel(d.avgScore)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
