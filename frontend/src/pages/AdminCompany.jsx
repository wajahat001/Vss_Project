import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'

function Toast({ show, children, onDone }) {
  React.useEffect(() => {
    if (show) { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }
  }, [show])
  if (!show) return null
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}
      className="animate-fade-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-card border border-mint/40 bg-white/[0.04] backdrop-blur-[12px] shadow-[0_14px_40px_rgba(0,0,0,0.5)]">
        <span className="w-6 h-6 rounded-full bg-mint/[0.16] grid place-items-center text-mint flex-shrink-0">
          <Icon name="check" size={15} stroke={2.6} />
        </span>
        <span className="text-sm text-text-0">{children}</span>
      </div>
    </div>
  )
}

export default function AdminCompany() {
  const [companyName, setCompanyName] = useState('')
  const [domain, setDomain] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [departments, setDepartments] = useState([])
  const [newDept, setNewDept] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Employee')
  const [inviteDept, setInviteDept] = useState('')
  const [invites, setInvites] = useState([])
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.companyId) {
      api.get(`/api/companies/${user.companyId}`)
        .then(res => {
          setCompanyName(res.data.name || '')
          setDraft(res.data.name || '')
          setDomain(res.data.domain || '')
          setDepartments(res.data.departments || [])
        })
        .catch(() => {})
    }
  }, [])

  async function saveCompany() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await api.patch(`/api/companies/${user.companyId}`, { name: draft, domain, departments })
      setCompanyName(draft); setEditing(false)
      setToast('Company profile saved')
    } catch { setError('Failed to save') }
  }

  function addDept() {
    const v = newDept.trim()
    if (v && !departments.includes(v)) { setDepartments(d => [...d, v]); setNewDept('') }
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return
    try {
      await api.post('/api/notifications/remind', { email: inviteEmail })
      setInvites(v => [{ id: 'i'+Date.now(), email: inviteEmail, role: inviteRole, dept: inviteDept || departments[0] || '', sent: 'just now' }, ...v])
      setInviteEmail('')
      setToast('Invitation sent to ' + inviteEmail)
    } catch { setError('Failed to send invite') }
  }

  return (
    <div className="space-y-5">
      {/* page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Company Settings</h1>
          <p className="text-text-1 text-sm mt-1.5">Manage your organization profile, departments, and team invitations.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold bg-violet/[0.12] text-violet-2 border border-violet/[0.28]">
          <Icon name="building" size={12} /> Admin
        </span>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      {/* company profile card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <span style={{
            width: 58, height: 58, borderRadius: 15, flexShrink: 0, display: 'grid', placeItems: 'center',
            background: 'linear-gradient(120deg,#6C63FF,#00D9A3)', color: '#0b0c12',
            boxShadow: '0 0 24px rgba(108,99,255,0.35)',
          }}>
            <Icon name="building" size={28} stroke={2} />
          </span>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                className="w-full max-w-[340px] h-[42px] px-3 bg-bg-2 border border-[#3a3d52] text-text-0 rounded-input text-lg font-semibold outline-none focus:border-violet focus:shadow-focus-violet"
                value={draft} autoFocus onChange={e => setDraft(e.target.value)} />
            ) : (
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-semibold tracking-tight">{companyName || 'Your Company'}</h2>
                <button onClick={() => { setDraft(companyName); setEditing(true) }}
                  className="text-text-2 hover:text-text-0 transition-colors p-1.5 rounded-[7px] hover:bg-white/[0.05]">
                  <Icon name="pencil" size={15} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {domain && (
                <span className="inline-flex items-center h-5 px-2 rounded-[6px] text-[11px] font-semibold bg-white/[0.06] text-text-1 gap-1">
                  <Icon name="mail" size={11} /> {domain}
                </span>
              )}
              <span className="inline-flex items-center h-5 px-2 rounded-[6px] text-[11px] font-semibold bg-grad text-[#0b0c12]">
                Pro plan
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Company name</span>
            <input value={editing ? draft : companyName} disabled={!editing}
              onChange={e => setDraft(e.target.value)}
              className="h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet disabled:opacity-70" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Primary domain</span>
            <input value={domain} disabled={!editing} onChange={e => setDomain(e.target.value)} placeholder="e.g. company.com"
              className="h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet disabled:opacity-70 placeholder-text-2" />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          {editing && (
            <button onClick={() => setEditing(false)}
              className="h-10 px-4 rounded-btn text-sm font-semibold text-text-1 hover:bg-white/[0.05] transition-colors">
              Cancel
            </button>
          )}
          <button onClick={editing ? saveCompany : () => setToast('No changes to save')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-btn text-sm font-semibold bg-grad text-[#0b0c12] shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01] transition-all">
            <Icon name="check" size={16} stroke={2.4} /> Save changes
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* departments */}
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-1">Departments</h3>
          <p className="text-text-1 text-[12.5px] mb-4">{departments.length} active · used to tag anonymous responses</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {departments.map(d => (
              <span key={d} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold bg-violet/[0.12] text-violet-2 border border-violet/[0.28]">
                {d}
                <button onClick={() => setDepartments(ds => ds.filter(x => x !== d))}
                  className="w-[18px] h-[18px] rounded-full grid place-items-center bg-white/[0.08] hover:bg-danger/25 hover:text-danger transition-colors">
                  <Icon name="x" size={11} stroke={2.6} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={newDept} onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDept())}
              placeholder="Add a department…"
              className="flex-1 h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet" />
            <button onClick={addDept}
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-btn text-sm font-semibold text-text-0 border border-violet/50 hover:bg-violet/10 hover:border-violet transition-all">
              <Icon name="plus" size={16} /> Add
            </button>
          </div>
        </Card>

        {/* invite */}
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-1">Invite teammates</h3>
          <p className="text-text-1 text-[12.5px] mb-4">They'll join your anonymous pulse program</p>
          <div className="space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Email address</span>
              <div className="relative">
                <Icon name="mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="name@company.io"
                  className="w-full h-11 pl-10 pr-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input text-sm outline-none transition-all focus:border-violet focus:shadow-focus-violet" />
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Role</span>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                  className="h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 rounded-input text-sm outline-none appearance-none transition-all focus:border-violet focus:shadow-focus-violet cursor-pointer">
                  <option>Employee</option><option>Manager</option><option>Admin</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">Department</span>
                <select value={inviteDept} onChange={e => setInviteDept(e.target.value)}
                  className="h-11 px-3.5 bg-bg-2 border border-[#3a3d52] text-text-0 rounded-input text-sm outline-none appearance-none transition-all focus:border-violet focus:shadow-focus-violet cursor-pointer">
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
            <button onClick={sendInvite} disabled={!inviteEmail.trim()}
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-btn text-sm font-semibold bg-grad text-[#0b0c12] shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01] transition-all disabled:opacity-55 disabled:cursor-not-allowed">
              <Icon name="userplus" size={16} /> Send invite
            </button>
          </div>
        </Card>
      </div>

      {/* pending invites table */}
      {invites.length > 0 && (
        <Card>
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <h3 className="text-base font-semibold">Pending invites</h3>
            <span className="inline-flex items-center h-5 px-2 rounded-[6px] text-[11px] font-semibold bg-white/[0.06] text-text-1">
              {invites.length} pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Email','Role','Department','Sent',''].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-text-1 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invites.map(inv => (
                  <tr key={inv.id} className="border-b border-border/60 last:border-0 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{inv.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold bg-white/[0.05] text-text-1 border border-white/[0.08]">
                        {inv.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold bg-violet/[0.12] text-violet-2 border border-violet/[0.28]">
                        {inv.dept}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-1 text-sm">{inv.sent}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setInvites(v => v.filter(i => i.id !== inv.id))}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-btn text-[13px] font-semibold bg-danger/[0.12] text-danger border border-danger/40 hover:bg-danger/20 transition-colors">
                        <Icon name="x" size={13} stroke={2.4} /> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Toast show={!!toast} onDone={() => setToast(null)}>{toast}</Toast>
    </div>
  )
}
