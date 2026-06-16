// ── CRM & Partnership Management ────────────────────────────────────────────

export type PartnerType =
  | "Gym"
  | "Influencer"
  | "Doctor"
  | "Chiropractor"
  | "Wellness Center"
  | "Med Spa"
  | "Corporate";

export type RelationshipStatus = "Active" | "Nurturing" | "At Risk" | "New Lead";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  contact: string;
  status: RelationshipStatus;
  leads: number;
  appointments: number;
  revenue: number;
  lastTouch: string;
  nextFollowUp: string;
  notes: string;
}

export const partners: Partner[] = [
  { id: "pt1", name: "Partner 1", type: "Gym", contact: "—", status: "Active", leads: 86, appointments: 41, revenue: 19400, lastTouch: "2026-06-04", nextFollowUp: "2026-06-18", notes: "" },
  { id: "pt2", name: "Partner 2", type: "Doctor", contact: "—", status: "Active", leads: 52, appointments: 38, revenue: 24800, lastTouch: "2026-06-06", nextFollowUp: "2026-06-20", notes: "" },
  { id: "pt3", name: "Partner 3", type: "Influencer", contact: "—", status: "Nurturing", leads: 124, appointments: 29, revenue: 8600, lastTouch: "2026-05-28", nextFollowUp: "2026-06-12", notes: "" },
  { id: "pt4", name: "Partner 4", type: "Chiropractor", contact: "—", status: "Active", leads: 38, appointments: 22, revenue: 7300, lastTouch: "2026-06-02", nextFollowUp: "2026-06-16", notes: "" },
  { id: "pt5", name: "Partner 5", type: "Corporate", contact: "—", status: "Nurturing", leads: 19, appointments: 14, revenue: 12600, lastTouch: "2026-05-30", nextFollowUp: "2026-06-13", notes: "" },
  { id: "pt6", name: "Partner 6", type: "Med Spa", contact: "—", status: "At Risk", leads: 14, appointments: 4, revenue: 1800, lastTouch: "2026-04-22", nextFollowUp: "2026-06-11", notes: "" },
  { id: "pt7", name: "Partner 7", type: "Wellness Center", contact: "—", status: "New Lead", leads: 0, appointments: 0, revenue: 0, lastTouch: "2026-06-08", nextFollowUp: "2026-06-11", notes: "" },
  { id: "pt8", name: "Partner 8", type: "Influencer", contact: "—", status: "Active", leads: 71, appointments: 33, revenue: 14200, lastTouch: "2026-06-05", nextFollowUp: "2026-06-19", notes: "" },
];

export const partnerRoi = (p: Partner) =>
  p.appointments ? +(p.revenue / Math.max(p.appointments, 1)).toFixed(0) : 0;

export const partnerConversion = (p: Partner) =>
  p.leads ? +((p.appointments / p.leads) * 100).toFixed(1) : 0;

export const crmTotals = {
  partners: partners.length,
  leads: partners.reduce((a, p) => a + p.leads, 0),
  appointments: partners.reduce((a, p) => a + p.appointments, 0),
  revenue: partners.reduce((a, p) => a + p.revenue, 0),
};

export const topPartners = [...partners].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
export const followUpsDue = [...partners].sort(
  (a, b) => new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime(),
);
