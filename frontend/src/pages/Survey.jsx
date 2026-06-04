import React from 'react'
import SurveyForm from '../components/SurveyForm'

export default function Survey(){
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Active Survey</h2>
      <SurveyForm />
    </div>
  )
}
