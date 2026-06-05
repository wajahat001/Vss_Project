import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Button from './ui/Button'
import Card from './ui/Card'
import Icon from './ui/Icon'

function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-2" onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(n => {
        const active = n <= (hover || value)
        return (
          <button key={n} type="button"
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            style={{
              background: 'none', border: 'none', padding: 4, lineHeight: 0,
              color: active ? '#FFB347' : '#5D6178',
              transition: 'color .15s, transform .12s',
              transform: active ? 'scale(1.08)' : 'scale(1)',
              filter: active ? 'drop-shadow(0 0 8px rgba(255,179,71,0.45))' : 'none',
            }}>
            <Icon name="star" size={28} stroke={1.6}
              style={{ fill: active ? '#FFB347' : 'transparent' }} />
          </button>
        )
      })}
      <span className="text-text-1 text-sm ml-1 min-w-[48px]">
        {value ? ['','Poor','Fair','Okay','Good','Great'][value] : ''}
      </span>
    </div>
  )
}

function Toast({ show, children, onDone, duration = 3200 }) {
  useEffect(() => {
    if (show) { const t = setTimeout(onDone, duration); return () => clearTimeout(t) }
  }, [show])
  if (!show) return null
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}
      className="animate-fade-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-card border border-mint/40 bg-white/[0.04] backdrop-blur-[12px] shadow-[0_14px_40px_rgba(0,0,0,0.5)] max-w-[440px]">
        <span className="w-6 h-6 rounded-full bg-mint/[0.16] grid place-items-center text-mint flex-shrink-0">
          <Icon name="check" size={15} stroke={2.6} />
        </span>
        <span className="text-sm text-text-0">{children}</span>
      </div>
    </div>
  )
}

export default function SurveyForm() {
  const [survey, setSurvey] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    api.get('/api/surveys/active')
      .then(res => setSurvey(res.data))
      .catch(() => setError('Failed to load survey'))
      .finally(() => setLoading(false))
  }, [])

  function setAnswer(qid, value) { setAnswers(a => ({ ...a, [qid]: value })) }

  const questions = survey?.questions || []
  const required = questions.filter(q => !q.optional)
  const answeredCount = required.filter(q => answers[q.id || q._id]).length
  const pct = required.length ? Math.round((answeredCount / required.length) * 100) : 0
  const canSubmit = answeredCount === required.length && required.length > 0

  async function submit(e) {
    e.preventDefault()
    if (!survey) return
    setSubmitting(true)
    setError('')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const payload = {
      surveyId: survey._id,
      department: user?.department || '',
      answers: Object.keys(answers).map(k => ({ questionId: k, answer: String(answers[k]) })),
    }
    try {
      await api.post('/api/responses/submit', payload)
      setSubmitted(true)
      setToast(true)
      setAnswers({})
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Card className="p-6 text-text-1">Loading survey…</Card>
  if (!survey) return <Card className="p-6 text-text-1">No active survey at the moment.</Card>

  if (submitted) return (
    <div className="max-w-[560px] mx-auto mt-10 text-center animate-fade-up">
      <div style={{
        width: 84, height: 84, borderRadius: '50%', margin: '0 auto 24px',
        background: 'radial-gradient(circle, rgba(0,217,163,0.22), rgba(0,217,163,0.04))',
        border: '1px solid rgba(0,217,163,0.4)', display: 'grid', placeItems: 'center',
        boxShadow: '0 0 40px rgba(0,217,163,0.25)',
      }}>
        <Icon name="shieldCheck" size={40} stroke={2} style={{ color: '#00D9A3' }} />
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight mb-3">Your response has been recorded</h1>
      <p className="text-text-1 text-[15px] leading-relaxed">
        Your identity was never stored. Responses are aggregated anonymously before anyone in leadership sees them.
      </p>
      <div className="flex justify-center mt-5">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
          <Icon name="lock" size={13} /> Submitted anonymously
        </span>
      </div>
      <Button variant="secondary" className="mt-7" onClick={() => { setAnswers({}); setSubmitted(false) }}>
        Back to survey
      </Button>
      <Toast show={toast} onDone={() => setToast(false)}>
        Your response has been recorded. Your identity was never stored.
      </Toast>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* page header */}
      <div className="mb-2">
        <h1 className="text-[26px] font-semibold tracking-tight">{survey.title || 'Weekly Pulse Survey'}</h1>
        <p className="text-text-1 text-sm mt-1">Responses are 100% anonymous. Answer honestly.</p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
            <Icon name="lock" size={13} /> Your identity is never stored
          </span>
        </div>
      </div>

      {/* sticky progress */}
      <Card className="p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Progress</span>
          <span className="text-sm font-semibold">{answeredCount} / {required.length} answered</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <span className="block h-full rounded-full bg-grad transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${pct}%` }} />
        </div>
      </Card>

      {error && (
        <div className="px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      {/* questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const qid = q.id || q._id || idx
          const done = !!answers[qid]
          return (
            <Card key={qid} hoverable className="p-5 animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex gap-3 items-start mb-4">
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center',
                  fontSize: 13, fontWeight: 600,
                  background: done ? 'rgba(0,217,163,0.16)' : 'rgba(108,99,255,0.14)',
                  color: done ? '#00D9A3' : '#8B83FF',
                  transition: 'all .2s',
                }}>
                  {done ? <Icon name="check" size={15} stroke={3} /> : idx + 1}
                </span>
                <div className="flex-1">
                  <span className="text-[15.5px] font-semibold">{q.text || q.question}</span>
                  {q.optional && (
                    <span className="ml-2 inline-flex items-center h-5 px-2 rounded-[6px] text-[11px] font-semibold bg-white/[0.06] text-text-1">Optional</span>
                  )}
                </div>
              </div>
              <div className="pl-10">
                {q.type === 'rating'
                  ? <Stars value={answers[qid] || 0} onChange={v => setAnswer(qid, v)} />
                  : (
                    <textarea
                      className="w-full bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input px-3.5 py-3 text-sm outline-none transition-all duration-200 focus:border-violet focus:shadow-focus-violet focus:bg-[#212640] resize-y min-h-[96px] leading-[1.55]"
                      placeholder={q.placeholder || 'Your answer…'}
                      value={answers[qid] || ''}
                      onChange={e => setAnswer(qid, e.target.value)}
                    />
                  )
                }
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <span className="flex items-center gap-2 text-text-1 text-sm">
          <Icon name="lock" size={14} style={{ color: '#00D9A3' }} />
          No names, emails, or device info are attached to this response.
        </span>
        <Button disabled={!canSubmit || submitting} onClick={submit} style={{ height: 46, padding: '0 26px' }}>
          {submitting ? 'Submitting…' : 'Submit anonymously'}
          {!submitting && <Icon name="arrowRight" size={17} />}
        </Button>
      </div>

      <Toast show={toast} onDone={() => setToast(false)}>
        Your response has been recorded. Your identity was never stored.
      </Toast>
    </div>
  )
}
