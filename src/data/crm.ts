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

// Cleared — awaiting the owner's real partners (see the intake form).
export const partners: Partner[] = [];

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
