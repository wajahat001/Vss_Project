import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from '../lib/api'

export default function Header() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-blue-600">Pulse</h2>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-600">
            <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <Link to="/kanban" className="hover:text-gray-900">Kanban</Link>
            <Link to="/reports" className="hover:text-gray-900">Reports</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.name} <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded capitalize">{user.role}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
