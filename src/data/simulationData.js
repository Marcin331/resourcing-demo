// Baseline data represents Scenario A: "2026-2030 Baseline"
// Simulation data represents Scenario B: "CGT Expansion + LATAM"
// Components interpolate between these based on slider positions.

// Lever defaults and ranges
export const levers = {
  cgtPercent: {
    label: 'CGT % of portfolio',
    min: 0,
    max: 100,
    baselineDefault: 35,
    simulationDefault: 50,
    unit: '%',
  },
  latamShift: {
    label: 'Shift studies to LATAM',
    min: 0,
    max: 50,
    baselineDefault: 10,
    simulationDefault: 25,
    unit: '%',
  },
  brCapacity: {
    label: 'Increase capacity in BR',
    min: 0,
    max: 10,
    baselineDefault: 0,
    simulationDefault: 5,
    unit: 'FTE',
  },
  costInflation: {
    label: 'Cost inflation',
    min: 0,
    max: 10,
    baselineDefault: 3,
    simulationDefault: 3,
    unit: '% / year',
  },
}

// Summary card baseline values (Scenario A)
export const baselineSummary = {
  requiredFTE: 124.5,
  gapFTE: 12.3,
  costUSD: 42.1, // in millions
}

// Summary card simulation deltas at full slider values
export const simulationDeltas = {
  requiredFTE: 6.2,
  gapFTE: 4.7,
  costUSD: 7.8, // in millions
}

// Gap by role — baseline and simulation values
export const roleData = {
  roles: ['CRA', 'DM', 'CPM', 'Stats', 'Reg', 'PV'],
  baseline: [3.2, 2.1, 1.8, 1.5, 2.0, 1.7],
  simulation: [5.8, 4.2, 3.5, 2.8, 3.1, 2.4],
}

// Gap by location — baseline and simulation values
export const locationData = {
  locations: ['US-NE', 'UK', 'DE', 'BR', 'CN', 'IN'],
  baseline: [3.5, 2.8, 2.2, 0.5, 1.8, 1.5],
  simulation: [4.2, 3.5, 3.8, -1.2, 3.2, 3.0],
}

// Gap by skill — shares (percentages, should sum to 100)
export const skillData = [
  { name: 'Site Ops', value: 38, color: '#8B1A4A' },
  { name: 'Data/DM', value: 21, color: '#3B82F6' },
  { name: 'Clinical', value: 17, color: '#8B5CF6' },
  { name: 'Reg', value: 12, color: '#D4A017' },
  { name: 'PV', value: 12, color: '#06B6D4' },
]

// Gap trend over years — Scenario A vs Scenario B
export const trendData = {
  years: [2026, 2027, 2028, 2029, 2030],
  scenarioA: [12.3, 14.1, 16.5, 18.2, 19.8],
  scenarioB: [17.0, 19.8, 23.4, 26.1, 28.5],
}

// Helper: compute interpolation factor from slider values
// Returns a 0–1 factor representing how far current slider values
// are from baseline toward full simulation values.
export function computeInterpolation(sliderValues) {
  const { cgtPercent, latamShift, brCapacity, costInflation } = sliderValues
  const l = levers

  const factors = [
    (cgtPercent - l.cgtPercent.baselineDefault) /
      (l.cgtPercent.simulationDefault - l.cgtPercent.baselineDefault),
    (latamShift - l.latamShift.baselineDefault) /
      (l.latamShift.simulationDefault - l.latamShift.baselineDefault),
    (brCapacity - l.brCapacity.baselineDefault) /
      (l.brCapacity.simulationDefault - l.brCapacity.baselineDefault),
    (costInflation - l.costInflation.baselineDefault) /
      Math.max(
        l.costInflation.simulationDefault - l.costInflation.baselineDefault,
        1,
      ),
  ]

  // Average the factors, clamped to 0–2 range to allow overshooting simulation defaults
  const avg =
    factors.reduce((sum, f) => sum + Math.max(0, f), 0) / factors.length
  return Math.min(avg, 2)
}

// Interpolate a value between baseline and simulation
export function lerp(baseline, simulation, t) {
  return baseline + (simulation - baseline) * t
}
