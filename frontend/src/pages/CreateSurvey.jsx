import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'

export default function CreateSurvey() {
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [questions, setQuestions] = useState([{ text: '' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function addQuestion() { setQuestions(q => [...q, { text: '' }]) }
  function removeQuestion(idx) { setQuestions(q => q.filter((_, i) => i !== idx)) }
  function updateQuestion(idx, value) { setQuestions(q => q.map((item, i) => i === idx ? { text: value } : item)) }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const filled = questions.filter(q => q.text.trim())
    if (filled.length === 0) { setError('Add at least one question.'); return }
    setLoading(true)
    try {
      await api.post('/api/surveys/create', { title, frequency, questions: filled })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-text-0 mb-1">Create Survey</h1>
      <p className="text-text-1 text-sm mb-6">Build and activate a new survey for your team.</p>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <Card className="p-5 space-y-4">
          <Input
            label="Survey Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Weekly Pulse Check"
            required
          />
          <Select label="Frequency" value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="text-sm text-violet hover:text-violet-2 font-semibold transition-colors"
            >
              + Add question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-sm text-text-2 mt-[11px] w-5 shrink-0 font-medium">{idx + 1}.</span>
                <div className="flex-1">
                  <Input
                    value={q.text}
                    onChange={e => updateQuestion(idx, e.target.value)}
                    placeholder="Type your question here…"
                  />
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="mt-[11px] text-text-2 hover:text-danger transition-colors"
                    aria-label="Remove question"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create & Activate Survey'}
        </Button>
      </form>
    </div>
  )
}
