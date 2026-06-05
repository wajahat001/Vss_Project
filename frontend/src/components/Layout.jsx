import React, { useState } from 'react'
import Navbar from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-0">
      <Navbar onHamburger={() => setSidebarOpen(o => !o)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* scrim */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-[64px] bg-black/50 z-[45] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 min-w-0 overflow-y-auto px-6 py-8 md:px-9 md:py-8">
          <div className="max-w-[1180px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
