import { useState } from "react";
import {
  Share2, Heart, Users, Sparkles, Instagram, Music2, Facebook, Youtube, Linkedin,
  RefreshCw, CheckCircle2, Clock, XCircle, Bookmark, MessageCircle, Send,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar } from "@/components/ui";
import { num, compact, pct } from "@/lib/format";
import { palette, tooltipStyle } from "@/lib/theme";
import {
  channels, followerTrend, engagementBreakdown, contentCalendar, aiContentIdeas,
  consistencyScore, channelHealthAvg,
} from "@/data/social";

const channelIcon: Record<string, any> = { Instagram, TikTok: Music2, Facebook, YouTube: Youtube, LinkedIn: Linkedin };
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const statusMap = {
  posted: { icon: CheckCircle2, tone: "emerald" as const },
  scheduled: { icon: Clock, tone: "sky" as const },
  missed: { icon: XCircle, tone: "rose" as const },
};

export default function SocialCenter() {
  const [seed, setSeed] = useState(0);
  const ideas = [...aiContentIdeas].sort(() => Math.sin(seed * 9301 + aiContentIdeas.length) - 0.5);
  const totalFollowers = channels.reduce((a, c) => a + c.followers, 0);
  const avgEng = +(channels.reduce((a, c) => a + c.engagement, 0) / channels.length).toFixed(1);
  const totalLeads = channels.reduce((a, c) => a + c.leads, 0);

  return (
    <>
      <PageIntro
        eyebrow="Social Media Command Center"
        title="Reach, engagement, and content — in one place."
        description="Every channel's health, your content calendar, and an AI assistant that hands you the next week of posts."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Total Followers" value={compact(totalFollowers)} icon={Users} sub="Across 5 channels" />
        <KpiCard index={1} label="Avg Engagement" value={`${avgEng}%`} icon={Heart} sub="Weighted" />
        <KpiCard index={2} label="Leads Generated" value={num(totalLeads)} icon={Send} sub="From social" />
        <KpiCard index={3} label="Consistency" value={`${consistencyScore}`} icon={Share2} sub="Posting score /100" />
      </div>

      {/* Channels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {channels.map((c, idx) => {
          const Icon = channelIcon[c.name] ?? Share2;
          return (
            <Card key={c.id} hover className="relative">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-charcoal-900 text-white"><Icon className="h-4 w-4" /></span>
                <Badge tone={c.health >= 80 ? "emerald" : c.health >= 65 ? "gold" : "amber"}>{c.health}</Badge>
              </div>
              <div className="mt-3 num text-xl font-semibold text-charcoal-900">{compact(c.followers)}</div>
              <div className="text-xs text-charcoal-400">{c.name} · <span className="text-emerald-deep">+{c.growth}%</span></div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-charcoal-400">
                <span>{c.postsThisWeek}/{c.weeklyGoal} posts</span>
                <span>{pct(c.engagement)} eng</span>
              </div>
              <ProgressBar value={(c.postsThisWeek / c.weeklyGoal) * 100} tone={c.postsThisWeek >= c.weeklyGoal ? "emerald" : "amber"} className="mt-1.5 h-1.5" />
              {idx === 0 && null}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader eyebrow="Growth" title="Follower Trend" />
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={followerTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={palette.charcoal400} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={palette.charcoal400} fontSize={11} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="instagram" stroke={palette.gold} strokeWidth={2.4} dot={false} />
                <Line type="monotone" dataKey="tiktok" stroke={palette.charcoal} strokeWidth={2.2} dot={false} />
                <Line type="monotone" dataKey="facebook" stroke={palette.charcoal400} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="youtube" stroke={palette.goldDeep} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="linkedin" stroke={palette.sky} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="This month" title="Engagement" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { l: "Shares", v: engagementBreakdown.shares, i: Send },
              { l: "Saves", v: engagementBreakdown.saves, i: Bookmark },
              { l: "Comments", v: engagementBreakdown.comments, i: MessageCircle },
              { l: "Profile visits", v: engagementBreakdown.profileVisits, i: Users },
              { l: "Site clicks", v: engagementBreakdown.websiteClicks, i: Share2 },
              { l: "Leads", v: engagementBreakdown.leadsGenerated, i: Heart },
            ].map((r) => (
              <div key={r.l} className="rounded-xl bg-paper-soft p-3">
                <r.i className="h-4 w-4 text-gold-600" />
                <div className="num mt-2 text-lg font-semibold text-charcoal-900">{compact(r.v)}</div>
                <div className="text-[11px] text-charcoal-400">{r.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <SectionHeader eyebrow="This week" title="Content Calendar" action={<span className="text-xs text-charcoal-400">Channel health avg · <span className="font-semibold text-charcoal-700">{channelHealthAvg}/100</span></span>} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {days.map((d) => (
            <div key={d} className="rounded-xl border border-charcoal-100 p-3">
              <div className="eyebrow mb-2">{d}</div>
              <div className="space-y-2">
                {contentCalendar.filter((p) => p.day === d).map((p) => {
                  const st = statusMap[p.status];
                  return (
                    <div key={p.id} className="rounded-lg bg-paper-soft p-2">
                      <div className="flex items-center justify-between">
                        <Badge tone="charcoal">{p.type}</Badge>
                        <st.icon className={`h-3.5 w-3.5 ${p.status === "posted" ? "text-emerald" : p.status === "missed" ? "text-rose" : "text-sky"}`} />
                      </div>
                      <p className="mt-1.5 text-[12px] leading-snug text-charcoal-700">{p.title}</p>
                      <div className="mt-1 text-[10px] text-charcoal-400">{p.channel}</div>
                    </div>
                  );
                })}
                {contentCalendar.filter((p) => p.day === d).length === 0 && (
                  <div className="rounded-lg border border-dashed border-charcoal-200 p-2 text-center text-[11px] text-charcoal-300">No posts</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI content assistant */}
      <Card className="relative overflow-hidden border-gold-200 bg-gold-50/40">
        <div className="flex items-center justify-between">
          <SectionHeader eyebrow="AI Content Assistant" title="Your next week of content" />
          <button onClick={() => setSeed((s) => s + 1)} className="btn-gold h-9 py-0 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Generate ideas</button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {ideas.map((idea, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-gold-200/60 bg-white p-3.5">
              <Sparkles className="h-4 w-4 shrink-0 text-gold-600" />
              <div>
                <Badge tone="gold">{idea.type}</Badge>
                <p className="mt-1.5 text-sm leading-snug text-charcoal-700">{idea.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
