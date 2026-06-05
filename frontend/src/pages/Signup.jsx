import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthToken } from '../lib/api'
import Icon from '../components/ui/Icon'

function Orbs() {
  return (
    <>
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 420, height: 420, background: '#6C63FF', top: '-12%', right: '-6%', filter: 'blur(60px)', opacity: 0.45, animationDelay: '0s' }} />
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 340, height: 340, background: '#00D9A3', bottom: '-10%', left: '-8%', filter: 'blur(60px)', opacity: 0.38, animationDelay: '-9s' }} />
      <div className="animate-orb absolute rounded-full pointer-events-none" style={{ width: 220, height: 220, background: '#8B83FF', top: '35%', left: '20%', filter: 'blur(60px)', opacity: 0.28, animationDelay: '-5s' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(15,17,23,0) 0%, rgba(15,17,23,0.55) 70%, rgba(15,17,23,0.9) 100%)' }} />
    </>
  )
}

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin', department: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.post('/api/auth/register', form)
      if (form.role === 'admin') {
        const loginRes = await api.post('/api/auth/login', { email: form.email, password: form.password })
        const { token, user } = loginRes.data
        localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user))
        setAuthToken(token); navigate('/create-company')
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  const inputCls = "w-full h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]"
  const labelCls = "text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1"

  return (
    <div className="relative min-h-screen grid place-items-center overflow-hidden px-6 py-8 bg-bg-0">
      <Orbs />

      <div className="animate-fade-up relative z-10 w-full max-w-[460px]">
        <div className="rounded-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px] p-9">
          {/* logo */}
          <div className="flex flex-col items-center gap-3 mb-5">
            <span className="w-12 h-12 rounded-[13px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12]">
              <Icon name="shieldCheck" size={26} stroke={2.2} />
            </span>
            <div className="text-2xl font-semibold tracking-tight">PulseCheck</div>
          </div>
          <p className="text-text-1 text-center text-sm mb-5">Create your workspace account.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-3.5">
            {/* full name */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Full name</span>
              <div className="relative">
                <Icon name="user" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
                <input name="name" value={form.name} onChange={change} placeholder="Jordan Rivera" required
                  className={inputCls.replace('px-3.5', 'pl-10 pr-3.5')} />
              </div>
            </label>

            {/* email */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Work email</span>
              <div className="relative">
                <Icon name="mail" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
                <input name="email" type="email" value={form.email} onChange={change} placeholder="you@company.com" required
                  className={inputCls.replace('px-3.5', 'pl-10 pr-3.5')} />
              </div>
            </label>

            {/* password */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Password</span>
              <input name="password" type="password" value={form.password} onChange={change}
                placeholder="Create a password" required minLength={6} className={inputCls} />
            </label>


            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-[46px] rounded-btn font-semibold text-sm mt-2 bg-grad text-[#0b0c12] shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01] transition-all active:scale-[0.985] disabled:opacity-55 disabled:cursor-not-allowed">
              {loading ? 'Creating…' : <>Create account <Icon name="arrowRight" size={17} /></>}
            </button>
          </form>

          <p className="text-center text-[13.5px] text-text-1 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-2 font-semibold hover:text-violet transition-colors">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
