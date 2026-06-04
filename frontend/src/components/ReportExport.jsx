import React, { useState } from 'react'
import api from '../lib/api'

export default function ReportExport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function exportPDF() {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/reports/export', {}, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'pulse-report.pdf'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-lg font-semibold mb-2">Export Report</h2>
      <p className="text-sm text-gray-500 mb-4">
        Download a PDF containing sentiment breakdown by department and week-by-week trends.
      </p>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <button
        onClick={exportPDF}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded font-medium text-sm transition-colors"
      >
        {loading ? 'Generating…' : 'Export PDF'}
      </button>
    </div>
  )
}
