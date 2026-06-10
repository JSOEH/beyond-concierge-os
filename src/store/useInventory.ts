import { create } from "zustand";
import { allIvItems, type Recipe, recipeById } from "@/data/iv";
import { vials as seedVials, type Vial } from "@/data/glp1";

export interface DispenseLog {
  id: string;
  time: string;
  label: string;
  detail: string;
  cost: number;
  revenue: number;
}

interface InventoryState {
  ivStock: Record<string, number>; // ingredientId -> units on hand
  vialMg: Record<string, number>; // vialId -> remaining mg
  log: DispenseLog[];
  dispenseRecipe: (recipeId: string) => void;
  dispenseCustom: (name: string, lines: { ingredientId: string; amount: number }[], retail: number) => void;
  dispenseGlp1: (vialId: string, mg: number, patientLabel: string, revenue: number) => boolean;
  restockIv: (ingredientId: string, units: number) => void;
  restockVial: (vialId: string, mg: number) => void;
  reset: () => void;
}

const seedIv = () =>
  Object.fromEntries(allIvItems.map((i) => [i.id, i.stock])) as Record<string, number>;
const seedVialMg = () =>
  Object.fromEntries(seedVials.map((v) => [v.id, v.remainingMg])) as Record<string, number>;

const stamp = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const useInventory = create<InventoryState>((set, get) => ({
  ivStock: seedIv(),
  vialMg: seedVialMg(),
  log: [],
  dispenseRecipe: (recipeId) => {
    const recipe = recipeById(recipeId) as Recipe | undefined;
    if (!recipe) return;
    const { ivStock } = get();
    const next = { ...ivStock };
    let cost = 0;
    for (const line of recipe.lines) {
      next[line.ingredientId] = Math.max(0, (next[line.ingredientId] ?? 0) - line.amount);
      const item = allIvItems.find((i) => i.id === line.ingredientId);
      if (item) cost += item.unitCost * line.amount;
    }
    set({
      ivStock: next,
      log: [
        {
          id: crypto.randomUUID(),
          time: stamp(),
          label: `Dispensed · ${recipe.name}`,
          detail: `${recipe.lines.length} ingredients deducted`,
          cost: +cost.toFixed(2),
          revenue: recipe.retail,
        },
        ...get().log,
      ].slice(0, 24),
    });
  },
  dispenseCustom: (name, lines, retail) => {
    const { ivStock } = get();
    const next = { ...ivStock };
    let cost = 0;
    for (const line of lines) {
      next[line.ingredientId] = Math.max(0, (next[line.ingredientId] ?? 0) - line.amount);
      const item = allIvItems.find((i) => i.id === line.ingredientId);
      if (item) cost += item.unitCost * line.amount;
    }
    set({
      ivStock: next,
      log: [
        {
          id: crypto.randomUUID(),
          time: stamp(),
          label: `Dispensed · ${name}`,
          detail: `${lines.length} ingredients deducted`,
          cost: +cost.toFixed(2),
          revenue: retail,
        },
        ...get().log,
      ].slice(0, 24),
    });
  },
  dispenseGlp1: (vialId, mg, patientLabel, revenue) => {
    const { vialMg } = get();
    const remaining = vialMg[vialId] ?? 0;
    if (remaining < mg) return false;
    set({
      vialMg: { ...vialMg, [vialId]: +(remaining - mg).toFixed(2) },
      log: [
        {
          id: crypto.randomUUID(),
          time: stamp(),
          label: `GLP-1 dose · ${patientLabel}`,
          detail: `${mg}mg drawn from vial`,
          cost: 0,
          revenue,
        },
        ...get().log,
      ].slice(0, 24),
    });
    return true;
  },
  restockIv: (ingredientId, units) =>
    set((s) => ({ ivStock: { ...s.ivStock, [ingredientId]: (s.ivStock[ingredientId] ?? 0) + units } })),
  restockVial: (vialId, mg) =>
    set((s) => ({ vialMg: { ...s.vialMg, [vialId]: (s.vialMg[vialId] ?? 0) + mg } })),
  reset: () => set({ ivStock: seedIv(), vialMg: seedVialMg(), log: [] }),
}));

export const currentVials = (vialMg: Record<string, number>): Vial[] =>
  seedVials.map((v) => ({ ...v, remainingMg: vialMg[v.id] ?? v.remainingMg }));
