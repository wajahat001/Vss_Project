import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

export default function AdminCompany() {
  const [companyName, setCompanyName] = useState('')
  const [domain, setDomain] = useState('')
  const [departments, setDepartments] = useState([])
  const [newDept, setNewDept] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.companyId) {
      api.get(`/api/companies/${user.companyId}`)
        .then(res => {
          setCompanyName(res.data.name || '')
          setDomain(res.data.domain || '')
          setDepartments(res.data.departments || [])
        })
        .catch(() => {})
    }
  }, [])

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setStatus('') }
    else { setStatus(msg); setError('') }
    setTimeout(() => { setStatus(''); setError('') }, 3000)
  }

  async function saveCompany(e) {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await api.patch(`/api/companies/${user.companyId}`, { name: companyName, domain, departments })
      flash('Company profile saved.')
    } catch { flash('Failed to save company profile.', true) }
  }

  function addDepartment() {
    const trimmed = newDept.trim()
    if (!trimmed || departments.includes(trimmed)) return
    setDepartments([...departments, trimmed])
    setNewDept('')
  }

  async function sendInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    try {
      await api.post('/api/notifications/remind', { email: inviteEmail })
      flash(`Invite sent to ${inviteEmail}.`)
      setInviteEmail('')
    } catch { flash('Failed to send invite.', true) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-0">Company Settings</h1>
        <p className="text-text-1 text-sm mt-1">Manage your workspace, departments and invitations.</p>
      </div>

      {status && (
        <div className="px-4 py-3 rounded-input bg-mint/10 border border-mint/30 text-mint text-sm">{status}</div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      {/* Company Profile */}
      <Card className="p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Company Profile</h2>
        <form onSubmit={saveCompany} className="space-y-4">
          <Input label="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
          <Input label="Domain" value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. acme.com" />
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      {/* Departments */}
      <Card className="p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Departments</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDepartment())}
              placeholder="New department name"
            />
          </div>
          <Button variant="secondary" type="button" onClick={addDepartment}>Add</Button>
        </div>
        {departments.length === 0 ? (
          <p className="text-sm text-text-2 italic">No departments yet.</p>
        ) : (
          <ul className="space-y-2">
            {departments.map(dept => (
              <li key={dept} className="flex items-center justify-between px-3 py-2.5 rounded-input bg-white/[0.03] border border-border">
                <span className="text-sm text-text-0">{dept}</span>
                <button
                  onClick={() => setDepartments(departments.filter(d => d !== dept))}
                  className="text-text-2 hover:text-danger transition-colors"
                  aria-label={`Remove ${dept}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Invite */}
      <Card className="p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Invite Employee</h2>
        <form onSubmit={sendInvite} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="employee@company.com"
              required
            />
          </div>
          <Button type="submit">Send Invite</Button>
        </form>
      </Card>
    </div>
  )
}
