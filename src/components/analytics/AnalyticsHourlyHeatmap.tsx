"use client";

import type { AnalyticsHeatmapCell } from "@/lib/analytics/types";

const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface Props {
  data: AnalyticsHeatmapCell[];
}

export function AnalyticsHourlyHeatmap({ data }: Props) {
  const max = data.reduce((acc, cell) => Math.max(acc, cell.count), 0);
  if (max === 0) {
    return <div className="analytics-admin__chart-empty">尚无足够事件可绘制热力图。</div>;
  }
  const grid: AnalyticsHeatmapCell[][] = Array.from({ length: 7 }, () => Array<AnalyticsHeatmapCell>());
  for (const cell of data) grid[cell.weekday][cell.hour] = cell;

  return (
    <div className="analytics-admin__heatmap" role="table" aria-label="访问时段热力图">
      <div className="analytics-admin__heatmap-row analytics-admin__heatmap-row--head">
        <span className="analytics-admin__heatmap-label" aria-hidden />
        {Array.from({ length: 24 }, (_, hour) => (
          <span key={hour} className="analytics-admin__heatmap-hour">
            {hour % 3 === 0 ? hour : ""}
          </span>
        ))}
      </div>
      {grid.map((row, weekday) => (
        <div key={weekday} className="analytics-admin__heatmap-row" role="row">
          <span className="analytics-admin__heatmap-label" role="rowheader">
            {WEEKDAY_LABELS[weekday]}
          </span>
          {row.map((cell, hour) => {
            const intensity = cell ? cell.count / max : 0;
            const alpha = intensity === 0 ? 0.06 : 0.16 + intensity * 0.84;
            return (
              <span
                key={hour}
                role="cell"
                className="analytics-admin__heatmap-cell"
                title={`${WEEKDAY_LABELS[weekday]} ${hour}:00 · ${cell?.count ?? 0} 次`}
                style={{ background: `rgba(224, 70, 92, ${alpha.toFixed(2)})` }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
