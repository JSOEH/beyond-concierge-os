import { useMemo, useState } from "react";
import { Gem, TrendingUp, Percent, Flame, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar, EmptyState } from "@/components/ui";
import { usd, num, pct } from "@/lib/format";
import { type Service, MARGIN_FLOOR } from "@/data/services";
import { useServices } from "@/store/useData";

type SortKey = "name" | "retail" | "totalCost" | "grossProfit" | "margin" | "monthlyVolume" | "monthlyRevenue" | "monthlyProfit";

const cols: { key: SortKey; label: string; num?: boolean }[] = [
  { key: "name", label: "Service" },
  { key: "retail", label: "Retail", num: true },
  { key: "totalCost", label: "Total Cost", num: true },
  { key: "grossProfit", label: "Gross Profit", num: true },
  { key: "margin", label: "Margin", num: true },
  { key: "monthlyVolume", label: "Volume", num: true },
  { key: "monthlyRevenue", label: "Mo. Revenue", num: true },
  { key: "monthlyProfit", label: "Mo. Profit", num: true },
];

function marginTone(m: number): "emerald" | "gold" | "amber" | "rose" {
  if (m >= 60) return "emerald";
  if (m >= 45) return "gold";
  if (m >= MARGIN_FLOOR) return "amber";
  return "rose";
}

function RankCard({ title, icon: Icon, rows, value, tone }: {
  title: string; icon: any; rows: Service[]; value: (s: Service) => string; tone: "gold" | "emerald" | "amber" | "rose";
}) {
  const chip = tone === "rose" ? "bg-rose-soft text-rose-deep" : tone === "amber" ? "bg-amber-soft text-amber-deep" : tone === "emerald" ? "bg-emerald-soft text-emerald-deep" : "bg-gold-50 text-gold-700";
  return (
    <Card hover>
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${chip}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-charcoal-800">{title}</h3>
      </div>
      <div className="mt-3 space-y-2.5">
        {rows.slice(0, 3).map((s, i) => (
          <div key={s.id} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm text-charcoal-600">
              <span className="num w-4 text-xs font-semibold text-charcoal-300">{i + 1}</span>
              {s.name}
            </span>
            <span className="num text-sm font-semibold text-charcoal-900">{value(s)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ProfitEngine() {
  const { services, rankByProfit, rankByMargin, rankByVolume, lowestMargin, totalMonthlyRevenue, totalMonthlyProfit } = useServices();
  const [sort, setSort] = useState<SortKey>("monthlyProfit");
  const [dir, setDir] = useState<-1 | 1>(-1);
  const [selectedId, setSelectedId] = useState<string>(rankByProfit[0].id);

  const sorted = useMemo(() => {
    return [...services].sort((a, b) => {
      const av = a[sort]; const bv = b[sort];
      if (typeof av === "string") return dir * av.localeCompare(bv as string);
      return dir * ((av as number) - (bv as number));
    });
  }, [services, sort, dir]);

  if (totalMonthlyRevenue === 0) {
    return (
      <>
        <PageIntro
          eyebrow="Profit Engine"
          title="Every service, fully costed."
          description="Retail minus product, nurse, labor, and card fees — so you see real profit and margin on every line."
        />
        <EmptyState icon={Gem} title="No pricing entered yet" message="Add each service's retail price, product cost, nurse cost, labor, and monthly volume in Owner Studio → Live Pricing. Margins, profit, and rankings calculate automatically." hint="Add your prices in Owner Studio → Live Pricing" />
      </>
    );
  }

  const selected = services.find((s) => s.id === selectedId) ?? services[0];
  const blendedMargin = +((totalMonthlyProfit / totalMonthlyRevenue) * 100).toFixed(1);

  const breakdown = [
    { label: "Product", value: selected.productCost, tone: "bg-gold-400" },
    { label: "Nurse", value: selected.nurseCost, tone: "bg-charcoal-700" },
    { label: "Labor", value: selected.laborCost, tone: "bg-charcoal-400" },
    { label: "Card Fees", value: selected.ccCost, tone: "bg-charcoal-200" },
    { label: "Gross Profit", value: selected.grossProfit, tone: "bg-emerald" },
  ];

  const toggleSort = (k: SortKey) => {
    if (k === sort) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(-1); }
  };

  return (
    <>
      <PageIntro
        eyebrow="Profit Engine"
        title="Every service, fully costed."
        description="Retail minus product, nurse, labor, and card fees — so you see real profit and margin on every single line."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Monthly Revenue" value={usd(totalMonthlyRevenue)} icon={TrendingUp} sub="Across all services" />
        <KpiCard index={1} label="Monthly Profit" value={usd(totalMonthlyProfit)} icon={Gem} sub="Gross, fully loaded" />
        <KpiCard index={2} label="Blended Margin" value={`${blendedMargin}%`} icon={Percent} sub="Weighted across mix" />
        <KpiCard index={3} label="Active Services" value={num(services.length)} icon={Flame} sub="Tracked lines" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RankCard title="Highest Profit" icon={Gem} rows={rankByProfit} tone="gold" value={(s) => usd(s.monthlyProfit)} />
        <RankCard title="Highest Margin" icon={Percent} rows={rankByMargin} tone="emerald" value={(s) => pct(s.margin)} />
        <RankCard title="Most Popular" icon={Flame} rows={rankByVolume} tone="amber" value={(s) => `${num(s.monthlyVolume)}/mo`} />
        <RankCard title="Lowest Margin" icon={AlertTriangle} rows={lowestMargin} tone="rose" value={(s) => pct(s.margin)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Table */}
        <Card className="lg:col-span-2 overflow-hidden" pad={false}>
          <div className="border-b border-charcoal-100 p-5 sm:p-6">
            <SectionHeader eyebrow="Unit economics" title="Service P&L Breakdown" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 text-left">
                  {cols.map((c) => (
                    <th key={c.key} className={`whitespace-nowrap px-3 py-3 first:pl-5 sm:first:pl-6 ${c.num ? "text-right" : ""}`}>
                      <button onClick={() => toggleSort(c.key)} className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition ${sort === c.key ? "text-charcoal-900" : "text-charcoal-400 hover:text-charcoal-600"} ${c.num ? "flex-row-reverse" : ""}`}>
                        {c.label}
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`cursor-pointer border-b border-charcoal-50 transition hover:bg-paper-soft ${selectedId === s.id ? "bg-gold-50/60" : ""}`}
                  >
                    <td className="px-3 py-3 pl-5 sm:pl-6">
                      <div className="font-medium text-charcoal-800">{s.name}</div>
                      <div className="text-[11px] text-charcoal-400">{s.category}</div>
                    </td>
                    <td className="px-3 py-3 text-right num text-charcoal-700">{usd(s.retail)}</td>
                    <td className="px-3 py-3 text-right num text-charcoal-500">{usd(s.totalCost)}</td>
                    <td className="px-3 py-3 text-right num font-semibold text-charcoal-900">{usd(s.grossProfit)}</td>
                    <td className="px-3 py-3 text-right">
                      <Badge tone={marginTone(s.margin)}>{pct(s.margin)}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right num text-charcoal-700">{num(s.monthlyVolume)}</td>
                    <td className="px-3 py-3 text-right num text-charcoal-700">{usd(s.monthlyRevenue)}</td>
                    <td className="px-3 py-3 pr-5 sm:pr-6 text-right num font-semibold text-charcoal-900">{usd(s.monthlyProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail breakdown */}
        <Card>
          <SectionHeader eyebrow="Cost waterfall" title={selected.name} description={selected.unitLabel} />
          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-sm text-charcoal-400">Retail price</span>
            <span className="num text-2xl font-semibold text-charcoal-900">{usd(selected.retail)}</span>
          </div>

          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
            {breakdown.map((b) => (
              <div key={b.label} className={b.tone} style={{ width: `${(b.value / selected.retail) * 100}%` }} title={`${b.label}: ${usd(b.value)}`} />
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-charcoal-600">
                  <span className={`h-2.5 w-2.5 rounded-sm ${b.tone}`} />
                  {b.label}
                </span>
                <span className="num font-medium text-charcoal-900">
                  {usd(b.value)} <span className="text-charcoal-300">· {pct((b.value / selected.retail) * 100, 0)}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-charcoal-100 pt-4">
            <div>
              <div className="eyebrow">Margin</div>
              <div className="num mt-0.5 text-xl font-semibold text-emerald-deep">{pct(selected.margin)}</div>
            </div>
            <div>
              <div className="eyebrow">Monthly Profit</div>
              <div className="num mt-0.5 text-xl font-semibold text-charcoal-900">{usd(selected.monthlyProfit)}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-paper-soft p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-charcoal-500">Share of total profit · {num(selected.monthlyVolume)} done/mo</span>
              <span className="font-semibold text-charcoal-700">{usd(selected.monthlyRevenue)}</span>
            </div>
            <ProgressBar value={(selected.monthlyProfit / totalMonthlyProfit) * 100} tone="gold" />
            <div className="mt-1.5 text-[11px] text-charcoal-400">
              {pct((selected.monthlyProfit / totalMonthlyProfit) * 100)} of total monthly profit
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
