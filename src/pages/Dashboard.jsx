import { useNavigate } from 'react-router-dom'
import { CLIENT_NAME } from '../config'
import { competitorAlert, kpiCards, studies } from '../data/demoData'
import KpiCard from '../components/shared/KpiCard'
import StatusBadge from '../components/shared/StatusBadge'

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const heroStudy = studies.find(s => s.status === 'accelerate')
  const deprioritised = studies.filter(s => s.status === 'deprioritise')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Alex.</h1>
        <p className="text-gray-500 text-sm mt-0.5">{today} · {CLIENT_NAME} Portfolio Intelligence</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        {kpiCards.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaPositive={kpi.deltaPositive}
          />
        ))}
      </div>

      {/* Competitor Alert Banner */}
      <div className="bg-white rounded-xl border border-brand-red/30 shadow-sm overflow-hidden">
        <div className="bg-brand-red/5 border-b border-brand-red/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-brand-red">
            <AlertIcon />
            <span className="font-semibold text-sm">Competitor Intelligence Alert</span>
            <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">HIGH SEVERITY</span>
          </div>
          <span className="text-xs text-gray-400">{competitorAlert.readoutDate}</span>
        </div>

        <div className="px-6 py-5 grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {competitorAlert.competitor}
              </span>
              <span className="bg-brand-red/10 text-brand-red text-xs font-medium px-2.5 py-1 rounded-full">
                {competitorAlert.product}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {competitorAlert.indication}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {competitorAlert.trialPhase}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{competitorAlert.summary}</p>
            <div className="flex items-center gap-6 pt-1">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">ORR</p>
                <p className="text-xl font-bold text-brand-red">{competitorAlert.keyFindings.orr}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Median PFS</p>
                <p className="text-xl font-bold text-gray-900">{competitorAlert.keyFindings.medianPFS}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">vs Timeline</p>
                <p className="text-sm font-semibold text-amber-600">{competitorAlert.keyFindings.earlyReadout}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Studies Impacted</p>
              <div className="space-y-1.5">
                {studies.map((study) => (
                  <div key={study.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-gray-600">{study.shortName}</span>
                    <StatusBadge status={study.status} label={study.statusLabel} />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/impact')}
              className="mt-4 w-full bg-brand-red text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-brand-red/90 transition-colors"
            >
              View Impact Assessment →
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">{CLIENT_NAME} Study Portfolio — Recommended Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Competitor Intelligence */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Competitor Intelligence</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5">New</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">GenVara Phase 3 Interim</p>
                  <p className="text-xs text-gray-500 mt-0.5">GV-CAR19 · rrMM · 78% ORR</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-brand-red/10 text-brand-red text-xs px-2 py-0.5 rounded-full font-medium">CAR-T</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">rrMM</span>
              </div>
              <div className="bg-brand-red/5 border border-brand-red/20 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span className="text-xs text-brand-red font-medium">Agent has assessed impact</span>
              </div>
            </div>
          </div>

          {/* Disruption Assessment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-red" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disruption Assessment</h3>
            </div>
            <div className="bg-white rounded-xl border border-brand-red/20 shadow-sm p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">NP-MM-401 Impact</p>
                <p className="text-xs text-gray-500 mt-0.5">Phase 3 acceleration required</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-brand-red/10 text-brand-red text-xs px-2 py-0.5 rounded-full font-medium">NP-MM-401</span>
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">NP-MM-318</span>
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">NP-HEM-215</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs text-amber-700 font-medium">Agent is working on it</span>
              </div>
            </div>
          </div>

          {/* Disruption Mitigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disruption Mitigation</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Scenario Plan Ready</p>
                <p className="text-xs text-gray-500 mt-0.5">3 scenarios modelled — action required</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">12 wk acceleration</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">15 sites</span>
              </div>
              <button
                onClick={() => navigate('/scenario')}
                className="w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                Open Scenario Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
