import StatusBadge from './StatusBadge'

export default function StudyCard({ study, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${
        active ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">{study.shortName}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{study.phase}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{study.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{study.indication}</p>
        </div>
        <StatusBadge status={study.status} label={study.statusLabel} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {study.modality}
        </span>
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {study.priority}
        </span>
      </div>
    </button>
  )
}
