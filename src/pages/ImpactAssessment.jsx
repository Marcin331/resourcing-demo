import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studies } from '../data/demoData'
import StudyCard from '../components/shared/StudyCard'
import StatusBadge from '../components/shared/StatusBadge'

function PhaseCard({ phase }) {
  const isAtRisk = phase.status === 'at-risk'
  return (
    <div className={`rounded-xl border p-4 ${isAtRisk ? 'border-brand-red/30 bg-brand-red/5' : 'border-green-200 bg-green-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{phase.label}</p>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isAtRisk ? 'text-brand-red' : 'text-green-700'}`}>
          {isAtRisk ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {isAtRisk ? 'At Risk' : 'On Track'}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">FTE Required</span>
          <span className="font-semibold text-gray-900">{phase.fteRequired}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">FTE Available</span>
          <span className={`font-semibold ${isAtRisk ? 'text-brand-red' : 'text-green-700'}`}>{phase.fteAvailable}</span>
        </div>
        {phase.fteGap > 0 && (
          <div className="flex justify-between text-xs border-t border-brand-red/20 pt-2 mt-2">
            <span className="text-brand-red font-medium">Gap</span>
            <span className="font-bold text-brand-red">−{phase.fteGap} FTE</span>
          </div>
        )}
      </div>

      <div className="mt-3 bg-white/60 rounded-lg px-2.5 py-1.5">
        <p className="text-xs text-gray-500">{phase.role}</p>
      </div>

      {phase.note && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{phase.note}</p>
      )}
    </div>
  )
}

function AIRationalePanel({ study }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      {/* Context bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-gray-400">{study.shortName}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-500">{study.phase}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-500">{study.indication}</span>
        <div className="ml-auto">
          <StatusBadge status={study.status} label={study.statusLabel} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-base">{study.name}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{study.recommendation}</p>
      </div>

      {/* AI Rationale Timeline */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">AI Rationale</p>
        <div className="space-y-3">
          {study.aiRationale.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                {i < study.aiRationale.length - 1 && (
                  <div className="w-px h-4 bg-gray-200 mt-1" />
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      {study.phases && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-amber-700 font-medium">AI-predicted resource data. Confirm with Capacity Manager before action.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {study.phases.map((phase) => (
              <PhaseCard key={phase.id} phase={phase} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ImpactAssessment() {
  const navigate = useNavigate()
  const [selectedStudy, setSelectedStudy] = useState(studies[0])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impact Assessment</h1>
          <p className="text-gray-500 text-sm mt-0.5">AI-generated study impact analysis based on GenVara Phase 3 readout</p>
        </div>
        <button
          onClick={() => navigate('/scenario')}
          className="bg-brand-red text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-red/90 transition-colors flex items-center gap-2"
        >
          Proceed to Scenario Planner
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Study list */}
        <div className="col-span-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Studies in Scope</p>
          {studies.map((study) => (
            <StudyCard
              key={study.id}
              study={study}
              onClick={() => setSelectedStudy(study)}
              active={selectedStudy?.id === study.id}
            />
          ))}
        </div>

        {/* Detail panel */}
        <div className="col-span-8">
          {selectedStudy && <AIRationalePanel study={selectedStudy} />}
        </div>
      </div>
    </div>
  )
}
