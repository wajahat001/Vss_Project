import React from 'react'

export default function KanbanBoard(){
  const columns = [
    { id: 'ideas', title: 'Ideas', items: ['Improve onboarding','More team events'] },
    { id: 'in-progress', title: 'In Progress', items: ['Address feedback loop'] },
    { id: 'done', title: 'Done', items: ['Survey v1 sent'] }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(col => (
        <div key={col.id} className="bg-white p-3 rounded shadow">
          <h4 className="font-semibold mb-2">{col.title}</h4>
          <ul className="space-y-2">
            {col.items.map((it,i) => <li key={i} className="p-2 bg-gray-50 rounded">{it}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}
