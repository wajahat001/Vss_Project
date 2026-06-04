import React from 'react'
import ResponseHistory from '../components/ResponseHistory'

export default function History(){
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Your responses</h2>
      <ResponseHistory />
    </div>
  )
}
