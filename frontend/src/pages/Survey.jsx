import React from 'react'
import SurveyForm from '../components/SurveyForm'

export default function Survey() {
  return (
    <div className="max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-text-0">Active Survey</h1>
      <p className="text-text-1 text-sm mb-6">Your answers are fully anonymous.</p>
      <SurveyForm />
    </div>
  )
}
