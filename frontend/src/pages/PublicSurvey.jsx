import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Icon from '../components/ui/Icon'
import Card from '../components/ui/Card'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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

export default function PublicSurvey() {
  const { token } = useParams()
  const [survey, setSurvey] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/api/surveys/public/${token}`)
      .then(res => setSurvey(res.data))
      .catch(() => setError('Survey not found or no longer active.'))
      .finally(() => setLoading(false))
  }, [token])

  function setAnswer(qid, value) { setAnswers(a => ({ ...a, [qid]: value })) }

  const questions = survey?.questions || []
  const answeredCount = questions.filter((q, i) => answers[String(q.id || q._id || i)]).length
  const pct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0
  const canSubmit = answeredCount === questions.length && questions.length > 0

  async function submit(e) {
    e.preventDefault()
    if (!survey) return
    setSubmitting(true); setError('')
    try {
      const answersArr = Object.keys(answers).map(k => ({ questionId: k, answer: String(answers[k]) }))
      await axios.post(`${API}/api/surveys/public/${token}/respond`, {
        answers: answersArr,
        department: 'External',
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-bg-0 grid place-items-center">
      <span className="text-text-1">Loading survey…</span>
    </div>
  )

  if (error && !survey) return (
    <div className="min-h-screen bg-bg-0 grid place-items-center px-6">
      <div className="text-center max-w-sm">
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', display: 'grid', placeItems: 'center' }}>
          <Icon name="x" size={32} style={{ color: '#FF6B6B' }} />
        </div>
        <h2 className="text-xl font-semibold text-text-0 mb-2">Survey Unavailable</h2>
        <p className="text-text-1 text-sm">{error}</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-bg-0 grid place-items-center px-6">
      <div className="max-w-[560px] text-center animate-fade-up">
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto 24px', background: 'radial-gradient(circle, rgba(0,217,163,0.22), rgba(0,217,163,0.04))', border: '1px solid rgba(0,217,163,0.4)', display: 'grid', placeItems: 'center', boxShadow: '0 0 40px rgba(0,217,163,0.25)' }}>
          <Icon name="shieldCheck" size={40} stroke={2} style={{ color: '#00D9A3' }} />
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-text-0 mb-3">Response recorded!</h1>
        <p className="text-text-1 text-[15px] leading-relaxed">
          Your identity was never stored. Responses are aggregated anonymously before anyone sees them.
        </p>
        <div className="flex justify-center mt-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
            <Icon name="lock" size={13} /> Submitted anonymously
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-bg-0 px-4 py-10" style={{ minHeight: '100vh', overflowY: 'auto', position: 'fixed', inset: 0, overflowX: 'hidden' }}>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* branding */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-9 h-9 rounded-[10px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12]">
            <Icon name="shieldCheck" size={20} stroke={2.2} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-text-0">PulseCheck</span>
        </div>

        {/* header */}
        <div className="mb-2">
          <h1 className="text-[26px] font-semibold tracking-tight text-text-0">{survey.title}</h1>
          <p className="text-text-1 text-sm mt-1">Responses are 100% anonymous. Answer honestly.</p>
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
              <Icon name="lock" size={13} /> Your identity is never stored
            </span>
          </div>
        </div>

        {/* progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Progress</span>
            <span className="text-sm font-semibold text-text-0">{answeredCount} / {questions.length} answered</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <span className="block h-full rounded-full bg-grad transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ width: `${pct}%` }} />
          </div>
        </Card>

        {error && (
          <div className="px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
        )}

        {/* questions */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const qid = String(q.id || q._id || idx)
            const done = !!answers[qid]
            return (
              <Card key={qid} hoverable className="p-5 animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex gap-3 items-start mb-4">
                  <span style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, background: done ? 'rgba(0,217,163,0.16)' : 'rgba(108,99,255,0.14)', color: done ? '#00D9A3' : '#8B83FF', transition: 'all .2s' }}>
                    {done ? <Icon name="check" size={15} stroke={3} /> : idx + 1}
                  </span>
                  <span className="text-[15.5px] font-semibold text-text-0">{q.text || q.question}</span>
                </div>
                <div className="pl-10">
                  {q.type === 'rating' ? (
                    <Stars value={answers[qid] || 0} onChange={v => setAnswer(qid, v)} />
                  ) : q.type === 'mcq' && q.options?.length > 0 ? (
                    <div className="space-y-2.5">
                      {q.options.map((opt, oi) => {
                        const selected = answers[qid] === opt
                        return (
                          <button key={oi} type="button" onClick={() => setAnswer(qid, opt)}
                            className={['w-full flex items-center gap-3 px-4 py-3 rounded-input border text-sm font-medium text-left transition-all', selected ? 'bg-violet/[0.14] border-violet/60 text-text-0' : 'bg-bg-2 border-[#3a3d52] text-text-1 hover:border-violet/30 hover:bg-white/[0.03] hover:text-text-0'].join(' ')}>
                            <span className={['w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center', selected ? 'border-violet bg-violet' : 'border-[#5D6178]'].join(' ')}>
                              {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <textarea
                      className="w-full bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input px-3.5 py-3 text-sm outline-none transition-all duration-200 focus:border-violet focus:shadow-focus-violet focus:bg-[#212640] resize-y min-h-[96px] leading-[1.55]"
                      placeholder="Your answer…"
                      value={answers[qid] || ''}
                      onChange={e => setAnswer(qid, e.target.value)}
                    />
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-10">
          <span className="flex items-center gap-2 text-text-1 text-sm text-center sm:text-left">
            <Icon name="lock" size={14} style={{ color: '#00D9A3' }} />
            No names, emails, or device info attached.
          </span>
          <button
            disabled={!canSubmit || submitting}
            onClick={submit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[46px] px-7 rounded-btn font-semibold text-sm bg-grad text-[#0b0c12] shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01] transition-all active:scale-[0.985] disabled:opacity-55 disabled:cursor-not-allowed">
            {submitting ? 'Submitting…' : <>Submit anonymously <Icon name="arrowRight" size={17} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
