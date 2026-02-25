export default function KpiCard({ label, value, delta, deltaPositive }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide leading-tight">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {delta && (
        <p className={`text-xs font-medium mt-0.5 ${deltaPositive ? 'text-green-600' : 'text-brand-red'}`}>
          {delta}
        </p>
      )}
    </div>
  )
}
