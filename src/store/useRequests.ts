import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReqPriority = "High" | "Medium" | "Low";
export type ReqType = "Fix" | "Pricing" | "Feature" | "Content" | "Question";
export type ReqStatus = "Open" | "In Progress" | "Shipped";

export interface ChangeRequest {
  id: string;
  title: string;
  detail: string;
  area: string; // which screen / module
  type: ReqType;
  priority: ReqPriority;
  status: ReqStatus;
  createdAt: number;
}

export const reqAreas = [
  "Executive Snapshot", "Profit Engine", "IV Calculator", "GLP-1", "Inventory",
  "Website & SEO", "Social", "Advertising", "CRM", "90-Day Plan", "AI Advisor",
  "Branding / Theme", "Whole Dashboard", "Other",
];

const seed: ChangeRequest[] = [
  {
    id: "ex-1",
    title: "Use our real Botox pricing",
    detail: "We charge $12/unit and average ~35 units. Update the Profit Engine so margins are accurate.",
    area: "Profit Engine",
    type: "Pricing",
    priority: "High",
    status: "Open",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "ex-2",
    title: "Add our med-spa logo to the top",
    detail: "Swap the placeholder 'B' mark for our actual logo and match the gold to our brand gold.",
    area: "Branding / Theme",
    type: "Fix",
    priority: "Medium",
    status: "Open",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
];

interface RequestState {
  requests: ChangeRequest[];
  add: (r: Omit<ChangeRequest, "id" | "createdAt" | "status">) => void;
  update: (id: string, patch: Partial<ChangeRequest>) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: ReqStatus) => void;
  clearShipped: () => void;
  resetExamples: () => void;
}

export const useRequests = create<RequestState>()(
  persist(
    (set) => ({
      requests: seed,
      add: (r) =>
        set((s) => ({
          requests: [
            { ...r, id: crypto.randomUUID(), createdAt: Date.now(), status: "Open" },
            ...s.requests,
          ],
        })),
      update: (id, patch) =>
        set((s) => ({ requests: s.requests.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      remove: (id) => set((s) => ({ requests: s.requests.filter((x) => x.id !== id) })),
      setStatus: (id, status) =>
        set((s) => ({ requests: s.requests.map((x) => (x.id === id ? { ...x, status } : x)) })),
      clearShipped: () => set((s) => ({ requests: s.requests.filter((x) => x.status !== "Shipped") })),
      resetExamples: () => set({ requests: seed }),
    }),
    { name: "bc-owner-requests" },
  ),
);
