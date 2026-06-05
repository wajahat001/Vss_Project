import React from 'react'
import ResponseHistory from '../components/ResponseHistory'

export default function History() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-text-0 mb-1">Your Responses</h1>
      <p className="text-text-1 text-sm mb-6">A record of your anonymous submissions.</p>
      <ResponseHistory />
    </div>
  )
}
