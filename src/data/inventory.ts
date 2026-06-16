// ── Inventory Command Center ────────────────────────────────────────────────

export type InvCategory =
  | "Injectables"
  | "IV & Nutrients"
  | "Weight Loss"
  | "Supplies"
  | "Retail";

export interface InventoryItem {
  id: string;
  name: string;
  category: InvCategory;
  unit: string;
  stock: number;
  unitCost: number;
  reorderLevel: number;
  supplier: string;
  monthlyUsage: number; // units consumed per month
  marginPct: number; // typical gross margin when sold/used
  expires?: string;
}

// Cleared — awaiting the owner's real inventory (see the intake form).
export const inventory: InventoryItem[] = [];

export const itemValue = (i: InventoryItem) => +(i.stock * i.unitCost).toFixed(2);
export const turnover = (i: InventoryItem) =>
  i.stock > 0 ? +(i.monthlyUsage / i.stock).toFixed(2) : i.monthlyUsage;

export const totalInventoryValue = inventory.reduce((a, i) => a + itemValue(i), 0);

export const lowStock = inventory.filter((i) => i.stock <= i.reorderLevel);

export const expiringSoon = inventory
  .filter((i) => i.expires)
  .map((i) => ({ ...i, daysToExpiry: daysUntil(i.expires!) }))
  .filter((i) => i.daysToExpiry <= 150)
  .sort((a, b) => a.daysToExpiry - b.daysToExpiry);

export const fastestMoving = [...inventory].sort((a, b) => turnover(b) - turnover(a)).slice(0, 5);
export const slowestMoving = [...inventory].sort((a, b) => turnover(a) - turnover(b)).slice(0, 5);
export const mostExpensive = [...inventory].sort((a, b) => b.unitCost - a.unitCost).slice(0, 5);
export const mostProfitable = [...inventory]
  .filter((i) => i.marginPct > 0)
  .sort((a, b) => b.marginPct * b.monthlyUsage * b.unitCost - a.marginPct * a.monthlyUsage * a.unitCost)
  .slice(0, 5);

function daysUntil(dateStr: string) {
  const today = new Date("2026-06-10");
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
export { daysUntil };
