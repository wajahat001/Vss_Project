import React, { useEffect, useState } from 'react'
import api from '../lib/api'

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
      answers: Object.keys(answers).map(k => ({ questionId: k, answer: answers[k] }))
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

  if (loading) return <div className="p-4 bg-white rounded shadow text-gray-500">Loading survey…</div>
  if (!survey) return <div className="p-4 bg-white rounded shadow text-gray-500">No active survey at the moment.</div>

  if (submitted) return (
    <div className="p-6 bg-white rounded shadow text-center">
      <p className="text-green-600 font-semibold text-lg">Thank you!</p>
      <p className="text-sm text-gray-500 mt-1">Your anonymous response has been recorded.</p>
      <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-blue-600 hover:underline">
        Submit another response
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold">{survey.title}</h3>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="space-y-4">
        {survey.questions?.map((q, idx) => (
          <div key={q.id || idx}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {q.text || q.question}
            </label>
            <input
              required
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={answers[q.id || idx] || ''}
              onChange={e => setAnswer(q.id || idx, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium"
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
