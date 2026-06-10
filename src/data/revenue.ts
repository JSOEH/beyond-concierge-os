import { services, totalMonthlyRevenue, totalMonthlyProfit } from "./services";

// ── Revenue grouped into the 7 reporting buckets ────────────────────────────
export type RevenueBucket =
  | "ThinWorks"
  | "Botox"
  | "Beyond Concierge"
  | "IV Therapy"
  | "Weight Loss"
  | "Memberships"
  | "Other Services";

const bucketMap: Record<string, RevenueBucket> = {
  thinworks: "ThinWorks",
  botox: "Botox",
  dysport: "Botox",
  fillers: "Other Services",
  "iv-therapy": "IV Therapy",
  nad: "IV Therapy",
  semaglutide: "Weight Loss",
  tirzepatide: "Weight Loss",
  "vitamin-injections": "Other Services",
  "concierge-visit": "Beyond Concierge",
  membership: "Memberships",
};

export const revenueByBucketMonthly: { bucket: RevenueBucket; revenue: number }[] =
  Object.values(
    services.reduce<Record<string, { bucket: RevenueBucket; revenue: number }>>(
      (acc, s) => {
        const bucket = bucketMap[s.id] ?? "Other Services";
        acc[bucket] ??= { bucket, revenue: 0 };
        acc[bucket].revenue += s.monthlyRevenue;
        return acc;
      },
      {},
    ),
  ).sort((a, b) => b.revenue - a.revenue);

// Period multipliers relative to a month (with realistic pacing).
export const periods = ["Today", "This Week", "This Month", "This Quarter", "This Year"] as const;
export type Period = (typeof periods)[number];

const periodFactor: Record<Period, number> = {
  Today: 1 / 26,
  "This Week": 1 / 4.1,
  "This Month": 1,
  "This Quarter": 2.94,
  "This Year": 10.8, // partial-year pacing, not a flat 12x
};

export const revenueByBucketForPeriod = (period: Period) =>
  revenueByBucketMonthly.map((r) => ({
    bucket: r.bucket,
    revenue: Math.round(r.revenue * periodFactor[period]),
  }));

export const totalRevenueForPeriod = (period: Period) =>
  Math.round(totalMonthlyRevenue * periodFactor[period]);

// ── 12-month trend (deterministic, gently accelerating) ─────────────────────
const monthLabels = [
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
];

// growth curve from 0.62 → 1.0 of current monthly run-rate
const growthCurve = [0.62, 0.66, 0.69, 0.73, 0.78, 0.8, 0.83, 0.86, 0.9, 0.93, 0.96, 1.0];

export interface TrendPoint {
  month: string;
  revenue: number;
  profit: number;
  customers: number;
  newCustomers: number;
}

export const trend: TrendPoint[] = monthLabels.map((month, i) => {
  const f = growthCurve[i];
  const revenue = Math.round(totalMonthlyRevenue * f);
  const margin = 0.41 + i * 0.004; // margin improves slightly over time
  const profit = Math.round(revenue * margin);
  const customers = Math.round(820 * f + 180);
  const newCustomers = Math.round(customers * (0.34 - i * 0.006));
  return { month, revenue, profit, customers, newCustomers };
});

export const current = trend[trend.length - 1];
export const prior = trend[trend.length - 2];

export const growthPct = (curr: number, prev: number) =>
  +(((curr - prev) / prev) * 100).toFixed(1);

// ── Financial summary (monthly P&L) ─────────────────────────────────────────
const grossRevenue = totalMonthlyRevenue;
const ccFees = Math.round(grossRevenue * 0.025);
const processingFees = Math.round(grossRevenue * 0.006);
const refunds = Math.round(grossRevenue * 0.011);
const netRevenue = grossRevenue - ccFees - processingFees - refunds;
const payroll = 71500;
const contractorCosts = 18400;
const nurseCosts = 39200;
const inventoryCosts = Math.round(
  services.reduce((a, s) => a + s.productCost * s.monthlyVolume, 0),
);
const marketingCosts = 27600;
const netProfit =
  netRevenue -
  payroll -
  contractorCosts -
  nurseCosts -
  inventoryCosts -
  marketingCosts;
const netMargin = +((netProfit / grossRevenue) * 100).toFixed(1);

export const financials = {
  grossRevenue,
  netRevenue,
  ccFees,
  processingFees,
  refunds,
  payroll,
  contractorCosts,
  nurseCosts,
  inventoryCosts,
  marketingCosts,
  netProfit,
  netMargin,
};

// ── KPI cards ───────────────────────────────────────────────────────────────
const customerCount = current.customers;
const returningCustomers = customerCount - current.newCustomers;
const avgTicket = Math.round(grossRevenue / 980); // ~980 transactions/mo

export const kpis = {
  revenue: grossRevenue,
  revenueDelta: growthPct(current.revenue, prior.revenue),
  profit: totalMonthlyProfit,
  profitDelta: growthPct(current.profit, prior.profit),
  margin: netMargin,
  marginDelta: 1.4,
  avgTicket,
  avgTicketDelta: 4.6,
  customerCount,
  customerDelta: growthPct(current.customers, prior.customers),
  returningCustomers,
  newCustomers: current.newCustomers,
  revenuePerCustomer: Math.round(grossRevenue / customerCount),
  revenuePerCustomerDelta: 3.1,
};

export const serviceMix = revenueByBucketMonthly.map((r) => ({
  name: r.bucket,
  value: r.revenue,
}));
