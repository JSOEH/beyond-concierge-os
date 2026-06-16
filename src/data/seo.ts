// ── Website & SEO Command Center ────────────────────────────────────────────
// Cleared — awaiting real data (Google Analytics / Search Console / GBP export).

export const seoSummary = {
  healthScore: 0,
  organicTraffic: 0,
  organicTrafficDelta: 0,
  totalTraffic: 0,
  totalTrafficDelta: 0,
  avgPosition: 0,
  avgPositionDelta: 0,
  calls: 0,
  callsDelta: 0,
  formSubmissions: 0,
  formSubmissionsDelta: 0,
  bookings: 0,
  bookingsDelta: 0,
  conversionRate: 0,
  conversionRateDelta: 0,
};

export interface TrafficPoint {
  month: string;
  organic: number;
  direct: number;
  paid: number;
}
export const trafficTrend: TrafficPoint[] = [];

export interface KeywordRow {
  keyword: string;
  position: number;
  prev: number;
  volume: number;
  url: string;
}
export const keywords: KeywordRow[] = [];

export interface PageRow {
  url: string;
  views: number;
  conversion: number;
  trend: number;
  issues: string[];
}
export const topPages: PageRow[] = [];
export const worstPages: PageRow[] = [];

export interface SeoIssue {
  severity: "critical" | "warning" | "opportunity";
  title: string;
  detail: string;
  impact: string;
}
export const seoIssues: SeoIssue[] = [];

export const gbp = {
  rating: 0,
  reviews: 0,
  reviewsDelta: 0,
  views: 0,
  calls: 0,
  directionRequests: 0,
  websiteClicks: 0,
};
