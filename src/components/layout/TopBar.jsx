export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-[#1F2937]">
          Scenario Simulation
        </h1>
        <p className="text-sm text-[#6B7280]">
          Compare scenarios and simulate levers
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-[#6B7280] cursor-pointer">
          Scenario ▼
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-[#6B7280] cursor-pointer">
          Year ▼
        </button>
      </div>
    </header>
  )
}
