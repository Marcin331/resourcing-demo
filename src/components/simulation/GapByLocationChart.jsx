import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function GapByLocationChart({ data }) {
  const chartData = data.locations.map((loc, i) => ({
    name: loc,
    gap: Number(data.values[i].toFixed(1)),
  }))

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-bold text-[#1F2937]">
        Δ Gap by location (FTE)
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="gap" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
