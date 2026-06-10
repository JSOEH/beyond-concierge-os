// ── IV Recipe Calculator: ingredient catalog + recipe presets ───────────────

export interface Ingredient {
  id: string;
  name: string;
  unit: string; // dispensing unit
  unitCost: number; // $ per unit
  supplier: string;
  stock: number; // units on hand (initial — live value lives in the store)
  reorderLevel: number;
}

export const SUPPLY_COST = 4.5; // tubing, needle, alcohol, gloves per drip
export const DEFAULT_NURSE_RATE = 65; // $/hr
export const DEFAULT_DRIP_MINUTES = 35;

export const bag: Ingredient = {
  id: "saline-bag",
  name: "Saline Bag (1000mL)",
  unit: "bag",
  unitCost: 3.2,
  supplier: "McKesson",
  stock: 240,
  reorderLevel: 60,
};

export const ingredients: Ingredient[] = [
  { id: "vitamin-c", name: "Vitamin C", unit: "mL", unitCost: 0.18, supplier: "Empower Pharmacy", stock: 1450, reorderLevel: 400 },
  { id: "b-complex", name: "B-Complex", unit: "mL", unitCost: 0.42, supplier: "Olympia Pharmacy", stock: 820, reorderLevel: 300 },
  { id: "b12", name: "B12 (Methylcobalamin)", unit: "mL", unitCost: 0.35, supplier: "Olympia Pharmacy", stock: 96, reorderLevel: 150 },
  { id: "glutathione", name: "Glutathione", unit: "mL", unitCost: 1.1, supplier: "Empower Pharmacy", stock: 410, reorderLevel: 180 },
  { id: "nad", name: "NAD+", unit: "100mg", unitCost: 4.2, supplier: "AmeriPharma", stock: 138, reorderLevel: 60 },
  { id: "magnesium", name: "Magnesium Chloride", unit: "mL", unitCost: 0.22, supplier: "McKesson", stock: 690, reorderLevel: 250 },
  { id: "zinc", name: "Zinc", unit: "mL", unitCost: 0.55, supplier: "AmeriPharma", stock: 72, reorderLevel: 120 },
  { id: "taurine", name: "Taurine", unit: "mL", unitCost: 0.3, supplier: "Olympia Pharmacy", stock: 540, reorderLevel: 200 },
  { id: "amino-blend", name: "Amino Blend", unit: "mL", unitCost: 0.48, supplier: "Empower Pharmacy", stock: 760, reorderLevel: 250 },
  { id: "calcium", name: "Calcium Gluconate", unit: "mL", unitCost: 0.26, supplier: "McKesson", stock: 480, reorderLevel: 180 },
];

export const allIvItems: Ingredient[] = [bag, ...ingredients];
export const ivItemById = (id: string) => allIvItems.find((i) => i.id === id);

export interface RecipeLine {
  ingredientId: string;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  retail: number;
  lines: RecipeLine[];
}

export const recipes: Recipe[] = [
  {
    id: "myers",
    name: "Myers' Cocktail",
    retail: 185,
    lines: [
      { ingredientId: "saline-bag", amount: 1 },
      { ingredientId: "vitamin-c", amount: 5 },
      { ingredientId: "b-complex", amount: 2 },
      { ingredientId: "b12", amount: 1 },
      { ingredientId: "magnesium", amount: 2 },
      { ingredientId: "calcium", amount: 1 },
    ],
  },
  {
    id: "immunity",
    name: "Immunity Boost",
    retail: 175,
    lines: [
      { ingredientId: "saline-bag", amount: 1 },
      { ingredientId: "vitamin-c", amount: 10 },
      { ingredientId: "zinc", amount: 1 },
      { ingredientId: "b-complex", amount: 2 },
      { ingredientId: "glutathione", amount: 1 },
    ],
  },
  {
    id: "recovery",
    name: "Recovery & Hydration",
    retail: 165,
    lines: [
      { ingredientId: "saline-bag", amount: 1 },
      { ingredientId: "amino-blend", amount: 5 },
      { ingredientId: "b-complex", amount: 2 },
      { ingredientId: "magnesium", amount: 2 },
      { ingredientId: "taurine", amount: 2 },
    ],
  },
  {
    id: "beauty",
    name: "Beauty Glow",
    retail: 210,
    lines: [
      { ingredientId: "saline-bag", amount: 1 },
      { ingredientId: "glutathione", amount: 3 },
      { ingredientId: "vitamin-c", amount: 5 },
      { ingredientId: "b-complex", amount: 1 },
    ],
  },
  {
    id: "nad-250",
    name: "NAD+ 250mg",
    retail: 375,
    lines: [
      { ingredientId: "saline-bag", amount: 1 },
      { ingredientId: "nad", amount: 2.5 },
      { ingredientId: "b-complex", amount: 1 },
    ],
  },
];

export const recipeById = (id: string) => recipes.find((r) => r.id === id);
