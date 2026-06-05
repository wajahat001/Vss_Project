import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
    <div className="relative h-screen grid place-items-center overflow-hidden px-6 bg-bg-0">
      <div className="animate-orb absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[80px] bg-violet -top-32 -left-32 pointer-events-none" />
      <div className="animate-orb absolute w-[350px] h-[350px] rounded-full opacity-20 blur-[80px] bg-mint bottom-0 right-0 pointer-events-none" style={{ animationDelay: '-7s' }} />

      <div className="animate-fade-up relative z-10 w-full max-w-[440px] p-9 rounded-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-[9px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12] font-bold text-sm">P</div>
          <span className="font-semibold text-base tracking-tight">Pulse</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-1">Set up your company</h1>
        <p className="text-text-1 text-sm mb-7">Create your company profile to get started with Pulse.</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Input label="Company Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Corp" required />
          <Input
            label={<span>Domain <span className="text-text-2 normal-case font-normal">(optional)</span></span>}
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="e.g. acme.com"
          />
          <Button type="submit" disabled={loading} block className="mt-2">
            {loading ? 'Creating…' : 'Create Company'}
          </Button>
        </form>

        <div className="mt-5 px-4 py-3 rounded-input bg-violet/[0.08] border border-violet/20 text-text-1 text-xs leading-relaxed">
          After creating your company, share the Company ID with employees so they can join.
        </div>
      </div>
    </div>
  )
}
