import { useState } from 'react'

import PasswordScreen from './components/auth/PasswordScreen'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import ScenarioSimulation from './components/pages/ScenarioSimulation'
import ScenarioLibrary from './components/pages/ScenarioLibrary'
import ScenarioSetup from './components/pages/ScenarioSetup'
import PortfolioBuilder from './components/pages/PortfolioBuilder'
import ResultsDashboard from './components/pages/ResultsDashboard'
import Admin from './components/pages/Admin'

const pages = {
  'scenario-library': ScenarioLibrary,
  'scenario-setup': ScenarioSetup,
  'portfolio-builder': PortfolioBuilder,
  'results-dashboard': ResultsDashboard,
  'scenario-simulation': ScenarioSimulation,
  admin: Admin,
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activePage, setActivePage] = useState('scenario-simulation')

  if (!authenticated) {
    return <PasswordScreen onAuthenticated={() => setAuthenticated(true)} />
  }

  const PageComponent = pages[activePage] || ScenarioSimulation

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}
