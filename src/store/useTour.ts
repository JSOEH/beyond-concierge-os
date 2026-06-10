import { create } from "zustand";

export interface TourStep {
  route: string;
  title: string;
  body: string;
  tag: string;
}

export const tourSteps: TourStep[] = [
  { route: "/", tag: "Welcome", title: "Beyond Concierge Executive OS", body: "One command center for the whole business — finance, operations, marketing, and growth. Let's walk the floor." },
  { route: "/", tag: "Module 1", title: "Executive Snapshot", body: "The morning view: revenue by service line, a full P&L, KPIs, and 12-month trends. Switch the period in the top-right to re-slice everything." },
  { route: "/profit", tag: "Module 2", title: "Profit Engine", body: "Every service fully costed — product, nurse, labor, and card fees — so you see true profit and margin. Click any row to see its cost waterfall." },
  { route: "/iv", tag: "Module 3", title: "IV Recipe Calculator", body: "Build a drip and watch cost, profit, and stock recalculate live. Hit 'Dispense' and it draws ingredients out of inventory automatically." },
  { route: "/glp1", tag: "Module 4", title: "GLP-1 Margin Center", body: "Cost per milligram on every vial, true profit per patient, and per-vial economics. Draw a dose and the vial depletes in real time." },
  { route: "/inventory", tag: "Module 5", title: "Inventory Command Center", body: "Live stock, reorder alerts, expiry watch, and the fast/slow movers that quietly make or cost you money." },
  { route: "/seo", tag: "Module 6", title: "Website & SEO", body: "Traffic by source, keyword rankings, your Google Business Profile, and a prioritized fix-list for the pages that convert." },
  { route: "/social", tag: "Module 7", title: "Social Command Center", body: "Every channel's health, your weekly content calendar, and an AI assistant that hands you the next week of posts." },
  { route: "/ads", tag: "Module 8", title: "Advertising", body: "Spend, leads, appointments, and ROAS by campaign — with a clear call on exactly where to move the budget." },
  { route: "/crm", tag: "Module 9", title: "CRM & Partnerships", body: "Gyms, doctors, influencers, and corporate partners ranked by the revenue they actually drive — with follow-ups you won't miss." },
  { route: "/growth", tag: "Module 10", title: "90-Day Growth Plan", body: "Foundation → Awareness → Scale. A quarter of operating cadence you can check off as you go." },
  { route: "/advisor", tag: "AI Advisor", title: "The brain on top", body: "A continuous read across every module — immediate issues, opportunities, recommendations, and an auto-generated weekly executive brief. That's the tour." },
];

interface TourState {
  open: boolean;
  step: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goto: (i: number) => void;
}

export const useTour = create<TourState>((set, get) => ({
  open: false,
  step: 0,
  start: () => set({ open: true, step: 0 }),
  stop: () => set({ open: false }),
  next: () => {
    const { step } = get();
    if (step >= tourSteps.length - 1) set({ open: false });
    else set({ step: step + 1 });
  },
  prev: () => set({ step: Math.max(0, get().step - 1) }),
  goto: (i) => set({ step: Math.min(tourSteps.length - 1, Math.max(0, i)) }),
}));
