"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const PRESETS: Array<{ id: string; label: string }> = [
  { id: "today", label: "今日" },
  { id: "7d", label: "7 天" },
  { id: "30d", label: "30 天" },
  { id: "all", label: "全部" },
];

export function RangeTabs({ basePath = "/admin/analytics" }: { basePath?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const fromParam = params.get("from") ?? "";
  const toParam = params.get("to") ?? "";
  const presetParam = params.get("range") ?? (fromParam || toParam ? "custom" : "7d");

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${basePath}?${qs}` : basePath);
    });
  };

  return (
    <div className="analytics-admin__range" data-pending={pending ? "true" : undefined}>
      <div className="analytics-admin__range-presets">
        {PRESETS.map((preset) => {
          const active = presetParam === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className="analytics-admin__range-pill"
              data-active={active ? "true" : undefined}
              onClick={() => updateParams({ range: preset.id, from: undefined, to: undefined })}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className="analytics-admin__range-custom">
        <label>
          自定义 起
          <input
            type="date"
            value={fromParam ? fromParam.slice(0, 10) : ""}
            onChange={(event) => updateParams({ range: undefined, from: event.target.value || undefined })}
          />
        </label>
        <label>
          止
          <input
            type="date"
            value={toParam ? toParam.slice(0, 10) : ""}
            onChange={(event) => updateParams({ range: undefined, to: event.target.value || undefined })}
          />
        </label>
        {(fromParam || toParam) && (
          <button
            type="button"
            className="analytics-admin__range-clear"
            onClick={() => updateParams({ range: "7d", from: undefined, to: undefined })}
          >
            清除
          </button>
        )}
      </div>
    </div>
  );
}
