import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { signedPct } from "@/lib/format";

export function Card({
  className,
  children,
  pad = true,
  hover = false,
}: {
  className?: string;
  children: ReactNode;
  pad?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "card",
        pad && "card-pad",
        hover && "transition-shadow hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h2 className="font-display text-xl font-semibold tracking-tight text-charcoal-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-charcoal-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Delta({
  value,
  invert = false,
  className,
  suffix = "",
}: {
  value: number;
  invert?: boolean;
  className?: string;
  suffix?: string;
}) {
  const good = invert ? value < 0 : value > 0;
  const flat = value === 0;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        flat ? "text-charcoal-300" : good ? "text-emerald-deep" : "text-rose-deep",
        className,
      )}
    >
      {!flat && <Icon className="h-3.5 w-3.5" />}
      {signedPct(value)}
      {suffix}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  invert,
  icon: Icon,
  sub,
  accent = false,
  index = 0,
}: {
  label: string;
  value: string;
  delta?: number;
  invert?: boolean;
  icon?: LucideIcon;
  sub?: string;
  accent?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "card card-pad relative overflow-hidden",
        accent && "bg-charcoal-deep text-white border-charcoal-800",
      )}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl" />
      )}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "eyebrow",
            accent && "text-gold-200/80",
          )}
        >
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg",
              accent ? "bg-white/10 text-gold-200" : "bg-paper-soft text-charcoal-500",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={cn(
            "num text-3xl font-semibold",
            accent ? "text-white" : "text-charcoal-900",
          )}
        >
          {value}
        </span>
        {typeof delta === "number" && <Delta value={delta} invert={invert} />}
      </div>
      {sub && (
        <p className={cn("mt-1 text-xs", accent ? "text-charcoal-200" : "text-charcoal-400")}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

type Tone = "gold" | "emerald" | "rose" | "amber" | "charcoal" | "sky";
const toneMap: Record<Tone, string> = {
  gold: "bg-gold-50 text-gold-700",
  emerald: "bg-emerald-soft text-emerald-deep",
  rose: "bg-rose-soft text-rose-deep",
  amber: "bg-amber-soft text-amber-deep",
  charcoal: "bg-charcoal-100 text-charcoal-700",
  sky: "bg-sky-soft text-sky",
};

export function Badge({
  children,
  tone = "charcoal",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn("pill", toneMap[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "gold",
  className,
}: {
  value: number;
  tone?: "gold" | "charcoal" | "emerald" | "rose" | "amber";
  className?: string;
}) {
  const bar: Record<string, string> = {
    gold: "bg-gold-sheen",
    charcoal: "bg-charcoal-800",
    emerald: "bg-emerald",
    rose: "bg-rose",
    amber: "bg-amber",
  };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-charcoal-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", bar[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex rounded-xl border border-charcoal-200/70 bg-white p-1 shadow-sm">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-lg font-semibold transition no-tap",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
            value === opt
              ? "bg-charcoal-900 text-white shadow-sm"
              : "text-charcoal-400 hover:text-charcoal-700",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad" | "muted";
}) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div
        className={cn(
          "num mt-1 text-lg font-semibold",
          tone === "good" && "text-emerald-deep",
          tone === "bad" && "text-rose-deep",
          tone === "muted" && "text-charcoal-400",
          !tone && "text-charcoal-900",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div className="eyebrow mb-2 flex items-center gap-2">
          <span className="h-px w-6 bg-gold-500" />
          {eyebrow}
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-[1.95rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-charcoal-400">{description}</p>
      </div>
      {action}
    </motion.div>
  );
}
