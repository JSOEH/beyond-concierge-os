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

const seed: ChangeRequest[] = [];

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
