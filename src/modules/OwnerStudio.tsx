import { useState } from "react";
import {
  ClipboardList, Plus, Trash2, Copy, Mail, Check, RotateCcw, Sparkles,
  CircleDot, Clock, CheckCircle2, DollarSign, Wand2, Send,
} from "lucide-react";
import { Card, PageIntro, SectionHeader, Badge, Segmented, KpiCard } from "@/components/ui";
import { usd, num, pct } from "@/lib/format";
import { editableFields } from "@/data/services";
import { pnlFields, type PnlInputs } from "@/data/revenue";
import { useData, useServices, countServiceOverrides } from "@/store/useData";
import {
  useRequests, reqAreas, type ReqType, type ReqPriority, type ReqStatus, type ChangeRequest,
} from "@/store/useRequests";

const OWNER_EMAIL = "joseph@truenorthholdingcompany.com";
const types: ReqType[] = ["Fix", "Pricing", "Feature", "Content", "Question"];
const priorities: ReqPriority[] = ["High", "Medium", "Low"];

const prioTone: Record<ReqPriority, "rose" | "amber" | "charcoal"> = { High: "rose", Medium: "amber", Low: "charcoal" };
const statusMeta: Record<ReqStatus, { icon: any; tone: "sky" | "gold" | "emerald" }> = {
  Open: { icon: CircleDot, tone: "sky" },
  "In Progress": { icon: Clock, tone: "gold" },
  Shipped: { icon: CheckCircle2, tone: "emerald" },
};

function timeAgo(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function briefText(r: ChangeRequest) {
  return `[Beyond Concierge — Change Request]
Area: ${r.area}
Type: ${r.type} · Priority: ${r.priority}
Title: ${r.title}
Details: ${r.detail || "(none)"}`;
}

// ── Change Requests view ────────────────────────────────────────────────────
function RequestsView() {
  const { requests, add, remove, setStatus, clearShipped } = useRequests();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [area, setArea] = useState(reqAreas[0]);
  const [type, setType] = useState<ReqType>("Fix");
  const [priority, setPriority] = useState<ReqPriority>("High");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 1800); };
  const submit = () => {
    if (!title.trim()) return;
    add({ title: title.trim(), detail: detail.trim(), area, type, priority });
    setTitle(""); setDetail(""); flash("Request added");
  };
  const copyBrief = async (r: ChangeRequest) => {
    try { await navigator.clipboard.writeText(briefText(r)); flash("Brief copied — paste it to us"); } catch { flash("Copy failed"); }
  };
  const emailAll = () => {
    const open = requests.filter((r) => r.status !== "Shipped");
    const body = open.map((r, i) => `${i + 1}. ${briefText(r)}`).join("\n\n");
    const subject = `Beyond Concierge — Dashboard change requests (${open.length})`;
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const counts = {
    open: requests.filter((r) => r.status === "Open").length,
    prog: requests.filter((r) => r.status === "In Progress").length,
    shipped: requests.filter((r) => r.status === "Shipped").length,
  };
  const ordered = [...requests].sort((a, b) => {
    const order: Record<ReqStatus, number> = { Open: 0, "In Progress": 1, Shipped: 2 };
    return order[a.status] - order[b.status] || b.createdAt - a.createdAt;
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* New request */}
      <Card className="lg:col-span-1 h-fit lg:sticky lg:top-20">
        <SectionHeader eyebrow="Tell us what to change" title="New Request" />
        <div className="mt-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to change?" className="input" />
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Add details — exact numbers, where on the page, what it should say…" rows={3} className="input resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="eyebrow">Area</span>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="input mt-1">
                {reqAreas.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Type</span>
              <select value={type} onChange={(e) => setType(e.target.value as ReqType)} className="input mt-1">
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <div>
            <span className="eyebrow">Priority</span>
            <div className="mt-1"><Segmented options={priorities} value={priority} onChange={setPriority} size="sm" /></div>
          </div>
          <button onClick={submit} className="btn-gold w-full"><Plus className="h-4 w-4" /> Add request</button>
          {toast && <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-deep"><Check className="h-3.5 w-3.5" /> {toast}</div>}
        </div>
      </Card>

      {/* List */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Badge tone="sky" dot>{counts.open} Open</Badge>
              <Badge tone="gold" dot>{counts.prog} In progress</Badge>
              <Badge tone="emerald" dot>{counts.shipped} Shipped</Badge>
            </div>
            <div className="flex gap-2">
              <button onClick={emailAll} className="btn-ghost h-9 py-0 text-xs"><Mail className="h-3.5 w-3.5" /> Email all to team</button>
              <button onClick={clearShipped} className="btn-ghost h-9 py-0 text-xs"><Trash2 className="h-3.5 w-3.5" /> Clear shipped</button>
            </div>
          </div>
        </Card>

        {ordered.length === 0 && (
          <Card className="text-center text-sm text-charcoal-400 py-10">No requests yet. Add your first one on the left.</Card>
        )}

        {ordered.map((r) => {
          const sm = statusMeta[r.status];
          return (
            <Card key={r.id} className={r.status === "Shipped" ? "opacity-70" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-charcoal-900">{r.title}</h3>
                    <Badge tone="charcoal">{r.area}</Badge>
                    <Badge tone="charcoal">{r.type}</Badge>
                    <Badge tone={prioTone[r.priority]} dot>{r.priority}</Badge>
                  </div>
                  {r.detail && <p className="mt-1.5 text-sm text-charcoal-500">{r.detail}</p>}
                  <div className="mt-1 text-[11px] text-charcoal-300">{timeAgo(r.createdAt)}</div>
                </div>
                <button onClick={() => remove(r.id)} className="shrink-0 text-charcoal-300 hover:text-rose-deep" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-charcoal-100 pt-3">
                <div className="flex items-center gap-1.5">
                  {(["Open", "In Progress", "Shipped"] as ReqStatus[]).map((st) => {
                    const M = statusMeta[st];
                    const active = r.status === st;
                    return (
                      <button key={st} onClick={() => setStatus(r.id, st)}
                        className={`pill border transition ${active ? `border-transparent ${M.tone === "sky" ? "bg-sky-soft text-sky" : M.tone === "gold" ? "bg-gold-50 text-gold-700" : "bg-emerald-soft text-emerald-deep"}` : "border-charcoal-200 bg-white text-charcoal-400 hover:text-charcoal-700"}`}>
                        <M.icon className="h-3 w-3" /> {st}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => copyBrief(r)} className="pill border border-charcoal-200 bg-white text-charcoal-600 hover:border-gold-400 hover:text-charcoal-900">
                  <Copy className="h-3 w-3" /> Copy brief
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-charcoal-300"><sm.icon className="h-3 w-3" /> {r.status}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Live Pricing view ───────────────────────────────────────────────────────
function PricingView() {
  const { services, totalMonthlyRevenue, totalMonthlyProfit } = useServices();
  const setServiceField = useData((s) => s.setServiceField);
  const setPnlField = useData((s) => s.setPnlField);
  const resetAll = useData((s) => s.resetAll);
  const pnl = useData((s) => s.pnl);
  const overrides = useData((s) => s.serviceOverrides);
  const overrideCount = countServiceOverrides(overrides);
  const blended = totalMonthlyRevenue ? +((totalMonthlyProfit / totalMonthlyRevenue) * 100).toFixed(1) : 0;

  const fieldVal = (kind: string, v: number) => (kind === "pct" ? +(v * 100).toFixed(2) : v);
  const setPnl = (k: keyof PnlInputs, raw: string, kind: string) => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return;
    setPnlField(k, kind === "pct" ? n / 100 : n);
  };

  return (
    <div className="space-y-4">
      <Card className="border-gold-200 bg-gold-50/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-sheen text-charcoal-900"><DollarSign className="h-5 w-5" /></span>
            <div>
              <h3 className="font-display text-base font-semibold text-charcoal-900">Type your real numbers — the whole dashboard updates instantly.</h3>
              <p className="text-sm text-charcoal-500">Saved in this browser. {overrideCount > 0 ? `${overrideCount} value${overrideCount > 1 ? "s" : ""} changed.` : "Nothing changed yet."} Send them to us to make them permanent for everyone.</p>
            </div>
          </div>
          <button onClick={resetAll} className="btn-ghost h-9 py-0 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Reset to demo</button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Monthly Revenue" value={usd(totalMonthlyRevenue)} sub="From your prices" />
        <KpiCard index={1} label="Monthly Profit" value={usd(totalMonthlyProfit)} sub="Gross, fully loaded" />
        <KpiCard index={2} label="Blended Margin" value={`${blended}%`} sub="Across all services" />
        <KpiCard index={3} label="Values Changed" value={num(overrideCount)} sub="Pending overrides" />
      </div>

      {/* Service price editor */}
      <Card pad={false}>
        <div className="p-5 sm:p-6"><SectionHeader eyebrow="Per service" title="Service Pricing" description="Edit any cell. Card fees auto-calculate. Margin and profit update live." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                <th className="px-3 py-2.5 pl-5 sm:pl-6">Service</th>
                {editableFields.map((f) => <th key={f.key} className="px-2 py-2.5 text-right">{f.label}</th>)}
                <th className="px-2 py-2.5 text-right">Margin</th>
                <th className="px-3 py-2.5 pr-5 sm:pr-6 text-right">Mo. Profit</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-charcoal-50">
                  <td className="px-3 py-2.5 pl-5 sm:pl-6">
                    <div className="font-medium text-charcoal-800">{s.name}</div>
                    <div className="text-[11px] text-charcoal-400">{s.category}</div>
                  </td>
                  {editableFields.map((f) => (
                    <td key={f.key} className="px-2 py-2.5 text-right">
                      <div className="inline-flex items-center rounded-lg border border-charcoal-200 bg-white focus-within:border-gold-400">
                        {f.money && <span className="pl-2 text-xs text-charcoal-300">$</span>}
                        <input
                          value={(s as any)[f.key]}
                          onChange={(e) => { const n = parseFloat(e.target.value); if (!Number.isNaN(n)) setServiceField(s.id, f.key, n); }}
                          inputMode="decimal"
                          className="num w-16 bg-transparent py-1.5 pr-2 pl-1 text-right text-sm font-semibold text-charcoal-900 focus:outline-none"
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-right">
                    <Badge tone={s.margin >= 60 ? "emerald" : s.margin >= 45 ? "gold" : s.margin >= 35 ? "amber" : "rose"}>{pct(s.margin)}</Badge>
                  </td>
                  <td className="px-3 py-2.5 pr-5 sm:pr-6 text-right num font-semibold text-charcoal-900">{usd(s.monthlyProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* P&L overrides */}
      <Card>
        <SectionHeader eyebrow="Monthly overhead" title="P&L Inputs" description="The fixed costs and rates behind net profit on the Executive Snapshot." />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pnlFields.map((f) => (
            <label key={f.key} className="block rounded-xl border border-charcoal-100 bg-paper-soft p-3">
              <span className="eyebrow">{f.label}</span>
              <div className="mt-1 flex items-center rounded-lg border border-charcoal-200 bg-white focus-within:border-gold-400">
                {f.kind === "money" && <span className="pl-2 text-xs text-charcoal-300">$</span>}
                <input
                  defaultValue={fieldVal(f.kind, pnl[f.key])}
                  onChange={(e) => setPnl(f.key, e.target.value, f.kind)}
                  inputMode="decimal"
                  className="num w-full bg-transparent px-2 py-1.5 text-sm font-semibold text-charcoal-900 focus:outline-none"
                />
                {f.kind === "pct" && <span className="pr-2 text-xs text-charcoal-300">%</span>}
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function OwnerStudio() {
  const [view, setView] = useState<"Change Requests" | "Live Pricing">("Change Requests");
  return (
    <>
      <PageIntro
        eyebrow="Owner Studio · Private"
        title="Your control room."
        description="Set your real prices and tell us exactly what to change. We ship it from here — and this tab comes off when we're done."
        action={<Segmented options={["Change Requests", "Live Pricing"] as const} value={view} onChange={setView} />}
      />

      <Card className="flex items-center gap-3 border-charcoal-800 bg-charcoal-deep text-white">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-gold-300"><Wand2 className="h-5 w-5" /></span>
        <p className="text-sm text-charcoal-100">
          <span className="font-semibold text-white">How this works:</span> log changes or edit prices here — they save in your browser. Hit <span className="font-semibold text-gold-200">Email all to team</span> or <span className="font-semibold text-gold-200">Copy brief</span> and our team ships the update, then redeploys the live site.
        </p>
      </Card>

      {view === "Change Requests" ? <RequestsView /> : <PricingView />}
    </>
  );
}
