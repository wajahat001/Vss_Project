import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { LineChart, DonutChart } from '../components/ui/Charts'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'

function sentimentOf(score) { return score >= 0.66 ? 'pos' : score >= 0.45 ? 'neu' : 'neg' }
function sentLabel(s) { return s === 'pos' ? 'Positive' : s === 'neu' ? 'Neutral' : 'Negative' }

function SentimentPill({ score }) {
  const s = sentimentOf(score)
  const map = {
    pos: { cls: 'bg-mint/[0.14] text-mint border-mint/30', icon: 'smile' },
    neu: { cls: 'bg-warning/[0.14] text-warning border-warning/30', icon: 'meh' },
    neg: { cls: 'bg-danger/[0.14] text-danger border-danger/30', icon: 'frown' },
  }
  const { cls, icon } = map[s]
  return (
    <span className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold border ${cls}`}>
      <Icon name={icon} size={13} stroke={2.2} /> {sentLabel(s)}
    </span>
  )
}

function StatCard({ label, value, sub, icon, tone = 'violet', delay = 0 }) {
  const tones = {
    violet:  { bg: 'rgba(108,99,255,0.14)', col: 'var(--tw-violet, #6C63FF)', textCol: 'text-text-0', iconCol: 'text-violet-2' },
    mint:    { bg: 'rgba(0,217,163,0.14)',  col: '#00D9A3', textCol: 'text-mint',    iconCol: 'text-mint' },
    warning: { bg: 'rgba(255,179,71,0.14)', col: '#FFB347', textCol: 'text-warning', iconCol: 'text-warning' },
    danger:  { bg: 'rgba(255,107,107,0.14)',col: '#FF6B6B', textCol: 'text-danger',  iconCol: 'text-danger' },
  }
  const t = tones[tone]
  return (
    <Card hoverable className="p-5 animate-fade-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">{label}</span>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: t.bg, display: 'grid', placeItems: 'center' }}
          className={t.iconCol}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      <div className={`text-3xl font-semibold tracking-tight leading-none mb-2 ${tone !== 'violet' ? t.textCol : 'text-text-0'}`}>
        {value}
      </div>
      <div className="text-[12.5px] text-text-1">{sub}</div>
    </Card>
  )
}

function ShareCard({ survey }) {
  const [copied, setCopied] = useState(false)
  if (!survey?.shareToken) return null
  const link = `${window.location.origin}/s/${survey.shareToken}`

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Card className="p-5 animate-fade-up border-violet/20" style={{ animationDelay: '0.04s' }}>
      <div className="flex items-center gap-4 flex-wrap justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'rgba(108,99,255,0.14)', color: '#8B83FF', border: '1px solid rgba(108,99,255,0.25)' }}>
            <Icon name="userplus" size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-0">Share survey link</p>
            <p className="text-[12px] text-text-1 mt-0.5 truncate max-w-[340px]">{link}</p>
          </div>
        </div>
        <button onClick={copy}
          className={['inline-flex items-center gap-2 h-9 px-4 rounded-btn text-[13px] font-semibold border transition-all', copied ? 'bg-mint/[0.14] text-mint border-mint/40' : 'bg-violet/[0.10] text-violet-2 border-violet/40 hover:bg-violet/[0.18]'].join(' ')}>
          <Icon name={copied ? 'check' : 'clipboard'} size={14} stroke={2.4} />
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [deptData, setDeptData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [activeSurvey, setActiveSurvey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [deptRes, trendRes, surveyRes] = await Promise.all([
          api.get('/api/sentiment/dashboard'),
          api.get('/api/sentiment/trends'),
          api.get('/api/surveys/active'),
        ])
        setDeptData(deptRes.data)
        setTrendData(trendRes.data)
        setActiveSurvey(surveyRes.data)
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
  const lastTrend = trendData[trendData.length - 1]
  const avgScore = lastTrend?.avgScore ?? lastTrend?.score ?? null

  if (loading) return <p className="text-text-1 p-6">Loading…</p>
  if (error) return <p className="text-danger p-6">{error}</p>

  return (
    <div className="space-y-5">
      {/* page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight leading-tight">Sentiment Dashboard</h1>
          <p className="text-text-1 text-sm mt-1.5 max-w-[560px]">
            Aggregated, anonymized pulse data across your organisation — updated as responses arrive.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
          <Icon name="lock" size={13} /> No individual is ever identifiable
        </span>
      </div>

      {/* share link */}
      <ShareCard survey={activeSurvey} />

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Responses" value={totalResponses} sub="Across all departments" icon="message" tone="violet" delay={0} />
        {avgScore != null && (
          <StatCard label="Avg sentiment score" value={avgScore.toFixed(2)}
            sub={`${sentLabel(sentimentOf(avgScore))} overall mood`} icon="trend"
            tone={sentimentOf(avgScore) === 'pos' ? 'mint' : sentimentOf(avgScore) === 'neu' ? 'warning' : 'danger'} delay={0.06} />
        )}
        {topDept && (
          <StatCard label="Top Department" value={topDept.department}
            sub={`${topDept.count} responses logged`} icon="users" tone="violet" delay={0.12} />
        )}
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5">
        <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.16s' }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-base font-semibold">Sentiment trend</h3>
              <p className="text-text-1 text-[12.5px]">Score 0–1 over time</p>
            </div>
            {avgScore != null && avgScore >= 0.55 && (
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold bg-mint/[0.14] text-mint border border-mint/30">
                <Icon name="trend" size={12} /> Improving
              </span>
            )}
          </div>
          <LineChart data={trendData} height={280} />
        </Card>

        <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.22s' }}>
          <h3 className="text-base font-semibold mb-1">Responses by department</h3>
          <p className="text-text-1 text-[12.5px] mb-4">This period</p>
          <DonutChart
            data={deptData.map(d => ({ ...d, dept: d.department, value: d.count }))}
            total={totalResponses}
            size={200}
          />
        </Card>
      </div>

      {/* recent responses table */}
      {deptData.length > 0 && (
        <Card className="animate-fade-up" style={{ animationDelay: '0.28s' }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div>
              <h3 className="text-base font-semibold">Department breakdown</h3>
              <p className="text-text-1 text-[12.5px]">Names and emails are never collected</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-text-1 text-xs font-medium">
              <Icon name="lock" size={13} style={{ color: '#00D9A3' }} /> Anonymous
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Department', 'Sentiment', 'Score', 'Responses'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-text-1 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptData.map(d => {
                  const s = sentimentOf(d.avgScore)
                  const col = s === 'pos' ? '0,217,163' : s === 'neu' ? '255,179,71' : '255,107,107'
                  return (
                    <tr key={d.department}
                      className="border-b border-border/60 last:border-0 hover:bg-white/[0.025] transition-colors"
                      style={{ boxShadow: `inset 3px 0 0 rgba(${col},0.55)` }}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold bg-violet/[0.12] text-violet-2 border border-violet/[0.28]">
                          {d.department}
                        </span>
                      </td>
                      <td className="px-4 py-3"><SentimentPill score={d.avgScore} /></td>
                      <td className="px-4 py-3 font-mono text-[13px] font-semibold" style={{ color: s === 'pos' ? '#00D9A3' : s === 'neu' ? '#FFB347' : '#FF6B6B' }}>
                        {d.avgScore.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-text-1 text-sm">{d.count}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
