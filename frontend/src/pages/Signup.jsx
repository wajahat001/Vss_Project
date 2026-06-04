import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'

const ROLES = ['employee', 'manager', 'admin']

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'employee',
    companyId: '', department: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function change(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input
          name="name" value={form.name} onChange={change}
          placeholder="Full name" required
          className="w-full p-2 border rounded text-sm"
        />
        <input
          name="email" type="email" value={form.email} onChange={change}
          placeholder="Email" required
          className="w-full p-2 border rounded text-sm"
        />
        <input
          name="password" type="password" value={form.password} onChange={change}
          placeholder="Password" required minLength={6}
          className="w-full p-2 border rounded text-sm"
        />
        <select
          name="role" value={form.role} onChange={change}
          className="w-full p-2 border rounded text-sm text-gray-700"
        >
          {ROLES.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        <input
          name="companyId" value={form.companyId} onChange={change}
          placeholder="Company ID (optional)"
          className="w-full p-2 border rounded text-sm"
        />
        <input
          name="department" value={form.department} onChange={change}
          placeholder="Department (e.g. Engineering)"
          className="w-full p-2 border rounded text-sm"
        />
        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded text-sm font-medium"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-3 text-center">
        Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
      </p>
    </div>
  )
}
