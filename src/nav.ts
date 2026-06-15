import {
  LayoutDashboard,
  Sparkles,
  Gem,
  FlaskConical,
  Syringe,
  Boxes,
  Globe,
  Share2,
  Megaphone,
  Handshake,
  CalendarRange,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
  group: string;
  end?: boolean;
}

export const nav: NavItem[] = [
  { to: "/", label: "Executive Snapshot", short: "Overview", icon: LayoutDashboard, group: "Overview", end: true },
  { to: "/advisor", label: "AI Advisor", short: "Advisor", icon: Sparkles, group: "Overview" },
  { to: "/profit", label: "Profit Engine", short: "Profit", icon: Gem, group: "Finance & Margin" },
  { to: "/iv", label: "IV Recipe Calculator", short: "IV Calc", icon: FlaskConical, group: "Finance & Margin" },
  { to: "/glp1", label: "GLP-1 Margin Center", short: "GLP-1", icon: Syringe, group: "Finance & Margin" },
  { to: "/inventory", label: "Inventory Command", short: "Inventory", icon: Boxes, group: "Finance & Margin" },
  { to: "/seo", label: "Website & SEO", short: "SEO", icon: Globe, group: "Growth & Demand" },
  { to: "/social", label: "Social Command", short: "Social", icon: Share2, group: "Growth & Demand" },
  { to: "/ads", label: "Advertising", short: "Ads", icon: Megaphone, group: "Growth & Demand" },
  { to: "/crm", label: "CRM & Partnerships", short: "CRM", icon: Handshake, group: "Growth & Demand" },
  { to: "/growth", label: "90-Day Growth Plan", short: "Growth", icon: CalendarRange, group: "Growth & Demand" },
  // ── TEMPORARY: Owner Studio. Remove this single line + the /studio route in
  //    main.tsx to take the tab away once changes are finalized. ──────────────
  { to: "/studio", label: "Owner Studio", short: "Studio", icon: Wand2, group: "Owner · Temporary" },
];

export const navGroups = [...new Set(nav.map((n) => n.group))];
