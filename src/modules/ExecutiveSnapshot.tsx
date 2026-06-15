import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, Percent, Receipt, Users, UserPlus,
  Repeat, Gem, Quote, ArrowRight,
} from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Segmented, Delta, ProgressBar } from "@/components/ui";
import { DualArea, MixDonut, TrendArea, HBars } from "@/components/charts";
import { usd, usdCompact, num } from "@/lib/format";
import { periods, type Period, type RevenueModel } from "@/data/revenue";
import { useRevenue } from "@/store/useData";

const plRows: { label: string; key: keyof RevenueModel["financials"]; sign: 1 | -1; strong?: boolean }[] = [
  { label: "Gross Revenue", key: "grossRevenue", sign: 1, strong: true },
  { label: "Credit Card Fees", key: "ccFees", sign: -1 },
  { label: "Processing Fees", key: "processingFees", sign: -1 },
  { label: "Refunds", key: "refunds", sign: -1 },
  { label: "Net Revenue", key: "netRevenue", sign: 1, strong: true },
  { label: "Payroll", key: "payroll", sign: -1 },
  { label: "Contractor Costs", key: "contractorCosts", sign: -1 },
  { label: "Nurse Costs", key: "nurseCosts", sign: -1 },
  { label: "Inventory Costs", key: "inventoryCosts", sign: -1 },
  { label: "Marketing Costs", key: "marketingCosts", sign: -1 },
];

export default function ExecutiveSnapshot() {
  const [period, setPeriod] = useState<Period>("This Month");
  const rev = useRevenue();
  const { serviceMix, trend, financials, kpis } = rev;
  const byBucket = rev.bucketsForPeriod(period);
  const totalRev = rev.revenueForPeriod(period);
  const maxBucket = Math.max(...byBucket.map((b) => b.revenue));

  return (
    <>
      <PageIntro
        eyebrow="Executive Snapshot"
        title="Good morning. Here's the whole business."
        description="One source of truth across finance, operations, marketing, and growth — updated for June 2026."
        action={<Segmented options={periods} value={period} onChange={setPeriod} />}
      />

      {/* Advisor money-quote */}
      <Card className="relative overflow-hidden border-charcoal-800 bg-charcoal-deep text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-gold-300">
            <Quote className="h-5 w-5" />
          </span>
          <div>
            <div className="eyebrow text-gold-200/80">The story this month</div>
            <p className="mt-1 max-w-3xl font-display text-lg leading-snug text-white sm:text-xl">
              You don't have a demand problem — you have a margin, capacity, and consistency
              problem. The fastest dollars are in supply discipline and doubling down on what
              already converts.
            </p>
            <Link to="/advisor" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200">
              See the AI Advisor breakdown <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Card>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Gross Revenue" value={usd(kpis.revenue)} delta={kpis.revenueDelta} icon={DollarSign} sub="Monthly run-rate" />
        <KpiCard index={1} label="Net Profit" value={usd(financials.netProfit)} delta={kpis.profitDelta} icon={TrendingUp} sub={`${financials.netMargin}% net margin`} />
        <KpiCard index={2} label="Avg Ticket" value={usd(kpis.avgTicket)} delta={kpis.avgTicketDelta} icon={Receipt} sub="Per transaction" />
        <KpiCard index={3} label="Customers" value={num(kpis.customerCount)} delta={kpis.customerDelta} icon={Users} sub={`${num(kpis.newCustomers)} new this month`} />
      </div>

      {/* Revenue by service + mix */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionHeader
            eyebrow={period}
            title="Revenue by Service Line"
            action={<span className="num text-xl font-semibold text-charcoal-900">{usd(totalRev)}</span>}
          />
          <div className="mt-5 space-y-3.5">
            {byBucket.map((b) => (
              <div key={b.bucket}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal-700">{b.bucket}</span>
                  <span className="num font-semibold text-charcoal-900">{usd(b.revenue)}</span>
                </div>
                <ProgressBar value={(b.revenue / maxBucket) * 100} tone={b.bucket === byBucket[0].bucket ? "gold" : "charcoal"} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeader eyebrow="Composition" title="Service Mix" />
          <MixDonut data={serviceMix} height={268} />
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader
            eyebrow="12-month view"
            title="Revenue & Profit Growth"
            action={
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold-600" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-charcoal-800" />Profit</span>
              </div>
            }
          />
          <div className="mt-3"><DualArea data={trend} /></div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Acquisition" title="Customer Growth" />
          <div className="mt-3"><TrendArea data={trend} dataKey="customers" format="num" color="#1B1B1F" height={236} /></div>
        </Card>
      </div>

      {/* Financial summary + secondary KPIs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionHeader eyebrow="Monthly P&L" title="Financial Summary" />
          <div className="mt-4 divide-y divide-charcoal-100">
            {plRows.map((r) => (
              <div key={r.label} className={`flex items-center justify-between py-2.5 ${r.strong ? "font-semibold" : ""}`}>
                <span className={r.strong ? "text-charcoal-900" : "text-charcoal-500"}>{r.label}</span>
                <span className={`num ${r.sign === -1 ? "text-rose-deep" : "text-charcoal-900"}`}>
                  {r.sign === -1 ? "−" : ""}{usd(financials[r.key])}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-gold-50 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3 mt-1">
              <span className="font-display text-base font-semibold text-charcoal-900">Net Profit</span>
              <div className="flex items-center gap-3">
                <Delta value={kpis.profitDelta} />
                <span className="num text-xl font-bold text-charcoal-900">{usd(financials.netProfit)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
          <KpiCard index={0} label="Net Margin" value={`${financials.netMargin}%`} delta={kpis.marginDelta} icon={Percent} />
          <KpiCard index={1} label="Rev / Customer" value={usd(kpis.revenuePerCustomer)} delta={kpis.revenuePerCustomerDelta} icon={Gem} />
          <KpiCard index={2} label="Returning" value={num(kpis.returningCustomers)} icon={Repeat} sub="Loyal base" />
          <KpiCard index={3} label="New" value={num(kpis.newCustomers)} delta={kpis.customerDelta} icon={UserPlus} />
          <Card className="col-span-2 bg-paper-soft" hover>
            <SectionHeader eyebrow="Top opportunity" title="Highest-Margin Lines" />
            <div className="mt-3"><HBars data={[...serviceMix].slice(0, 4)} height={170} format="usd" /></div>
          </Card>
        </div>
      </div>
    </>
  );
}
