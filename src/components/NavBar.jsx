import { NavLink } from 'react-router-dom'
import { CLIENT_NAME } from '../config'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/impact', label: 'Impact Assessment' },
  { to: '/scenario', label: 'Scenario Planner' },
  { to: '/actions', label: 'Actions & Outputs' },
]

export default function NavBar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-brand-red flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">{CLIENT_NAME}</span>
          <span className="text-gray-300 text-sm">|</span>
          <span className="text-gray-500 text-sm">Workforce Planning</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-red/10 flex items-center justify-center">
            <span className="text-brand-red text-xs font-bold">AM</span>
          </div>
          <span className="text-sm text-gray-700 font-medium">Alex Morgan</span>
        </div>
      </div>
    </header>
  )
}
