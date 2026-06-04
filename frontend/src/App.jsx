import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Survey from './pages/Survey'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Kanban from './pages/Kanban'
import Reports from './pages/Reports'
import AdminCompany from './pages/AdminCompany'
import Layout from './components/Layout'

export default function App(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/survey" element={<Survey/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/kanban" element={<Kanban/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/admin/company" element={<AdminCompany/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
