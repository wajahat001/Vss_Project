import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function ResponseHistory(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/api/responses/my')
        setItems(res.data || [])
      }catch(err){
        console.error(err)
      }
    }
    load()
  },[])

  if (!items.length) return <div className="p-4 bg-white rounded shadow">No responses yet</div>

  return (
    <div className="space-y-3">
      {items.map(it => (
        <div key={it._id} className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()}</div>
          <div className="mt-2 text-sm">Answers: {it.answers?.length || 0}</div>
          <div className="text-xs text-gray-500">Sentiment: {it.sentimentScore ?? 'n/a'}</div>
        </div>
      ))}
    </div>
  )
}
