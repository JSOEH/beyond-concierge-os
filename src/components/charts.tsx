import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { palette, series, tooltipStyle } from "@/lib/theme";
import { usdCompact, usd, compact } from "@/lib/format";

const axis = {
  stroke: palette.charcoal400,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

export function TrendArea({
  data,
  dataKey,
  color = palette.gold,
  format = "usd",
  height = 240,
}: {
  data: any[];
  dataKey: string;
  color?: string;
  format?: "usd" | "num";
  height?: number;
}) {
  const fmt = format === "usd" ? usdCompact : compact;
  const id = `grad-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => fmt(v)} width={48} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => [format === "usd" ? usd(v) : compact(v), ""]}
          cursor={{ stroke: palette.gold, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.4}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DualArea({
  data,
  height = 280,
}: {
  data: any[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.gold} stopOpacity={0.34} />
            <stop offset="100%" stopColor={palette.gold} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.charcoal} stopOpacity={0.18} />
            <stop offset="100%" stopColor={palette.charcoal} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => usdCompact(v)} width={48} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number, n: string) => [usd(v), n === "revenue" ? "Revenue" : "Profit"]}
          cursor={{ stroke: palette.gold, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area type="monotone" dataKey="revenue" stroke={palette.goldDeep} strokeWidth={2.4} fill="url(#rev)" dot={false} />
        <Area type="monotone" dataKey="profit" stroke={palette.charcoal} strokeWidth={2.2} fill="url(#prof)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MixDonut({
  data,
  height = 260,
  valueFormat = "usd",
}: {
  data: { name: string; value: number }[];
  height?: number;
  valueFormat?: "usd" | "num";
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="86%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={series[i % series.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => [valueFormat === "usd" ? usd(v) : compact(v), ""]}
        />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-xs text-charcoal-600">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HBars({
  data,
  height = 260,
  color = palette.gold,
  format = "usd",
}: {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
  format?: "usd" | "num" | "pct";
}) {
  const fmt = (v: number) =>
    format === "usd" ? usdCompact(v) : format === "pct" ? `${v}%` : compact(v);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={palette.grid} strokeDasharray="3 3" />
        <XAxis type="number" {...axis} tickFormatter={fmt} />
        <YAxis type="category" dataKey="name" {...axis} width={120} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), ""]} cursor={{ fill: "rgba(200,168,98,0.06)" }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? color : palette.charcoal600} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function VBars({
  data,
  dataKey,
  height = 240,
  color = palette.gold,
  format = "usd",
}: {
  data: any[];
  dataKey: string;
  height?: number;
  color?: string;
  format?: "usd" | "num";
}) {
  const fmt = format === "usd" ? usdCompact : compact;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => fmt(v)} width={44} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [format === "usd" ? usd(v) : compact(v), ""]} cursor={{ fill: "rgba(200,168,98,0.06)" }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} fill={color} barSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
