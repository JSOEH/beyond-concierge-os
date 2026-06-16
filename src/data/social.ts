// ── Social Media Command Center ─────────────────────────────────────────────
// Cleared — awaiting real channel data (connect Instagram / TikTok / etc. or
// enter it from the intake form).

export interface Channel {
  id: string;
  name: string;
  followers: number;
  growth: number;
  engagement: number;
  reach: number;
  leads: number;
  health: number;
  postsThisWeek: number;
  weeklyGoal: number;
}

export const channels: Channel[] = [];

export const followerTrend: { month: string; [k: string]: number | string }[] = [];

export const engagementBreakdown = {
  shares: 0,
  saves: 0,
  comments: 0,
  profileVisits: 0,
  websiteClicks: 0,
  leadsGenerated: 0,
};

export interface CalendarPost {
  id: string;
  day: string;
  channel: string;
  title: string;
  type: "Reel" | "Story" | "Post" | "Video" | "Carousel";
  status: "scheduled" | "posted" | "missed";
}
export const contentCalendar: CalendarPost[] = [];

export interface ContentIdea {
  type: "Reel" | "Video" | "Podcast" | "Caption" | "Hook";
  text: string;
}
// AI content ideas are generated suggestions (a feature), not business data —
// kept so the assistant still works once channels are connected.
export const aiContentIdeas: ContentIdea[] = [
  { type: "Reel", text: "60-sec 'what's actually in our IV drips' — transparent, on-screen cost cards." },
  { type: "Hook", text: "\"Your IV drip is mostly saline and hope — unless it has these 3 things.\"" },
  { type: "Video", text: "Concierge house-call POV: from text to treatment in under an hour." },
  { type: "Podcast", text: "Ep: 'The economics of looking good' — margins, myths, and what med spas hide." },
  { type: "Caption", text: "Results don't shout. They glow. Quietly booked, privately treated, beautifully you. ✨" },
  { type: "Reel", text: "Trend audio + body-contouring inch-loss reveal, week 1 vs week 4." },
];

export const consistencyScore = 0;
export const channelHealthAvg = channels.length
  ? Math.round(channels.reduce((a, c) => a + c.health, 0) / channels.length)
  : 0;
