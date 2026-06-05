import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Survey from './pages/Survey'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Kanban from './pages/Kanban'
import Reports from './pages/Reports'
import AdminCompany from './pages/AdminCompany'
import CreateCompany from './pages/CreateCompany'
import CreateSurvey from './pages/CreateSurvey'
import PublicSurvey from './pages/PublicSurvey'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/s/:token" element={<PublicSurvey />} />

        {/* create-company is protected but has no sidebar/layout */}
        <Route path="/create-company" element={
          <ProtectedRoute>
            <CreateCompany />
          </ProtectedRoute>
        } />

        {/* all other protected routes inside Layout */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/history" element={<History />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/create-survey" element={<CreateSurvey />} />
                <Route path="/admin/company" element={<AdminCompany />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
