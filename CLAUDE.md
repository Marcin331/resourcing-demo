# CLAUDE.md

> This file is read automatically by Claude Code at the start of every session.
> It provides persistent project context, conventions, and guidance.

## Project Overview

A polished front-end prototype demo tool for NovaPharma (client name configurable) simulating a pharmaceutical workforce planning and study scenario planning capability. The tool demonstrates an "event → insight → action" narrative flow: a competitor intelligence trigger (GenVara Therapeutics Phase 3 readout in multiple myeloma) drives study impact assessment, interactive scenario planning, and downstream action outputs. Built for use as a live client demo during sales/consulting discussions.

## Config — Change These Before Each Client Demo

All client-facing variables live in one file:

```js
// src/config.js
export const CLIENT_NAME = "NovaPharma";
export const DEMO_PASSWORD = "pharma2025";
```

Change `CLIENT_NAME` to update every mention of the client name across the entire app. Change `DEMO_PASSWORD` to update the password gate.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Charts / Visualisation:** Recharts
- **Routing:** React Router v6
- **Hosting / Deployment:** Vercel (free tier)
- **Data:** Hard-coded demo data in `src/data/demoData.js` — no backend, no API calls

## Architecture

Single-page React application with client-side routing across 4 screens. All data is hard-coded in `demoData.js` and imported directly into components. Slider interactions on the Scenario Planner trigger pure front-end recalculations using simple arithmetic functions defined in `src/utils/scenarioCalculations.js`. The client name is injected everywhere via `CLIENT_NAME` from `src/config.js`. A password gate component wraps the entire app and blocks access until the correct password is entered — stored in component state only, no localStorage.

## Project Structure

```
/                              # Project root
├── CLAUDE.md                  # This file
├── UI Screenshot 1.png        # Design reference — Dashboard (Screen 1)
├── UI Screenshot 2.png        # Design reference — Actions & Outputs (Screen 4) + detail view pattern
├── UI Screenshot 3.png        # Design reference — Impact Assessment (Screen 2) + period cards
src/
├── config.js                  # CLIENT_NAME and DEMO_PASSWORD — edit here
├── main.jsx
├── App.jsx                    # Router setup + PasswordGate wrapper
├── components/
│   ├── PasswordGate.jsx       # Full-screen password entry, blocks app until correct
│   ├── NavBar.jsx             # Top navigation with CLIENT_NAME and brand colours
│   └── shared/
│       ├── StatusBadge.jsx    # Reusable status pill (On Track / At Risk / Accelerate)
│       ├── StudyCard.jsx      # Reusable study summary card
│       └── KpiCard.jsx        # Reusable KPI summary card
├── pages/
│   ├── Dashboard.jsx          # Screen 1 — competitor alert + KPI cards (ref: UI Screenshot 1.png)
│   ├── ImpactAssessment.jsx   # Screen 2 — 3 study cards with AI rationale (ref: UI Screenshot 3.png)
│   ├── ScenarioPlanner.jsx    # Screen 3 — sliders + live Recharts visualisation (ref: UI Screenshot 3.png)
│   └── ActionsOutput.jsx      # Screen 4 — checklist + draft email + Teams prompt (ref: UI Screenshot 2.png)
├── data/
│   └── demoData.js            # All hard-coded demo data — studies, resources, scenario defaults
└── utils/
    └── scenarioCalculations.js # Slider recalculation logic (pure functions)
```

## Demo Scenario

**Trigger Event:** GenVara Therapeutics releases positive interim Phase 3 results for GV-CAR19, a CAR-T therapy in relapsed/refractory multiple myeloma (rrMM), showing 78% ORR and 14-month median PFS — ahead of expected readout by 6 months.

**NovaPharma Studies in Scope:**

| Study ID | Name | Indication | Phase | Status |
|---|---|---|---|---|
| NP-MM-401 | NovaPharma CAR-T rrMM | Rel/Ref Multiple Myeloma | Phase 2 → Phase 3 | **Hero — Accelerate** |
| NP-HEM-215 | NovaPharma BiTE Therapy | Diffuse Large B-Cell Lymphoma | Phase 2 | Deprioritise |
| NP-MM-318 | NovaPharma Bispecific rrMM | Multiple Myeloma (2nd line) | Phase 2 | Deprioritise |

**Scenario Planner Sliders:**
1. **Acceleration Target** — weeks to bring forward NP-MM-401 Phase 3 start (range: 4–20 weeks, default recommended: 12 weeks)
2. **Additional Sites to Enrol** — number of new investigator sites to activate for faster recruitment (range: 5–30, default: 15)
3. **Resource Reallocation (%)** — % of FTEs pulled from deprioritised studies to fund acceleration (range: 10–40%, default: 25%)

**Realistic FTE Data by Role (NP-MM-401 acceleration resource requirements):**
- Clinical Operations: 8 FTEs required, 5 available, 3 gap
- Biostatistics: 3 FTEs required, 2 available, 1 gap
- Medical Affairs: 2 FTEs required, 2 available, 0 gap
- Regulatory Affairs: 2 FTEs required, 1 available, 1 gap
- Data Management: 3 FTEs required, 2 available, 1 gap

## Common Commands

### Install
```bash
npm install
```

### Run
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Coding Conventions

- Use ES modules (`import`/`export`) throughout — no CommonJS
- Functional components only — no class components
- Tailwind CSS utility classes for all styling — no separate CSS files except `index.css` for base styles
- `CLIENT_NAME` from `src/config.js` must be used everywhere the client name appears — never hardcode "NovaPharma" directly in components
- Brand colours defined as Tailwind config extensions:
  - Mulberry red: `#8B1A4A` → `brand-red`
  - Gold: `#C9952A` → `brand-gold`
- Component files use PascalCase, utility files use camelCase
- Keep `demoData.js` as the single source of truth for all data — no data defined inline in components
- Recharts components should be responsive — wrap in `ResponsiveContainer`

## Design System

Three UI reference screenshots are included in the project root. Use these as the primary visual reference when building each screen — they define the target aesthetic and UX patterns:

- **`UI Screenshot 1.png`** — Reference for **Screen 1 (Dashboard)**. Shows: personalised greeting + 3 KPI summary cards at top; kanban-style pipeline columns below (Potential Threat Identified / Disruption Assessment / Disruption Mitigation); alert cards within columns showing material type badges, affected product line pills, and agent action buttons ("Agent is waiting to send an email" / "Agent is working on it"). Adapt this pattern: replace supplier/product line concepts with competitor intelligence alerts and NovaPharma study portfolio concepts.

- **`UI Screenshot 2.png`** — Reference for **Screen 4 (Actions & Outputs)** and the detail view pattern used in **Screen 2 (Impact Assessment)**. Shows: top context bar with back arrow, status badge ("Predicting Risk"), and metadata tags (tier, material, product lines); three-column layout with left agent status timeline, centre incident summary + recommended action headline, right draft email panel with from/to/subject and editable body; final timeline step highlighted in red as a pending approval CTA ("Approve the email to [contact]"). Adapt: replace supplier risk concepts with study acceleration recommendations; replace email recipient with Functional Capacity Manager.

- **`UI Screenshot 3.png`** — Reference for **Screen 2 (Impact Assessment)** card layout and **Screen 3 (Scenario Planner)** period-by-period visualisation. Shows: full-width page title + subtitle; amber disclaimer banner for AI-predicted data; grid of period cards (Week 1–4) each showing a status indicator (On Track ✓ / Disrupted ✗ with colour coding), a resource/stock label with pill badge, and key metrics. Adapt: replace weeks with study phases (Study Start-Up / Recruitment / Interim Analysis / Phase 3 Start); replace material stock with FTE resource metrics; use same green/red status coding.

**General design principles derived from screenshots:**
- Background: `gray-50` base
- Cards: white with `rounded-xl shadow-sm border border-gray-100`
- Status colours: green (on track), `brand-red` (at risk/accelerate), amber (caution/AI disclaimer)
- Typography: clean sans-serif, bold headings, muted subtext in `gray-500`
- CTAs: `brand-red` primary buttons, `brand-gold` accent highlights
- Agent/AI reasoning steps: vertical timeline on left panel with icon + label + timestamp per step (see UI Screenshot 2.png left column)
- Pending action steps: highlighted with red border and prominent approve/action CTA (see UI Screenshot 2.png bottom timeline item)
- Metadata context bar at top of detail screens: back arrow + status badge + tag pills (see UI Screenshot 2.png top bar)
- Competitor alert: prominent banner card with severity badge, material/study type tags, and affected study pills (see UI Screenshot 1.png alert cards)

## Workflows

### Adding or Editing Demo Data
1. All data changes go in `src/data/demoData.js` only
2. Slider recalculation logic changes go in `src/utils/scenarioCalculations.js`
3. Never define data inline in page components
4. After changes, run `npm run dev` and walk through the full demo flow to verify

### Adding a New Screen
1. Create the page component in `src/pages/`
2. Add the route in `App.jsx`
3. Add the nav link in `NavBar.jsx`
4. Follow existing page structure — import data from `demoData.js`, use shared components

### Modifying the Scenario Planner
1. Slider ranges and defaults are defined in `demoData.js` under `scenarioDefaults`
2. Recalculation functions are in `scenarioCalculations.js` — pure functions only, no side effects
3. Charts must update reactively as slider state changes — use `useState` for slider values and derive chart data inline

### Pre-Demo Checklist
1. Update `CLIENT_NAME` in `src/config.js` if needed
2. Update `DEMO_PASSWORD` in `src/config.js` if needed
3. Run `npm run build` and deploy to Vercel
4. Walk through the full 4-screen demo flow end to end before the meeting

## Development Phases

### Phase 1 — MVP (Current)
- [ ] Project scaffold (Vite + React + Tailwind + Recharts + React Router)
- [ ] `config.js` with CLIENT_NAME and DEMO_PASSWORD
- [ ] `demoData.js` with all realistic hard-coded scenario data
- [ ] `scenarioCalculations.js` with slider recalculation logic
- [ ] PasswordGate component
- [ ] NavBar with brand colours
- [ ] Screen 1: Dashboard — GenVara alert banner, KPI cards, CTA
- [ ] Screen 2: Impact Assessment — 3 study cards with AI rationale
- [ ] Screen 3: Scenario Planner — 3 sliders, live Recharts bar chart, trade-off panel
- [ ] Screen 4: Actions & Outputs — action checklist, draft email, Teams prompt
- [ ] Vercel deployment

### Phase 2 — Enhancements (Future)
- [ ] Second demo scenario (e.g. internal safety signal trigger)
- [ ] Animated transitions between screens
- [ ] Exportable PDF summary of selected scenario
- [ ] Additional therapy area scenarios
- [ ] Integration with real data sources

## Key Constraints & Warnings

- `CLIENT_NAME` must never be hardcoded in components — always imported from `config.js`
- Password is stored in component state only — do not use localStorage or sessionStorage
- All slider calculations are front-end only — keep them simple, deterministic, and based on `demoData.js` values
- Recharts must always be wrapped in `ResponsiveContainer` — otherwise charts break on smaller screens
- This is a demo prototype — do not add real API calls, authentication services, or database connections
- Keep the demo flow linear: Dashboard → Impact Assessment → Scenario Planner → Actions. Navigation should guide the user through this sequence naturally
- Tailwind brand colours (`brand-red`, `brand-gold`) must be defined in `tailwind.config.js` before use

## Domain Terminology

- **CAR-T**: Chimeric Antigen Receptor T-cell therapy — a type of cell and gene therapy
- **rrMM**: Relapsed/Refractory Multiple Myeloma — the target patient population
- **ORR**: Overall Response Rate — key efficacy endpoint in oncology trials
- **PFS**: Progression-Free Survival — key survival endpoint
- **FTE**: Full-Time Equivalent — unit of resource measurement
- **Study Start-Up**: Pre-recruitment phase including site activation and regulatory submissions
- **Phase 2 → Phase 3**: The hero study NP-MM-401 is completing Phase 2 and planning Phase 3 start
- **Investigator Sites**: Clinical sites (hospitals/clinics) that enrol patients into the trial
- **Capacity Manager**: The functional lead responsible for FTE allocation across studies
- **CGT**: Cell and Gene Therapy — NovaPharma's strategic growth area (target: 20% → 50% by 2030)
- **Indication**: The disease or condition a study is targeting (e.g. multiple myeloma)
