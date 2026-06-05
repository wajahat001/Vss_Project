import React from 'react'
import ReportExport from '../components/ReportExport'

export default function Reports() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-text-0 mb-1">Reports</h1>
      <p className="text-text-1 text-sm mb-6">Export sentiment data as a PDF report.</p>
      <ReportExport />
    </div>
  )
}
