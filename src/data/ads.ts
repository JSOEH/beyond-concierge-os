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

export const campaigns: Campaign[] = [
  { id: "m1", platform: "Meta", name: "Meta Campaign 1", spend: 4200, leads: 168, appointments: 71, revenue: 28400 },
  { id: "m2", platform: "Meta", name: "Meta Campaign 2", spend: 1850, leads: 94, appointments: 58, revenue: 10700 },
  { id: "g1", platform: "Google", name: "Google Campaign 1", spend: 3100, leads: 86, appointments: 44, revenue: 21100 },
  { id: "g2", platform: "Google", name: "Google Campaign 2", spend: 1600, leads: 38, appointments: 21, revenue: 9800 },
  { id: "t1", platform: "TikTok", name: "TikTok Campaign 1", spend: 2400, leads: 61, appointments: 19, revenue: 7600 },
  { id: "y1", platform: "YouTube", name: "YouTube Campaign 1", spend: 1100, leads: 17, appointments: 6, revenue: 2900 },
];

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
  return {
    spend,
    leads,
    appts,
    revenue,
    cpl: +(spend / leads).toFixed(2),
    cpa: +(spend / appts).toFixed(2),
    cac: +(spend / appts).toFixed(2),
    roas: +(revenue / spend).toFixed(2),
    roi: +(((revenue - spend) / spend) * 100).toFixed(0),
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
export const budgetRecs: BudgetRec[] = [
  { campaign: "Google Campaign 1", action: "increase", detail: "6.8× ROAS on high-intent search — raise daily cap, add exact-match." },
  { campaign: "Meta Campaign 1", action: "increase", detail: "6.8× ROAS and lowest CPA — shift +$2k and scale lookalikes." },
  { campaign: "TikTok Campaign 1", action: "decrease", detail: "3.2× ROAS, weak booking rate — trim 30% and refresh creative." },
  { campaign: "YouTube Campaign 1", action: "decrease", detail: "2.6× ROAS — pause or reallocate to retargeting." },
];
