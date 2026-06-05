import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthToken } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const ROLES = ['employee', 'manager', 'admin']

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department: '' })
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
      if (form.role === 'admin') {
        const loginRes = await api.post('/api/auth/login', { email: form.email, password: form.password })
        const { token, user } = loginRes.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setAuthToken(token)
        navigate('/create-company')
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen grid place-items-center overflow-hidden px-6 bg-bg-0">
      <div className="animate-orb absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[80px] bg-violet -top-32 -right-32 pointer-events-none" />
      <div className="animate-orb absolute w-[350px] h-[350px] rounded-full opacity-20 blur-[80px] bg-mint bottom-0 left-0 pointer-events-none" style={{ animationDelay: '-9s' }} />

      <div className="animate-fade-up relative z-10 w-full max-w-[420px] p-9 rounded-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-[9px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12] font-bold text-sm">P</div>
          <span className="font-semibold text-base tracking-tight">Pulse</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-1">Create account</h1>
        <p className="text-text-1 text-sm mb-7">Join your team on Pulse</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Input label="Full name" name="name" value={form.name} onChange={change} placeholder="Jane Smith" required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={change} placeholder="you@company.com" required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={change} placeholder="••••••••" required minLength={6} />
          <Select label="Role" name="role" value={form.role} onChange={change}>
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </Select>
          <Input label="Department" name="department" value={form.department} onChange={change} placeholder="e.g. Engineering" />
          <Button type="submit" disabled={loading} block className="mt-2">
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-1 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet hover:text-violet-2 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
