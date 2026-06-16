import { type Service, services as baseComputedServices } from "./services";

// ── Reporting buckets ───────────────────────────────────────────────────────
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

export const periods = ["Today", "This Week", "This Month", "This Quarter", "This Year"] as const;
export type Period = (typeof periods)[number];

const periodFactor: Record<Period, number> = {
  Today: 1 / 26,
  "This Week": 1 / 4.1,
  "This Month": 1,
  "This Quarter": 2.94,
  "This Year": 10.8,
};

const monthLabels = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const growthCurve = [0.62, 0.66, 0.69, 0.73, 0.78, 0.8, 0.83, 0.86, 0.9, 0.93, 0.96, 1.0];

export interface TrendPoint {
  month: string;
  revenue: number;
  profit: number;
  customers: number;
  newCustomers: number;
}

// ── Overridable P&L inputs (Owner Studio) ───────────────────────────────────
export interface PnlInputs {
  payroll: number;
  contractorCosts: number;
  nurseCosts: number;
  marketingCosts: number;
  ccRate: number; // card fee rate on gross
  refundRate: number; // refunds as % of gross
  txPerMonth: number; // transactions / month (for avg ticket)
}

export const defaultPnl: PnlInputs = {
  payroll: 0,
  contractorCosts: 0,
  nurseCosts: 0,
  marketingCosts: 0,
  ccRate: 0.029,
  refundRate: 0,
  txPerMonth: 0,
};

export const pnlFields: { key: keyof PnlInputs; label: string; kind: "money" | "pct" | "count" }[] = [
  { key: "payroll", label: "Payroll", kind: "money" },
  { key: "contractorCosts", label: "Contractor Costs", kind: "money" },
  { key: "nurseCosts", label: "Nurse Costs", kind: "money" },
  { key: "marketingCosts", label: "Marketing Costs", kind: "money" },
  { key: "ccRate", label: "Card Fee Rate", kind: "pct" },
  { key: "refundRate", label: "Refund Rate", kind: "pct" },
  { key: "txPerMonth", label: "Transactions / mo", kind: "count" },
];

export const growthPct = (curr: number, prev: number) =>
  +(((curr - prev) / prev) * 100).toFixed(1);

export interface RevenueModel {
  revenueByBucketMonthly: { bucket: RevenueBucket; revenue: number }[];
  serviceMix: { name: string; value: number }[];
  trend: TrendPoint[];
  current: TrendPoint;
  prior: TrendPoint;
  financials: ReturnType<typeof buildFinancials>;
  kpis: ReturnType<typeof buildKpis>;
  totalMonthlyRevenue: number;
  totalMonthlyProfit: number;
  bucketsForPeriod: (p: Period) => { bucket: RevenueBucket; revenue: number }[];
  revenueForPeriod: (p: Period) => number;
}

function buildFinancials(services: Service[], totalMonthlyRevenue: number, pnl: PnlInputs) {
  const grossRevenue = totalMonthlyRevenue;
  const ccFees = Math.round(grossRevenue * pnl.ccRate);
  const processingFees = Math.round(grossRevenue * 0.006);
  const refunds = Math.round(grossRevenue * pnl.refundRate);
  const netRevenue = grossRevenue - ccFees - processingFees - refunds;
  const inventoryCosts = Math.round(
    services.reduce((a, s) => a + s.productCost * s.monthlyVolume, 0),
  );
  const netProfit =
    netRevenue - pnl.payroll - pnl.contractorCosts - pnl.nurseCosts - inventoryCosts - pnl.marketingCosts;
  const netMargin = grossRevenue ? +((netProfit / grossRevenue) * 100).toFixed(1) : 0;
  return {
    grossRevenue, netRevenue, ccFees, processingFees, refunds,
    payroll: pnl.payroll, contractorCosts: pnl.contractorCosts, nurseCosts: pnl.nurseCosts,
    inventoryCosts, marketingCosts: pnl.marketingCosts, netProfit, netMargin,
  };
}

function buildKpis(
  trend: TrendPoint[],
  financials: ReturnType<typeof buildFinancials>,
  totalMonthlyProfit: number,
  pnl: PnlInputs,
) {
  const current = trend[trend.length - 1];
  const prior = trend[trend.length - 2];
  const customerCount = current.customers;
  return {
    revenue: financials.grossRevenue,
    revenueDelta: growthPct(current.revenue, prior.revenue),
    profit: totalMonthlyProfit,
    profitDelta: growthPct(current.profit, prior.profit),
    margin: financials.netMargin,
    marginDelta: 1.4,
    avgTicket: Math.round(financials.grossRevenue / Math.max(pnl.txPerMonth, 1)),
    avgTicketDelta: 4.6,
    customerCount,
    customerDelta: growthPct(current.customers, prior.customers),
    returningCustomers: customerCount - current.newCustomers,
    newCustomers: current.newCustomers,
    revenuePerCustomer: Math.round(financials.grossRevenue / Math.max(customerCount, 1)),
    revenuePerCustomerDelta: 3.1,
  };
}

export function computeRevenue(services: Service[], pnl: PnlInputs = defaultPnl): RevenueModel {
  const totalMonthlyRevenue = services.reduce((a, s) => a + s.monthlyRevenue, 0);
  const totalMonthlyProfit = services.reduce((a, s) => a + s.monthlyProfit, 0);

  const byBucket = Object.values(
    services.reduce<Record<string, { bucket: RevenueBucket; revenue: number }>>((acc, s) => {
      const bucket = bucketMap[s.id] ?? "Other Services";
      acc[bucket] ??= { bucket, revenue: 0 };
      acc[bucket].revenue += s.monthlyRevenue;
      return acc;
    }, {}),
  ).sort((a, b) => b.revenue - a.revenue);

  const hasData = totalMonthlyRevenue > 0;
  const trend: TrendPoint[] = monthLabels.map((month, i) => {
    const f = growthCurve[i];
    const revenue = Math.round(totalMonthlyRevenue * f);
    const margin = 0.41 + i * 0.004;
    const profit = Math.round(revenue * margin);
    const customers = hasData ? Math.round(820 * f + 180) : 0;
    const newCustomers = hasData ? Math.round(customers * (0.34 - i * 0.006)) : 0;
    return { month, revenue, profit, customers, newCustomers };
  });

  const financials = buildFinancials(services, totalMonthlyRevenue, pnl);
  const kpis = buildKpis(trend, financials, totalMonthlyProfit, pnl);

  return {
    revenueByBucketMonthly: byBucket,
    serviceMix: byBucket.map((b) => ({ name: b.bucket, value: b.revenue })),
    trend,
    current: trend[trend.length - 1],
    prior: trend[trend.length - 2],
    financials,
    kpis,
    totalMonthlyRevenue,
    totalMonthlyProfit,
    bucketsForPeriod: (p) => byBucket.map((b) => ({ bucket: b.bucket, revenue: Math.round(b.revenue * periodFactor[p]) })),
    revenueForPeriod: (p) => Math.round(totalMonthlyRevenue * periodFactor[p]),
  };
}

// Static default model (base prices) — handy for non-reactive consumers/tests.
export const baseRevenue = computeRevenue(baseComputedServices, defaultPnl);
