import { useState } from "react";
import { Boxes, AlertTriangle, CalendarClock, Layers, TrendingUp, TrendingDown, DollarSign, Gem } from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar, Segmented, EmptyState } from "@/components/ui";
import { usd, usdCompact, num, pct } from "@/lib/format";
import {
  inventory, itemValue, turnover, totalInventoryValue, lowStock, expiringSoon,
  fastestMoving, slowestMoving, mostExpensive, mostProfitable, daysUntil,
  type InventoryItem, type InvCategory,
} from "@/data/inventory";

const categories = ["All", "Injectables", "IV & Nutrients", "Weight Loss", "Supplies", "Retail"] as const;

function MoverCard({ title, icon: Icon, rows, value, tone }: {
  title: string; icon: any; rows: InventoryItem[]; value: (i: InventoryItem) => string; tone: string;
}) {
  return (
    <Card hover>
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
        <h3 className="text-sm font-semibold text-charcoal-800">{title}</h3>
      </div>
      <div className="mt-3 space-y-2">
        {rows.slice(0, 4).map((i) => (
          <div key={i.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-charcoal-600">{i.name}</span>
            <span className="num shrink-0 font-semibold text-charcoal-900">{value(i)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function InventoryCenter() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const rows = cat === "All" ? inventory : inventory.filter((i) => i.category === (cat as InvCategory));

  if (!inventory.length) {
    return (
      <>
        <PageIntro
          eyebrow="Inventory Command Center"
          title="Know what you have, before you run out."
          description="Real-time stock, reorder alerts, expiry watch, and the movers that quietly make or cost you money."
        />
        <EmptyState icon={Boxes} title="No inventory yet" message="Add your products with stock, unit cost, reorder levels, and suppliers and this center lights up with alerts, expiry watch, and your fastest/slowest movers." hint="Add inventory via the intake form" />
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Inventory Command Center"
        title="Know what you have, before you run out."
        description="Real-time stock, reorder alerts, expiry watch, and the movers that quietly make or cost you money."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Inventory Value" value={usd(totalInventoryValue)} icon={Boxes} sub="At cost, on hand" />
        <KpiCard index={1} label="Below Reorder" value={num(lowStock.length)} icon={AlertTriangle} sub="Need attention" />
        <KpiCard index={2} label="Expiring <150d" value={num(expiringSoon.length)} icon={CalendarClock} sub="Use or lose" />
        <KpiCard index={3} label="Tracked SKUs" value={num(inventory.length)} icon={Layers} sub="Across 5 categories" />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-amber/30 bg-amber-soft/40">
          <SectionHeader eyebrow="Action needed" title="Low Stock Alerts" />
          <div className="mt-3 space-y-2.5">
            {lowStock.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
                <div>
                  <div className="text-sm font-medium text-charcoal-800">{i.name}</div>
                  <div className="text-[11px] text-charcoal-400">{i.stock} {i.unit} on hand · reorder at {i.reorderLevel} · {i.supplier}</div>
                </div>
                <button className="pill bg-charcoal-900 text-white hover:bg-charcoal-700">Reorder</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Expiry watch" title="Expiring Soon" />
          <div className="mt-3 space-y-2.5">
            {expiringSoon.map((i) => (
              <div key={i.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-charcoal-800">{i.name}</div>
                  <div className="text-[11px] text-charcoal-400">{i.stock} {i.unit} · {usd(itemValue(i))} at risk</div>
                </div>
                <Badge tone={i.daysToExpiry < 90 ? "rose" : "amber"}>{i.daysToExpiry}d</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Movers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MoverCard title="Fastest Moving" icon={TrendingUp} rows={fastestMoving} tone="bg-emerald-soft text-emerald-deep" value={(i) => `${turnover(i)}×`} />
        <MoverCard title="Slowest Moving" icon={TrendingDown} rows={slowestMoving} tone="bg-charcoal-100 text-charcoal-600" value={(i) => `${turnover(i)}×`} />
        <MoverCard title="Most Expensive" icon={DollarSign} rows={mostExpensive} tone="bg-amber-soft text-amber-deep" value={(i) => usd(i.unitCost)} />
        <MoverCard title="Most Profitable" icon={Gem} rows={mostProfitable} tone="bg-gold-50 text-gold-700" value={(i) => pct(i.marginPct, 0)} />
      </div>

      {/* Full table */}
      <Card pad={false}>
        <div className="flex flex-col gap-3 border-b border-charcoal-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <SectionHeader eyebrow="Full catalog" title="Inventory" />
          <Segmented options={categories} value={cat} onChange={setCat} size="sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                <th className="px-3 py-3 pl-5 sm:pl-6">Product</th>
                <th className="px-3 py-3 text-right">On Hand</th>
                <th className="px-3 py-3 text-right">Unit Cost</th>
                <th className="px-3 py-3 text-right">Value</th>
                <th className="px-3 py-3 text-right">Usage/mo</th>
                <th className="px-3 py-3 text-right">Turnover</th>
                <th className="px-3 py-3 pr-5 sm:pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const low = i.stock <= i.reorderLevel;
                const exp = i.expires ? daysUntil(i.expires) : null;
                return (
                  <tr key={i.id} className="border-b border-charcoal-50 hover:bg-paper-soft">
                    <td className="px-3 py-3 pl-5 sm:pl-6">
                      <div className="font-medium text-charcoal-800">{i.name}</div>
                      <div className="text-[11px] text-charcoal-400">{i.category} · {i.supplier}</div>
                    </td>
                    <td className="px-3 py-3 text-right num text-charcoal-700">{num(i.stock)} <span className="text-charcoal-300">{i.unit}</span></td>
                    <td className="px-3 py-3 text-right num text-charcoal-600">{usd(i.unitCost)}</td>
                    <td className="px-3 py-3 text-right num font-semibold text-charcoal-900">{usdCompact(itemValue(i))}</td>
                    <td className="px-3 py-3 text-right num text-charcoal-600">{num(i.monthlyUsage)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex w-20 items-center justify-end gap-2">
                        <span className="num text-charcoal-600">{turnover(i)}×</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 pr-5 sm:pr-6 text-right">
                      {low ? <Badge tone="rose" dot>Reorder</Badge> : exp !== null && exp < 90 ? <Badge tone="amber" dot>Exp {exp}d</Badge> : <Badge tone="emerald" dot>Healthy</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
