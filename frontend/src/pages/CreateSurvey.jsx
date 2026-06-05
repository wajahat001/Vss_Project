import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'

const TYPE_LABELS = {
  text:   { label: 'Text',          icon: 'clipboard', hint: 'Open-ended written answer' },
  rating: { label: 'Star Rating',   icon: 'star',      hint: '1–5 stars' },
  mcq:    { label: 'Multiple Choice', icon: 'check',   hint: 'Pick one option' },
}

function QuestionCard({ q, idx, total, onChange, onRemove }) {
  function setField(field, value) { onChange({ ...q, [field]: value }) }

  function addOption() {
    const opts = [...(q.options || []), '']
    setField('options', opts)
  }
  function updateOption(i, value) {
    const opts = [...(q.options || [])]
    opts[i] = value
    setField('options', opts)
  }
  function removeOption(i) {
    const opts = (q.options || []).filter((_, idx) => idx !== i)
    setField('options', opts)
  }

  return (
    <Card className="p-5 space-y-4">
      {/* question header row */}
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-[8px] grid place-items-center bg-violet/[0.14] text-violet-2 text-[13px] font-semibold flex-shrink-0 mt-0.5">
          {idx + 1}
        </span>
        <div className="flex-1 space-y-3">
          {/* question text */}
          <input
            value={q.text}
            onChange={e => setField('text', e.target.value)}
            placeholder="Type your question here…"
            className="w-full h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]"
          />

          {/* type selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-2">Type:</span>
            {Object.entries(TYPE_LABELS).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => setField('type', key)}
                className={[
                  'inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[12px] font-semibold border transition-all',
                  q.type === key
                    ? 'bg-violet/[0.18] text-violet-2 border-violet/50'
                    : 'bg-white/[0.04] text-text-1 border-white/[0.08] hover:border-violet/30 hover:text-text-0',
                ].join(' ')}
              >
                <Icon name={meta.icon} size={12} stroke={2} />
                {meta.label}
              </button>
            ))}
            <span className="text-[11px] text-text-2 ml-1">{TYPE_LABELS[q.type]?.hint}</span>
          </div>

          {/* MCQ options */}
          {q.type === 'mcq' && (
            <div className="space-y-2 pl-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1 mb-2">Options</p>
              {(q.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                  <input
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 h-9 px-3 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet"
                  />
                  {(q.options || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-text-2 hover:text-danger transition-colors flex-shrink-0"
                    >
                      <Icon name="x" size={14} stroke={2.4} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet hover:text-violet-2 transition-colors mt-1"
              >
                <Icon name="plus" size={13} /> Add option
              </button>
            </div>
          )}
        </div>

        {/* remove question */}
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-text-2 hover:text-danger transition-colors flex-shrink-0 mt-0.5"
            aria-label="Remove question"
          >
            <Icon name="x" size={16} stroke={2} />
          </button>
        )}
      </div>
    </Card>
  )
}

export default function CreateSurvey() {
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [questions, setQuestions] = useState([{ text: '', type: 'text', options: [] }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function addQuestion() {
    setQuestions(q => [...q, { text: '', type: 'text', options: [] }])
  }

  function updateQuestion(idx, updated) {
    setQuestions(q => q.map((item, i) => i === idx ? updated : item))
  }

  function removeQuestion(idx) {
    setQuestions(q => q.filter((_, i) => i !== idx))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const filled = questions.filter(q => q.text.trim())
    if (filled.length === 0) { setError('Add at least one question.'); return }

    // validate MCQ has at least 2 options
    for (const q of filled) {
      if (q.type === 'mcq') {
        const validOpts = (q.options || []).filter(o => o.trim())
        if (validOpts.length < 2) {
          setError(`"${q.text}" needs at least 2 options.`); return
        }
      }
    }

    setLoading(true)
    try {
      const payload = filled.map(q => ({
        text: q.text,
        type: q.type || 'text',
        options: q.type === 'mcq' ? (q.options || []).filter(o => o.trim()) : [],
      }))
      await api.post('/api/surveys/create', { title, frequency, questions: payload })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[26px] font-semibold tracking-tight text-text-0 mb-1">Create Survey</h1>
      <p className="text-text-1 text-sm mb-6">Build and activate a new survey for your team.</p>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* survey meta */}
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

        {/* questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">
              Questions ({questions.length})
            </span>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet hover:text-violet-2 transition-colors"
            >
              <Icon name="plus" size={15} /> Add question
            </button>
          </div>

          {questions.map((q, idx) => (
            <QuestionCard
              key={idx}
              q={q}
              idx={idx}
              total={questions.length}
              onChange={updated => updateQuestion(idx, updated)}
              onRemove={() => removeQuestion(idx)}
            />
          ))}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create & Activate Survey'}
          {!loading && <Icon name="arrowRight" size={17} />}
        </Button>
      </form>
    </div>
  )
}
