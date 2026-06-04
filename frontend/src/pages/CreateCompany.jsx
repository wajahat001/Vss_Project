import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../lib/api'

export default function CreateCompany() {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/companies', { name, domain })
      const company = res.data
      // update localStorage user with new companyId
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.companyId = company._id
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create company')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Set up your company</h1>
        <p className="text-sm text-gray-500 mb-6">Create your company profile to get started.</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              required
              className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain <span className="text-gray-400">(optional)</span></label>
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. acme.com"
              className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded font-medium text-sm"
          >
            {loading ? 'Creating…' : 'Create Company'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
          After creating your company, share the Company ID with employees so they can join.
        </div>
      </div>
    </div>
  )
}
