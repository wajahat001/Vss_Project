import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../lib/api'

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-[34px] h-[34px] rounded-full grid place-items-center bg-grad text-[#0b0c12] font-semibold text-[13px] flex-shrink-0 cursor-pointer select-none">
      {initials}
    </div>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  )
}

export default function Navbar({ onHamburger }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <header className="h-[64px] flex-shrink-0 flex items-center gap-4 px-5 border-b border-border bg-bg-0/70 backdrop-blur-[14px] z-40 relative">
      {/* hamburger — mobile only */}
      <button
        onClick={onHamburger}
        className="lg:hidden inline-grid place-items-center w-9 h-9 rounded-btn text-text-1 hover:bg-white/5 hover:text-text-0 transition-colors"
        aria-label="Toggle sidebar"
      >
        <HamburgerIcon />
      </button>

      {/* brand */}
      <div className="flex items-center gap-2.5 font-semibold text-base tracking-tight">
        <div className="w-8 h-8 rounded-[9px] grid place-items-center bg-grad shadow-glow-violet text-[#0b0c12] font-bold text-sm">P</div>
        <span className="hidden sm:block">Pulse</span>
      </div>

      <div className="flex-1" />

      {/* right side */}
      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="hidden sm:block text-sm text-text-1">{user.name}</span>
            <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.09em] text-text-2 bg-white/[0.06] px-2 py-0.5 rounded-[6px]">{user.role}</span>
            <Avatar name={user.name} />
          </button>

          {menuOpen && (
            <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 min-w-[190px] bg-bg-2 border border-white/[0.08] rounded-[12px] shadow-menu p-1.5 z-60">
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="text-sm font-semibold text-text-0 truncate">{user.name}</p>
                <p className="text-[11px] text-text-2 truncate mt-0.5">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
