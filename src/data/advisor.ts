// ── AI Advisor: cross-platform synthesis ────────────────────────────────────
import { rankByProfit, lowestMargin } from "./services";
import { lowStock, expiringSoon } from "./inventory";
import { bestCampaigns, worstCampaigns, adsTotals } from "./ads";
import { vials, costPerMg, glp1Products } from "./glp1";
import { seoIssues } from "./seo";
import { channels } from "./social";

export type InsightKind = "issue" | "opportunity" | "recommendation";

export interface Insight {
  id: string;
  kind: InsightKind;
  severity: "high" | "medium" | "low";
  module: string;
  title: string;
  detail: string;
  action: string;
}

const topProfit = rankByProfit[0];
const worstMargin = lowestMargin[0];
const bestAd = bestCampaigns[0];
const worstAd = worstCampaigns[0];
const lowSema = vials.find((v) => v.productId === "semaglutide" && v.remainingMg < 15);
const weakChannel = [...channels].sort((a, b) => a.health - b.health)[0];

export const insights: Insight[] = [
  {
    id: "i1",
    kind: "issue",
    severity: "high",
    module: "Inventory",
    title: `${lowStock.length} products below reorder level`,
    detail: `${lowStock.slice(0, 3).map((i) => i.name).join(", ")}${lowStock.length > 3 ? " and more" : ""} are at or under their reorder point. Stockouts on injectables directly block revenue.`,
    action: "Open Inventory → reorder flagged items today.",
  },
  {
    id: "i2",
    kind: "issue",
    severity: "high",
    module: "GLP-1",
    title: lowSema ? `Vial ${lowSema.lot} nearly depleted` : "GLP-1 stock running tight",
    detail: lowSema
      ? `${lowSema.lot} has ${lowSema.remainingMg}mg left at $${costPerMg("semaglutide")}/mg. With 188 active semaglutide patients, you'll run short within ~2 weeks.`
      : "Semaglutide demand is outpacing on-hand vials.",
    action: "Reorder 3+ semaglutide vials from Empower Pharmacy.",
  },
  {
    id: "i3",
    kind: "issue",
    severity: "medium",
    module: "Inventory",
    title: expiringSoon.length ? `${expiringSoon.length} products expiring within 150 days` : "Watch expiry windows",
    detail: expiringSoon.length
      ? `${expiringSoon[0].name} expires in ${expiringSoon[0].daysToExpiry} days. Prioritize it in scheduling to avoid write-offs.`
      : "No imminent expirations.",
    action: "Feature near-expiry products in this week's promos.",
  },
  {
    id: "i4",
    kind: "issue",
    severity: "medium",
    module: "Website & SEO",
    title: "Broken money-page hurting conversions",
    detail: seoIssues[0].detail,
    action: "Fix /blog/old-promo 500 error and reclaim inbound links.",
  },
  {
    id: "o1",
    kind: "opportunity",
    severity: "high",
    module: "Advertising",
    title: `Scale "${bestAd.name}" — ${bestAd.roas}× ROAS`,
    detail: `Your best campaign returns $${bestAd.roas} per $1 at a $${bestAd.cpa} cost per appointment. It has headroom before fatigue.`,
    action: "Shift budget from low performers into this campaign.",
  },
  {
    id: "o2",
    kind: "opportunity",
    severity: "high",
    module: "Profit Engine",
    title: `${topProfit.name} is your profit engine`,
    detail: `${topProfit.name} produces the most monthly profit at a ${topProfit.margin}% margin. Capacity and bundling here compounds fastest.`,
    action: "Add a premium tier + membership bundle around it.",
  },
  {
    id: "o3",
    kind: "opportunity",
    severity: "medium",
    module: "Social",
    title: `${weakChannel.name} is underperforming its potential`,
    detail: `${weakChannel.name} sits at a ${weakChannel.health}/100 health score and only ${weakChannel.postsThisWeek}/${weakChannel.weeklyGoal} posts this week. Consistency is the unlock.`,
    action: "Use the AI content assistant to batch a week of posts.",
  },
  {
    id: "r1",
    kind: "recommendation",
    severity: "high",
    module: "Advertising",
    title: `Cut spend on "${worstAd.name}"`,
    detail: `At ${worstAd.roas}× ROAS it lags your ${adsTotals.roas}× blended average. Reallocating protects acquisition efficiency.`,
    action: "Trim 30% and reinvest in proven winners.",
  },
  {
    id: "r2",
    kind: "recommendation",
    severity: "medium",
    module: "Profit Engine",
    title: `Re-price or re-cost ${worstMargin.name}`,
    detail: `${worstMargin.name} runs the thinnest margin at ${worstMargin.margin}%. A small price or supply-cost change moves real profit.`,
    action: "Test a 5–8% price adjustment or renegotiate supply.",
  },
];

export const issues = insights.filter((i) => i.kind === "issue");
export const opportunities = insights.filter((i) => i.kind === "opportunity");
export const recommendations = insights.filter((i) => i.kind === "recommendation");

export const weeklyBrief = {
  headline: "Margins are healthy and demand is climbing — the bottleneck is supply and consistency, not sales.",
  generated: "2026-06-10",
  points: [
    `Revenue run-rate is at a 12-month high with a ${glp1Products.length}-product GLP-1 line now driving the largest recurring segment.`,
    `Profit is concentrated in ${topProfit.name} and Weight Loss — both have capacity to scale without new fixed cost.`,
    `Top risk this week: ${lowStock.length} items below reorder and a near-empty semaglutide vial. Reordering is the single highest-ROI action.`,
    `Marketing efficiency is strong overall (${adsTotals.roas}× blended ROAS); the gain is in reallocating from "${worstAd.name}" into "${bestAd.name}".`,
    `Social reach is growing but consistency (${weakChannel.name} especially) is leaving leads on the table.`,
  ],
  priorities: [
    "Reorder flagged inventory + semaglutide vials (today).",
    `Shift ~$2k ad budget into ${bestAd.name}.`,
    "Batch + schedule a full week of short-form content.",
    "Fix the broken SEO money-page and ship missing metadata.",
  ],
};
