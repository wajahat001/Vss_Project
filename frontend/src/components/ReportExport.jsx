import React, { useState } from 'react'
import api from '../lib/api'
import Button from './ui/Button'
import Card from './ui/Card'
import Icon from './ui/Icon'
import { BarChart, AreaChart } from './ui/Charts'

function Toast({ show, children, onDone, duration = 3200 }) {
  React.useEffect(() => {
    if (show) { const t = setTimeout(onDone, duration); return () => clearTimeout(t) }
  }, [show])
  if (!show) return null
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}
      className="animate-fade-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-card border border-mint/40 bg-white/[0.04] backdrop-blur-[12px] shadow-[0_14px_40px_rgba(0,0,0,0.5)] max-w-[440px]">
        <span className="w-6 h-6 rounded-full bg-mint/[0.16] grid place-items-center text-mint flex-shrink-0">
          <Icon name="check" size={15} stroke={2.6} />
        </span>
        <span className="text-sm text-text-0">{children}</span>
      </div>
    </div>
  )
}

export default function ReportExport() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(false)

  async function exportPDF() {
    setLoading(true); setDone(false); setError('')
    try {
      const res = await api.post('/api/reports/export', {}, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url; link.download = 'pulse-report.pdf'; link.click()
      URL.revokeObjectURL(url)
      setDone(true); setToast(true)
      setTimeout(() => setDone(false), 2600)
    } catch {
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Analytics Reports</h1>
          <p className="text-text-1 text-sm mt-1.5">Slice anonymized sentiment across teams and time.</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/[0.10] border border-mint/25 text-mint text-[12.5px] font-medium">
          <Icon name="lock" size={13} /> Aggregated data only
        </span>
      </div>

      {/* export card */}
      <Card className="p-5">
        <div className="flex items-center gap-4 justify-between flex-wrap">
          <div className="flex items-center gap-4">
            <span style={{
              width: 52, height: 52, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center',
              background: 'rgba(108,99,255,0.12)', color: '#8B83FF',
              border: '1px solid rgba(108,99,255,0.25)',
            }}>
              <Icon name="file" size={24} />
            </span>
            <div>
              <h3 className="text-base font-semibold mb-1">Export full report as PDF</h3>
              <p className="text-text-1 text-sm max-w-[420px]">
                A formatted summary of charts and sentiment data. No personal data is included.
              </p>
            </div>
          </div>
          <button
            disabled={loading}
            onClick={exportPDF}
            style={{ height: 46, padding: '0 22px', minWidth: 172 }}
            className={[
              'inline-flex items-center justify-center gap-2 rounded-btn font-semibold text-sm',
              'transition-all duration-200 active:scale-[0.985]',
              'disabled:opacity-55 disabled:cursor-not-allowed',
              'bg-grad text-[#0b0c12] border-transparent shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01]',
            ].join(' ')}>
            {loading
              ? <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(11,12,18,0.35)', borderTopColor: '#0b0c12', animation: 'spin 0.7s linear infinite' }} /> Generating…</>
              : done
              ? <><Icon name="check" size={17} stroke={2.6} /> Ready</>
              : <><Icon name="download" size={17} /> Download PDF</>}
          </button>
        </div>
        {error && (
          <div className="mt-4 px-4 py-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
        )}
      </Card>

      <Toast show={toast} onDone={() => setToast(false)}>
        Report generated. Aggregated, anonymous — safe to share with leadership.
      </Toast>
    </div>
  )
}
