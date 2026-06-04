import React from 'react'
import SentimentChart from '../components/SentimentChart'

export default function Dashboard(){
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SentimentChart />
      </div>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Quick Stats</h3>
          <div className="mt-3 text-sm text-gray-600">Responses last 7 days: <strong>124</strong></div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Departments</h3>
          <ul className="mt-2 text-sm text-gray-600"><li>Engineering</li><li>Sales</li><li>HR</li></ul>
        </div>
      </div>
    </div>
  )
}
