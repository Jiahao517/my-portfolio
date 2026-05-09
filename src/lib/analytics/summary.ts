import type {
  AnalyticsClickSummary,
  AnalyticsCountSummary,
  AnalyticsEventRecord,
  AnalyticsPageSummary,
  AnalyticsSectionSummary,
  AnalyticsSummary,
  AnalyticsVisitorSummary,
} from "./types";

const MAX_ITEMS = 50;

interface MutableSession {
  sessionId: string;
  visitorId: string;
  startedAt: string;
  lastSeen: string;
  durationMs: number;
  pageViews: number;
  clicks: number;
  maxScrollDepth: number;
  pageDurations: Map<string, number>;
  sectionDurations: Map<string, number>;
  visitor: AnalyticsEventRecord["visitor"];
  device?: string;
  referrer?: string;
}

export function buildAnalyticsSummary(events: AnalyticsEventRecord[]): AnalyticsSummary {
  const sorted = [...events].sort((a, b) => dateValue(a.timestamp) - dateValue(b.timestamp));
  const sessions = new Map<string, MutableSession>();
  const pageViews = new Map<string, number>();
  const pageDurations = new Map<string, number>();
  const sections = new Map<string, AnalyticsSectionSummary>();
  const clicks = new Map<string, AnalyticsClickSummary>();
  const scrolls = new Map<string, Map<string, number>>();
  const devices = new Map<string, number>();
  const referrers = new Map<string, number>();

  for (const event of sorted) {
    const session = getSession(sessions, event);
    session.lastSeen = maxIso(session.lastSeen, event.timestamp);

    if (event.visitor && Object.keys(event.visitor).length > 0) {
      session.visitor = { ...session.visitor, ...event.visitor };
    }

    if (event.device?.userAgent) {
      session.device = summarizeUserAgent(event.device.userAgent);
    }
    if (event.referrer && !session.referrer) {
      session.referrer = event.referrer;
    }

    if (event.type === "page_view") {
      session.pageViews += 1;
      increment(pageViews, event.path);
      if (session.device) increment(devices, session.device);
      increment(referrers, normalizeReferrer(event.referrer));
    }

    if (event.type === "heartbeat" && event.durationMs) {
      const durationMs = clampDuration(event.durationMs);
      session.durationMs += durationMs;
      addToMap(session.pageDurations, event.path, durationMs);
      addToMap(pageDurations, event.path, durationMs);
    }

    if (event.type === "section_view" && event.sectionId && event.durationMs) {
      const durationMs = clampDuration(event.durationMs);
      const sectionKey = `${event.path}::${event.sectionId}`;
      addToMap(session.sectionDurations, sectionKey, durationMs);
      const current = sections.get(sectionKey) ?? {
        id: event.sectionId,
        label: event.sectionLabel || event.sectionId,
        path: event.path,
        views: 0,
        durationMs: 0,
      };
      current.views += 1;
      current.durationMs += durationMs;
      sections.set(sectionKey, current);
    }

    if (event.type === "click") {
      session.clicks += 1;
      const label = event.targetText || event.targetRole || "未命名点击";
      const clickKey = `${event.path}::${label}::${event.targetHref ?? ""}`;
      const current = clicks.get(clickKey) ?? {
        label,
        role: event.targetRole,
        href: event.targetHref,
        path: event.path,
        count: 0,
      };
      current.count += 1;
      clicks.set(clickKey, current);
    }

    if (event.type === "scroll_depth" && typeof event.depth === "number") {
      const depth = Math.max(0, Math.min(100, Math.round(event.depth)));
      session.maxScrollDepth = Math.max(session.maxScrollDepth, depth);
      const bySession = scrolls.get(event.path) ?? new Map<string, number>();
      bySession.set(event.sessionId, Math.max(bySession.get(event.sessionId) ?? 0, depth));
      scrolls.set(event.path, bySession);
    }
  }

  const recentVisitors = [...sessions.values()]
    .sort((a, b) => dateValue(b.lastSeen) - dateValue(a.lastSeen))
    .slice(0, MAX_ITEMS)
    .map(toVisitorSummary);

  return {
    generatedAt: new Date().toISOString(),
    totalEvents: events.length,
    totalSessions: sessions.size,
    totalVisitors: new Set(events.map((event) => event.visitorId)).size,
    suspectOrgSessions: [...sessions.values()].filter((session) => Boolean(session.visitor.suspectOrg)).length,
    recentVisitors,
    pages: [...new Set([...pageViews.keys(), ...pageDurations.keys()])]
      .map<AnalyticsPageSummary>((path) => ({
        path,
        views: pageViews.get(path) ?? 0,
        durationMs: pageDurations.get(path) ?? 0,
      }))
      .sort((a, b) => b.durationMs - a.durationMs || b.views - a.views)
      .slice(0, MAX_ITEMS),
    sections: [...sections.values()]
      .sort((a, b) => b.durationMs - a.durationMs || b.views - a.views)
      .slice(0, MAX_ITEMS),
    clicks: [...clicks.values()].sort((a, b) => b.count - a.count).slice(0, MAX_ITEMS),
    maxScrollDepthByPath: [...scrolls.entries()]
      .map(([path, bySession]) => ({
        path,
        maxDepth: Math.max(...bySession.values()),
        sessions: bySession.size,
      }))
      .sort((a, b) => b.maxDepth - a.maxDepth || b.sessions - a.sessions)
      .slice(0, MAX_ITEMS),
    devices: toCountSummary(devices),
    referrers: toCountSummary(referrers),
  };
}

function getSession(sessions: Map<string, MutableSession>, event: AnalyticsEventRecord) {
  const current = sessions.get(event.sessionId);
  if (current) return current;

  const next: MutableSession = {
    sessionId: event.sessionId,
    visitorId: event.visitorId,
    startedAt: event.timestamp,
    lastSeen: event.timestamp,
    durationMs: 0,
    pageViews: 0,
    clicks: 0,
    maxScrollDepth: 0,
    pageDurations: new Map(),
    sectionDurations: new Map(),
    visitor: event.visitor ?? {},
  };
  sessions.set(event.sessionId, next);
  return next;
}

function toVisitorSummary(session: MutableSession): AnalyticsVisitorSummary {
  const topPage = topEntry(session.pageDurations)?.[0];
  const topSection = topEntry(session.sectionDurations)?.[0]?.split("::")[1];
  return {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    startedAt: session.startedAt,
    lastSeen: session.lastSeen,
    durationMs: session.durationMs,
    pageViews: session.pageViews,
    clicks: session.clicks,
    maxScrollDepth: session.maxScrollDepth,
    topPage,
    topSection,
    city: session.visitor.city,
    region: session.visitor.region,
    country: session.visitor.country,
    asn: session.visitor.asn,
    org: session.visitor.org,
    suspectOrg: session.visitor.suspectOrg,
    device: session.device,
    referrer: session.referrer,
    interest: inferInterest(session, topPage),
  };
}

function inferInterest(session: MutableSession, topPage?: string) {
  if (session.durationMs < 10_000 && session.pageViews <= 1 && session.maxScrollDepth < 25) return "快速跳出";
  if (session.clicks > 0 && /contact|联系|mailto|tel/i.test([...session.sectionDurations.keys(), topPage ?? ""].join(" "))) {
    return "有联系意向";
  }
  if (topPage && topPage !== "/" && session.durationMs >= 30_000) return "重点查看案例";
  if (session.maxScrollDepth >= 75 || session.durationMs >= 60_000) return "深度浏览";
  return "普通浏览";
}

function summarizeUserAgent(userAgent: string) {
  const os = /iPhone|iPad|iPod/i.test(userAgent)
    ? "iOS"
    : /Android/i.test(userAgent)
      ? "Android"
      : /Mac/i.test(userAgent)
        ? "macOS"
        : /Windows/i.test(userAgent)
          ? "Windows"
          : "Other";
  const browser = /Edg/i.test(userAgent)
    ? "Edge"
    : /Chrome/i.test(userAgent)
      ? "Chrome"
      : /Safari/i.test(userAgent)
        ? "Safari"
        : /Firefox/i.test(userAgent)
          ? "Firefox"
          : "Other";
  return `${browser} / ${os}`;
}

function normalizeReferrer(referrer?: string) {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer.slice(0, 80);
  }
}

function topEntry(map: Map<string, number>) {
  return [...map.entries()].sort((a, b) => b[1] - a[1])[0];
}

function toCountSummary(map: Map<string, number>): AnalyticsCountSummary[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_ITEMS);
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function addToMap(map: Map<string, number>, key: string, value: number) {
  map.set(key, (map.get(key) ?? 0) + value);
}

function clampDuration(durationMs: number) {
  return Math.max(0, Math.min(durationMs, 5 * 60 * 1000));
}

function dateValue(value: string) {
  return new Date(value).getTime();
}

function maxIso(a: string, b: string) {
  return dateValue(a) >= dateValue(b) ? a : b;
}
