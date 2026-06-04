import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Pulse</h2>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Dashboard</Link>
            <Link to="/kanban" className="hover:text-gray-900">Kanban</Link>
            <Link to="/reports" className="hover:text-gray-900">Reports</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-blue-600">Sign in</Link>
        </div>
      </div>
    </header>
  )
}
