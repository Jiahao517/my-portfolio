"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsPageSummary } from "@/lib/analytics/types";
import { formatDuration } from "@/lib/analytics/format";

interface Props {
  data: AnalyticsPageSummary[];
}

export function AnalyticsPagesBar({ data }: Props) {
  if (data.length === 0) {
    return <div className="analytics-admin__chart-empty">没有足够的页面数据。</div>;
  }
  const top = data.slice(0, 8).map((page) => ({
    path: page.path === "/" ? "首页" : page.path,
    views: page.views,
    duration: Math.round(page.durationMs / 1000),
    raw: page.durationMs,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={top} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,18,18,0.08)" />
        <XAxis dataKey="path" tick={{ fontSize: 11 }} stroke="rgba(24,18,18,0.55)" interval={0} />
        <YAxis tick={{ fontSize: 11 }} stroke="rgba(24,18,18,0.55)" allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#181212",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
          formatter={(value, name) => {
            const num = typeof value === "number" ? value : Number(value ?? 0);
            if (name === "duration") return [formatDuration(num * 1000), "总停留"];
            return [`${num}`, "访问次数"];
          }}
        />
        <Bar dataKey="views" fill="#181212" radius={[4, 4, 0, 0]} name="views" />
        <Bar dataKey="duration" fill="#E0465C" radius={[4, 4, 0, 0]} name="duration" />
      </BarChart>
    </ResponsiveContainer>
  );
}
