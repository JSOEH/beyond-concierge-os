// ── Social Media Command Center ─────────────────────────────────────────────

export interface Channel {
  id: string;
  name: string;
  followers: number;
  growth: number; // % MoM
  engagement: number; // %
  reach: number;
  leads: number;
  health: number; // 0-100
  postsThisWeek: number;
  weeklyGoal: number;
}

export const channels: Channel[] = [
  { id: "instagram", name: "Instagram", followers: 18420, growth: 6.4, engagement: 4.8, reach: 92400, leads: 64, health: 88, postsThisWeek: 5, weeklyGoal: 5 },
  { id: "tiktok", name: "TikTok", followers: 9260, growth: 12.1, engagement: 7.2, reach: 148000, leads: 41, health: 82, postsThisWeek: 3, weeklyGoal: 5 },
  { id: "facebook", name: "Facebook", followers: 11040, growth: 1.8, engagement: 2.1, reach: 38600, leads: 29, health: 64, postsThisWeek: 2, weeklyGoal: 4 },
  { id: "youtube", name: "YouTube", followers: 3180, growth: 9.3, engagement: 5.6, reach: 41200, leads: 18, health: 71, postsThisWeek: 1, weeklyGoal: 2 },
  { id: "linkedin", name: "LinkedIn", followers: 2640, growth: 3.4, engagement: 3.0, reach: 12800, leads: 11, health: 58, postsThisWeek: 1, weeklyGoal: 3 },
];

export const followerTrend = [
  { month: "Jan", instagram: 14200, tiktok: 5100, facebook: 10400, youtube: 2200, linkedin: 2050 },
  { month: "Feb", instagram: 14900, tiktok: 5900, facebook: 10520, youtube: 2380, linkedin: 2160 },
  { month: "Mar", instagram: 15700, tiktok: 6700, facebook: 10650, youtube: 2560, linkedin: 2290 },
  { month: "Apr", instagram: 16600, tiktok: 7600, facebook: 10780, youtube: 2760, linkedin: 2420 },
  { month: "May", instagram: 17400, tiktok: 8300, facebook: 10910, youtube: 2950, linkedin: 2530 },
  { month: "Jun", instagram: 18420, tiktok: 9260, facebook: 11040, youtube: 3180, linkedin: 2640 },
];

export const engagementBreakdown = {
  shares: 1840,
  saves: 3120,
  comments: 2260,
  profileVisits: 14200,
  websiteClicks: 1980,
  leadsGenerated: 163,
};

export interface CalendarPost {
  id: string;
  day: string;
  channel: string;
  title: string;
  type: "Reel" | "Story" | "Post" | "Video" | "Carousel";
  status: "scheduled" | "posted" | "missed";
}
export const contentCalendar: CalendarPost[] = [
  { id: "c1", day: "Mon", channel: "Instagram", title: "Patient glow-up before/after", type: "Reel", status: "posted" },
  { id: "c2", day: "Mon", channel: "TikTok", title: "What's actually in our IV drips", type: "Video", status: "posted" },
  { id: "c3", day: "Tue", channel: "Instagram", title: "Semaglutide myth-busting", type: "Carousel", status: "posted" },
  { id: "c4", day: "Wed", channel: "Facebook", title: "Member spotlight: Renee", type: "Post", status: "missed" },
  { id: "c5", day: "Wed", channel: "YouTube", title: "Concierge day-in-the-life", type: "Video", status: "scheduled" },
  { id: "c6", day: "Thu", channel: "Instagram", title: "NAD+ energy explainer", type: "Reel", status: "scheduled" },
  { id: "c7", day: "Fri", channel: "TikTok", title: "Nurse Q&A: Botox aftercare", type: "Video", status: "scheduled" },
  { id: "c8", day: "Fri", channel: "LinkedIn", title: "Corporate wellness partnership", type: "Post", status: "scheduled" },
];

export interface ContentIdea {
  type: "Reel" | "Video" | "Podcast" | "Caption" | "Hook";
  text: string;
}
export const aiContentIdeas: ContentIdea[] = [
  { type: "Reel", text: "60-sec 'What $399 of semaglutide actually gets you' — transparent breakdown with on-screen cost cards." },
  { type: "Hook", text: "\"Your IV drip is mostly saline and hope — unless it has these 3 things.\"" },
  { type: "Video", text: "Concierge house-call POV: from text to treatment in under an hour." },
  { type: "Podcast", text: "Ep: 'The economics of looking good' — margins, myths, and what med spas hide." },
  { type: "Caption", text: "Results don't shout. They glow. Quietly booked, privately treated, beautifully you. ✨ Link to book." },
  { type: "Reel", text: "Trend audio + ThinWorks inch-loss reveal, week 1 vs week 4." },
];

export const consistencyScore = 74;
export const channelHealthAvg = Math.round(
  channels.reduce((a, c) => a + c.health, 0) / channels.length,
);
