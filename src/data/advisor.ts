// ── AI Advisor: cross-platform synthesis ────────────────────────────────────
// Insights are built only from modules that actually have data, so emptying a
// module (e.g. SEO, Social, Inventory) simply drops its insights rather than
// surfacing fabricated commentary.
import { rankByProfit, lowestMargin, totalMonthlyRevenue } from "./services";
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

const candidates: (Insight | null)[] = [
  lowStock.length
    ? {
        id: "i1", kind: "issue", severity: "high", module: "Inventory",
        title: `${lowStock.length} products below reorder level`,
        detail: `${lowStock.slice(0, 3).map((i) => i.name).join(", ")}${lowStock.length > 3 ? " and more" : ""} are at or under their reorder point. Stockouts directly block revenue.`,
        action: "Open Inventory → reorder flagged items today.",
      }
    : null,
  vials.length
    ? {
        id: "i2", kind: "issue", severity: "high", module: "GLP-1",
        title: lowSema ? `Vial ${lowSema.lot} nearly depleted` : "Watch GLP-1 vial levels",
        detail: lowSema
          ? `${lowSema.lot} has ${lowSema.remainingMg}mg left at $${costPerMg("semaglutide")}/mg. Reorder before it runs out.`
          : "Keep an eye on remaining mg across active vials.",
        action: "Reorder semaglutide vials when stock dips.",
      }
    : null,
  expiringSoon.length
    ? {
        id: "i3", kind: "issue", severity: "medium", module: "Inventory",
        title: `${expiringSoon.length} products expiring within 150 days`,
        detail: `${expiringSoon[0].name} expires in ${expiringSoon[0].daysToExpiry} days. Prioritize it in scheduling to avoid write-offs.`,
        action: "Feature near-expiry products in this week's promos.",
      }
    : null,
  seoIssues.length
    ? {
        id: "i4", kind: "issue", severity: "medium", module: "Website & SEO",
        title: seoIssues[0].title,
        detail: seoIssues[0].detail,
        action: "Fix the flagged SEO issue and reclaim traffic.",
      }
    : null,
  bestAd
    ? {
        id: "o1", kind: "opportunity", severity: "high", module: "Advertising",
        title: `Scale "${bestAd.name}" — ${bestAd.roas}× ROAS`,
        detail: `Your best campaign returns $${bestAd.roas} per $1 at a $${bestAd.cpa} cost per appointment. It has headroom before fatigue.`,
        action: "Shift budget from low performers into this campaign.",
      }
    : null,
  topProfit && totalMonthlyRevenue > 0
    ? {
        id: "o2", kind: "opportunity", severity: "high", module: "Profit Engine",
        title: `${topProfit.name} is your profit engine`,
        detail: `${topProfit.name} produces the most monthly profit at a ${topProfit.margin}% margin. Capacity and bundling here compounds fastest.`,
        action: "Add a premium tier + membership bundle around it.",
      }
    : null,
  weakChannel
    ? {
        id: "o3", kind: "opportunity", severity: "medium", module: "Social",
        title: `${weakChannel.name} is underperforming its potential`,
        detail: `${weakChannel.name} sits at a ${weakChannel.health}/100 health score and only ${weakChannel.postsThisWeek}/${weakChannel.weeklyGoal} posts this week. Consistency is the unlock.`,
        action: "Use the AI content assistant to batch a week of posts.",
      }
    : null,
  worstAd
    ? {
        id: "r1", kind: "recommendation", severity: "high", module: "Advertising",
        title: `Cut spend on "${worstAd.name}"`,
        detail: `At ${worstAd.roas}× ROAS it lags your ${adsTotals.roas}× blended average. Reallocating protects acquisition efficiency.`,
        action: "Trim 30% and reinvest in proven winners.",
      }
    : null,
  worstMargin && totalMonthlyRevenue > 0
    ? {
        id: "r2", kind: "recommendation", severity: "medium", module: "Profit Engine",
        title: `Re-price or re-cost ${worstMargin.name}`,
        detail: `${worstMargin.name} runs the thinnest margin at ${worstMargin.margin}%. A small price or supply-cost change moves real profit.`,
        action: "Test a 5–8% price adjustment or renegotiate supply.",
      }
    : null,
];

export const insights: Insight[] = candidates.filter((i): i is Insight => i !== null);

export const issues = insights.filter((i) => i.kind === "issue");
export const opportunities = insights.filter((i) => i.kind === "opportunity");
export const recommendations = insights.filter((i) => i.kind === "recommendation");

const points = [
  glp1Products.some((p) => p.programPrice > 0)
    ? `Weight loss runs a ${glp1Products.length}-product GLP-1 line — track it to the milligram in the margin center.`
    : null,
  topProfit && totalMonthlyRevenue > 0 ? `Profit is concentrated in ${topProfit.name} — it has capacity to scale without new fixed cost.` : null,
  lowStock.length ? `${lowStock.length} item${lowStock.length > 1 ? "s" : ""} below reorder — restocking is the highest-ROI action right now.` : null,
  bestAd && worstAd
    ? `Marketing efficiency is ${adsTotals.roas}× blended ROAS; the gain is reallocating from "${worstAd.name}" into "${bestAd.name}".`
    : null,
  weakChannel ? `Social consistency (${weakChannel.name} especially) is leaving leads on the table.` : null,
].filter((p): p is string => p !== null);

const priorities = [
  lowStock.length ? "Reorder flagged inventory items (today)." : null,
  bestAd ? `Shift budget into ${bestAd.name}.` : null,
  weakChannel ? "Batch + schedule a full week of short-form content." : null,
  seoIssues.length ? "Fix the flagged SEO issue and ship missing metadata." : null,
  topProfit && totalMonthlyRevenue > 0 ? `Protect capacity on ${topProfit.name} — your top profit line.` : null,
].filter((p): p is string => p !== null);

export const weeklyBrief = {
  headline: "",
  generated: "2026-06-10",
  points,
  priorities,
};
