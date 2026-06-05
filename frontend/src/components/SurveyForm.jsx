import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'

export default function SurveyForm() {
  const [survey, setSurvey] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/surveys/active')
      .then(res => setSurvey(res.data))
      .catch(() => setError('Failed to load survey'))
      .finally(() => setLoading(false))
  }, [])

  function setAnswer(qid, value) {
    setAnswers(a => ({ ...a, [qid]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!survey) return
    setSubmitting(true)
    setError('')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const payload = {
      surveyId: survey._id,
      department: user?.department || '',
      answers: Object.keys(answers).map(k => ({ questionId: k, answer: answers[k] })),
    }
    try {
      await api.post('/api/responses/submit', payload)
      setSubmitted(true)
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
    <Card className="p-10 text-center">
      <div className="w-12 h-12 rounded-full bg-mint/10 border border-mint/30 grid place-items-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D9A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-text-0 mb-1">Thank you!</p>
      <p className="text-sm text-text-1 mb-6">Your anonymous response has been recorded.</p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.12] border border-mint/25 text-mint text-xs font-semibold">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
        Fully anonymous
      </div>
      <div className="mt-6">
        <Button variant="secondary" onClick={() => setSubmitted(false)}>Submit another response</Button>
      </div>
    </Card>
  )

  return (
    <form onSubmit={submit} className="space-y-5">
      <Card className="p-6">
        <h3 className="text-lg font-semibold tracking-tight text-text-0 mb-1">{survey.title}</h3>
        <p className="text-sm text-text-1">All responses are anonymous.</p>
      </Card>

      {error && (
        <div className="px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      <div className="space-y-4">
        {survey.questions?.map((q, idx) => (
          <Card key={q.id || idx} className="p-5">
            <Input
              label={`${idx + 1}. ${q.text || q.question}`}
              value={answers[q.id || idx] || ''}
              onChange={e => setAnswer(q.id || idx, e.target.value)}
              placeholder="Your answer…"
              required
            />
          </Card>
        ))}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit response'}
      </Button>
    </form>
  )
}
