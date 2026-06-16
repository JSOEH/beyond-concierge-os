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

// Real service catalog, ZEROED — all prices, costs, and volumes are 0 until the
// owner enters real figures in Owner Studio → Live Pricing. No fabricated revenue.
const z = { retail: 0, productCost: 0, nurseCost: 0, laborCost: 0, monthlyVolume: 0 };
const raw: ServiceInput[] = [
  { id: "botox", name: "Botox", category: "Injectables", unitLabel: "per treatment", ...z },
  { id: "dysport", name: "Dysport", category: "Injectables", unitLabel: "per treatment", ...z },
  { id: "fillers", name: "Dermal Fillers", category: "Injectables", unitLabel: "per syringe", ...z },
  { id: "thinworks", name: "ThinWorks Body Contouring", category: "Body", unitLabel: "per session", ...z },
  { id: "iv-therapy", name: "IV Therapy", category: "IV & NAD", unitLabel: "per drip", ...z },
  { id: "nad", name: "NAD+ Infusion", category: "IV & NAD", unitLabel: "per infusion", ...z },
  { id: "semaglutide", name: "Semaglutide Program", category: "Weight Loss", unitLabel: "per month", recurring: true, ...z },
  { id: "tirzepatide", name: "Tirzepatide Program", category: "Weight Loss", unitLabel: "per month", recurring: true, ...z },
  { id: "vitamin-injections", name: "Vitamin Injections", category: "IV & NAD", unitLabel: "per injection", ...z },
  { id: "concierge-visit", name: "Concierge House Call", category: "Concierge", unitLabel: "per visit", ...z },
  { id: "membership", name: "Beyond Membership", category: "Membership", unitLabel: "per month", recurring: true, ...z },
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

export function deriveServices(
  overrides: ServiceOverrides = {},
  extra: ServiceInput[] = [],
): ServiceModel {
  const list = [...baseServices, ...extra].map((s) =>
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
