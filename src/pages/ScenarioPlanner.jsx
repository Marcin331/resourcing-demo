import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { scenarioDefaults } from '../data/demoData'
import {
  calcChartData,
  calcCostImpact,
  calcMarketLead,
  calcRemainingGap,
  calcReallocatedFTEs,
  calcVerdict,
} from '../utils/scenarioCalculations'
import StatusBadge from '../components/shared/StatusBadge'

function Slider({ config, value, onChange }) {
  const pct = ((value - config.min) / (config.max - config.min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{config.label}</label>
        <span className="text-sm font-bold text-brand-red tabular-nums">
          {value}{config.label.includes('%') ? '%' : config.label.includes('weeks') ? ' wks' : ''}
        </span>
      </div>
      <p className="text-xs text-gray-500">{config.description}</p>
      <div className="relative">
        <input
          type="range"
          min={config.min}
          max={config.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8B1A4A ${pct}%, #e5e7eb ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{config.min}</span>
          <span>Recommended: {config.default}</span>
          <span>{config.max}</span>
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-semibold">{p.value} FTE</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function ScenarioPlanner() {
  const navigate = useNavigate()
  const [weeks, setWeeks] = useState(scenarioDefaults.accelerationWeeks.default)
  const [sites, setSites] = useState(scenarioDefaults.additionalSites.default)
  const [realloc, setRealloc] = useState(scenarioDefaults.reallocationPct.default)

  const chartData = calcChartData(realloc)
  const cost = calcCostImpact(weeks, sites)
  const lead = calcMarketLead(weeks)
  const remainingGap = calcRemainingGap(realloc)
  const reallocated = calcReallocatedFTEs(realloc)
  const verdict = calcVerdict(weeks, sites, realloc)

  const verdictColour = {
    optimal: 'border-green-200 bg-green-50 text-green-700',
    feasible: 'border-blue-200 bg-blue-50 text-blue-700',
    caution: 'border-amber-200 bg-amber-50 text-amber-700',
    risk: 'border-brand-red/30 bg-brand-red/5 text-brand-red',
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Planner</h1>
          <p className="text-gray-500 text-sm mt-0.5">Model NP-MM-401 Phase 3 acceleration scenarios and trade-offs</p>
        </div>
        <button
          onClick={() => navigate('/actions')}
          className="bg-brand-red text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-red/90 transition-colors flex items-center gap-2"
        >
          Generate Actions
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sliders */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-gray-900">Acceleration Parameters</h2>

            <Slider
              config={scenarioDefaults.accelerationWeeks}
              value={weeks}
              onChange={setWeeks}
            />
            <div className="border-t border-gray-100" />
            <Slider
              config={scenarioDefaults.additionalSites}
              value={sites}
              onChange={setSites}
            />
            <div className="border-t border-gray-100" />
            <Slider
              config={scenarioDefaults.reallocationPct}
              value={realloc}
              onChange={setRealloc}
            />
          </div>

          {/* Trade-off summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Scenario Trade-offs</h2>

            <div className={`rounded-lg border px-4 py-3 ${verdictColour[verdict.level]}`}>
              <p className="font-bold text-sm">{verdict.label}</p>
              <p className="text-xs mt-0.5 opacity-80">{verdict.description}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Market lead gained</span>
                <span className="font-bold text-gray-900">+{lead} months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Estimated cost impact</span>
                <span className="font-bold text-gray-900">£{cost.toLocaleString()}k</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-gray-500">FTEs reallocated</span>
                <span className="font-bold text-gray-900">{reallocated} FTE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">FTE gap remaining</span>
                <span className={`font-bold ${remainingGap > 0 ? 'text-brand-red' : 'text-green-600'}`}>
                  {remainingGap === 0 ? 'None ✓' : `${remainingGap} FTE`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart panel */}
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">FTE Resource Coverage — NP-MM-401</h2>
                <p className="text-xs text-gray-500 mt-0.5">Required vs available after reallocation, by function</p>
              </div>
              <StatusBadge status={verdict.level === 'optimal' || verdict.level === 'feasible' ? 'on-track' : 'at-risk'} label="NP-MM-401" />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-amber-700 font-medium">AI-predicted capacity data. Adjust sliders to model different scenarios.</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="roleShort"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'FTE', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                />
                <Bar dataKey="available" name="Currently Available" fill="#d1d5db" radius={[3, 3, 0, 0]} />
                <Bar dataKey="covered" name="Covered by Reallocation" fill="#C9952A" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="stillNeeded" name="Still Needed" fill="#8B1A4A" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Phase timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">NP-MM-401 Phase Timeline — Accelerated Plan</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Study Start-Up', status: remainingGap > 2 ? 'at-risk' : 'on-track', weeks: `Wks 1–${Math.round(weeks * 0.3)}` },
                { label: 'Site Activation', status: sites < 10 ? 'at-risk' : 'on-track', weeks: `Wks ${Math.round(weeks * 0.25)}–${Math.round(weeks * 0.6)}` },
                { label: 'First Patient In', status: 'on-track', weeks: `Wk ${Math.round(weeks * 0.65)}` },
                { label: 'Phase 3 Start', status: 'on-track', weeks: `Wk ${weeks}` },
              ].map((step, i) => (
                <div key={i} className={`rounded-lg border p-3 ${step.status === 'at-risk' ? 'border-brand-red/30 bg-brand-red/5' : 'border-green-200 bg-green-50'}`}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{step.label}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${step.status === 'at-risk' ? 'text-brand-red' : 'text-green-700'}`}>
                    {step.status === 'at-risk' ? '✕ At Risk' : '✓ On Track'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.weeks}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
