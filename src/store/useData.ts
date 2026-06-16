import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  deriveServices,
  type ServiceOverrides,
  type EditableField,
  type ServiceModel,
  type ServiceInput,
  type ServiceCategory,
} from "@/data/services";
import {
  computeRevenue,
  defaultPnl,
  type PnlInputs,
  type RevenueModel,
} from "@/data/revenue";

export interface CustomIngredient {
  id: string;
  name: string;
  unit: string;
  unitCost: number;
  supplier: string;
}

interface DataState {
  serviceOverrides: ServiceOverrides;
  customServices: ServiceInput[];
  customIngredients: CustomIngredient[];
  pnl: PnlInputs;
  setServiceField: (id: string, field: EditableField, value: number) => void;
  resetService: (id: string) => void;
  addService: (name: string, category: ServiceCategory, unitLabel?: string) => void;
  removeService: (id: string) => void;
  addIngredient: (name: string, unit: string, unitCost: number, supplier: string) => void;
  removeIngredient: (id: string) => void;
  setPnlField: (field: keyof PnlInputs, value: number) => void;
  resetPnl: () => void;
  resetAll: () => void;
}

export const useData = create<DataState>()(
  persist(
    (set) => ({
      serviceOverrides: {},
      customServices: [],
      customIngredients: [],
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
      addService: (name, category, unitLabel = "per service") =>
        set((s) => ({
          customServices: [
            ...s.customServices,
            { id: `custom-${crypto.randomUUID().slice(0, 8)}`, name, category, unitLabel,
              retail: 0, productCost: 0, nurseCost: 0, laborCost: 0, monthlyVolume: 0 },
          ],
        })),
      removeService: (id) =>
        set((s) => {
          const overrides = { ...s.serviceOverrides };
          delete overrides[id];
          return {
            customServices: s.customServices.filter((c) => c.id !== id),
            serviceOverrides: overrides,
          };
        }),
      addIngredient: (name, unit, unitCost, supplier) =>
        set((s) => ({
          customIngredients: [
            ...s.customIngredients,
            { id: `civ-${crypto.randomUUID().slice(0, 8)}`, name, unit, unitCost, supplier },
          ],
        })),
      removeIngredient: (id) =>
        set((s) => ({ customIngredients: s.customIngredients.filter((c) => c.id !== id) })),
      setPnlField: (field, value) =>
        set((s) => ({ pnl: { ...s.pnl, [field]: value } })),
      resetPnl: () => set({ pnl: { ...defaultPnl } }),
      resetAll: () => set({ serviceOverrides: {}, customServices: [], customIngredients: [], pnl: { ...defaultPnl } }),
    }),
    { name: "bc-owner-data" },
  ),
);

/** Live services derived from base + owner-added services + price overrides. */
export function useServices(): ServiceModel {
  const overrides = useData((s) => s.serviceOverrides);
  const custom = useData((s) => s.customServices);
  return useMemo(() => deriveServices(overrides, custom), [overrides, custom]);
}

/** Live revenue model derived from live services + P&L overrides. */
export function useRevenue(): RevenueModel {
  const overrides = useData((s) => s.serviceOverrides);
  const custom = useData((s) => s.customServices);
  const pnl = useData((s) => s.pnl);
  return useMemo(() => {
    const { services } = deriveServices(overrides, custom);
    return computeRevenue(services, pnl);
  }, [overrides, custom, pnl]);
}

export const countServiceOverrides = (o: ServiceOverrides) =>
  Object.values(o).reduce((a, fields) => a + Object.keys(fields).length, 0);
