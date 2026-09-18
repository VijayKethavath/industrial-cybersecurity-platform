# CyberShield OT — Industrial Cybersecurity Platform

> Frontend + UX Design Challenge — High-Fidelity Prototype

A polished, enterprise-grade **Industrial / Operational Technology (OT) Cybersecurity Platform** frontend prototype demonstrating strong product thinking, UX reasoning, and technical execution.

---

## Overview

This prototype answers the **Frontend + UX Design Challenge** for an Industrial Cybersecurity Platform. It models a real security product used by:

- **Security Leadership / CISOs** — posture overview, priority risks, business impact
- **SOC / Security Analysts** — fast triage, findings, attack path investigation
- **OT Security Analysts** — asset context, protocols, zones, operational state
- **Site / Plant Operators** — operational impact, critical systems, accessible information

---

## Features

### Security Dashboard (`/dashboard`)
- **Security Posture Score** with trend, supporting KPIs, and contextual explanation
- **Priority Attention** — critical findings, high-risk paths, exposed critical assets
- **Risk & Findings** — severity distribution chart, 8-day trend line, recent critical findings
- **Asset Visibility** — inventory stats, device type distribution, protocol breakdown
- **Featured Attack Path Preview** — interactive chain visualization with path metadata
- **Network Topology** — zone map with cross-zone communication indicators
- **Recent Changes Timeline** — timestamped security events
- **Sensor & Platform Health** — degraded data communication, coverage indicators

### Attack Path Map (`/attack-path`)
- **React Flow graph** with custom OT node types and edge semantics
- **Multiple attack paths** — switchable via path panel
- **Node roles** — Source, Pivot, Target/Crown Jewel, Reachable
- **Edge types** — Suspicious (dashed red), Cross-zone (dashed orange), Normal (gray)
- **Investigation Side Panel** — Summary, Why It Matters, Evidence, Findings, Actions
- **Focus Mode** — dims unrelated nodes for path clarity
- **Minimap** — toggleable navigation minimap
- **Keyboard accessible** — all nodes and edges navigable via keyboard

### Design States
- ✅ Normal / healthy state
- ✅ Degraded sensor state with explicit data-quality banners
- ✅ Partial data indicators on nodes and paths
- ✅ Unknown/uncertain asset classification
- ✅ Empty state handling
- ✅ Confidence indicators (High/Medium/Low/Unknown)

---

## Design Approach

**Color palette**: Orange (#F97316) + Black/Dark Charcoal + White  
- Orange used deliberately: active navigation, primary actions, alert highlights, selected paths
- Severity always communicated via: icon + label + color (never color alone)
- WCAG 2.2-aligned: visible focus states, role labels, semantic HTML, aria attributes

**Information hierarchy**:
1. Security posture + urgent items (above the fold)
2. Critical risks, attack paths, exposed assets
3. Asset visibility, network insights
4. Recent changes, sensor health

**Attack path overload prevention**:
- Focus mode dims unrelated nodes
- Path-level switching via sidebar panel
- Edge labels use progressive disclosure
- Minimap for spatial orientation

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Design system / styling |
| React Flow | Attack path graph |
| Recharts | Charts (findings, trend, distribution) |
| Lucide React | Icon library |
| React Router v6 | Client-side routing |
| clsx | Class name composition |

---

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel dashboard](https://vercel.com)
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. SPA routing is handled by `vercel.json`

### Render (Static Site)

1. Create a new **Static Site** in Render
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add a rewrite rule: `/* → /index.html` (200)

---

## Project Structure

```
src/
  components/
    ui/               # Design system components (Button, Badge, Card, etc.)
    dashboard/        # Dashboard section components
    attack-path/      # Graph nodes, edges, investigation panel
    layout/           # AppShell, Sidebar, Header, FilterBar
    charts/           # Chart wrappers
  pages/
    Dashboard.tsx     # Main security dashboard
    AttackPath.tsx    # Attack path investigation workspace
  data/               # Static mock data (no backend required)
    assets.ts
    findings.ts
    attackPaths.ts
    sites.ts
    sensors.ts
    timeline.ts
    posture.ts
  types/
    index.ts          # TypeScript type definitions
  utils/
    designSystem.ts   # Severity/status/confidence config + formatters
  styles/
    globals.css       # Tailwind base + custom utilities
```

---

## Environment Variables

No environment variables are required. All data is static mock data bundled with the application.

---

## GitHub Safety

This repository contains no API keys, passwords, authentication secrets, or private credentials. It is safe to push publicly to GitHub.
