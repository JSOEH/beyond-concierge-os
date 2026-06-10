# Beyond Concierge — Executive Operating System

A premium business-intelligence command center for a luxury medical concierge brand.
One source of truth across **finance, operations, inventory, marketing, social, advertising,
CRM, and growth** — built to feel like Stripe, Linear, and Ramp, not a spreadsheet.

> Theme: clean ivory background · charcoal accents · gold highlights · fully mobile responsive.

---

## What's inside

| # | Module | What it answers |
|---|--------|-----------------|
| 1 | **Executive Snapshot** | Where revenue comes from, the full P&L, KPIs, and 12-month trends |
| 2 | **Profit Engine** | True cost & margin on every service, with automatic rankings |
| 3 | **IV Recipe Calculator** | Live drip costing + automatic inventory deduction |
| 4 | **GLP-1 Margin Center** | Cost-per-mg, profit per patient, profit per vial |
| 5 | **Inventory Command** | Stock, reorder alerts, expiry watch, fast/slow movers |
| 6 | **Website & SEO** | Traffic, rankings, Google Business Profile, fix-list |
| 7 | **Social Command** | Channel health, content calendar, AI content assistant |
| 8 | **Advertising** | ROAS / CAC by campaign + budget reallocation calls |
| 9 | **CRM & Partnerships** | Gyms, doctors, influencers ranked by revenue driven |
| 10 | **90-Day Growth Plan** | Foundation → Awareness → Scale, with live task tracking |
| ★ | **AI Advisor** | Cross-module issues, opportunities, and a weekly executive brief |

Plus a built-in **Guided Tour** (the "Take the tour" button, bottom-right) that walks an
owner through every module — your interactive product demo.

---

## Tech stack

- **React 18 + TypeScript + Vite** — fast, modern, static-deployable
- **Tailwind CSS** — the luxury design system (`tailwind.config.js`)
- **Recharts** — all charts
- **Framer Motion** — page + component motion
- **Zustand** — live inventory state (IV + GLP-1 deduction)
- **React Router** — route-based code splitting for fast loads

---

## Quick start

```bash
pnpm install      # or: npm install
pnpm dev          # http://localhost:5173
```

Build for production:

```bash
pnpm build        # outputs to /dist
pnpm preview      # serve the production build locally
pnpm typecheck    # strict TypeScript check (no emit)
```

Node 18+ required (built and tested on Node 26).

---

## Deployment

This is a static single-page app — host it anywhere. SPA route rewrites are already configured.

**Vercel** (recommended)
```bash
npm i -g vercel
vercel            # framework auto-detected; vercel.json handles SPA rewrites
```

**Netlify**
```bash
# Build command: pnpm build   ·   Publish directory: dist
# public/_redirects already handles SPA routing
netlify deploy --prod
```

**Any static host / S3 / Nginx**
Serve `/dist` and rewrite all unknown paths to `/index.html` (required for client-side routing).
Nginx example:
```nginx
location / { try_files $uri $uri/ /index.html; }
```

---

## Admin access & data

This build ships with **realistic demo data** and no backend — it runs entirely client-side,
so it's safe to share a live preview without exposing real numbers.

- **All sample data lives in `src/data/`** — one file per domain. Edit these to plug in
  Beyond Concierge's real figures (see table below). Numbers recompute automatically.
- **Live, stateful features** (IV dispense, GLP-1 dosing) use an in-memory store
  (`src/store/useInventory.ts`). State resets on page refresh; each calculator has a
  **"Reset demo"** button.
- There is **no login** by design (single-tenant owner tool). To gate it, put it behind
  Vercel/Netlify password protection, Cloudflare Access, or a reverse-proxy basic-auth —
  this keeps credentials out of the app entirely.

| Edit this file | To change |
|----------------|-----------|
| `src/data/services.ts` | Service prices, costs, volumes (drives Profit Engine + Executive) |
| `src/data/revenue.ts` | P&L lines, KPI deltas, trend curve |
| `src/data/iv.ts` | IV ingredients, costs, suppliers, recipes |
| `src/data/glp1.ts` | GLP-1 vials, lots, patients, doses |
| `src/data/inventory.ts` | Full inventory catalog + reorder/expiry |
| `src/data/seo.ts` · `social.ts` · `ads.ts` · `crm.ts` · `growth.ts` | Each respective module |
| `src/data/advisor.ts` | Advisor logic (reads from the others) |

### Going live with a real backend (optional)
`docs/SCHEMA.sql` contains a Postgres schema that mirrors this data model 1:1. Wire it to a
backend (Supabase, Postgres, or your EMR/POS exports) and replace the `src/data/*` imports
with fetch calls — the components stay unchanged.

---

## Branding

- Colors: `tailwind.config.js` → `theme.extend.colors` (`charcoal`, `gold`, `paper`)
- Fonts: Fraunces (display) + Inter (body), loaded in `index.html`
- Logo/wordmark: `src/components/Sidebar.tsx` and `public/favicon.svg`

---

## Project structure

```
src/
  main.tsx            # router + lazy-loaded routes
  index.css           # design-system base layer
  nav.ts              # sidebar navigation config
  lib/                # formatters (usd, %, compact), chart palette, cn()
  data/               # all sample data (edit here)
  store/              # zustand: inventory + tour state
  components/         # Shell, Sidebar, charts, UI primitives, GuidedTour
  modules/            # the 11 screens (one file each)
docs/
  SCHEMA.sql          # database schema reference
  VIDEO_SCRIPT.md     # 3–5 min demo walkthrough script + shot list
```
