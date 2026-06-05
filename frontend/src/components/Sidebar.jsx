import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { setAuthToken } from '../lib/api'

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  survey:    'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z M9 12h6 M9 16h4',
  history:   'M12 8v4l3 3 M3.05 11a9 9 0 1 0 .5-3',
  create:    'M12 5v14 M5 12h14',
  kanban:    'M3 3h6v18H3z M15 3h6v10h-6z',
  reports:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  admin:     'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
}

function NavItem({ to, iconKey, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => [
        'relative flex items-center gap-3 h-[42px] px-3 rounded-[9px] font-medium text-sm transition-all duration-200',
        isActive
          ? 'nav-link-active bg-violet/[0.12] text-text-0'
          : 'text-text-1 hover:bg-white/[0.04] hover:text-text-0',
      ].join(' ')}
    >
      <Icon d={ICONS[iconKey]} />
      {label}
    </NavLink>
  )
}

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full grid place-items-center bg-grad text-[#0b0c12] font-semibold text-sm flex-shrink-0">
      {initials}
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const role = user?.role || 'employee'

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <aside className={[
      'flex flex-col w-[240px] flex-shrink-0 bg-bg-1 border-r border-border py-4 px-3 gap-1',
      'lg:relative lg:translate-x-0',
      'fixed top-[64px] bottom-0 left-0 z-50 transition-transform duration-[250ms] ease-out',
      open ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0',
    ].join(' ')}>

      {/* company label */}
      <div className="px-3 pb-3 mb-1 border-b border-border">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-2 mb-0.5">Workspace</p>
        <p className="text-sm font-semibold text-text-0 truncate">{user?.companyId ? 'My Company' : 'Pulse'}</p>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto" onClick={onClose}>
        <NavItem to="/dashboard" iconKey="dashboard" label="Dashboard" />

        {/* Survey + History — employees only */}
        {role === 'employee' && (
          <>
            <NavItem to="/survey"  iconKey="survey"  label="Survey" />
            <NavItem to="/history" iconKey="history" label="History" />
          </>
        )}

        {/* Manager + Admin tools */}
        {(role === 'manager' || role === 'admin') && (
          <>
            <div className="mx-3 my-2 h-px bg-border" />
            <NavItem to="/create-survey" iconKey="create"  label="Create Survey" />
            <NavItem to="/kanban"        iconKey="kanban"  label="Kanban" />
            <NavItem to="/reports"       iconKey="reports" label="Reports" />
          </>
        )}

        {role === 'admin' && (
          <NavItem to="/admin/company" iconKey="admin" label="Admin" />
        )}
      </nav>

      {/* user card pinned to bottom */}
      {user && (
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[9px] hover:bg-white/[0.04] transition-colors group">
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-0 truncate">{user.name}</p>
              <p className="text-[11px] text-text-2 uppercase tracking-[0.07em]">{role}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-text-2 hover:text-danger"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
