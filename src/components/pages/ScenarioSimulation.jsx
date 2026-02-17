import { useState } from 'react'

import ScenarioSelector from '../simulation/ScenarioSelector'
import SimulationLevers from '../simulation/SimulationLevers'
import SummaryCards from '../simulation/SummaryCards'
import GapByRoleChart from '../simulation/GapByRoleChart'
import GapByLocationChart from '../simulation/GapByLocationChart'
import GapBySkillChart from '../simulation/GapBySkillChart'
import GapTrendChart from '../simulation/GapTrendChart'

import {
  levers,
  simulationDeltas,
  roleData,
  locationData,
  trendData,
  computeInterpolation,
  lerp,
} from '../../data/simulationData'

export default function ScenarioSimulation() {
  const [sliderValues, setSliderValues] = useState({
    cgtPercent: levers.cgtPercent.simulationDefault,
    latamShift: levers.latamShift.simulationDefault,
    brCapacity: levers.brCapacity.simulationDefault,
    costInflation: levers.costInflation.simulationDefault,
  })

  const t = computeInterpolation(sliderValues)

  // Interpolated summary deltas
  const deltas = {
    requiredFTE: simulationDeltas.requiredFTE * t,
    gapFTE: simulationDeltas.gapFTE * t,
    costUSD: simulationDeltas.costUSD * t,
  }

  // Interpolated role data
  const interpolatedRoleData = {
    roles: roleData.roles,
    values: roleData.baseline.map((base, i) =>
      lerp(base, roleData.simulation[i], t),
    ),
  }

  // Interpolated location data
  const interpolatedLocationData = {
    locations: locationData.locations,
    values: locationData.baseline.map((base, i) =>
      lerp(base, locationData.simulation[i], t),
    ),
  }

  // Interpolated trend data
  const interpolatedTrendData = {
    years: trendData.years,
    scenarioA: trendData.scenarioA,
    scenarioB: trendData.scenarioA.map((base, i) =>
      lerp(base, trendData.scenarioB[i], t),
    ),
  }

  return (
    <div className="p-6">
      <ScenarioSelector />

      <div className="mt-6 flex gap-6">
        {/* Left column — levers */}
        <div className="w-72 shrink-0">
          <SimulationLevers values={sliderValues} onChange={setSliderValues} />
        </div>

        {/* Right column — cards + charts */}
        <div className="flex-1 space-y-4">
          <SummaryCards deltas={deltas} />

          <div className="grid grid-cols-2 gap-4">
            <GapByRoleChart data={interpolatedRoleData} />
            <GapByLocationChart data={interpolatedLocationData} />
            <GapBySkillChart />
            <GapTrendChart data={interpolatedTrendData} />
          </div>
        </div>
      </div>
    </div>
  )
}
