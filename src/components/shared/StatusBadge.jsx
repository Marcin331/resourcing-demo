export default function StatusBadge({ status, label }) {
  const variants = {
    accelerate: 'bg-brand-red/10 text-brand-red border-brand-red/20',
    'at-risk': 'bg-brand-red/10 text-brand-red border-brand-red/20',
    deprioritise: 'bg-amber-50 text-amber-700 border-amber-200',
    'on-track': 'bg-green-50 text-green-700 border-green-200',
    optimal: 'bg-green-50 text-green-700 border-green-200',
    feasible: 'bg-blue-50 text-blue-700 border-blue-200',
    caution: 'bg-amber-50 text-amber-700 border-amber-200',
    risk: 'bg-brand-red/10 text-brand-red border-brand-red/20',
  }

  const dots = {
    accelerate: 'bg-brand-red',
    'at-risk': 'bg-brand-red',
    deprioritise: 'bg-amber-500',
    'on-track': 'bg-green-500',
    optimal: 'bg-green-500',
    feasible: 'bg-blue-500',
    caution: 'bg-amber-500',
    risk: 'bg-brand-red',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-gray-400'}`} />
      {label}
    </span>
  )
}
