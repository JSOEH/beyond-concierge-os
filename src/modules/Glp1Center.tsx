import { useMemo, useState } from "react";
import { Syringe, Scale, Droplet, TrendingUp, Check, AlertTriangle, RotateCcw } from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar, EmptyState } from "@/components/ui";
import { usd, money, num, pct } from "@/lib/format";
import {
  glp1Products, vials as seedVials, costPerMg, patientEconomics, patients,
  profitPerVial, type Glp1Patient,
} from "@/data/glp1";
import { useInventory } from "@/store/useInventory";

export default function Glp1Center() {
  const vialMg = useInventory((s) => s.vialMg);
  const dispenseGlp1 = useInventory((s) => s.dispenseGlp1);
  const reset = useInventory((s) => s.reset);
  const [flash, setFlash] = useState<string | null>(null);

  const vials = seedVials.map((v) => ({ ...v, remainingMg: vialMg[v.id] ?? v.remainingMg }));
  const econ = useMemo(() => patients.map(patientEconomics), []);

  const totalRemaining = (pid: string) =>
    vials.filter((v) => v.productId === pid).reduce((a, v) => a + v.remainingMg, 0);

  const monthlyProgramProfit = econ.reduce((a, p) => a + p.profit, 0);
  const monthlyProgramRevenue = econ.reduce((a, p) => a + p.revenue, 0);
  const avgMargin = monthlyProgramRevenue ? +((monthlyProgramProfit / monthlyProgramRevenue) * 100).toFixed(1) : 0;

  if (glp1Products.every((p) => p.programPrice === 0) && vials.length === 0) {
    return (
      <>
        <PageIntro
          eyebrow="GLP-1 Weight Loss Margin Center"
          title="Cost per milligram. Profit per patient."
          description="Track every vial down to the mg, and see true profit on each patient and program."
        />
        <EmptyState icon={Syringe} title="No GLP-1 data yet" message="Add your program prices, vial costs, mg per vial, and patient doses (via the intake form) to see cost-per-mg, profit per patient, and profit per vial." hint="Add GLP-1 figures via the intake form" />
      </>
    );
  }

  const doseFromVial = (p: Glp1Patient) => {
    const mg = +(p.weeklyDoseMg).toFixed(2);
    const vial = vials.find((v) => v.productId === p.productId && v.remainingMg >= mg);
    if (!vial) { setFlash(`No vial with ${mg}mg for ${p.name}`); return; }
    const ok = dispenseGlp1(vial.id, mg, p.name, glp1Products.find((x) => x.id === p.productId)!.programPrice);
    if (ok) { setFlash(`Drew ${mg}mg for ${p.name} from ${vial.lot}`); setTimeout(() => setFlash(null), 2400); }
  };

  return (
    <>
      <PageIntro
        eyebrow="GLP-1 Weight Loss Margin Center"
        title="Cost per milligram. Profit per patient."
        description="Track every vial down to the mg, see true profit on each patient and program, and draw doses that deduct stock live."
        action={<button onClick={reset} className="btn-ghost h-9 py-0 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Reset demo</button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Program Revenue" value={usd(monthlyProgramRevenue)} icon={TrendingUp} sub={`${num(patients.length)} sampled patients`} />
        <KpiCard index={1} label="Program Profit" value={usd(monthlyProgramProfit)} icon={Scale} sub="This month, sampled" />
        <KpiCard index={2} label="Avg Margin" value={`${avgMargin}%`} icon={Droplet} sub="Across GLP-1 lines" />
        <KpiCard index={3} label="MG On Hand" value={num(vials.reduce((a, v) => a + v.remainingMg, 0))} icon={Syringe} sub="All vials combined" />
      </div>

      {/* Product cost-per-mg cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {glp1Products.map((prod) => {
          const cpm = costPerMg(prod.id);
          const remaining = totalRemaining(prod.id);
          const purchased = vials.filter((v) => v.productId === prod.id).reduce((a, v) => a + v.mgPurchased, 0);
          const revPerMg = prod.programPrice / prod.maintenanceMgPerMonth;
          return (
            <Card key={prod.id} hover>
              <div className="flex items-start justify-between">
                <div>
                  <div className="eyebrow">{prod.name}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="num text-3xl font-semibold text-charcoal-900">{money(cpm)}</span>
                    <span className="text-sm text-charcoal-400">/ mg cost</span>
                  </div>
                </div>
                <Badge tone="gold">{money(revPerMg)}/mg revenue</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><div className="eyebrow">Program</div><div className="num mt-0.5 font-semibold text-charcoal-900">{usd(prod.programPrice)}/mo</div></div>
                <div><div className="eyebrow">Maint. dose</div><div className="num mt-0.5 font-semibold text-charcoal-900">{prod.maintenanceMgPerMonth}mg/mo</div></div>
                <div><div className="eyebrow">Markup</div><div className="num mt-0.5 font-semibold text-emerald-deep">{pct((revPerMg / cpm - 1) * 100, 0)}</div></div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-charcoal-500">
                  <span>Inventory remaining</span>
                  <span className="num">{num(remaining)} / {num(purchased)} mg</span>
                </div>
                <ProgressBar value={(remaining / purchased) * 100} tone={remaining / purchased < 0.25 ? "amber" : "gold"} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Vials */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 sm:p-6"><SectionHeader eyebrow="Lot tracking" title="Vials On Hand" /></div>
          <div className="divide-y divide-charcoal-100">
            {vials.map((v) => {
              const prod = glp1Products.find((p) => p.id === v.productId)!;
              const lowMg = v.remainingMg < 15;
              return (
                <div key={v.id} className="px-5 sm:px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-charcoal-800">
                        {v.lot} {lowMg && <Badge tone="amber" dot>low</Badge>}
                      </div>
                      <div className="text-[11px] text-charcoal-400">{prod.name} · {v.supplier} · exp {v.expires}</div>
                    </div>
                    <div className="text-right">
                      <div className="num text-sm font-semibold text-charcoal-900">{v.remainingMg.toFixed(1)} mg</div>
                      <div className="num text-[11px] text-emerald-deep">+{usd(profitPerVial(v))}/vial</div>
                    </div>
                  </div>
                  <ProgressBar value={(v.remainingMg / v.mgPurchased) * 100} tone={lowMg ? "amber" : "charcoal"} className="mt-2 h-1.5" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Patients */}
        <Card className="lg:col-span-3" pad={false}>
          <div className="flex items-center justify-between p-5 sm:p-6">
            <SectionHeader eyebrow="Per patient" title="Patient Economics" />
            {flash && <Badge tone="emerald" dot>{flash}</Badge>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                  <th className="px-3 py-2.5 pl-5 sm:pl-6">Patient</th>
                  <th className="px-3 py-2.5 text-right">Dose</th>
                  <th className="px-3 py-2.5 text-right">MG/mo</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 text-right">Cost</th>
                  <th className="px-3 py-2.5 text-right">Profit</th>
                  <th className="px-3 py-2.5 pr-5 sm:pr-6 text-right">Draw</th>
                </tr>
              </thead>
              <tbody>
                {econ.map((p) => (
                  <tr key={p.id} className="border-b border-charcoal-50 hover:bg-paper-soft">
                    <td className="px-3 py-2.5 pl-5 sm:pl-6">
                      <div className="font-medium text-charcoal-800">{p.name}</div>
                      <div className="text-[11px] text-charcoal-400">{p.product.name} · {p.monthsActive}mo</div>
                    </td>
                    <td className="px-3 py-2.5 text-right num text-charcoal-600">{p.weeklyDoseMg}mg/wk</td>
                    <td className="px-3 py-2.5 text-right num text-charcoal-600">{p.mgUsedThisMonth}</td>
                    <td className="px-3 py-2.5 text-right num text-charcoal-700">{usd(p.revenue)}</td>
                    <td className="px-3 py-2.5 text-right num text-charcoal-500">{money(p.productCost + p.nurseCost + p.ccCost)}</td>
                    <td className="px-3 py-2.5 text-right num font-semibold text-emerald-deep">{usd(p.profit)}</td>
                    <td className="px-3 py-2.5 pr-5 sm:pr-6 text-right">
                      <button onClick={() => doseFromVial(p)} className="pill bg-charcoal-900 text-white hover:bg-charcoal-700">
                        <Syringe className="h-3 w-3" /> {p.weeklyDoseMg}mg
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
