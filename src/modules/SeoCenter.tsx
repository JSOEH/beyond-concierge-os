import {
  Globe, Search, CalendarCheck, MousePointerClick, ArrowUp, ArrowDown, Minus,
  Star, Phone, AlertTriangle, Lightbulb, Wrench,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, Delta, ProgressBar, EmptyState } from "@/components/ui";
import { num, pct } from "@/lib/format";
import { palette, tooltipStyle } from "@/lib/theme";
import { seoSummary, trafficTrend, keywords, topPages, worstPages, seoIssues, gbp } from "@/data/seo";

const sevMap = {
  critical: { tone: "rose" as const, icon: AlertTriangle, label: "Critical" },
  warning: { tone: "amber" as const, icon: Wrench, label: "Warning" },
  opportunity: { tone: "gold" as const, icon: Lightbulb, label: "Opportunity" },
};

export default function SeoCenter() {
  if (!keywords.length && !trafficTrend.length && seoSummary.organicTraffic === 0) {
    return (
      <>
        <PageIntro
          eyebrow="Website & SEO Command Center"
          title="Your storefront, measured."
          description="Traffic, rankings, and the Google Business Profile that actually drives calls and bookings."
        />
        <EmptyState icon={Globe} title="No SEO data connected" message="Connect Google Analytics, Search Console, and your Google Business Profile (or send the numbers) to see traffic, keyword rankings, top/worst pages, and a prioritized fix-list." hint="Connect analytics or send the data" />
      </>
    );
  }
  return (
    <>
      <PageIntro
        eyebrow="Website & SEO Command Center"
        title="Your storefront, measured."
        description="Traffic, rankings, and the Google Business Profile that actually drives calls and bookings — plus exactly what to fix."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="SEO Health" value={`${seoSummary.healthScore}`} icon={Globe} sub="Out of 100" />
        <KpiCard index={1} label="Organic Traffic" value={num(seoSummary.organicTraffic)} delta={seoSummary.organicTrafficDelta} icon={Search} sub="Monthly visits" />
        <KpiCard index={2} label="Bookings" value={num(seoSummary.bookings)} delta={seoSummary.bookingsDelta} icon={CalendarCheck} sub="From web" />
        <KpiCard index={3} label="Conversion" value={`${seoSummary.conversionRate}%`} delta={seoSummary.conversionRateDelta} icon={MousePointerClick} sub="Visit → action" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader
            eyebrow="6-month view"
            title="Traffic by Source"
            action={
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: palette.gold }} />Organic</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: palette.charcoal }} />Direct</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: palette.charcoal400 }} />Paid</span>
              </div>
            }
          />
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={258}>
              <AreaChart data={trafficTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="org" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={palette.gold} stopOpacity={0.4} /><stop offset="100%" stopColor={palette.gold} stopOpacity={0.05} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={palette.charcoal400} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={palette.charcoal400} fontSize={11} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="organic" stackId="1" stroke={palette.goldDeep} strokeWidth={2} fill="url(#org)" />
                <Area type="monotone" dataKey="direct" stackId="1" stroke={palette.charcoal} strokeWidth={2} fill={palette.charcoal} fillOpacity={0.08} />
                <Area type="monotone" dataKey="paid" stackId="1" stroke={palette.charcoal400} strokeWidth={2} fill={palette.charcoal400} fillOpacity={0.06} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-charcoal-deep text-white">
          <SectionHeader eyebrow="Google Business Profile" title="Local Presence" className="[&_h2]:text-white [&_.eyebrow]:text-gold-200/80" />
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
              <span className="num text-3xl font-bold">{gbp.rating}</span>
            </div>
            <div className="text-sm text-charcoal-200">{num(gbp.reviews)} reviews <span className="text-emerald">+{gbp.reviewsDelta}</span></div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {[
              { l: "Profile views", v: num(gbp.views), i: Globe },
              { l: "Calls", v: num(gbp.calls), i: Phone },
              { l: "Direction requests", v: num(gbp.directionRequests), i: MousePointerClick },
              { l: "Website clicks", v: num(gbp.websiteClicks), i: MousePointerClick },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="flex items-center gap-2 text-charcoal-200"><r.i className="h-4 w-4 text-gold-300" />{r.l}</span>
                <span className="num font-semibold">{r.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Keywords + issues */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 sm:p-6"><SectionHeader eyebrow="Rankings" title="Keyword Positions" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                  <th className="px-3 py-2.5 pl-5 sm:pl-6">Keyword</th>
                  <th className="px-3 py-2.5 text-right">Volume</th>
                  <th className="px-3 py-2.5 text-right">Position</th>
                  <th className="px-3 py-2.5 pr-5 sm:pr-6 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k) => {
                  const change = k.prev - k.position;
                  return (
                    <tr key={k.keyword} className="border-b border-charcoal-50 hover:bg-paper-soft">
                      <td className="px-3 py-2.5 pl-5 sm:pl-6">
                        <div className="font-medium text-charcoal-800">{k.keyword}</div>
                        <div className="text-[11px] text-charcoal-400">{k.url}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right num text-charcoal-600">{num(k.volume)}</td>
                      <td className="px-3 py-2.5 text-right"><span className={`num font-semibold ${k.position <= 3 ? "text-emerald-deep" : k.position <= 10 ? "text-charcoal-900" : "text-charcoal-400"}`}>#{k.position}</span></td>
                      <td className="px-3 py-2.5 pr-5 sm:pr-6 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${change > 0 ? "text-emerald-deep" : change < 0 ? "text-rose-deep" : "text-charcoal-300"}`}>
                          {change > 0 ? <ArrowUp className="h-3 w-3" /> : change < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          {change !== 0 ? Math.abs(change) : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Fix list" title="SEO Opportunities" />
          <div className="mt-3 space-y-2.5">
            {seoIssues.map((s, i) => {
              const m = sevMap[s.severity];
              return (
                <div key={i} className="rounded-xl border border-charcoal-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-charcoal-800"><m.icon className="h-4 w-4" />{s.title}</span>
                    <Badge tone={m.tone}>{m.label}</Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-charcoal-500">{s.detail}</p>
                  <p className="mt-1.5 text-[11px] font-semibold text-gold-700">→ {s.impact}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Pages */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader eyebrow="Winners" title="Top Performing Pages" />
          <div className="mt-3 space-y-3">
            {topPages.map((p) => (
              <div key={p.url}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal-800">{p.url}</span>
                  <span className="flex items-center gap-3"><span className="num text-charcoal-500">{num(p.views)} views</span><Delta value={p.trend} /></span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={p.conversion * 10} tone="emerald" className="h-1.5" />
                  <span className="num shrink-0 text-[11px] font-semibold text-emerald-deep">{pct(p.conversion)} CVR</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Need work" title="Worst Performing Pages" />
          <div className="mt-3 space-y-2.5">
            {worstPages.map((p) => (
              <div key={p.url} className="rounded-xl bg-paper-soft p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal-800">{p.url}</span>
                  <span className="flex items-center gap-3"><span className="num text-charcoal-500">{pct(p.conversion)} CVR</span><Delta value={p.trend} /></span>
                </div>
                {p.issues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.issues.map((iss) => <Badge key={iss} tone="rose">{iss}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
