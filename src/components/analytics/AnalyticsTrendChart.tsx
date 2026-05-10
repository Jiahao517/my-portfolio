"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsTimeBucket } from "@/lib/analytics/types";
import { formatBucket } from "@/lib/analytics/format";

interface Props {
  data: AnalyticsTimeBucket[];
  granularity: "hour" | "day";
}

export function AnalyticsTrendChart({ data, granularity }: Props) {
  if (data.length === 0) {
    return <div className="analytics-admin__chart-empty">所选时间范围内没有事件。</div>;
  }
  const chartData = data.map((point) => ({
    label: formatBucket(point.bucket, granularity),
    events: point.events,
    sessions: point.sessions,
    visitors: point.visitors,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,18,18,0.08)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="rgba(24,18,18,0.55)" />
        <YAxis tick={{ fontSize: 11 }} stroke="rgba(24,18,18,0.55)" allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#181212",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
          labelStyle={{ color: "rgba(255,255,255,0.7)" }}
        />
        <Line type="monotone" dataKey="events" stroke="#E0465C" strokeWidth={2} dot={false} name="事件" />
        <Line type="monotone" dataKey="sessions" stroke="#181212" strokeWidth={2} dot={false} name="会话" />
        <Line type="monotone" dataKey="visitors" stroke="#9b8a87" strokeWidth={2} dot={false} name="访客" />
      </LineChart>
    </ResponsiveContainer>
  );
}
