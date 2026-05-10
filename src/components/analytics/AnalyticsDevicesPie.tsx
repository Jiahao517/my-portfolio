"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalyticsCountSummary } from "@/lib/analytics/types";

const COLORS = ["#E0465C", "#181212", "#9b8a87", "#c98792", "#5d5050", "#d6c5c1", "#b43145"];

interface Props {
  data: AnalyticsCountSummary[];
}

export function AnalyticsDevicesPie({ data }: Props) {
  if (data.length === 0) {
    return <div className="analytics-admin__chart-empty">尚无设备数据。</div>;
  }
  const top = data.slice(0, 6);
  const others = data.slice(6).reduce((acc, item) => acc + item.count, 0);
  const chartData = [
    ...top.map((item) => ({ name: item.label, value: item.count })),
    ...(others > 0 ? [{ name: "其他", value: others }] : []),
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={1}
          stroke="#fff"
          strokeWidth={2}
          label={({ name, value }) => `${name} ${value}`}
        >
          {chartData.map((entry, idx) => (
            <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#181212",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
