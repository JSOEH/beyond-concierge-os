// ── GLP-1 Weight Loss Margin Center ─────────────────────────────────────────

export interface Glp1Product {
  id: string;
  name: string;
  programPrice: number; // monthly revenue per patient
  maintenanceMgPerMonth: number;
  nurseCostMonthly: number;
}

export const glp1Products: Glp1Product[] = [
  {
    id: "semaglutide",
    name: "Semaglutide",
    programPrice: 399,
    maintenanceMgPerMonth: 6,
    nurseCostMonthly: 28,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    programPrice: 549,
    maintenanceMgPerMonth: 12,
    nurseCostMonthly: 28,
  },
];

export interface Vial {
  id: string;
  productId: string;
  lot: string;
  purchaseCost: number;
  mgPurchased: number;
  remainingMg: number;
  supplier: string;
  expires: string;
}

export const vials: Vial[] = [
  { id: "sem-2401", productId: "semaglutide", lot: "SEM-2401", purchaseCost: 480, mgPurchased: 30, remainingMg: 12.5, supplier: "Empower Pharmacy", expires: "2026-09-14" },
  { id: "sem-2402", productId: "semaglutide", lot: "SEM-2402", purchaseCost: 480, mgPurchased: 30, remainingMg: 27.0, supplier: "Empower Pharmacy", expires: "2026-11-02" },
  { id: "sem-2403", productId: "semaglutide", lot: "SEM-2403", purchaseCost: 480, mgPurchased: 30, remainingMg: 30.0, supplier: "Empower Pharmacy", expires: "2027-01-20" },
  { id: "tir-2403", productId: "tirzepatide", lot: "TIR-2403", purchaseCost: 700, mgPurchased: 50, remainingMg: 19.0, supplier: "AmeriPharma", expires: "2026-08-28" },
  { id: "tir-2404", productId: "tirzepatide", lot: "TIR-2404", purchaseCost: 700, mgPurchased: 50, remainingMg: 46.0, supplier: "AmeriPharma", expires: "2026-12-09" },
];

// cost per mg = weighted average across that product's vials
export const costPerMg = (productId: string) => {
  const v = vials.filter((x) => x.productId === productId);
  const cost = v.reduce((a, x) => a + x.purchaseCost, 0);
  const mg = v.reduce((a, x) => a + x.mgPurchased, 0);
  return mg ? +(cost / mg).toFixed(2) : 0;
};

export const remainingMgForProduct = (productId: string) =>
  vials.filter((v) => v.productId === productId).reduce((a, v) => a + v.remainingMg, 0);

export interface Glp1Patient {
  id: string;
  name: string;
  productId: string;
  weeklyDoseMg: number;
  monthsActive: number;
}

export const patients: Glp1Patient[] = [
  { id: "p1", name: "Patient 1", productId: "semaglutide", weeklyDoseMg: 1.0, monthsActive: 5 },
  { id: "p2", name: "Patient 2", productId: "semaglutide", weeklyDoseMg: 1.7, monthsActive: 3 },
  { id: "p3", name: "Patient 3", productId: "semaglutide", weeklyDoseMg: 2.0, monthsActive: 7 },
  { id: "p4", name: "Patient 4", productId: "semaglutide", weeklyDoseMg: 0.5, monthsActive: 1 },
  { id: "p5", name: "Patient 5", productId: "tirzepatide", weeklyDoseMg: 5.0, monthsActive: 4 },
  { id: "p6", name: "Patient 6", productId: "tirzepatide", weeklyDoseMg: 7.5, monthsActive: 6 },
  { id: "p7", name: "Patient 7", productId: "tirzepatide", weeklyDoseMg: 2.5, monthsActive: 2 },
  { id: "p8", name: "Patient 8", productId: "tirzepatide", weeklyDoseMg: 10.0, monthsActive: 8 },
];

export interface PatientEconomics extends Glp1Patient {
  product: Glp1Product;
  mgUsedThisMonth: number;
  revenue: number;
  productCost: number;
  nurseCost: number;
  ccCost: number;
  profit: number;
  margin: number;
}

export const patientEconomics = (p: Glp1Patient): PatientEconomics => {
  const product = glp1Products.find((x) => x.id === p.productId)!;
  const mgUsedThisMonth = +(p.weeklyDoseMg * 4.33).toFixed(2);
  const revenue = product.programPrice;
  const productCost = +(mgUsedThisMonth * costPerMg(p.productId)).toFixed(2);
  const nurseCost = product.nurseCostMonthly;
  const ccCost = +(revenue * 0.029 + 0.3).toFixed(2);
  const profit = +(revenue - productCost - nurseCost - ccCost).toFixed(2);
  const margin = +((profit / revenue) * 100).toFixed(1);
  return { ...p, product, mgUsedThisMonth, revenue, productCost, nurseCost, ccCost, profit, margin };
};

export const allPatientEconomics = () => patients.map(patientEconomics);

// Profit per vial = mg in vial × (effective revenue per mg) − vial cost
export const profitPerVial = (v: Vial) => {
  const product = glp1Products.find((x) => x.id === v.productId)!;
  const revPerMg = product.programPrice / product.maintenanceMgPerMonth;
  const grossRevenue = v.mgPurchased * revPerMg;
  return Math.round(grossRevenue - v.purchaseCost);
};
