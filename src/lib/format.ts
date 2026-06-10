export const usd = (n: number, opts: { cents?: boolean } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  }).format(n);

export const usdCompact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(abs >= 100_000 ? 0 : 1)}K`;
  return usd(n);
};

export const num = (n: number, frac = 0) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  }).format(n);

export const pct = (n: number, frac = 1) =>
  `${n >= 0 ? "" : ""}${n.toFixed(frac)}%`;

export const signedPct = (n: number, frac = 1) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(frac)}%`;

export const compact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return num(n);
};

export const money = (n: number) => usd(n, { cents: true });

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
