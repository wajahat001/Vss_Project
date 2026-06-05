import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthToken } from '../lib/api'
import Icon from '../components/ui/Icon'

function Orbs() {
  return (
    <>
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 420, height: 420, background: '#6C63FF', top: '-12%', left: '-6%', filter: 'blur(60px)', opacity: 0.5, animationDelay: '0s' }} />
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, background: '#00D9A3', bottom: '-14%', right: '-8%', filter: 'blur(60px)', opacity: 0.42, animationDelay: '-6s' }} />
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, background: '#8B83FF', top: '40%', right: '18%', filter: 'blur(60px)', opacity: 0.32, animationDelay: '-11s' }} />
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, background: '#00D9A3', bottom: '18%', left: '14%', filter: 'blur(60px)', opacity: 0.3, animationDelay: '-3s' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(15,17,23,0) 0%, rgba(15,17,23,0.55) 70%, rgba(15,17,23,0.9) 100%)' }} />
    </>
  )
}

function PasswordInput({ value, onChange, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Icon name="lock" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 pl-10 pr-10 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]"
      />
      <button type="button" onClick={() => setShow(s => !s)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-[6px] text-text-2 hover:text-text-0 transition-colors"
        style={{ background: 'none', border: 'none' }}>
        <Icon name={show ? 'eyeoff' : 'search'} size={16} />
      </button>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setAuthToken(token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen grid place-items-center overflow-hidden px-6 bg-bg-0">
      <Orbs />

      <div className="animate-fade-up relative z-10 w-full max-w-[420px]">
        <div className="rounded-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px] p-9">
          {/* logo */}
          <div className="flex flex-col items-center gap-3.5 mb-6">
            <span className="w-14 h-14 rounded-[15px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12]">
              <Icon name="shieldCheck" size={30} stroke={2.2} />
            </span>
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-tight">PulseCheck</div>
            </div>
          </div>
          <p className="text-text-1 text-center text-[14.5px] mb-6">Your voice. Completely anonymous.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* email */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Work email</span>
              <div className="relative">
                <Icon name="mail" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="w-full h-11 pl-10 pr-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]" />
              </div>
            </label>

            {/* password */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Password</span>
              <PasswordInput value={password} onChange={setPassword} />
            </label>

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-[46px] rounded-btn font-semibold text-sm mt-1 bg-grad text-[#0b0c12] shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01] transition-all active:scale-[0.985] disabled:opacity-55 disabled:cursor-not-allowed">
              {loading ? 'Signing in…' : <>Sign in <Icon name="arrowRight" size={17} /></>}
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
              <Icon name="lock" size={13} /> Your identity is never stored
            </span>
          </div>

          <p className="text-center text-[13.5px] text-text-1 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-2 font-semibold hover:text-violet transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
