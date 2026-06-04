import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import SentimentChart from '../components/SentimentChart'

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

  if (loading) return <p className="text-gray-500 p-6">Loading…</p>
  if (error) return <p className="text-red-600 p-6">{error}</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sentiment Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Responses" value={totalResponses} />
        {topDept && (
          <StatCard
            label="Top Department"
            value={topDept.department}
            sub={`${(topDept.avgScore * 100).toFixed(1)}%`}
            color="text-green-600"
          />
        )}
        {bottomDept && bottomDept !== topDept && (
          <StatCard
            label="Needs Attention"
            value={bottomDept.department}
            sub={`${(bottomDept.avgScore * 100).toFixed(1)}%`}
            color="text-red-500"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <SentimentChart data={deptData} xKey="department" title="By Department" />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <SentimentChart data={trendData} xKey="week" title="Week-by-Week Trend" />
        </div>
      </div>

      {deptData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3">Department</th>
                <th className="text-left px-4 py-3">Responses</th>
                <th className="text-left px-4 py-3">Avg Sentiment</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deptData.map(d => (
                <tr key={d.department} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.department}</td>
                  <td className="px-4 py-3 text-gray-500">{d.count}</td>
                  <td className="px-4 py-3">{(d.avgScore * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      d.avgScore >= 0.6
                        ? 'bg-green-100 text-green-700'
                        : d.avgScore >= 0.4
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {d.avgScore >= 0.6 ? 'Positive' : d.avgScore >= 0.4 ? 'Neutral' : 'Negative'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
