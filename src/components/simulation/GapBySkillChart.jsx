import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import { skillData } from '../../data/simulationData'

export default function GapBySkillChart() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-bold text-[#1F2937]">
        Δ Gap by skill (share)
      </h4>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={skillData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              dataKey="value"
              strokeWidth={2}
            >
              {skillData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2">
          {skillData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[#1F2937]">
                {entry.name} {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
