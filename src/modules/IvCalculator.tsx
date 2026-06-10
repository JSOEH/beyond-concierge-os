import { useMemo, useState } from "react";
import { FlaskConical, Plus, Minus, Droplets, Syringe, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, Segmented, ProgressBar } from "@/components/ui";
import { money, usd, pct } from "@/lib/format";
import {
  recipes, allIvItems, ivItemById, SUPPLY_COST, DEFAULT_NURSE_RATE, DEFAULT_DRIP_MINUTES, type RecipeLine,
} from "@/data/iv";
import { useInventory } from "@/store/useInventory";

export default function IvCalculator() {
  const ivStock = useInventory((s) => s.ivStock);
  const dispenseCustom = useInventory((s) => s.dispenseCustom);
  const reset = useInventory((s) => s.reset);

  const [recipeId, setRecipeId] = useState(recipes[0].id);
  const [lines, setLines] = useState<RecipeLine[]>(recipes[0].lines.map((l) => ({ ...l })));
  const [retail, setRetail] = useState(recipes[0].retail);
  const [nurseMinutes, setNurseMinutes] = useState(DEFAULT_DRIP_MINUTES);
  const [justDispensed, setJustDispensed] = useState(false);

  const loadRecipe = (id: string) => {
    const r = recipes.find((x) => x.id === id)!;
    setRecipeId(id);
    setLines(r.lines.map((l) => ({ ...l })));
    setRetail(r.retail);
    setJustDispensed(false);
  };

  const setAmount = (ingredientId: string, amount: number) =>
    setLines((ls) => ls.map((l) => (l.ingredientId === ingredientId ? { ...l, amount: Math.max(0, +amount.toFixed(2)) } : l)));

  const addLine = (ingredientId: string) =>
    setLines((ls) => (ls.some((l) => l.ingredientId === ingredientId) ? ls : [...ls, { ingredientId, amount: 1 }]));

  const removeLine = (ingredientId: string) =>
    setLines((ls) => ls.filter((l) => l.ingredientId !== ingredientId));

  const { ingredientCost, bagCost } = useMemo(() => {
    let ing = 0, bag = 0;
    for (const l of lines) {
      const item = ivItemById(l.ingredientId);
      if (!item) continue;
      const c = item.unitCost * l.amount;
      if (item.id === "saline-bag") bag += c;
      else ing += c;
    }
    return { ingredientCost: +ing.toFixed(2), bagCost: +bag.toFixed(2) };
  }, [lines]);

  const nurseLabor = +((DEFAULT_NURSE_RATE / 60) * nurseMinutes).toFixed(2);
  const totalCost = +(ingredientCost + bagCost + SUPPLY_COST + nurseLabor).toFixed(2);
  const grossProfit = +(retail - totalCost).toFixed(2);
  const margin = retail > 0 ? +((grossProfit / retail) * 100).toFixed(1) : 0;

  const available = lines.every((l) => (ivStock[l.ingredientId] ?? 0) >= l.amount);
  const unusedIngredients = allIvItems.filter((i) => !lines.some((l) => l.ingredientId === i.id));

  const onDispense = () => {
    if (!available) return;
    const cur = recipes.find((r) => r.id === recipeId)!;
    dispenseCustom(cur.name, lines, retail);
    setJustDispensed(true);
    setTimeout(() => setJustDispensed(false), 2200);
  };

  return (
    <>
      <PageIntro
        eyebrow="IV Recipe Calculator"
        title="Build a drip. Know the margin. Deduct the stock."
        description="Adjust any ingredient and watch cost, profit, and inventory update live — then dispense to draw down stock automatically."
        action={<button onClick={reset} className="btn-ghost h-9 py-0 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Reset demo</button>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Segmented options={recipes.map((r) => r.name) as any} value={recipes.find((r) => r.id === recipeId)!.name} onChange={(n) => loadRecipe(recipes.find((r) => r.name === n)!.id)} size="sm" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Builder */}
        <Card className="lg:col-span-2">
          <SectionHeader eyebrow="Formula" title="Ingredients" description="Tap +/− to titrate. Cost recalculates instantly." />
          <div className="mt-4 space-y-2">
            {lines.map((l) => {
              const item = ivItemById(l.ingredientId)!;
              const stock = ivStock[l.ingredientId] ?? 0;
              const short = stock < l.amount;
              const low = stock <= item.reorderLevel;
              return (
                <div key={l.ingredientId} className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white px-3 py-2.5">
                  <Droplets className="h-4 w-4 shrink-0 text-gold-500" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-charcoal-800">
                      {item.name}
                      {short ? <Badge tone="rose" dot>short</Badge> : low ? <Badge tone="amber" dot>low</Badge> : null}
                    </div>
                    <div className="text-[11px] text-charcoal-400">
                      {money(item.unitCost)}/{item.unit} · {stock.toFixed(0)} {item.unit} on hand · {item.supplier}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setAmount(l.ingredientId, l.amount - 0.5)} className="grid h-7 w-7 place-items-center rounded-lg border border-charcoal-200 text-charcoal-500 hover:bg-paper-soft"><Minus className="h-3.5 w-3.5" /></button>
                    <input
                      value={l.amount}
                      onChange={(e) => setAmount(l.ingredientId, parseFloat(e.target.value) || 0)}
                      className="num w-14 rounded-lg border border-charcoal-200 bg-white py-1 text-center text-sm font-semibold text-charcoal-900 focus:border-gold-400 focus:outline-none"
                    />
                    <button onClick={() => setAmount(l.ingredientId, l.amount + 0.5)} className="grid h-7 w-7 place-items-center rounded-lg border border-charcoal-200 text-charcoal-500 hover:bg-paper-soft"><Plus className="h-3.5 w-3.5" /></button>
                    <span className="num w-16 text-right text-sm font-semibold text-charcoal-900">{money(item.unitCost * l.amount)}</span>
                    <button onClick={() => removeLine(l.ingredientId)} className="ml-1 text-charcoal-300 hover:text-rose-deep">×</button>
                  </div>
                </div>
              );
            })}
          </div>

          {unusedIngredients.length > 0 && (
            <div className="mt-4">
              <div className="eyebrow mb-2">Add ingredient</div>
              <div className="flex flex-wrap gap-1.5">
                {unusedIngredients.map((i) => (
                  <button key={i.id} onClick={() => addLine(i.id)} className="pill border border-charcoal-200 bg-white text-charcoal-600 hover:border-gold-400 hover:text-charcoal-900">
                    <Plus className="h-3 w-3" /> {i.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4 rounded-xl bg-paper-soft p-3">
            <Syringe className="h-4 w-4 text-charcoal-500" />
            <span className="text-sm text-charcoal-600">Nurse time</span>
            <input type="range" min={15} max={75} step={5} value={nurseMinutes} onChange={(e) => setNurseMinutes(+e.target.value)} className="flex-1 accent-gold-500" />
            <span className="num text-sm font-semibold text-charcoal-800">{nurseMinutes} min · {money(nurseLabor)}</span>
          </div>
        </Card>

        {/* Costing + dispense */}
        <div className="space-y-4">
          <Card className="bg-charcoal-deep text-white">
            <SectionHeader eyebrow="Live margin" title="Drip P&L" className="[&_h2]:text-white [&_.eyebrow]:text-gold-200/80" />
            <div className="mt-4 space-y-2 text-sm">
              {[
                ["Ingredient cost", ingredientCost],
                ["Bag cost", bagCost],
                ["Supply cost", SUPPLY_COST],
                ["Nurse labor", nurseLabor],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between text-charcoal-200">
                  <span>{label}</span><span className="num text-white">{money(val as number)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
                <span className="text-white">Total cost</span><span className="num text-white">{money(totalCost)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/[0.05] p-3">
              <div className="flex items-center justify-between text-xs text-charcoal-200">
                <span>Retail price</span>
                <input value={retail} onChange={(e) => setRetail(parseFloat(e.target.value) || 0)} className="num w-20 rounded-md bg-white/10 px-2 py-1 text-right font-semibold text-white focus:outline-none" />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gold-200/80">Gross profit</div>
                  <div className="num text-2xl font-bold text-white">{usd(grossProfit)}</div>
                </div>
                <Badge tone={margin >= 70 ? "emerald" : margin >= 55 ? "gold" : "amber"}>{pct(margin)} margin</Badge>
              </div>
              <div className="mt-2"><ProgressBar value={margin} tone={margin >= 70 ? "emerald" : "gold"} /></div>
            </div>

            <button
              onClick={onDispense}
              disabled={!available}
              className={`btn mt-4 w-full ${available ? "bg-gold-sheen text-charcoal-900 shadow-gold hover:brightness-105" : "cursor-not-allowed bg-white/10 text-charcoal-300"}`}
            >
              {justDispensed ? <><Check className="h-4 w-4" /> Dispensed — stock deducted</> : available ? <><FlaskConical className="h-4 w-4" /> Dispense & deduct inventory</> : <><AlertTriangle className="h-4 w-4" /> Not enough stock</>}
            </button>
          </Card>

          <Card>
            <SectionHeader eyebrow="Stock impact" title="After this drip" />
            <div className="mt-3 space-y-2.5">
              {lines.map((l) => {
                const item = ivItemById(l.ingredientId)!;
                const stock = ivStock[l.ingredientId] ?? 0;
                const after = Math.max(0, stock - l.amount);
                return (
                  <div key={l.ingredientId}>
                    <div className="flex justify-between text-xs">
                      <span className="text-charcoal-500">{item.name}</span>
                      <span className="num text-charcoal-700">{stock.toFixed(0)} → <span className="font-semibold">{after.toFixed(0)}</span> {item.unit}</span>
                    </div>
                    <ProgressBar value={(after / Math.max(item.stock, 1)) * 100} tone={after <= item.reorderLevel ? "amber" : "charcoal"} className="mt-1 h-1.5" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <DispenseLog />
    </>
  );
}

function DispenseLog() {
  const log = useInventory((s) => s.log).filter((l) => l.label.startsWith("Dispensed") || l.label.includes("IV"));
  if (log.length === 0) return null;
  return (
    <Card>
      <SectionHeader eyebrow="Activity" title="Recent Dispenses" />
      <div className="mt-3 divide-y divide-charcoal-100">
        {log.slice(0, 6).map((l) => (
          <div key={l.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <div className="font-medium text-charcoal-800">{l.label}</div>
              <div className="text-[11px] text-charcoal-400">{l.detail} · {l.time}</div>
            </div>
            <div className="text-right">
              <div className="num font-semibold text-emerald-deep">+{usd(l.revenue)}</div>
              <div className="num text-[11px] text-charcoal-400">cost {money(l.cost)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
