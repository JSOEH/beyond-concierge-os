// ── Profit Engine: per-service unit economics ───────────────────────────────
// Every service is defined by its raw cost components; all profit metrics are
// computed so the numbers are always internally consistent.

export const CC_RATE = 0.029; // blended card + processing rate
export const CC_FLAT = 0.3;

export type ServiceCategory =
  | "Injectables"
  | "Body"
  | "IV & NAD"
  | "Weight Loss"
  | "Concierge"
  | "Membership";

export interface ServiceInput {
  id: string;
  name: string;
  category: ServiceCategory;
  unitLabel: string; // e.g. "per treatment", "per month"
  retail: number;
  productCost: number;
  nurseCost: number;
  laborCost: number; // front desk / overhead allocation per service
  monthlyVolume: number;
  recurring?: boolean;
}

export interface Service extends ServiceInput {
  ccCost: number;
  totalCost: number;
  grossProfit: number;
  margin: number; // %
  monthlyRevenue: number;
  monthlyProfit: number;
}

const raw: ServiceInput[] = [
  {
    id: "botox",
    name: "Botox",
    category: "Injectables",
    unitLabel: "per treatment (40u)",
    retail: 480,
    productCost: 220,
    nurseCost: 60,
    laborCost: 18,
    monthlyVolume: 142,
  },
  {
    id: "dysport",
    name: "Dysport",
    category: "Injectables",
    unitLabel: "per treatment",
    retail: 420,
    productCost: 178,
    nurseCost: 55,
    laborCost: 16,
    monthlyVolume: 38,
  },
  {
    id: "fillers",
    name: "Dermal Fillers",
    category: "Injectables",
    unitLabel: "per syringe",
    retail: 695,
    productCost: 290,
    nurseCost: 85,
    laborCost: 20,
    monthlyVolume: 64,
  },
  {
    id: "thinworks",
    name: "ThinWorks Body Contouring",
    category: "Body",
    unitLabel: "per session",
    retail: 400,
    productCost: 42,
    nurseCost: 70,
    laborCost: 22,
    monthlyVolume: 96,
  },
  {
    id: "iv-therapy",
    name: "IV Therapy",
    category: "IV & NAD",
    unitLabel: "per drip",
    retail: 185,
    productCost: 38,
    nurseCost: 42,
    laborCost: 12,
    monthlyVolume: 168,
  },
  {
    id: "nad",
    name: "NAD+ Infusion",
    category: "IV & NAD",
    unitLabel: "per infusion",
    retail: 650,
    productCost: 232,
    nurseCost: 95,
    laborCost: 18,
    monthlyVolume: 41,
  },
  {
    id: "semaglutide",
    name: "Semaglutide Program",
    category: "Weight Loss",
    unitLabel: "per month",
    retail: 399,
    productCost: 96,
    nurseCost: 28,
    laborCost: 14,
    monthlyVolume: 188,
    recurring: true,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide Program",
    category: "Weight Loss",
    unitLabel: "per month",
    retail: 549,
    productCost: 168,
    nurseCost: 28,
    laborCost: 14,
    monthlyVolume: 121,
    recurring: true,
  },
  {
    id: "vitamin-injections",
    name: "Vitamin Injections",
    category: "IV & NAD",
    unitLabel: "per injection",
    retail: 35,
    productCost: 6,
    nurseCost: 9,
    laborCost: 5,
    monthlyVolume: 263,
  },
  {
    id: "concierge-visit",
    name: "Concierge House Call",
    category: "Concierge",
    unitLabel: "per visit",
    retail: 275,
    productCost: 12,
    nurseCost: 120,
    laborCost: 24,
    monthlyVolume: 58,
  },
  {
    id: "membership",
    name: "Beyond Membership",
    category: "Membership",
    unitLabel: "per month",
    retail: 199,
    productCost: 0,
    nurseCost: 22,
    laborCost: 10,
    monthlyVolume: 312,
    recurring: true,
  },
];

export function computeService(s: ServiceInput): Service {
  const ccCost = +(s.retail * CC_RATE + CC_FLAT).toFixed(2);
  const totalCost = +(s.productCost + s.nurseCost + s.laborCost + ccCost).toFixed(2);
  const grossProfit = +(s.retail - totalCost).toFixed(2);
  const margin = +((grossProfit / s.retail) * 100).toFixed(1);
  const monthlyRevenue = s.retail * s.monthlyVolume;
  const monthlyProfit = +(grossProfit * s.monthlyVolume).toFixed(0);
  return {
    ...s,
    ccCost,
    totalCost,
    grossProfit,
    margin,
    monthlyRevenue,
    monthlyProfit,
  };
}

export const services: Service[] = raw.map(computeService);

export const serviceById = (id: string) => services.find((s) => s.id === id);

// ── Rankings ────────────────────────────────────────────────────────────────
export const rankByProfit = [...services].sort(
  (a, b) => b.monthlyProfit - a.monthlyProfit,
);
export const rankByMargin = [...services].sort((a, b) => b.margin - a.margin);
export const rankByVolume = [...services].sort(
  (a, b) => b.monthlyVolume - a.monthlyVolume,
);
export const lowestMargin = [...services].sort((a, b) => a.margin - b.margin);

// A service "loses money" if fully-loaded cost exceeds retail. None do by
// default, but the model flags any that dip below a healthy floor.
export const MARGIN_FLOOR = 35;
export const underperformers = services.filter((s) => s.margin < MARGIN_FLOOR);

export const totalMonthlyRevenue = services.reduce(
  (a, s) => a + s.monthlyRevenue,
  0,
);
export const totalMonthlyProfit = services.reduce(
  (a, s) => a + s.monthlyProfit,
  0,
);

// ── Override layer (Owner Studio live pricing) ──────────────────────────────
export const baseServices: ServiceInput[] = raw;

export type EditableField =
  | "retail"
  | "productCost"
  | "nurseCost"
  | "laborCost"
  | "monthlyVolume";

export const editableFields: { key: EditableField; label: string; money: boolean }[] = [
  { key: "retail", label: "Retail", money: true },
  { key: "productCost", label: "Product", money: true },
  { key: "nurseCost", label: "Nurse", money: true },
  { key: "laborCost", label: "Labor", money: true },
  { key: "monthlyVolume", label: "Volume/mo", money: false },
];

export type ServiceOverrides = Record<string, Partial<Record<EditableField, number>>>;

export interface ServiceModel {
  services: Service[];
  rankByProfit: Service[];
  rankByMargin: Service[];
  rankByVolume: Service[];
  lowestMargin: Service[];
  underperformers: Service[];
  totalMonthlyRevenue: number;
  totalMonthlyProfit: number;
}

export function deriveServices(overrides: ServiceOverrides = {}): ServiceModel {
  const list = baseServices.map((s) =>
    computeService({ ...s, ...(overrides[s.id] ?? {}) }),
  );
  return {
    services: list,
    rankByProfit: [...list].sort((a, b) => b.monthlyProfit - a.monthlyProfit),
    rankByMargin: [...list].sort((a, b) => b.margin - a.margin),
    rankByVolume: [...list].sort((a, b) => b.monthlyVolume - a.monthlyVolume),
    lowestMargin: [...list].sort((a, b) => a.margin - b.margin),
    underperformers: list.filter((s) => s.margin < MARGIN_FLOOR),
    totalMonthlyRevenue: list.reduce((a, s) => a + s.monthlyRevenue, 0),
    totalMonthlyProfit: list.reduce((a, s) => a + s.monthlyProfit, 0),
  };
}
