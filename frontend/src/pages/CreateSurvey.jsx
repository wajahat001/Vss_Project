import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function CreateSurvey() {
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [questions, setQuestions] = useState([{ text: '' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function addQuestion() {
    setQuestions(q => [...q, { text: '' }])
  }

  function removeQuestion(idx) {
    setQuestions(q => q.filter((_, i) => i !== idx))
  }

  function updateQuestion(idx, value) {
    setQuestions(q => q.map((item, i) => i === idx ? { text: value } : item))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const filled = questions.filter(q => q.text.trim())
    if (filled.length === 0) {
      setError('Add at least one question.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/surveys/create', {
        title,
        frequency,
        questions: filled,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Survey</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={submit} className="space-y-6">
        {/* title */}
        <div className="bg-white rounded-lg shadow p-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Survey Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Weekly Pulse Check"
            required
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            className="w-full border rounded p-2 text-sm text-gray-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* questions */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-700">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-sm text-gray-400 mt-2 w-5 shrink-0">{idx + 1}.</span>
                <input
                  value={q.text}
                  onChange={e => updateQuestion(idx, e.target.value)}
                  placeholder="Type your question here…"
                  className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="text-red-400 hover:text-red-600 mt-2 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded font-medium text-sm"
        >
          {loading ? 'Creating…' : 'Create & Activate Survey'}
        </button>
      </form>
    </div>
  )
}
