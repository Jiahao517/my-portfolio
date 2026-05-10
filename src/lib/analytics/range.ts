export type RangePreset = "today" | "7d" | "30d" | "all" | "custom";

export interface RangeInput {
  range?: string | null;
  from?: string | null;
  to?: string | null;
}

export interface ResolvedRange {
  preset: RangePreset;
  from?: string;
  to?: string;
}

export function resolveRange(input: RangeInput): ResolvedRange {
  const fromRaw = input.from?.trim();
  const toRaw = input.to?.trim();
  const presetParam = input.range?.trim();

  if (fromRaw || toRaw) {
    return {
      preset: "custom",
      from: parseInputDate(fromRaw, "start"),
      to: parseInputDate(toRaw, "end"),
    };
  }

  const now = new Date();
  switch (presetParam) {
    case "today": {
      const start = startOfLocalDay(now);
      return { preset: "today", from: start.toISOString(), to: now.toISOString() };
    }
    case "30d": {
      return {
        preset: "30d",
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: now.toISOString(),
      };
    }
    case "all":
      return { preset: "all" };
    case "7d":
    default:
      return {
        preset: "7d",
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        to: now.toISOString(),
      };
  }
}

function startOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function parseInputDate(value: string | undefined, edge: "start" | "end"): string | undefined {
  if (!value) return undefined;
  // accept YYYY-MM-DD or full ISO
  const isYmd = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (isYmd) {
    if (edge === "start") date.setHours(0, 0, 0, 0);
    else date.setHours(23, 59, 59, 999);
  }
  return date.toISOString();
}
