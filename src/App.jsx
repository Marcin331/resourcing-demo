import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import PasswordGate from './components/PasswordGate'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import ImpactAssessment from './pages/ImpactAssessment'
import ScenarioPlanner from './pages/ScenarioPlanner'
import ActionsOutput from './pages/ActionsOutput'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/impact" element={<ImpactAssessment />} />
            <Route path="/scenario" element={<ScenarioPlanner />} />
            <Route path="/actions" element={<ActionsOutput />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
