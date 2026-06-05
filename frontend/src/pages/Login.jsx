import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthToken } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setAuthToken(token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="relative h-screen grid place-items-center overflow-hidden px-6 bg-bg-0">
      {/* ambient orbs */}
      <div className="animate-orb absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[80px] bg-violet -top-32 -left-32 pointer-events-none" />
      <div className="animate-orb absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] bg-mint bottom-0 right-0 pointer-events-none" style={{ animationDelay: '-6s' }} />

      <div className="animate-fade-up relative z-10 w-full max-w-[420px] p-9 rounded-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px]">
        {/* brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-[9px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12] font-bold text-sm">P</div>
          <span className="font-semibold text-base tracking-tight">Pulse</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
        <p className="text-text-1 text-sm mb-7">Sign in to your workspace</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" block className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-text-1 mt-6">
          No account?{' '}
          <Link to="/signup" className="text-violet hover:text-violet-2 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
