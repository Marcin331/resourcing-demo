import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  scenarioDefaults,
  reallocationPool,
  unstaffedFTEPool,
  studies,
} from '../data/demoData'
import {
  calcChartDataFromAllocation,
  calcRemainingGapFromAllocation,
  calcTotalReallocated,
  calcCoveredByRole,
  calcTrialImpact,
  calcCostImpact,
  calcMarketLead,
  calcVerdict,
  calcScaledFteRequirements,
  calcOptimalAllocation,
  calcExternalHiringNeeded,
} from '../utils/scenarioCalculations'
import StatusBadge from '../components/shared/StatusBadge'

// ─── Initial state (computed once at module load) ────────────────────────────

const _initial = calcOptimalAllocation(scenarioDefaults.accelerationWeeks.default)

// ─── Sub-components ──────────────────────────────────────────────────────────

function Slider({ config, value, onChange }) {
  const pct = ((value - config.min) / (config.max - config.min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{config.label}</label>
        <span className="text-sm font-bold text-brand-red tabular-nums">
          {value}{config.label.includes('weeks') ? ' wks' : ''}
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

function getTargetDate(weeks) {
  const d = new Date('2025-08-04')
  d.setDate(d.getDate() - weeks * 7)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

function AiBanner({ isAiScenario, isOptimised, weeks, remainingGap }) {
  if (isAiScenario) {
    return (
      <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl px-5 py-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mt-0.5">
          <SparkleIcon className="w-4 h-4 text-brand-red" />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-red">AI Recommended Scenario</p>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
            Accelerate NP-MM-401 Phase 3 start to <strong>12 May 2025</strong> — 12 weeks ahead of current plan (4 Aug 2025).
            Full FTE coverage achieved through reallocation from NP-HEM-215 and NP-MM-318, plus bench allocation.
            Trial disruption is minimised by prioritising bench resources and lowest-impact study roles.
          </p>
        </div>
      </div>
    )
  }

  if (isOptimised) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
          <SparkleIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-indigo-700">AI Optimised — {weeks}-week scenario</p>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
            Allocation recalculated to minimise disruption to deprioritised trials at <strong>{weeks} weeks</strong>{' '}
            (target: <strong>{getTargetDate(weeks)}</strong>).{' '}
            {remainingGap === 0
              ? 'Full FTE coverage achieved with internal resources.'
              : <span className="text-brand-red font-medium">{remainingGap} FTE gap remains — external hiring is required.</span>}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">User Modified Scenario</p>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
          Accelerating NP-MM-401 Phase 3 start by <strong>{weeks} weeks</strong> to{' '}
          <strong>{getTargetDate(weeks)}</strong> (planned: 4 Aug 2025).{' '}
          {remainingGap === 0
            ? 'Full FTE coverage achieved.'
            : <span className="text-brand-red font-medium">{remainingGap} FTE gap remains — click Optimise Allocation to recalculate.</span>}
        </p>
      </div>
    </div>
  )
}

function ReallocationGrid({
  scaledFteReqs,
  reallocation,
  onStepperChange,
  unstaffedAllocation,
  onUnstaffedChange,
  coveredByRole,
  externalHiringNeeded,
}) {
  const gapRoles = scaledFteReqs.filter(r => r.gap > 0)
  const totalGap = gapRoles.reduce((s, r) => s + r.gap, 0)
  const totalCovered = gapRoles.reduce((s, r) => s + Math.min(r.gap, coveredByRole[r.role] ?? 0), 0)
  const fullyGapped = totalCovered >= totalGap

  const roleAbbrev = {
    'Clinical Operations': 'Clin. Ops',
    'Biostatistics': 'Biostat.',
    'Regulatory Affairs': 'Reg. Affairs',
    'Data Management': 'Data Mgmt',
    'Medical Affairs': 'Med. Affairs',
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Resource Reallocation</h3>
        <span className="text-xs text-gray-500">
          Covered:{' '}
          <span className={`font-bold ${fullyGapped ? 'text-green-600' : 'text-brand-red'}`}>
            {totalCovered}/{totalGap} FTE
          </span>
        </span>
      </div>

      {gapRoles.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-3 text-xs text-green-700 text-center">
          ✓ No FTE reallocation required at this acceleration level — existing team is sufficient.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium pb-2 pr-2">Function</th>
                {reallocationPool.map(study => (
                  <th key={study.studyId} className="text-center text-gray-500 font-medium pb-2 px-1">
                    {study.studyShortName}
                  </th>
                ))}
                <th className="text-center text-gray-500 font-medium pb-2 px-1">Bench</th>
                <th className="text-center text-gray-400 font-medium pb-2 pl-1">Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gapRoles.map(req => {
                const covered = Math.min(req.gap, coveredByRole[req.role] ?? 0)
                const isCovered = covered >= req.gap
                const needsHiring = (externalHiringNeeded[req.role] ?? 0) > 0
                return (
                  <tr key={req.role}>
                    <td className="py-2 pr-2 text-gray-700 font-medium leading-tight">
                      {roleAbbrev[req.role] ?? req.role}
                      <span className="block text-gray-400 font-normal">gap: {req.gap}</span>
                      {needsHiring && (
                        <span className="flex items-center gap-0.5 text-brand-red font-semibold mt-0.5" style={{ fontSize: '10px' }}>
                          ⚠ +{externalHiringNeeded[req.role]} ext.
                        </span>
                      )}
                    </td>
                    {reallocationPool.map(study => {
                      const roleEntry = study.roles.find(r => r.role === req.role)
                      const max = roleEntry?.maxFTE ?? 0
                      const val = reallocation[study.studyId]?.[req.role] ?? 0
                      return (
                        <td key={study.studyId} className="py-2 px-1">
                          {max === 0 ? (
                            <div className="flex justify-center">
                              <span className="text-gray-300">—</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => onStepperChange(study.studyId, req.role, -1)}
                                  disabled={val <= 0}
                                  className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                                >
                                  −
                                </button>
                                <span className="w-5 text-center font-bold text-gray-900 tabular-nums">{val}</span>
                                <button
                                  onClick={() => onStepperChange(study.studyId, req.role, +1)}
                                  disabled={val >= max}
                                  className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-gray-300" style={{ fontSize: '10px' }}>/{max}</span>
                            </div>
                          )}
                        </td>
                      )
                    })}
                    {/* Bench / Unfilled column */}
                    <td className="py-2 px-1">
                      {(() => {
                        const max = unstaffedFTEPool[req.role] ?? 0
                        const val = unstaffedAllocation[req.role] ?? 0
                        if (max === 0) {
                          return (
                            <div className="flex justify-center">
                              <span className="text-gray-300">—</span>
                            </div>
                          )
                        }
                        return (
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => onUnstaffedChange(req.role, -1)}
                                disabled={val <= 0}
                                className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                              >
                                −
                              </button>
                              <span className="w-5 text-center font-bold text-gray-900 tabular-nums">{val}</span>
                              <button
                                onClick={() => onUnstaffedChange(req.role, +1)}
                                disabled={val >= max}
                                className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-gray-300" style={{ fontSize: '10px' }}>/{max}</span>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 pl-1 text-center">
                      <span className={`font-bold text-sm ${isCovered ? 'text-green-600' : 'text-brand-red'}`}>
                        {covered}/{req.gap}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={`rounded-lg px-3 py-2 flex items-center justify-between text-xs ${
        fullyGapped ? 'bg-green-50 border border-green-200' : 'bg-brand-red/5 border border-brand-red/20'
      }`}>
        <span className={fullyGapped ? 'text-green-700' : 'text-brand-red'}>
          {fullyGapped ? '✓ FTE gap fully covered' : 'FTE gap not fully covered'}
        </span>
        <span className={`font-bold ${fullyGapped ? 'text-green-700' : 'text-brand-red'}`}>
          {totalCovered} / {totalGap} FTE
        </span>
      </div>
    </div>
  )
}

function HiringAlertDialog({ weeks, externalHiringNeeded, onClose }) {
  const total = Object.values(externalHiringNeeded).reduce((s, v) => s + v, 0)
  const roleCount = Object.keys(externalHiringNeeded).length
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">External Hiring Required</h3>
            <p className="text-xs text-gray-500">{weeks}-week acceleration scenario</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          At <strong>{weeks} weeks</strong>, all internal capacity has been maximised but{' '}
          <strong className="text-brand-red">{total} FTE across {roleCount} function{roleCount !== 1 ? 's' : ''}</strong>{' '}
          cannot be covered internally. External hiring or contracting will be required to proceed with this timeline.
        </p>

        <ul className="space-y-2 mb-4 bg-brand-red/5 border border-brand-red/20 rounded-xl p-4">
          {Object.entries(externalHiringNeeded).map(([role, count]) => (
            <li key={role} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{role}</span>
              <span className="font-bold text-brand-red">+{count} FTE</span>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-5">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-amber-700">
            The estimated cost impact has been updated to reflect external hiring and contracting costs.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-brand-red text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-red/90 transition-colors"
        >
          Understood — proceed with this scenario
        </button>
      </div>
    </div>
  )
}

function TrialImpactCard({ study, reallocation, expanded, onToggle }) {
  const studyAlloc = reallocation[study.id] ?? {}
  const ftesRemoved = Object.values(studyAlloc).reduce((s, v) => s + v, 0)

  const riskLevel = ftesRemoved === 0 ? 'on-track'
    : ftesRemoved <= 2 ? 'at-risk'
    : 'significantly-impacted'

  const riskLabel = ftesRemoved === 0 ? 'On Track'
    : ftesRemoved <= 2 ? 'At Risk'
    : 'Significantly Impacted'

  const phaseImpacts = calcTrialImpact(study.id, reallocation, reallocationPool)
  const impactedPhases = phaseImpacts.filter(p => p.isImpacted)

  const summaryText = ftesRemoved === 0
    ? 'No FTEs reallocated — study unaffected.'
    : impactedPhases.length === 0
    ? `${ftesRemoved} FTE removed — phase impact minimal.`
    : `${ftesRemoved} FTE removed — ${impactedPhases.map(p => `${p.phaseLabel} +${p.slippageWeeks}w`).join(', ')}.`

  const borderColour = riskLevel === 'on-track' ? 'border-green-200'
    : riskLevel === 'at-risk' ? 'border-amber-200'
    : 'border-brand-red/30'

  const badgeClass = riskLevel === 'on-track'
    ? 'bg-green-50 text-green-700 border-green-200'
    : riskLevel === 'at-risk'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-brand-red/10 text-brand-red border-brand-red/20'

  const dotClass = riskLevel === 'on-track' ? 'bg-green-500'
    : riskLevel === 'at-risk' ? 'bg-amber-500'
    : 'bg-brand-red'

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${borderColour}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-gray-500 font-semibold flex-shrink-0">{study.shortName}</span>
          <span className="text-xs text-gray-400 truncate">{study.indication}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {riskLabel}
          </span>
          <p className="text-xs text-gray-500 max-w-52 text-right leading-snug hidden md:block">{summaryText}</p>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Phase-by-Phase Timeline Impact</p>
          <div className="grid grid-cols-2 gap-3">
            {phaseImpacts.map(pi => (
              <div
                key={pi.phaseLabel}
                className={`rounded-xl border p-4 ${pi.isImpacted ? 'border-brand-red/30 bg-brand-red/5' : 'border-green-200 bg-green-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{pi.phaseLabel}</p>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${pi.isImpacted ? 'text-brand-red' : 'text-green-700'}`}>
                    {pi.isImpacted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {pi.isImpacted ? `+${pi.slippageWeeks}w` : 'No impact'}
                  </div>
                </div>
                {pi.isImpacted && (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {pi.slippageWeeks} week{pi.slippageWeeks !== 1 ? 's' : ''} added to projected end date.
                  </p>
                )}
              </div>
            ))}
          </div>
          {impactedPhases.length > 0 && (
            <p className="text-xs text-gray-400 mt-3 italic">
              Slippage is modelled as linear: each FTE removed adds a proportional delay to dependent phases.
            </p>
          )}
        </div>
      )}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScenarioPlanner() {
  const navigate = useNavigate()

  const [weeks, setWeeks] = useState(scenarioDefaults.accelerationWeeks.default)
  const [sites] = useState(scenarioDefaults.additionalSites.default) // hidden — kept for cost calc
  const [reallocation, setReallocation] = useState(_initial.reallocation)
  const [unstaffedAllocation, setUnstaffedAllocation] = useState(_initial.unstaffedAllocation)
  const [optimisedForWeeks, setOptimisedForWeeks] = useState(scenarioDefaults.accelerationWeeks.default)
  const [showHiringDialog, setShowHiringDialog] = useState(false)
  const [expandedStudy, setExpandedStudy] = useState(null)

  // ── Derived values ────────────────────────────────────────────────────────
  const scaledFteReqs       = calcScaledFteRequirements(weeks)
  const chartData            = calcChartDataFromAllocation(reallocation, unstaffedAllocation, scaledFteReqs)
  const remainingGap         = calcRemainingGapFromAllocation(reallocation, unstaffedAllocation, scaledFteReqs)
  const coveredByRole        = calcCoveredByRole(reallocation, unstaffedAllocation)
  const externalHiringNeeded = calcExternalHiringNeeded(reallocation, unstaffedAllocation, scaledFteReqs)
  const externalHiringCount  = Object.values(externalHiringNeeded).reduce((s, v) => s + v, 0)
  const cost                 = calcCostImpact(weeks, sites, externalHiringCount)
  const lead                 = calcMarketLead(weeks)
  const totalReallocated     = calcTotalReallocated(reallocation)
  const totalUnstaffed       = Object.values(unstaffedAllocation).reduce((s, v) => s + v, 0)
  const verdict              = calcVerdict(weeks, sites, reallocation, unstaffedAllocation, scaledFteReqs)

  // Banner state flags
  const isAiScenario  = weeks === scenarioDefaults.accelerationWeeks.default && optimisedForWeeks === scenarioDefaults.accelerationWeeks.default
  const isOptimised   = optimisedForWeeks === weeks

  // Button: disabled when already optimised for current weeks (includes initial AI state)
  const buttonDisabled = optimisedForWeeks === weeks

  function handleOptimise() {
    const result = calcOptimalAllocation(weeks)
    setReallocation(result.reallocation)
    setUnstaffedAllocation(result.unstaffedAllocation)
    setOptimisedForWeeks(weeks)
    const sr = calcScaledFteRequirements(weeks)
    const hiring = calcExternalHiringNeeded(result.reallocation, result.unstaffedAllocation, sr)
    if (Object.keys(hiring).length > 0) setShowHiringDialog(true)
  }

  function handleStepperChange(studyId, role, delta) {
    setOptimisedForWeeks(null) // mark as manually edited
    setReallocation(prev => {
      const current = prev[studyId]?.[role] ?? 0
      const max = reallocationPool.find(s => s.studyId === studyId)
        ?.roles.find(r => r.role === role)?.maxFTE ?? 0
      const newVal = Math.min(max, Math.max(0, current + delta))
      return { ...prev, [studyId]: { ...(prev[studyId] ?? {}), [role]: newVal } }
    })
  }

  function handleUnstaffedChange(role, delta) {
    setOptimisedForWeeks(null) // mark as manually edited
    setUnstaffedAllocation(prev => {
      const current = prev[role] ?? 0
      const max = unstaffedFTEPool[role] ?? 0
      return { ...prev, [role]: Math.min(max, Math.max(0, current + delta)) }
    })
  }

  const deprioritisedStudies = studies.filter(s => s.status === 'deprioritise')

  const verdictColour = {
    optimal: 'border-green-200 bg-green-50 text-green-700',
    feasible: 'border-blue-200 bg-blue-50 text-blue-700',
    caution: 'border-amber-200 bg-amber-50 text-amber-700',
    risk: 'border-brand-red/30 bg-brand-red/5 text-brand-red',
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Hiring alert dialog */}
      {showHiringDialog && (
        <HiringAlertDialog
          weeks={weeks}
          externalHiringNeeded={externalHiringNeeded}
          onClose={() => setShowHiringDialog(false)}
        />
      )}

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

      {/* AI / User Modified Banner — always visible */}
      <AiBanner
        isAiScenario={isAiScenario}
        isOptimised={isOptimised}
        weeks={weeks}
        remainingGap={remainingGap}
      />

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left panel */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-gray-900">Acceleration Parameters</h2>

            <Slider
              config={scenarioDefaults.accelerationWeeks}
              value={weeks}
              onChange={setWeeks}
            />

            {/* Additional Investigator Sites — temporarily removed from UI; uncomment to restore
            <div className="border-t border-gray-100" />
            <Slider
              config={scenarioDefaults.additionalSites}
              value={sites}
              onChange={setSites}
            />
            */}

            {/* Optimise Allocation button */}
            <button
              onClick={handleOptimise}
              disabled={buttonDisabled}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                buttonDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-red text-white hover:bg-brand-red/90 shadow-sm'
              }`}
            >
              <SparkleIcon className="w-4 h-4" />
              {buttonDisabled
                ? (isAiScenario ? 'AI Recommendation Active' : 'Allocation Optimised')
                : 'Optimise Allocation'}
            </button>

            <div className="border-t border-gray-100" />
            <ReallocationGrid
              scaledFteReqs={scaledFteReqs}
              reallocation={reallocation}
              onStepperChange={handleStepperChange}
              unstaffedAllocation={unstaffedAllocation}
              onUnstaffedChange={handleUnstaffedChange}
              coveredByRole={coveredByRole}
              externalHiringNeeded={externalHiringNeeded}
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
                <span className="text-gray-500">FTEs from trials</span>
                <span className="font-bold text-gray-900">{totalReallocated} FTE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">FTEs from bench</span>
                <span className="font-bold text-gray-900">{totalUnstaffed} FTE</span>
              </div>
              {externalHiringCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-brand-red font-medium">External hires required</span>
                  <span className="font-bold text-brand-red">{externalHiringCount} FTE ⚠</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">FTE gap remaining</span>
                <span className={`font-bold ${remainingGap > 0 ? 'text-brand-red' : 'text-green-600'}`}>
                  {remainingGap === 0 ? 'None ✓' : `${remainingGap} FTE`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">FTE Resource Coverage — NP-MM-401</h2>
                <p className="text-xs text-gray-500 mt-0.5">Required vs available after reallocation, by function</p>
              </div>
              <StatusBadge
                status={verdict.level === 'optimal' || verdict.level === 'feasible' ? 'on-track' : 'at-risk'}
                label="NP-MM-401"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-amber-700 font-medium">
                AI-predicted capacity data. Adjust acceleration target and click Optimise Allocation to model different scenarios.
              </p>
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
                { label: 'Site Activation', status: 'on-track', weeks: `Wks ${Math.round(weeks * 0.25)}–${Math.round(weeks * 0.6)}` },
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

      {/* Deprioritised trial impact */}
      <div className="space-y-3">
        <div>
          <h2 className="font-semibold text-gray-900">Impact on Deprioritised Trials</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Phase slippage modelled proportionally from FTE reallocation out of NP-HEM-215 and NP-MM-318.
            Bench FTE assignments do not affect deprioritised trials.
          </p>
        </div>
        {deprioritisedStudies.map(study => (
          <TrialImpactCard
            key={study.id}
            study={study}
            reallocation={reallocation}
            expanded={expandedStudy === study.id}
            onToggle={() => setExpandedStudy(prev => prev === study.id ? null : study.id)}
          />
        ))}
      </div>
    </div>
  )
}
