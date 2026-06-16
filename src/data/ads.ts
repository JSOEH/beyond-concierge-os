// ── Advertising Command Center ──────────────────────────────────────────────

export interface Campaign {
  id: string;
  platform: "Meta" | "Google" | "TikTok" | "YouTube";
  name: string;
  spend: number;
  leads: number;
  appointments: number;
  revenue: number;
}

// Cleared — awaiting real ad-platform data (Meta / Google / TikTok exports).
export const campaigns: Campaign[] = [];

export interface CampaignMetrics extends Campaign {
  cpl: number;
  cpa: number;
  cac: number;
  roas: number;
  roi: number;
}

export const withMetrics = (c: Campaign): CampaignMetrics => {
  const cpl = +(c.spend / c.leads).toFixed(2);
  const cpa = c.appointments ? +(c.spend / c.appointments).toFixed(2) : 0;
  const cac = cpa; // acquisition ≈ cost per booked appointment here
  const roas = +(c.revenue / c.spend).toFixed(2);
  const roi = +(((c.revenue - c.spend) / c.spend) * 100).toFixed(0);
  return { ...c, cpl, cpa, cac, roas, roi };
};

export const campaignMetrics = campaigns.map(withMetrics);

export const adsTotals = (() => {
  const spend = campaigns.reduce((a, c) => a + c.spend, 0);
  const leads = campaigns.reduce((a, c) => a + c.leads, 0);
  const appts = campaigns.reduce((a, c) => a + c.appointments, 0);
  const revenue = campaigns.reduce((a, c) => a + c.revenue, 0);
  const safe = (n: number, d: number, frac = 2) => (d ? +(n / d).toFixed(frac) : 0);
  return {
    spend,
    leads,
    appts,
    revenue,
    cpl: safe(spend, leads),
    cpa: safe(spend, appts),
    cac: safe(spend, appts),
    roas: safe(revenue, spend),
    roi: spend ? +(((revenue - spend) / spend) * 100).toFixed(0) : 0,
  };
})();

export const byPlatform = Object.values(
  campaignMetrics.reduce<Record<string, { platform: string; spend: number; revenue: number; roas: number }>>(
    (acc, c) => {
      acc[c.platform] ??= { platform: c.platform, spend: 0, revenue: 0, roas: 0 };
      acc[c.platform].spend += c.spend;
      acc[c.platform].revenue += c.revenue;
      return acc;
    },
    {},
  ),
).map((p) => ({ ...p, roas: +(p.revenue / p.spend).toFixed(2) }));

export const bestCampaigns = [...campaignMetrics].sort((a, b) => b.roas - a.roas).slice(0, 3);
export const worstCampaigns = [...campaignMetrics].sort((a, b) => a.roas - b.roas).slice(0, 3);

export interface BudgetRec {
  campaign: string;
  action: "increase" | "decrease" | "hold";
  detail: string;
}
export const budgetRecs: BudgetRec[] = [];
