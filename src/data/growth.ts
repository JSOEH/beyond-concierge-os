// ── 90-Day Growth Planner ───────────────────────────────────────────────────

export interface GrowthTask {
  id: string;
  title: string;
  owner: string;
  done: boolean;
  impact: "High" | "Medium" | "Low";
}

export interface GrowthPhase {
  id: string;
  range: string;
  focus: string;
  theme: string;
  tasks: GrowthTask[];
}

export const phases: GrowthPhase[] = [
  {
    id: "p1",
    range: "Days 1–30",
    focus: "Foundation",
    theme: "Get clean numbers and a fast, fixed website.",
    tasks: [
      { id: "t1", title: "Website performance + broken-page fixes", owner: "Web", done: true, impact: "High" },
      { id: "t2", title: "SEO metadata + schema on service pages", owner: "Marketing", done: true, impact: "High" },
      { id: "t3", title: "Inventory cleanup + reorder levels set", owner: "Ops", done: true, impact: "Medium" },
      { id: "t4", title: "Per-service margin visibility (Profit Engine)", owner: "Finance", done: true, impact: "High" },
      { id: "t5", title: "Monthly P&L visibility wired to dashboard", owner: "Finance", done: false, impact: "High" },
      { id: "t6", title: "Cost tracking on IV + GLP-1 per unit", owner: "Ops", done: true, impact: "Medium" },
      { id: "t7", title: "Executive dashboard rollout to ownership", owner: "Leadership", done: false, impact: "High" },
    ],
  },
  {
    id: "p2",
    range: "Days 31–60",
    focus: "Awareness",
    theme: "Become impossible to ignore locally.",
    tasks: [
      { id: "t8", title: "Short-form content engine (3–5/wk)", owner: "Marketing", done: false, impact: "High" },
      { id: "t9", title: "Launch podcast / long-form series", owner: "Marketing", done: false, impact: "Medium" },
      { id: "t10", title: "Gym partnership outreach (10 targets)", owner: "Partnerships", done: false, impact: "High" },
      { id: "t11", title: "Influencer collabs with tracking links", owner: "Marketing", done: false, impact: "Medium" },
      { id: "t12", title: "Referral program for members", owner: "Ops", done: false, impact: "High" },
      { id: "t13", title: "Community visibility events (2)", owner: "Leadership", done: false, impact: "Medium" },
    ],
  },
  {
    id: "p3",
    range: "Days 61–90",
    focus: "Scale",
    theme: "Pour fuel on what's already working.",
    tasks: [
      { id: "t14", title: "Double down on winning services (GLP-1, Botox)", owner: "Leadership", done: false, impact: "High" },
      { id: "t15", title: "Increase ad spend on proven campaigns", owner: "Marketing", done: false, impact: "High" },
      { id: "t16", title: "Expand top partnerships to contracts", owner: "Partnerships", done: false, impact: "High" },
      { id: "t17", title: "Membership growth push (+20%)", owner: "Ops", done: false, impact: "High" },
      { id: "t18", title: "Conversion-rate optimization on top pages", owner: "Web", done: false, impact: "Medium" },
      { id: "t19", title: "Grow recurring revenue mix to 45%", owner: "Finance", done: false, impact: "High" },
    ],
  },
];

export const phaseProgress = (p: GrowthPhase) =>
  Math.round((p.tasks.filter((t) => t.done).length / p.tasks.length) * 100);

export const overallProgress = (() => {
  const all = phases.flatMap((p) => p.tasks);
  return Math.round((all.filter((t) => t.done).length / all.length) * 100);
})();
