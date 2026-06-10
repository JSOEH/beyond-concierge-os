// ── Website & SEO Command Center ────────────────────────────────────────────

export const seoSummary = {
  healthScore: 82,
  organicTraffic: 9840,
  organicTrafficDelta: 14.2,
  totalTraffic: 17260,
  totalTrafficDelta: 9.6,
  avgPosition: 12.4,
  avgPositionDelta: -2.1, // negative = improved (moved up)
  calls: 214,
  callsDelta: 11.0,
  formSubmissions: 168,
  formSubmissionsDelta: 8.3,
  bookings: 96,
  bookingsDelta: 17.4,
  conversionRate: 4.2,
  conversionRateDelta: 0.6,
};

export interface TrafficPoint {
  month: string;
  organic: number;
  direct: number;
  paid: number;
}
export const trafficTrend: TrafficPoint[] = [
  { month: "Jan", organic: 6200, direct: 3100, paid: 2400 },
  { month: "Feb", organic: 6680, direct: 3250, paid: 2600 },
  { month: "Mar", organic: 7350, direct: 3380, paid: 2950 },
  { month: "Apr", organic: 8120, direct: 3520, paid: 3100 },
  { month: "May", organic: 8990, direct: 3700, paid: 3300 },
  { month: "Jun", organic: 9840, direct: 3880, paid: 3540 },
];

export interface KeywordRow {
  keyword: string;
  position: number;
  prev: number;
  volume: number;
  url: string;
}
export const keywords: KeywordRow[] = [
  { keyword: "medical concierge near me", position: 3, prev: 6, volume: 1900, url: "/concierge" },
  { keyword: "iv therapy [city]", position: 2, prev: 4, volume: 2400, url: "/iv-therapy" },
  { keyword: "semaglutide weight loss", position: 7, prev: 11, volume: 5400, url: "/weight-loss" },
  { keyword: "botox [city]", position: 5, prev: 5, volume: 3300, url: "/botox" },
  { keyword: "nad+ infusion", position: 9, prev: 14, volume: 880, url: "/nad" },
  { keyword: "body contouring thinworks", position: 12, prev: 19, volume: 720, url: "/thinworks" },
  { keyword: "tirzepatide clinic", position: 14, prev: 22, volume: 2900, url: "/weight-loss" },
  { keyword: "mobile iv drip", position: 4, prev: 8, volume: 1300, url: "/iv-therapy" },
];

export interface PageRow {
  url: string;
  views: number;
  conversion: number;
  trend: number;
  issues: string[];
}
export const topPages: PageRow[] = [
  { url: "/weight-loss", views: 4120, conversion: 6.8, trend: 22, issues: [] },
  { url: "/iv-therapy", views: 3650, conversion: 5.4, trend: 14, issues: [] },
  { url: "/botox", views: 2980, conversion: 4.1, trend: 6, issues: ["Slow LCP (3.4s)"] },
  { url: "/concierge", views: 1840, conversion: 7.2, trend: 31, issues: [] },
];
export const worstPages: PageRow[] = [
  { url: "/about", views: 1210, conversion: 0.4, trend: -9, issues: ["No CTA", "Thin content"] },
  { url: "/thinworks", views: 980, conversion: 1.1, trend: -4, issues: ["Missing meta description", "No schema"] },
  { url: "/pricing", views: 760, conversion: 1.8, trend: -12, issues: ["404 inbound links (3)", "Slow LCP (4.1s)"] },
  { url: "/blog/old-promo", views: 420, conversion: 0.0, trend: -38, issues: ["Broken page (500)", "Orphaned"] },
];

export interface SeoIssue {
  severity: "critical" | "warning" | "opportunity";
  title: string;
  detail: string;
  impact: string;
}
export const seoIssues: SeoIssue[] = [
  { severity: "critical", title: "Broken page returning 500", detail: "/blog/old-promo errors on load and has 3 inbound links.", impact: "Recover ~420 monthly visits" },
  { severity: "critical", title: "3 pages missing meta descriptions", detail: "ThinWorks, Memberships, and Contact have no meta description.", impact: "+CTR on 2,400 impressions" },
  { severity: "warning", title: "Core Web Vitals failing on /pricing", detail: "LCP 4.1s — hero image is unoptimized (2.3MB).", impact: "Higher bounce on a money page" },
  { severity: "opportunity", title: "Tirzepatide ranks #14 for 2,900/mo term", detail: "On page 2 — a content refresh + internal links could reach page 1.", impact: "Est. +780 visits/mo" },
  { severity: "opportunity", title: "Add LocalBusiness + Service schema", detail: "No structured data on 6 service pages.", impact: "Rich results eligibility" },
];

export const gbp = {
  rating: 4.8,
  reviews: 312,
  reviewsDelta: 18,
  views: 22400,
  calls: 214,
  directionRequests: 178,
  websiteClicks: 640,
};
