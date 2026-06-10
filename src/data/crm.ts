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
  { id: "pt1", name: "Elevation Strength Club", type: "Gym", contact: "Jordan Webb", status: "Active", leads: 86, appointments: 41, revenue: 19400, lastTouch: "2026-06-04", nextFollowUp: "2026-06-18", notes: "Cross-promo: recovery IV package for members. Wants a pop-up event." },
  { id: "pt2", name: "Dr. Lena Park (Internal Med)", type: "Doctor", contact: "Dr. Lena Park", status: "Active", leads: 52, appointments: 38, revenue: 24800, lastTouch: "2026-06-06", nextFollowUp: "2026-06-20", notes: "Refers GLP-1 candidates. High conversion — protect this relationship." },
  { id: "pt3", name: "@coastal.wellness", type: "Influencer", contact: "Mia Coastal", status: "Nurturing", leads: 124, appointments: 29, revenue: 8600, lastTouch: "2026-05-28", nextFollowUp: "2026-06-12", notes: "92k followers. Strong reach, soft conversion — tighten CTA & tracking link." },
  { id: "pt4", name: "Align Chiropractic", type: "Chiropractor", contact: "Dr. Sam Ortiz", status: "Active", leads: 38, appointments: 22, revenue: 7300, lastTouch: "2026-06-02", nextFollowUp: "2026-06-16", notes: "Co-located patients for recovery IVs. Steady, low-maintenance." },
  { id: "pt5", name: "Pinnacle Corporate Wellness", type: "Corporate", contact: "Rachel Tan", status: "Nurturing", leads: 19, appointments: 14, revenue: 12600, lastTouch: "2026-05-30", nextFollowUp: "2026-06-13", notes: "On-site B12 + wellness days. Negotiating a quarterly contract." },
  { id: "pt6", name: "Serenity Med Spa", type: "Med Spa", contact: "Olivia Crane", status: "At Risk", leads: 14, appointments: 4, revenue: 1800, lastTouch: "2026-04-22", nextFollowUp: "2026-06-11", notes: "Overlap on services — referral flow stalled. Decide: nurture or drop." },
  { id: "pt7", name: "The Reset Studio", type: "Wellness Center", contact: "Priya Shah", status: "New Lead", leads: 0, appointments: 0, revenue: 0, lastTouch: "2026-06-08", nextFollowUp: "2026-06-11", notes: "Intro call booked. Yoga + recovery audience — strong IV fit." },
  { id: "pt8", name: "@thefitexec", type: "Influencer", contact: "Marcus Reed", status: "Active", leads: 71, appointments: 33, revenue: 14200, lastTouch: "2026-06-05", nextFollowUp: "2026-06-19", notes: "Executive male audience — great for NAD+ and concierge. Renew Q3 deal." },
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
