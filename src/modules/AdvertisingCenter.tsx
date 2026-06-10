import {
  Megaphone, Target, Users, TrendingUp, ArrowUpCircle, ArrowDownCircle, Minus,
} from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge } from "@/components/ui";
import { HBars } from "@/components/charts";
import { usd, money, num, pct } from "@/lib/format";
import {
  campaignMetrics, adsTotals, byPlatform, bestCampaigns, worstCampaigns, budgetRecs,
} from "@/data/ads";

const platformTone: Record<string, "gold" | "charcoal" | "sky" | "rose"> = {
  Meta: "sky", Google: "gold", TikTok: "charcoal", YouTube: "rose",
};

export default function AdvertisingCenter() {
  return (
    <>
      <PageIntro
        eyebrow="Advertising Command Center"
        title="Every ad dollar, traced to revenue."
        description="Spend, leads, appointments, and ROAS by campaign and platform — with a clear call on where the budget should move."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Ad Spend" value={usd(adsTotals.spend)} icon={Megaphone} sub="This month" />
        <KpiCard index={1} label="Blended ROAS" value={`${adsTotals.roas}×`} icon={TrendingUp} sub={`${usd(adsTotals.revenue)} attributed`} />
        <KpiCard index={2} label="Cost / Appt" value={usd(adsTotals.cpa)} icon={Target} sub={`${num(adsTotals.appts)} booked`} />
        <KpiCard index={3} label="Cost / Lead" value={money(adsTotals.cpl)} icon={Users} sub={`${num(adsTotals.leads)} leads`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeader eyebrow="By platform" title="Spend Split" />
          <div className="mt-3"><HBars data={byPlatform.map((p) => ({ name: p.platform, value: p.spend }))} height={200} /></div>
        </Card>
        <Card>
          <SectionHeader eyebrow="By platform" title="ROAS" />
          <div className="mt-3"><HBars data={byPlatform.map((p) => ({ name: p.platform, value: p.roas }))} height={200} format="num" /></div>
        </Card>
        <Card>
          <SectionHeader eyebrow="By platform" title="Revenue" />
          <div className="mt-3"><HBars data={byPlatform.map((p) => ({ name: p.platform, value: p.revenue }))} height={200} /></div>
        </Card>
      </div>

      {/* Campaign table */}
      <Card pad={false}>
        <div className="p-5 sm:p-6"><SectionHeader eyebrow="Performance" title="Campaign Breakdown" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                <th className="px-3 py-2.5 pl-5 sm:pl-6">Campaign</th>
                <th className="px-3 py-2.5 text-right">Spend</th>
                <th className="px-3 py-2.5 text-right">Leads</th>
                <th className="px-3 py-2.5 text-right">Appts</th>
                <th className="px-3 py-2.5 text-right">CPL</th>
                <th className="px-3 py-2.5 text-right">CAC</th>
                <th className="px-3 py-2.5 text-right">Revenue</th>
                <th className="px-3 py-2.5 pr-5 sm:pr-6 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaignMetrics.map((c) => (
                <tr key={c.id} className="border-b border-charcoal-50 hover:bg-paper-soft">
                  <td className="px-3 py-3 pl-5 sm:pl-6">
                    <div className="flex items-center gap-2">
                      <Badge tone={platformTone[c.platform]}>{c.platform}</Badge>
                      <span className="font-medium text-charcoal-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right num text-charcoal-600">{usd(c.spend)}</td>
                  <td className="px-3 py-3 text-right num text-charcoal-600">{num(c.leads)}</td>
                  <td className="px-3 py-3 text-right num text-charcoal-600">{num(c.appointments)}</td>
                  <td className="px-3 py-3 text-right num text-charcoal-500">{money(c.cpl)}</td>
                  <td className="px-3 py-3 text-right num text-charcoal-500">{usd(c.cac)}</td>
                  <td className="px-3 py-3 text-right num font-semibold text-charcoal-900">{usd(c.revenue)}</td>
                  <td className="px-3 py-3 pr-5 sm:pr-6 text-right">
                    <Badge tone={c.roas >= 6 ? "emerald" : c.roas >= 4 ? "gold" : "rose"}>{c.roas}×</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Best / worst + budget recs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeader eyebrow="Scale these" title="Best Campaigns" />
          <div className="mt-3 space-y-2.5">
            {bestCampaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-emerald-soft/50 px-3 py-2.5">
                <div><div className="text-sm font-medium text-charcoal-800">{c.name}</div><div className="text-[11px] text-charcoal-400">{c.platform} · {usd(c.cac)} CAC</div></div>
                <span className="num font-semibold text-emerald-deep">{c.roas}×</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Trim these" title="Worst Campaigns" />
          <div className="mt-3 space-y-2.5">
            {worstCampaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-rose-soft/50 px-3 py-2.5">
                <div><div className="text-sm font-medium text-charcoal-800">{c.name}</div><div className="text-[11px] text-charcoal-400">{c.platform} · {usd(c.cac)} CAC</div></div>
                <span className="num font-semibold text-rose-deep">{c.roas}×</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="AI recommendation" title="Budget Moves" />
          <div className="mt-3 space-y-2.5">
            {budgetRecs.map((r, i) => {
              const I = r.action === "increase" ? ArrowUpCircle : r.action === "decrease" ? ArrowDownCircle : Minus;
              const tone = r.action === "increase" ? "text-emerald-deep" : r.action === "decrease" ? "text-rose-deep" : "text-charcoal-400";
              return (
                <div key={i} className="flex gap-2.5">
                  <I className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
                  <div>
                    <div className="text-sm font-semibold text-charcoal-800">{r.campaign}</div>
                    <p className="text-[12px] text-charcoal-500">{r.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
