# CLAUDE.md

> This file is read automatically by Claude Code at the start of every session.
> It provides persistent project context, conventions, and guidance.

## Project Overview

A polished front-end prototype for a client demo showcasing strategic workforce scenario planning for a pharmaceutical company. The app allows users to simulate how portfolio shifts (e.g. increasing cell & gene therapy studies, moving work to LATAM) affect future FTE requirements, workforce gaps, and costs. All data is hard-coded and realistic-looking — there is no backend.

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Language:** JavaScript (no TypeScript)
- **Package Manager:** npm
- **Linting / Formatting:** ESLint + Prettier
- **Hosting:** Vercel (free tier)

## Architecture

Single-page React application. All simulation data is hard-coded in a `/src/data` directory. Slider interactions update local React state, which is passed as props to chart and summary components. No API calls, no backend, no database.

The app has two layers:
1. **Password screen** — shown on first load, hard-coded password grants access
2. **Main app** — left nav + page content area

## Project Structure
```
src/
├── components/
│   ├── auth/
│   │   └── PasswordScreen.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   ├── simulation/
│   │   ├── ScenarioSelector.jsx
│   │   ├── SimulationLevers.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── GapByRoleChart.jsx
│   │   ├── GapByLocationChart.jsx
│   │   ├── GapBySkillChart.jsx
│   │   └── GapTrendChart.jsx
│   └── pages/
│       ├── ScenarioSimulation.jsx
│       ├── ScenarioLibrary.jsx
│       ├── ScenarioSetup.jsx
│       ├── PortfolioBuilder.jsx
│       ├── ResultsDashboard.jsx
│       └── Admin.jsx
├── data/
│   └── simulationData.js
├── App.jsx
└── main.jsx
```

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

### Lint
```bash
npm run lint
```

### Format
```bash
npx prettier --write .
```

### Deploy (Vercel CLI)
```bash
vercel --prod
```

## Git & Vercel Deployment Workflow

This project uses GitHub + Vercel for continuous deployment. Every push to `main` automatically redeploys the live site.

### One-time setup
1. Create a free account at vercel.com (sign up with GitHub recommended)
2. Install Vercel CLI: `npm install -g vercel`
3. Create a GitHub repository for this project
4. Push the project to GitHub:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
5. Connect the GitHub repo to Vercel:
   - Go to vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Vite and configure build settings
   - Click Deploy

### Ongoing deployment
After the one-time setup, deploying is just:
```bash
git add .
git commit -m "your commit message"
git push
```
Vercel will automatically redeploy on every push to `main`. The live URL will be in the format `your-project-name.vercel.app`.

### Manual deploy (optional)
If you need to deploy without pushing to GitHub:
```bash
vercel --prod
```

## Coding Conventions

- Use functional React components with hooks only — no class components
- Keep components small and focused — one responsibility per component
- All hard-coded demo data lives in `src/data/simulationData.js` — never inline data in components
- Use Tailwind utility classes for all styling — no separate CSS files unless absolutely necessary
- Use `camelCase` for variables and functions, `PascalCase` for component filenames
- Prefer `const` over `let` — avoid `var`
- Import order: React first, then third-party libraries, then local components, then data
- ESLint and Prettier configs should be initialised at project setup

## Brand & Visual Design

- **Primary colour (mulberry red):** `#8B1A4A` — use for active nav items, primary buttons, key highlights, header accents
- **Secondary colour (gold):** `#D4A017` — use for CTAs (e.g. "Run Compare" button), slider thumb/active state, delta value highlights
- **Background:** Light grey (`#F5F6FA`) for the page, white cards for panels
- **Text:** Dark grey (`#1F2937`) for headings, medium grey (`#6B7280`) for labels
- **Nav sidebar:** White background, mulberry red for active item, grey for inactive
- **Positive deltas** (increases in gap/cost): mulberry red with `+` prefix
- **Charts:** Use blue (`#3B82F6`) as the primary bar/line colour for chart data
- **Typography:** Use system font stack or Inter via Google Fonts

## Page Layout — Scenario Simulation

This is the only fully functional page. Build it to match the following structure:

### Top bar
- Company logo area (top left) — show generic two-letter user initials (e.g. "JD") in a coloured avatar
- Page title: "Scenario Simulation" with subtitle "Compare scenarios and simulate levers"
- Top right: "Scenario ▼" and "Year ▼" filter dropdowns (can be non-functional placeholders)

### Scenario selector row (below top bar)
- **Scenario A (baseline):** Dropdown — default "2026-2030 Baseline"
- **Scenario B (simulation):** Dropdown — default "CGT Expansion + LATAM"
- **Year range:** Text field or label — default "2026-2030"
- **Run Compare button:** Gold background, dark text — triggers chart/card update
- **Save as Scenario button:** Outlined style

### Left panel — Simulation Levers
Four sliders, each with a label and a current value display showing the delta (e.g. "35% → 50%"):
1. **CGT % of portfolio** — range 0–100%, default 35%, simulation value 50%
2. **Shift studies to LATAM** — range 0–50%, default 10%, simulation value 25%
3. **Increase capacity in BR** — range 0–10 FTE, default 0, simulation value +5 FTE
4. **Cost inflation** — range 0–10% per year, default 3%, simulation value 3%

Slider thumb colour: gold (`#D4A017`). Include a dev note at the bottom: "Levers can be hard-coded for demo."

### Summary cards row (top right of main content)
Three cards showing delta values between Scenario B and Scenario A:
- **Δ Required FTE** — e.g. "+6.2" in mulberry red
- **Δ Gap (FTE)** — e.g. "+4.7" with label "worse vs baseline" in mulberry red
- **Δ Cost (USD)** — e.g. "+$7.8M" with label "per year view" in mulberry red

All delta values should update reactively when sliders move.

### Chart grid (2x2)
- **Top left:** Δ Gap by role (FTE) — vertical bar chart — roles: CRA, DM, CPM, Stats, Reg, PV
- **Top right:** Δ Gap by location (FTE) — vertical bar chart — locations: US-NE, UK, DE, BR, CN, IN
- **Bottom left:** Δ Gap by skill (share) — pie/donut chart — segments: Site Ops 38%, Data/DM 21%, Clinical 17%, Reg 12%, PV 12%
- **Bottom right:** Gap trend: A vs B (FTE) — dual line chart — years 2026–2030, two lines (Scenario A in grey, Scenario B in mulberry red)

All charts should update reactively when sliders move.

### Placeholder pages
All other nav pages (Scenario Library, Scenario Setup, Portfolio Builder, Results Dashboard, Admin) should render a simple centred message: "This section is coming soon." No other content needed.

## Simulation Logic

All data is hard-coded but should respond to slider changes to create a believable demo. Use the following approach:

- Define a `baselineData` object and a `simulationData` object in `src/data/simulationData.js`
- When sliders move, interpolate between baseline and simulation values using a simple linear scale based on slider position
- This gives the impression of a live calculation without any real model
- The four summary card values and all four charts should derive from this interpolation

## Password Screen

- Full-page centred layout with company branding
- Single password input field + "Enter Demo" button (gold)
- Hard-coded password: `demo2026`
- On correct entry, set authenticated state to `true` and show the main app
- On incorrect entry, show a brief error message: "Incorrect password. Please try again."
- Store auth state in React state only — no localStorage, no cookies

## Workflows

### Adding a New Feature
1. Read relevant existing components first — do not write code yet
2. Check `src/data/simulationData.js` to understand the data shape before touching components
3. Plan the approach if the change touches more than two files
4. Implement, then verify visually in Chrome
5. Run `npm run lint` and fix any issues before finishing
6. Commit with a clear descriptive message

### Fixing a Bug
1. Reproduce the issue in Chrome or Edge first
2. Identify the root cause — do not patch symptoms
3. Fix and verify
4. Commit

### Updating Chart Data or Simulation Values
1. All changes to demo data should be made in `src/data/simulationData.js` only
2. Never hardcode data values directly inside components

## Development Phases

### Phase 1 — MVP
- [ ] Project scaffolding (Vite + React + Tailwind + Recharts)
- [ ] Password screen with hard-coded access control
- [ ] App shell: sidebar nav + top bar + page routing
- [ ] Placeholder pages for all non-simulation nav items
- [ ] Hard-coded simulation data in `src/data/simulationData.js`
- [ ] Simulation levers panel with four working sliders
- [ ] Three summary cards with reactive delta values
- [ ] Four charts with reactive data (bar x2, pie x1, line x1)
- [ ] Brand colours applied throughout (mulberry red + gold)
- [ ] Verified working in Chrome and Edge
- [ ] Deployed to Vercel

### Phase 2 — Future Enhancements (out of scope for now)
- [ ] Scenario Library page
- [ ] Scenario Setup page
- [ ] Portfolio Builder page
- [ ] Results Dashboard page
- [ ] Real data integration
- [ ] User authentication (proper)

## Key Constraints & Warnings

- **No backend** — all data is hard-coded; do not introduce any API calls or server-side logic
- **Demo only** — this is not production code; prioritise appearance and interactivity over robustness
- **No TypeScript** — keep it plain JavaScript throughout
- **No localStorage** — password auth state lives in React state only and resets on page refresh (intentional)
- **Vercel free tier** — no server-side features; deploy as a static site
- **Browser target** — Chrome and Edge only; do not spend time on Safari or Firefox compatibility
- **Chart library** — use Recharts only; do not introduce a second charting library

## Domain Terminology

- **FTE** — Full Time Equivalent; a unit of workforce capacity (1.0 FTE = one full-time person)
- **CGT** — Cell and Gene Therapy; a specialist and growing area of the pharma portfolio
- **Gap (FTE)** — the difference between required FTE and available FTE; positive gap = under-resourced
- **Baseline scenario** — the current projected state of the portfolio and workforce
- **Simulation scenario** — an alternative future state being modelled against the baseline
- **LATAM** — Latin America; a target region for study delivery and location strategy optimisation
- **BR** — Brazil; a specific LATAM location referenced in the simulation levers
- **CRA** — Clinical Research Associate
- **DM** — Data Manager
- **CPM** — Clinical Project Manager
- **Reg** — Regulatory Affairs
- **PV** — Pharmacovigilance