import { fteRequirements } from '../data/demoData'

/**
 * Calculate how many FTEs are covered by reallocating a given % from deprioritised studies.
 * Deprioritised studies collectively have ~13 FTE available for reallocation.
 */
const DEPRIORITISED_POOL = 13

/**
 * Returns the number of FTEs covered by reallocation.
 * @param {number} reallocationPct - Percentage of deprioritised FTEs to reallocate (10–40)
 */
export function calcReallocatedFTEs(reallocationPct) {
  return Math.round((reallocationPct / 100) * DEPRIORITISED_POOL)
}

/**
 * Returns the total FTE gap for NP-MM-401 acceleration.
 */
export function calcTotalGap() {
  return fteRequirements.reduce((sum, r) => sum + r.gap, 0)
}

/**
 * Returns the remaining FTE gap after reallocation.
 * @param {number} reallocationPct
 */
export function calcRemainingGap(reallocationPct) {
  const covered = calcReallocatedFTEs(reallocationPct)
  const total = calcTotalGap()
  return Math.max(0, total - covered)
}

/**
 * Estimates the cost impact of the scenario in £k.
 * Simple linear model: each additional site costs ~£120k; each week of acceleration costs ~£80k.
 * @param {number} accelerationWeeks
 * @param {number} additionalSites
 */
export function calcCostImpact(accelerationWeeks, additionalSites) {
  const siteCost = additionalSites * 120
  const accelerationCost = accelerationWeeks * 80
  return siteCost + accelerationCost
}

/**
 * Estimates the competitive advantage in terms of months to market lead.
 * 4 weeks acceleration ≈ 1 month lead (accounting for regulatory processing time).
 * @param {number} accelerationWeeks
 */
export function calcMarketLead(accelerationWeeks) {
  return Math.round((accelerationWeeks / 4) * 0.75 * 10) / 10
}

/**
 * Builds chart data for the resource bar chart showing FTE required vs available
 * after reallocation.
 * @param {number} reallocationPct
 */
export function calcChartData(reallocationPct) {
  const reallocated = calcReallocatedFTEs(reallocationPct)
  let remaining = reallocated

  return fteRequirements.map((r) => {
    const coverage = Math.min(r.gap, remaining)
    remaining = Math.max(0, remaining - coverage)
    return {
      role: r.role.replace(' ', '\n'),
      roleShort: r.role.split(' ')[0],
      required: r.required,
      available: r.available,
      covered: coverage,
      stillNeeded: r.gap - coverage,
    }
  })
}

/**
 * Returns a summary verdict for the trade-off panel based on slider values.
 * @param {number} accelerationWeeks
 * @param {number} additionalSites
 * @param {number} reallocationPct
 */
export function calcVerdict(accelerationWeeks, additionalSites, reallocationPct) {
  const remainingGap = calcRemainingGap(reallocationPct)
  const cost = calcCostImpact(accelerationWeeks, additionalSites)
  const lead = calcMarketLead(accelerationWeeks)

  if (remainingGap === 0 && cost <= 5000) {
    return { level: 'optimal', label: 'Optimal', description: 'Full FTE coverage with manageable cost impact.' }
  }
  if (remainingGap === 0) {
    return { level: 'feasible', label: 'Feasible', description: 'Full FTE coverage achieved but cost is high — review budget.' }
  }
  if (remainingGap <= 2) {
    return { level: 'caution', label: 'Caution', description: `${remainingGap} FTE gap remains — consider increasing reallocation or hiring.` }
  }
  return { level: 'risk', label: 'At Risk', description: `${remainingGap} FTE gap unresolved — acceleration is at risk without additional headcount.` }
}
