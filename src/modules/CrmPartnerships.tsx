import { useState } from "react";
import {
  Handshake, Users, CalendarCheck, DollarSign, Dumbbell, Stethoscope, Star,
  Building2, Sparkles, Activity, FileText, Clock, ChevronRight,
} from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar } from "@/components/ui";
import { usd, num, pct, initials } from "@/lib/format";
import {
  partners, partnerRoi, partnerConversion, crmTotals, followUpsDue,
  type Partner, type RelationshipStatus,
} from "@/data/crm";

const typeIcon: Record<string, any> = {
  Gym: Dumbbell, Influencer: Sparkles, Doctor: Stethoscope, Chiropractor: Activity,
  "Wellness Center": Star, "Med Spa": Building2, Corporate: Building2,
};
const statusTone: Record<RelationshipStatus, "emerald" | "gold" | "rose" | "sky"> = {
  Active: "emerald", Nurturing: "gold", "At Risk": "rose", "New Lead": "sky",
};

export default function CrmPartnerships() {
  const [selId, setSelId] = useState(partners[0].id);
  const sel = partners.find((p) => p.id === selId)!;
  const Icon = typeIcon[sel.type] ?? Handshake;

  return (
    <>
      <PageIntro
        eyebrow="CRM & Partnership Management"
        title="The relationships that send you patients."
        description="Track every gym, doctor, influencer, and corporate partner by the revenue they actually drive — and never miss a follow-up."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Partners" value={num(crmTotals.partners)} icon={Handshake} sub="Active relationships" />
        <KpiCard index={1} label="Partner Leads" value={num(crmTotals.leads)} icon={Users} sub="Referred in" />
        <KpiCard index={2} label="Appointments" value={num(crmTotals.appointments)} icon={CalendarCheck} sub="Booked from partners" />
        <KpiCard index={3} label="Partner Revenue" value={usd(crmTotals.revenue)} icon={DollarSign} sub="Attributed" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Partner list */}
        <Card className="lg:col-span-3" pad={false}>
          <div className="p-5 sm:p-6"><SectionHeader eyebrow="Directory" title="Partners" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-charcoal-100 text-left text-[11px] uppercase tracking-wider text-charcoal-400">
                  <th className="px-3 py-2.5 pl-5 sm:pl-6">Partner</th>
                  <th className="px-3 py-2.5 text-right">Leads</th>
                  <th className="px-3 py-2.5 text-right">Conv.</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 pr-5 sm:pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => {
                  const PIcon = typeIcon[p.type] ?? Handshake;
                  return (
                    <tr key={p.id} onClick={() => setSelId(p.id)} className={`cursor-pointer border-b border-charcoal-50 transition hover:bg-paper-soft ${selId === p.id ? "bg-gold-50/60" : ""}`}>
                      <td className="px-3 py-3 pl-5 sm:pl-6">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-charcoal-100 text-charcoal-600"><PIcon className="h-4 w-4" /></span>
                          <div><div className="font-medium text-charcoal-800">{p.name}</div><div className="text-[11px] text-charcoal-400">{p.type}</div></div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right num text-charcoal-600">{num(p.leads)}</td>
                      <td className="px-3 py-3 text-right num text-charcoal-600">{pct(partnerConversion(p))}</td>
                      <td className="px-3 py-3 text-right num font-semibold text-charcoal-900">{usd(p.revenue)}</td>
                      <td className="px-3 py-3 pr-5 sm:pr-6 text-right"><Badge tone={statusTone[p.status]} dot>{p.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-charcoal-900 text-gold-200"><Icon className="h-5 w-5" /></span>
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-900">{sel.name}</h3>
              <div className="text-xs text-charcoal-400">{sel.type} · {sel.contact}</div>
            </div>
            <Badge tone={statusTone[sel.status]} className="ml-auto" dot>{sel.status}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-paper-soft p-3"><div className="num text-lg font-semibold text-charcoal-900">{num(sel.appointments)}</div><div className="text-[11px] text-charcoal-400">Appointments</div></div>
            <div className="rounded-xl bg-paper-soft p-3"><div className="num text-lg font-semibold text-emerald-deep">{pct(partnerConversion(sel))}</div><div className="text-[11px] text-charcoal-400">Conversion</div></div>
            <div className="rounded-xl bg-paper-soft p-3"><div className="num text-lg font-semibold text-charcoal-900">{usd(partnerRoi(sel))}</div><div className="text-[11px] text-charcoal-400">Rev / appt</div></div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-charcoal-500"><span>Revenue contribution</span><span className="num font-semibold text-charcoal-800">{usd(sel.revenue)}</span></div>
            <ProgressBar value={(sel.revenue / Math.max(...partners.map((p) => p.revenue))) * 100} tone="gold" />
          </div>

          <div className="mt-4 space-y-3 border-t border-charcoal-100 pt-4 text-sm">
            {sel.notes && <div className="flex items-start gap-2.5"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-400" /><p className="text-charcoal-600">{sel.notes}</p></div>}
            <div className="flex items-center justify-between rounded-xl bg-gold-50 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium text-charcoal-700"><Clock className="h-4 w-4 text-gold-600" /> Next follow-up</span>
              <span className="num text-sm font-semibold text-charcoal-900">{sel.nextFollowUp}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Follow-ups due */}
      <Card>
        <SectionHeader eyebrow="Don't drop the ball" title="Follow-Ups Due" />
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {followUpsDue.slice(0, 6).map((p) => (
            <button key={p.id} onClick={() => setSelId(p.id)} className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white px-3 py-2.5 text-left transition hover:border-gold-300 hover:shadow-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-charcoal-900 text-[11px] font-semibold text-gold-200">{initials(p.name)}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-charcoal-800">{p.name}</div>
                <div className="text-[11px] text-charcoal-400">{p.nextFollowUp} · {p.type}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-charcoal-300" />
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}
