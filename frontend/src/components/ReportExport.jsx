import React from 'react'

export default function ReportExport(){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-semibold mb-2">Export Reports</h3>
      <p className="text-sm text-gray-600 mb-3">Generate PDF reports for selected surveys and date ranges.</p>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Export PDF</button>
        <button className="px-3 py-2 border rounded">Schedule</button>
      </div>
    </div>
  )
}
