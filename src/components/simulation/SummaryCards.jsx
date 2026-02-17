export default function SummaryCards({ deltas }) {
  const cards = [
    {
      label: 'Δ Required FTE',
      value: `+${deltas.requiredFTE.toFixed(1)}`,
      subtitle: 'B minus A',
    },
    {
      label: 'Δ Gap (FTE)',
      value: `+${deltas.gapFTE.toFixed(1)}`,
      subtitle: 'worse vs baseline',
    },
    {
      label: 'Δ Cost (USD)',
      value: `+$${deltas.costUSD.toFixed(1)}M`,
      subtitle: 'per year view',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#6B7280]">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-[#8B1A4A]">{card.value}</p>
          <p className="mt-0.5 text-xs text-[#6B7280]">{card.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
