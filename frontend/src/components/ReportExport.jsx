import React, { useState } from 'react'
import api from '../lib/api'
import Button from './ui/Button'
import Card from './ui/Card'

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
    <Card className="p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[9px] grid place-items-center bg-violet/10 border border-violet/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-0">Export Report</h2>
          <p className="text-[11px] text-text-2">PDF · Sentiment by dept + trends</p>
        </div>
      </div>

      <p className="text-sm text-text-1 mb-5">
        Download a PDF containing sentiment breakdown by department and week-by-week trends.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      <Button onClick={exportPDF} disabled={loading}>
        {loading ? 'Generating…' : 'Export PDF'}
      </Button>
    </Card>
  )
}
