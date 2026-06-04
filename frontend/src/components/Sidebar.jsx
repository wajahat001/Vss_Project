import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 text-sm rounded ${isActive ? 'bg-white text-blue-600 font-medium' : 'text-gray-600 hover:bg-white'}`
    }
  >
    {children}
  </NavLink>
)

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const role = user?.role || 'employee'
  const companyName = user?.companyId ? 'My Company' : 'Pulse'

  return (
    <aside className="w-56 bg-gray-100 border-r hidden md:flex flex-col">
      <div className="p-4 border-b">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Company</div>
        <div className="font-semibold text-gray-800 truncate">{companyName}</div>
        {user && (
          <div className="text-xs text-gray-500 mt-0.5 capitalize">{role}</div>
        )}
      </div>
      <nav className="p-2 flex-1">
        {/* all roles */}
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/survey">Survey</NavItem>
        <NavItem to="/history">History</NavItem>

        {/* manager + admin */}
        {(role === 'manager' || role === 'admin') && (
          <>
            <NavItem to="/kanban">Kanban</NavItem>
            <NavItem to="/reports">Reports</NavItem>
          </>
        )}

        {/* admin only */}
        {role === 'admin' && (
          <NavItem to="/admin/company">Admin</NavItem>
        )}
      </nav>
    </aside>
  )
}
