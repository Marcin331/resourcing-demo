export default function ScenarioSelector() {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex-1 min-w-[180px]">
        <label className="mb-1 block text-xs font-medium text-[#6B7280]">
          Scenario A (baseline)
        </label>
        <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1F2937]">
          2026-2030 Baseline ▼
        </div>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="mb-1 block text-xs font-medium text-[#6B7280]">
          Scenario B (simulation)
        </label>
        <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1F2937]">
          CGT Expansion + LATAM ▼
        </div>
      </div>

      <div className="min-w-[120px]">
        <label className="mb-1 block text-xs font-medium text-[#6B7280]">
          Year range
        </label>
        <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1F2937]">
          2026-2030
        </div>
      </div>

      <button className="rounded-lg bg-[#D4A017] px-5 py-2 text-sm font-semibold text-[#1F2937] transition-colors hover:bg-[#C4920F] cursor-pointer">
        Run compare
      </button>

      <button className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-gray-50 cursor-pointer">
        Save as scenario
      </button>
    </div>
  )
}
