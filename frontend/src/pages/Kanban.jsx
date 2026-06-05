import React from 'react'
import KanbanBoard from '../components/KanbanBoard'

export default function Kanban() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-text-0 mb-1">Feedback Kanban</h1>
      <p className="text-text-1 text-sm mb-6">Responses grouped by sentiment score.</p>
      <KanbanBoard />
    </div>
  )
}
