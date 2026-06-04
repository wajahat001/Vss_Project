import React from 'react'
import { NavLink } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <NavLink to={to} className={({isActive}) => `block px-4 py-2 text-sm ${isActive? 'bg-white text-gray-900':'text-gray-600 hover:bg-white'}`}>
    {children}
  </NavLink>
)

export default function Sidebar(){
  return (
    <aside className="w-56 bg-gray-100 border-r hidden md:block">
      <div className="p-4 border-b">
        <div className="text-sm text-gray-500">Company</div>
        <div className="font-semibold">Acme Corp</div>
      </div>
      <nav className="p-2">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/kanban">Kanban</NavItem>
        <NavItem to="/reports">Reports</NavItem>
        <NavItem to="/survey">Survey</NavItem>
        <NavItem to="/history">History</NavItem>
        <NavItem to="/admin/company">Admin</NavItem>
      </nav>
    </aside>
  )
}
