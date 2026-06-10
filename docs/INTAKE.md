# Real-Numbers Intake — Beyond Concierge Executive OS

Fill in whatever you know. **Anything you leave blank keeps the realistic demo value**, so you
can do this in passes. The fastest high-impact set is **§1 Services** and **§2 Monthly P&L** —
those drive the Executive Snapshot and Profit Engine, which is most of the dashboard.

Paste this back to me filled in (rough numbers are fine) and I'll wire it in and redeploy.
File it maps to is shown in `(…)` so you can also edit directly.

---

## §1 — Services  *(src/data/services.ts)* ⭐ highest impact
For each service: **retail price · product cost · nurse cost · labor/overhead · # done per month**.
Card fees are auto-calculated (2.9% + $0.30).

| Service | Retail | Product cost | Nurse cost | Labor | Volume/mo |
|---|---|---|---|---|---|
| Botox (40u) | 480 | 220 | 60 | 18 | 142 |
| Dysport | 420 | 178 | 55 | 16 | 38 |
| Dermal Fillers | 695 | 290 | 85 | 20 | 64 |
| ThinWorks | 400 | 42 | 70 | 22 | 96 |
| IV Therapy | 185 | 38 | 42 | 12 | 168 |
| NAD+ | 650 | 232 | 95 | 18 | 41 |
| Semaglutide | 399 | 96 | 28 | 14 | 188 |
| Tirzepatide | 549 | 168 | 28 | 14 | 121 |
| Vitamin Injections | 35 | 6 | 9 | 5 | 263 |
| Concierge House Call | 275 | 12 | 120 | 24 | 58 |
| Membership | 199 | 0 | 22 | 10 | 312 |
| _add/remove rows as needed_ | | | | | |

## §2 — Monthly P&L  *(src/data/revenue.ts)* ⭐
Only the fixed/overhead lines — revenue & inventory cost compute from §1.

| Line | Demo value |
|---|---|
| Payroll | 71,500 |
| Contractor costs | 18,400 |
| Nurse costs (total) | 39,200 |
| Marketing costs | 27,600 |
| Card-fee rate | 2.5% |
| Refund rate | 1.1% |
| Avg transactions/mo (for avg-ticket) | 980 |

## §3 — IV Calculator  *(src/data/iv.ts)*
Per ingredient: **$ per unit · supplier · units on hand · reorder level**. Then your recipe menu
(which ingredients + amounts + retail price). Current ingredients: Vitamin C, B-Complex, B12,
Glutathione, NAD+, Magnesium, Zinc, Taurine, Amino Blend, Calcium, Saline Bag.

## §4 — GLP-1  *(src/data/glp1.ts)*
- **Vials:** lot · purchase cost · mg in vial · mg remaining · supplier · expiry
- **Programs:** monthly price · typical maintenance mg/month
- **Patients (optional):** name · weekly dose mg

## §5 — Inventory  *(src/data/inventory.ts)*
Per item: name · category · unit · stock · unit cost · reorder level · supplier · usage/mo ·
margin % · expiry. (15 demo items already in place — send a CSV/export and I'll import it.)

## §6 — Website & SEO  *(src/data/seo.ts)*  *optional / can connect to GA later*
Organic traffic, top keywords + positions, Google Business rating & review count, bookings/mo.

## §7 — Social  *(src/data/social.ts)*  *optional*
Per channel (Instagram, TikTok, Facebook, YouTube, LinkedIn): followers · monthly growth % ·
engagement % · posts/week goal.

## §8 — Advertising  *(src/data/ads.ts)*  *optional*
Per campaign: platform · name · spend · leads · appointments · revenue. (ROAS/CPL/CAC auto-calc.)

## §9 — CRM & Partnerships  *(src/data/crm.ts)*
Per partner: name · type · contact · status · leads · appointments · revenue · next follow-up · notes.

## §10 — 90-Day Plan  *(src/data/growth.ts)*
Your real tasks per phase (Foundation / Awareness / Scale) with owner + impact. Or keep the demo plan.

---

### Easiest ways to send it
- Fill the tables above and paste them back, **or**
- Drop me CSV/exports from your POS / EMR / QuickBooks / GA / Meta Ads and I'll map them, **or**
- Just tell me the numbers conversationally ("Botox is $12/unit, we do ~140 a month…") and I'll do the rest.
