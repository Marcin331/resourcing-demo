// ─────────────────────────────────────────────────────────────────────────────
// Competitor Intelligence Event
// ─────────────────────────────────────────────────────────────────────────────
export const competitorAlert = {
  competitor: 'GenVara Therapeutics',
  product: 'GV-CAR19',
  indication: 'Relapsed/Refractory Multiple Myeloma (rrMM)',
  trialPhase: 'Phase 3 Interim',
  readoutDate: '14 Feb 2025',
  keyFindings: {
    orr: '78%',
    medianPFS: '14 months',
    earlyReadout: '6 months ahead of expected readout',
  },
  severity: 'High',
  summary:
    'GenVara Therapeutics has released positive interim Phase 3 data for GV-CAR19 (CAR-T therapy) in rrMM — 78% ORR and 14-month median PFS, coming 6 months ahead of schedule. This represents a material competitive threat to NovaPharma\'s CAR-T programme and creates urgency to accelerate NP-MM-401 into Phase 3.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard KPI Cards
// ─────────────────────────────────────────────────────────────────────────────
export const kpiCards = [
  {
    id: 'kpi-1',
    label: 'Studies in Active Portfolio',
    value: '12',
    delta: '+2 vs last quarter',
    deltaPositive: true,
  },
  {
    id: 'kpi-2',
    label: 'Studies At Risk (FTE Gap)',
    value: '3',
    delta: '+1 this week',
    deltaPositive: false,
  },
  {
    id: 'kpi-3',
    label: 'Total FTE Capacity (CGT)',
    value: '47',
    delta: '−5 vs plan',
    deltaPositive: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Studies in Scope
// ─────────────────────────────────────────────────────────────────────────────
export const studies = [
  {
    id: 'NP-MM-401',
    name: 'NovaPharma CAR-T rrMM',
    shortName: 'NP-MM-401',
    indication: 'Relapsed/Refractory Multiple Myeloma',
    phase: 'Phase 2 → Phase 3',
    modality: 'CAR-T',
    status: 'accelerate',
    statusLabel: 'Accelerate',
    priority: 'Hero',
    recommendation:
      'Accelerate Phase 3 start by 12 weeks. Competitor readout materially de-risks the rrMM market window. Moving fast is essential to maintain first-mover advantage in this indication.',
    aiRationale: [
      'GenVara GV-CAR19 interim data (78% ORR, 14m PFS) exceeds current NP-MM-401 Phase 2 benchmarks',
      'FDA Breakthrough Therapy designation pathway is time-sensitive — window closes if competitor receives BTD first',
      'Current Phase 2 data package is sufficient to support accelerated Phase 3 IND submission',
      'Site activation at 3 existing Phase 2 sites can begin immediately, reducing start-up latency',
    ],
    phases: [
      {
        id: 'startup',
        label: 'Study Start-Up',
        status: 'at-risk',
        fteRequired: 8,
        fteAvailable: 5,
        fteGap: 3,
        role: 'Clinical Operations',
        note: '3 FTE gap — requires reallocation from deprioritised studies',
      },
      {
        id: 'recruitment',
        label: 'Recruitment',
        status: 'at-risk',
        fteRequired: 12,
        fteAvailable: 9,
        fteGap: 3,
        role: 'Clinical Operations + Data Mgmt',
        note: 'Additional 15 sites needed to hit accelerated enrolment target',
      },
      {
        id: 'interim',
        label: 'Interim Analysis',
        status: 'on-track',
        fteRequired: 5,
        fteAvailable: 5,
        fteGap: 0,
        role: 'Biostatistics',
        note: 'Biostatistics team fully resourced for interim',
      },
      {
        id: 'phase3',
        label: 'Phase 3 Start',
        status: 'on-track',
        fteRequired: 4,
        fteAvailable: 4,
        fteGap: 0,
        role: 'Regulatory Affairs',
        note: 'Regulatory submission on track pending start-up resolution',
      },
    ],
  },
  {
    id: 'NP-HEM-215',
    name: 'NovaPharma BiTE Therapy',
    shortName: 'NP-HEM-215',
    indication: 'Diffuse Large B-Cell Lymphoma (DLBCL)',
    phase: 'Phase 2',
    modality: 'BiTE',
    status: 'deprioritise',
    statusLabel: 'Deprioritise',
    priority: 'Standard',
    recommendation:
      'Deprioritise NP-HEM-215 to release FTE capacity. DLBCL indication is less strategically urgent and competitor impact is indirect. Pausing non-critical activities preserves budget for NP-MM-401 acceleration.',
    aiRationale: [
      'DLBCL indication not directly impacted by GV-CAR19 rrMM data',
      'NP-HEM-215 is mid-Phase 2 with no upcoming readout milestone in the next 6 months',
      'Releasing 4 FTEs (Clinical Ops + Data Management) covers 60% of the NP-MM-401 FTE gap',
      'No active enrolment pause required — only non-critical monitoring activities to be deferred',
    ],
    phases: [
      {
        id: 'recruitment',
        label: 'Recruitment',
        status: 'on-track',
        fteRequired: 6,
        fteAvailable: 6,
        fteGap: 0,
        role: 'Clinical Operations',
        note: 'Active enrolment continues — pause non-critical monitoring only',
      },
      {
        id: 'monitoring',
        label: 'Site Monitoring',
        status: 'on-track',
        fteRequired: 4,
        fteAvailable: 4,
        fteGap: 0,
        role: 'Clinical Operations',
        note: 'Defer non-critical site visits — 2 FTE reallocation possible',
      },
    ],
  },
  {
    id: 'NP-MM-318',
    name: 'NovaPharma Bispecific rrMM',
    shortName: 'NP-MM-318',
    indication: 'Multiple Myeloma (2nd line)',
    phase: 'Phase 2',
    modality: 'Bispecific Antibody',
    status: 'deprioritise',
    statusLabel: 'Deprioritise',
    priority: 'Standard',
    recommendation:
      'Deprioritise NP-MM-318 given competitive pressure and overlapping indication with NP-MM-401. Redirecting Bispecific programme resources to CAR-T acceleration maximises strategic return.',
    aiRationale: [
      'NP-MM-318 targets 2nd-line rrMM — adjacent to GV-CAR19 competitive pressure',
      'CAR-T (NP-MM-401) is the strategic priority in rrMM; Bispecific is secondary modality',
      'NP-MM-318 mid-Phase 2 data not expected until Q4 2025 — deprioritisation has low near-term cost',
      '3 FTE release (Regulatory + Data Management) covers remaining NP-MM-401 gap',
    ],
    phases: [
      {
        id: 'recruitment',
        label: 'Recruitment',
        status: 'on-track',
        fteRequired: 5,
        fteAvailable: 5,
        fteGap: 0,
        role: 'Clinical Operations',
        note: 'Maintain minimum viable enrolment cadence',
      },
      {
        id: 'data',
        label: 'Data Management',
        status: 'on-track',
        fteRequired: 3,
        fteAvailable: 3,
        fteGap: 0,
        role: 'Data Management',
        note: '2 FTE reallocation possible without impacting database lock timeline',
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Scenario Planner — Defaults & Ranges
// ─────────────────────────────────────────────────────────────────────────────
export const scenarioDefaults = {
  accelerationWeeks: {
    min: 4,
    max: 20,
    default: 12,
    label: 'Acceleration Target (weeks)',
    description: 'Weeks to bring forward NP-MM-401 Phase 3 start',
  },
  additionalSites: {
    min: 5,
    max: 30,
    default: 15,
    label: 'Additional Investigator Sites',
    description: 'New sites to activate for faster patient recruitment',
  },
  reallocationPct: {
    min: 10,
    max: 40,
    default: 25,
    label: 'Resource Reallocation (%)',
    description: '% of FTEs reallocated from deprioritised studies',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FTE Resource Requirements for NP-MM-401 Acceleration
// ─────────────────────────────────────────────────────────────────────────────
export const fteRequirements = [
  { role: 'Clinical Operations', required: 8, available: 5, gap: 3 },
  { role: 'Biostatistics', required: 3, available: 2, gap: 1 },
  { role: 'Medical Affairs', required: 2, available: 2, gap: 0 },
  { role: 'Regulatory Affairs', required: 2, available: 1, gap: 1 },
  { role: 'Data Management', required: 3, available: 2, gap: 1 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Actions & Outputs
// ─────────────────────────────────────────────────────────────────────────────
export const actionChecklist = [
  {
    id: 'action-1',
    title: 'Notify Functional Capacity Manager',
    description: 'Alert the CGT Capacity Manager to initiate FTE reallocation from NP-HEM-215 and NP-MM-318',
    owner: 'Programme Director',
    priority: 'Critical',
    completed: false,
  },
  {
    id: 'action-2',
    title: 'Submit Phase 3 IND Amendment',
    description: 'File accelerated Phase 3 IND amendment with FDA — target submission within 4 weeks',
    owner: 'Regulatory Affairs',
    priority: 'Critical',
    completed: false,
  },
  {
    id: 'action-3',
    title: 'Activate Additional Investigator Sites',
    description: 'Initiate site activation at 15 additional Phase 3 sites to meet accelerated enrolment target',
    owner: 'Clinical Operations',
    priority: 'High',
    completed: false,
  },
  {
    id: 'action-4',
    title: 'Revise Study Budget',
    description: 'Update NP-MM-401 budget to reflect accelerated timeline, additional sites, and FTE reallocation costs',
    owner: 'Finance Business Partner',
    priority: 'High',
    completed: false,
  },
  {
    id: 'action-5',
    title: 'Brief Executive Leadership',
    description: 'Present competitive landscape update and acceleration rationale to Chief Medical Officer and CSO',
    owner: 'Programme Director',
    priority: 'Medium',
    completed: false,
  },
]

export const draftEmail = {
  from: 'alex.morgan@novapharma.com',
  to: 'sarah.chen@novapharma.com',
  toName: 'Sarah Chen, CGT Functional Capacity Manager',
  subject: 'URGENT: FTE Reallocation Required — NP-MM-401 Phase 3 Acceleration',
  body: `Dear Sarah,

I'm reaching out following this morning's competitive intelligence briefing on GenVara Therapeutics' Phase 3 interim results for GV-CAR19 in relapsed/refractory multiple myeloma (78% ORR, 14-month median PFS — 6 months ahead of expected readout).

Given the material competitive threat, we have made the decision to accelerate NP-MM-401 Phase 3 start by 12 weeks. This requires immediate FTE reallocation from our deprioritised studies.

**Reallocation Required:**
• 3 FTE (Clinical Operations) from NP-HEM-215 → NP-MM-401
• 2 FTE (Data Management) from NP-MM-318 → NP-MM-401
• 1 FTE (Regulatory Affairs) from NP-MM-318 → NP-MM-401

**Total: 6 FTE reallocation effective 01 March 2025**

Could you please confirm capacity and initiate the formal reallocation process? I've attached the updated scenario plan for your review.

We will also be activating 15 additional investigator sites — your team will receive site activation packs from Clinical Operations by end of week.

Please let me know if you have any questions or need to discuss further.

Best regards,
Alex Morgan
Programme Director, CGT Portfolio`,
}

export const teamsPrompt = {
  channel: 'CGT Portfolio — Leadership',
  message: `🚨 **Competitive Alert — Action Required**

GenVara Phase 3 interim data (GV-CAR19, rrMM) released today. 78% ORR / 14m PFS — ahead of schedule by 6 months.

**Decision taken:** Accelerate NP-MM-401 Phase 3 start by 12 weeks.

**Immediate actions:**
✅ FTE reallocation initiated (6 FTE from NP-HEM-215 / NP-MM-318)
✅ Additional 15 investigator sites to be activated
⏳ Phase 3 IND amendment — Regulatory Affairs to file within 4 weeks
⏳ Budget revision — Finance to update by end of week

Full scenario plan available in the Workforce Planning tool. CMO briefing scheduled for Thursday.

— Alex Morgan, Programme Director`,
}
