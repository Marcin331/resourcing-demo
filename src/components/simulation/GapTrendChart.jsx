import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function GapTrendChart({ data }) {
  const chartData = data.years.map((year, i) => ({
    year,
    'Gap A': Number(data.scenarioA[i].toFixed(1)),
    'Gap B': Number(data.scenarioB[i].toFixed(1)),
  }))

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-bold text-[#1F2937]">
        Gap trend: A vs B (FTE)
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="Gap A"
            stroke="#9CA3AF"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Gap B"
            stroke="#8B1A4A"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
