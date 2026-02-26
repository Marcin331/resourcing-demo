import { fteRequirements, reallocationPool, unstaffedFTEPool } from '../data/demoData'

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
 * External FTEs (hired/contracted) cost ~£200k each.
 * @param {number} accelerationWeeks
 * @param {number} additionalSites
 * @param {number} externalFTEs - FTEs that must be externally hired (default 0)
 */
const HIRING_COST_PER_FTE = 200
export function calcCostImpact(accelerationWeeks, additionalSites, externalFTEs = 0) {
  const siteCost = additionalSites * 120
  const accelerationCost = accelerationWeeks * 80
  const hiringCost = externalFTEs * HIRING_COST_PER_FTE
  return siteCost + accelerationCost + hiringCost
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
 * @param {Object} reallocation        - { [studyId]: { [role]: number } }
 * @param {Object} unstaffedAllocation - { [role]: number } (default {})
 * @param {Array}  scaledReqs          - from calcScaledFteRequirements (default: base)
 */
export function calcVerdict(accelerationWeeks, additionalSites, reallocation, unstaffedAllocation = {}, scaledReqs = fteRequirements) {
  const remainingGap = calcRemainingGapFromAllocation(reallocation, unstaffedAllocation, scaledReqs)
  const cost = calcCostImpact(accelerationWeeks, additionalSites)

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

// ─────────────────────────────────────────────────────────────────────────────
// Function-level allocation calculations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns FTE requirements scaled to the given acceleration weeks.
 * Base requirements in demoData.js are defined at 12 weeks.
 * @param {number} weeks
 * @returns {Array<{ role, required, available, gap }>}
 */
export function calcScaledFteRequirements(weeks) {
  return fteRequirements.map(r => {
    const required = Math.round(r.required * (weeks / 12))
    return { ...r, required, gap: Math.max(0, required - r.available) }
  })
}

/**
 * Sums allocated FTEs per role across all source studies AND the bench pool.
 * @param {Object} reallocation        - { [studyId]: { [role]: number } }
 * @param {Object} unstaffedAllocation - { [role]: number } bench FTEs (default {})
 * @returns {{ [role]: number }}
 */
export function calcCoveredByRole(reallocation, unstaffedAllocation = {}) {
  const result = {}
  for (const studyAlloc of Object.values(reallocation)) {
    for (const [role, fte] of Object.entries(studyAlloc)) {
      result[role] = (result[role] ?? 0) + fte
    }
  }
  for (const [role, fte] of Object.entries(unstaffedAllocation)) {
    result[role] = (result[role] ?? 0) + fte
  }
  return result
}

/**
 * Builds bar chart data using explicit per-role allocation.
 * Replaces calcChartData(pct). Output shape is identical.
 * @param {Object} reallocation        - { [studyId]: { [role]: number } }
 * @param {Object} unstaffedAllocation - { [role]: number } (default {})
 * @param {Array}  scaledReqs          - from calcScaledFteRequirements (default: base)
 */
export function calcChartDataFromAllocation(reallocation, unstaffedAllocation = {}, scaledReqs = fteRequirements) {
  const coveredByRole = calcCoveredByRole(reallocation, unstaffedAllocation)
  return scaledReqs.map((r) => {
    const covered = Math.min(r.gap, coveredByRole[r.role] ?? 0)
    return {
      role: r.role.replace(' ', '\n'),
      roleShort: r.role.split(' ')[0],
      required: r.required,
      available: r.available,
      covered,
      stillNeeded: Math.max(0, r.gap - covered),
    }
  })
}

/**
 * Returns total uncovered FTE gap after per-role allocation.
 * Replaces calcRemainingGap(pct).
 * @param {Object} reallocation        - { [studyId]: { [role]: number } }
 * @param {Object} unstaffedAllocation - { [role]: number } (default {})
 * @param {Array}  scaledReqs          - from calcScaledFteRequirements (default: base)
 */
export function calcRemainingGapFromAllocation(reallocation, unstaffedAllocation = {}, scaledReqs = fteRequirements) {
  const coveredByRole = calcCoveredByRole(reallocation, unstaffedAllocation)
  return scaledReqs.reduce((sum, r) => {
    const covered = Math.min(r.gap, coveredByRole[r.role] ?? 0)
    return sum + Math.max(0, r.gap - covered)
  }, 0)
}

/**
 * Returns total FTEs moved across all studies and roles.
 * @param {Object} reallocation - { [studyId]: { [role]: number } }
 */
export function calcTotalReallocated(reallocation) {
  let total = 0
  for (const studyAlloc of Object.values(reallocation)) {
    for (const fte of Object.values(studyAlloc)) {
      total += fte
    }
  }
  return total
}

/**
 * Greedy optimiser: bench first (zero trial disruption), then trial pool sorted by
 * lowest total slippage cost per FTE. Returns the best achievable allocation for
 * the given acceleration weeks. Any FTE gap that cannot be covered internally is
 * captured by calcExternalHiringNeeded.
 * @param {number} weeks
 * @returns {{ reallocation: Object, unstaffedAllocation: Object }}
 */
export function calcOptimalAllocation(weeks) {
  const scaledReqs = calcScaledFteRequirements(weeks)
  const newReallocation = {}
  const newUnstaffed = {}

  for (const study of reallocationPool) {
    newReallocation[study.studyId] = {}
    for (const roleEntry of study.roles) {
      newReallocation[study.studyId][roleEntry.role] = 0
    }
  }
  for (const role of Object.keys(unstaffedFTEPool)) {
    newUnstaffed[role] = 0
  }

  for (const req of scaledReqs) {
    if (req.gap === 0) continue
    let remaining = req.gap

    // Step 1: bench (no trial disruption)
    const benchAvail = unstaffedFTEPool[req.role] ?? 0
    if (benchAvail > 0) {
      const use = Math.min(benchAvail, remaining)
      newUnstaffed[req.role] = use
      remaining -= use
    }
    if (remaining === 0) continue

    // Step 2: trial pool — lowest total slippage per FTE first
    const candidates = reallocationPool
      .filter(s => s.roles.some(r => r.role === req.role && r.maxFTE > 0))
      .map(s => {
        const roleEntry = s.roles.find(r => r.role === req.role)
        const totalSlippage = roleEntry.phaseImpacts.reduce((sum, pi) => sum + pi.weeksPerFTE, 0)
        return { studyId: s.studyId, maxFTE: roleEntry.maxFTE, totalSlippage }
      })
      .sort((a, b) => a.totalSlippage - b.totalSlippage)

    for (const c of candidates) {
      if (remaining === 0) break
      const take = Math.min(c.maxFTE, remaining)
      newReallocation[c.studyId][req.role] = take
      remaining -= take
    }
    // remaining > 0 means external hiring needed — captured by calcExternalHiringNeeded
  }

  return { reallocation: newReallocation, unstaffedAllocation: newUnstaffed }
}

/**
 * Returns roles and counts where internal coverage (pool + bench) falls short of the gap.
 * Non-empty result means external hiring is required for this scenario.
 * @param {Object} reallocation
 * @param {Object} unstaffedAllocation
 * @param {Array}  scaledReqs - from calcScaledFteRequirements
 * @returns {{ [role]: number }}
 */
export function calcExternalHiringNeeded(reallocation, unstaffedAllocation, scaledReqs) {
  const coveredByRole = calcCoveredByRole(reallocation, unstaffedAllocation)
  const result = {}
  for (const r of scaledReqs) {
    const shortfall = Math.max(0, r.gap - (coveredByRole[r.role] ?? 0))
    if (shortfall > 0) result[r.role] = shortfall
  }
  return result
}

/**
 * Calculates phase-by-phase slippage for a deprioritised study.
 * For each phase in the study's pool, sums weeksPerFTE × ftesRemoved
 * across all roles that impact that phase.
 * @param {string} studyId
 * @param {Object} reallocation - { [studyId]: { [role]: number } }
 * @param {Array}  reallocationPool - from demoData
 * @returns {Array<{ phaseLabel, slippageWeeks, isImpacted }>}
 */
export function calcTrialImpact(studyId, reallocation, reallocationPool) {
  const studyPool = reallocationPool.find(s => s.studyId === studyId)
  const studyAlloc = reallocation[studyId] ?? {}

  if (!studyPool) return []

  const phaseLabels = [
    ...new Set(
      studyPool.roles.flatMap(r => r.phaseImpacts.map(pi => pi.phaseLabel))
    ),
  ]

  return phaseLabels.map(phaseLabel => {
    let slippageWeeks = 0
    for (const roleEntry of studyPool.roles) {
      const ftesRemoved = studyAlloc[roleEntry.role] ?? 0
      if (ftesRemoved === 0) continue
      const impact = roleEntry.phaseImpacts.find(pi => pi.phaseLabel === phaseLabel)
      if (impact) slippageWeeks += impact.weeksPerFTE * ftesRemoved
    }
    return { phaseLabel, slippageWeeks, isImpacted: slippageWeeks > 0 }
  })
}
