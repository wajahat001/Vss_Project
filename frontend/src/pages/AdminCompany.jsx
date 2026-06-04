import React, { useEffect, useState } from 'react'
import api from '../lib/api'

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
    } catch {
      flash('Failed to save company profile.', true)
    }
  }

  function addDepartment() {
    const trimmed = newDept.trim()
    if (!trimmed || departments.includes(trimmed)) return
    setDepartments([...departments, trimmed])
    setNewDept('')
  }

  function removeDepartment(dept) {
    setDepartments(departments.filter(d => d !== dept))
  }

  async function sendInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    try {
      await api.post('/api/notifications/remind', { email: inviteEmail })
      flash(`Invite sent to ${inviteEmail}.`)
      setInviteEmail('')
    } catch {
      flash('Failed to send invite.', true)
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>

      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error  && <p className="text-red-600 text-sm">{error}</p>}

      <section className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
        <form onSubmit={saveCompany} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Company Name</label>
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Domain</label>
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. acme.com"
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
            Save
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Departments</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={newDept}
            onChange={e => setNewDept(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDepartment())}
            placeholder="New department name"
            className="flex-1 border rounded p-2 text-sm"
          />
          <button
            onClick={addDepartment}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm"
          >
            Add
          </button>
        </div>
        {departments.length === 0 && (
          <p className="text-sm text-gray-400 italic">No departments yet.</p>
        )}
        <ul className="space-y-2">
          {departments.map(dept => (
            <li key={dept} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm">
              <span>{dept}</span>
              <button
                onClick={() => removeDepartment(dept)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Invite Employee</h2>
        <form onSubmit={sendInvite} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="employee@company.com"
            required
            className="flex-1 border rounded p-2 text-sm"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
            Send Invite
          </button>
        </form>
      </section>
    </div>
  )
}
