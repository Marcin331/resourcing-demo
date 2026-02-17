import { levers } from '../../data/simulationData'

const leverKeys = ['cgtPercent', 'latamShift', 'brCapacity', 'costInflation']

function formatDelta(key, sliderValue) {
  const lever = levers[key]
  const base = lever.baselineDefault
  if (lever.unit === 'FTE') return `+${base} → +${sliderValue} FTE`
  if (lever.unit === '% / year') return `${sliderValue}% / year`
  return `${base}% → ${sliderValue}%`
}

export default function SimulationLevers({ values, onChange }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-[#1F2937]">
        Simulation levers (demo)
      </h3>

      <div className="space-y-5">
        {leverKeys.map((key) => {
          const lever = levers[key]
          return (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-[#1F2937]">
                {lever.label}
              </label>
              <input
                type="range"
                min={lever.min}
                max={lever.max}
                value={values[key]}
                onChange={(e) =>
                  onChange({ ...values, [key]: Number(e.target.value) })
                }
                className="slider-gold w-full cursor-pointer"
              />
              <p className="mt-0.5 text-xs text-[#6B7280]">
                {formatDelta(key, values[key])}
              </p>
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-[10px] italic text-[#6B7280]">
        Dev note: levers can be hard-coded for demo.
      </p>
    </div>
  )
}
