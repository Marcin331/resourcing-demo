const navItems = [
  { id: 'scenario-library', label: 'Scenario Library' },
  { id: 'scenario-setup', label: 'Scenario Setup' },
  { id: 'portfolio-builder', label: 'Portfolio Builder' },
  { id: 'results-dashboard', label: 'Results Dashboard' },
  { id: 'scenario-simulation', label: 'Scenario Simulation' },
  { id: 'admin', label: 'Admin (optional)' },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-center p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8B1A4A] text-xl font-bold text-white">
          AZ
        </div>
      </div>

      <nav className="flex-1 px-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          Resource Planning
        </p>
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mb-1 w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'border-l-3 border-[#8B1A4A] bg-[#8B1A4A]/5 font-semibold text-[#8B1A4A]'
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1F2937]'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
