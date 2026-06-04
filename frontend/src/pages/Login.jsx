import React, { useState } from 'react'
import api from '../lib/api'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  async function submit(e){
    e.preventDefault()
    try{
        const res = await api.post('/api/auth/login',{ email, password })
        const token = res.data.token
        const user = res.data.user
        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        alert('Logged in')
    }catch(err){
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="w-full p-2 border rounded" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="w-full p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  )
}
