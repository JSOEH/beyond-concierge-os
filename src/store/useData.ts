import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  deriveServices,
  type ServiceOverrides,
  type EditableField,
  type ServiceModel,
} from "@/data/services";
import {
  computeRevenue,
  defaultPnl,
  type PnlInputs,
  type RevenueModel,
} from "@/data/revenue";

interface DataState {
  serviceOverrides: ServiceOverrides;
  pnl: PnlInputs;
  setServiceField: (id: string, field: EditableField, value: number) => void;
  resetService: (id: string) => void;
  setPnlField: (field: keyof PnlInputs, value: number) => void;
  resetPnl: () => void;
  resetAll: () => void;
}

export const useData = create<DataState>()(
  persist(
    (set) => ({
      serviceOverrides: {},
      pnl: { ...defaultPnl },
      setServiceField: (id, field, value) =>
        set((s) => ({
          serviceOverrides: {
            ...s.serviceOverrides,
            [id]: { ...s.serviceOverrides[id], [field]: value },
          },
        })),
      resetService: (id) =>
        set((s) => {
          const next = { ...s.serviceOverrides };
          delete next[id];
          return { serviceOverrides: next };
        }),
      setPnlField: (field, value) =>
        set((s) => ({ pnl: { ...s.pnl, [field]: value } })),
      resetPnl: () => set({ pnl: { ...defaultPnl } }),
      resetAll: () => set({ serviceOverrides: {}, pnl: { ...defaultPnl } }),
    }),
    { name: "bc-owner-data" },
  ),
);

/** Live services derived from the owner's price overrides. */
export function useServices(): ServiceModel {
  const overrides = useData((s) => s.serviceOverrides);
  return useMemo(() => deriveServices(overrides), [overrides]);
}

/** Live revenue model derived from live services + P&L overrides. */
export function useRevenue(): RevenueModel {
  const overrides = useData((s) => s.serviceOverrides);
  const pnl = useData((s) => s.pnl);
  return useMemo(() => {
    const { services } = deriveServices(overrides);
    return computeRevenue(services, pnl);
  }, [overrides, pnl]);
}

export const countServiceOverrides = (o: ServiceOverrides) =>
  Object.values(o).reduce((a, fields) => a + Object.keys(fields).length, 0);
