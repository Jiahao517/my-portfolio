import type {
  AnalyticsChatRecord,
  AnalyticsClickSummary,
  AnalyticsCountSummary,
  AnalyticsEventRecord,
  AnalyticsHeatmapCell,
  AnalyticsPageSummary,
  AnalyticsRangeInfo,
  AnalyticsSectionSummary,
  AnalyticsSummary,
  AnalyticsTimeBucket,
  AnalyticsVisitorDetail,
  AnalyticsVisitorIp,
  AnalyticsVisitorPage,
  AnalyticsVisitorSession,
  AnalyticsVisitorSummary,
  AnalyticsVisitorTimelineItem,
} from "./types";

const MAX_ITEMS = 50;
const MAX_RECENT_CHATS = 100;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface MutableSession {
  sessionId: string;
  visitorId: string;
  startedAt: string;
  lastSeen: string;
  durationMs: number;
  pageViews: number;
  clicks: number;
  contactClicks: number;
  maxScrollDepth: number;
  pageDurations: Map<string, number>;
  pageViewCounts: Map<string, number>;
  sectionDurations: Map<string, number>;
  visitor: AnalyticsEventRecord["visitor"];
  device?: string;
  referrer?: string;
}

export interface SummaryOptions {
  range?: { from?: string; to?: string };
  chats?: AnalyticsChatRecord[];
}

export function buildAnalyticsSummary(
  events: AnalyticsEventRecord[],
  options: SummaryOptions = {},
): AnalyticsSummary {
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
      addToMap(session.pageViewCounts, event.path, 1);
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
      if (/contact|联系|mailto:|tel:|wechat|微信|邮箱|手机号/i.test(`${label} ${event.targetHref ?? ""}`)) {
        session.contactClicks += 1;
      }
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

  const range = computeRangeInfo(sorted, options.range);
  const timeSeries = buildTimeSeries(sorted, range.granularity);
  const hourlyHeatmap = buildHourlyHeatmap(sorted);

  const recentChats = (options.chats ?? [])
    .slice()
    .sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp))
    .slice(0, MAX_RECENT_CHATS);

  return {
    generatedAt: new Date().toISOString(),
    range,
    totalEvents: events.length,
    totalSessions: sessions.size,
    totalVisitors: new Set(events.map((event) => event.visitorId)).size,
    suspectOrgSessions: [...sessions.values()].filter((session) => Boolean(session.visitor.suspectOrg)).length,
    totalChats: options.chats?.length ?? 0,
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
    timeSeries,
    hourlyHeatmap,
    recentChats,
  };
}

export function buildVisitorDetail(
  events: AnalyticsEventRecord[],
  visitorId: string,
  chats: AnalyticsChatRecord[] = [],
): AnalyticsVisitorDetail {
  const sorted = [...events]
    .filter((event) => event.visitorId === visitorId)
    .sort((a, b) => dateValue(a.timestamp) - dateValue(b.timestamp));

  if (sorted.length === 0) {
    return {
      visitorId,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      totalSessions: 0,
      totalDurationMs: 0,
      totalPageViews: 0,
      totalClicks: 0,
      ips: [],
      devices: [],
      sessions: [],
      chats: chats.slice().sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp)),
    };
  }

  const sessions = new Map<string, MutableSession>();
  const sessionTimelines = new Map<string, AnalyticsVisitorTimelineItem[]>();
  const ipMap = new Map<string, AnalyticsVisitorIp & { sessionsSet: Set<string> }>();
  const deviceCounts = new Map<string, number>();

  for (const event of sorted) {
    const session = getSession(sessions, event);
    session.lastSeen = maxIso(session.lastSeen, event.timestamp);
    if (event.visitor && Object.keys(event.visitor).length > 0) {
      session.visitor = { ...session.visitor, ...event.visitor };
    }
    if (event.device?.userAgent) {
      session.device = summarizeUserAgent(event.device.userAgent);
      increment(deviceCounts, session.device);
    }
    if (event.referrer && !session.referrer) session.referrer = event.referrer;

    const timeline = sessionTimelines.get(event.sessionId) ?? [];
    if (event.type === "page_view") {
      session.pageViews += 1;
      addToMap(session.pageViewCounts, event.path, 1);
      timeline.push({ at: event.timestamp, type: "page_view", path: event.path, label: event.title });
    } else if (event.type === "heartbeat" && event.durationMs) {
      const durationMs = clampDuration(event.durationMs);
      session.durationMs += durationMs;
      addToMap(session.pageDurations, event.path, durationMs);
    } else if (event.type === "section_view" && event.sectionId && event.durationMs) {
      const durationMs = clampDuration(event.durationMs);
      addToMap(session.sectionDurations, `${event.path}::${event.sectionId}`, durationMs);
      timeline.push({
        at: event.timestamp,
        type: "section_view",
        path: event.path,
        durationMs,
        label: event.sectionLabel || event.sectionId,
      });
    } else if (event.type === "click") {
      session.clicks += 1;
      timeline.push({
        at: event.timestamp,
        type: "click",
        path: event.path,
        label: event.targetText || event.targetRole || "未命名点击",
        href: event.targetHref,
      });
    } else if (event.type === "scroll_depth" && typeof event.depth === "number") {
      const depth = Math.max(0, Math.min(100, Math.round(event.depth)));
      session.maxScrollDepth = Math.max(session.maxScrollDepth, depth);
      timeline.push({ at: event.timestamp, type: "scroll_depth", path: event.path, depth });
    }
    sessionTimelines.set(event.sessionId, timeline);

    const ipKey = event.visitor.ip || event.visitor.ipHash || "unknown";
    const existing = ipMap.get(ipKey);
    if (existing) {
      existing.lastSeen = maxIso(existing.lastSeen, event.timestamp);
      existing.firstSeen = minIso(existing.firstSeen, event.timestamp);
      existing.events += 1;
      existing.sessionsSet.add(event.sessionId);
      if (event.visitor.city) existing.city = event.visitor.city;
      if (event.visitor.country) existing.country = event.visitor.country;
      if (event.visitor.region) existing.region = event.visitor.region;
      if (event.visitor.org) existing.org = event.visitor.org;
      if (event.visitor.asn) existing.asn = event.visitor.asn;
      if (event.visitor.suspectOrg) existing.suspectOrg = event.visitor.suspectOrg;
    } else {
      ipMap.set(ipKey, {
        ip: event.visitor.ip,
        ipHash: event.visitor.ipHash,
        city: event.visitor.city,
        region: event.visitor.region,
        country: event.visitor.country,
        org: event.visitor.org,
        asn: event.visitor.asn,
        suspectOrg: event.visitor.suspectOrg,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        events: 1,
        sessions: 0,
        sessionsSet: new Set([event.sessionId]),
      });
    }
  }

  const sessionDetails: AnalyticsVisitorSession[] = [...sessions.values()]
    .sort((a, b) => dateValue(b.lastSeen) - dateValue(a.lastSeen))
    .map((session) => ({
      sessionId: session.sessionId,
      startedAt: session.startedAt,
      lastSeen: session.lastSeen,
      durationMs: session.durationMs,
      pageViews: session.pageViews,
      clicks: session.clicks,
      maxScrollDepth: session.maxScrollDepth,
      device: session.device,
      referrer: session.referrer,
      ip: session.visitor.ip,
      ipHash: session.visitor.ipHash,
      city: session.visitor.city,
      country: session.visitor.country,
      org: session.visitor.org,
      pages: pagesFromSession(session),
      timeline: (sessionTimelines.get(session.sessionId) ?? []).slice(-200),
    }));

  const ips: AnalyticsVisitorIp[] = [...ipMap.values()]
    .map(({ sessionsSet, ...rest }) => ({ ...rest, sessions: sessionsSet.size }))
    .sort((a, b) => dateValue(b.lastSeen) - dateValue(a.lastSeen));

  return {
    visitorId,
    firstSeen: sorted[0].timestamp,
    lastSeen: sorted[sorted.length - 1].timestamp,
    totalSessions: sessions.size,
    totalDurationMs: sessionDetails.reduce((acc, s) => acc + s.durationMs, 0),
    totalPageViews: sessionDetails.reduce((acc, s) => acc + s.pageViews, 0),
    totalClicks: sessionDetails.reduce((acc, s) => acc + s.clicks, 0),
    ips,
    devices: toCountSummary(deviceCounts),
    sessions: sessionDetails,
    chats: chats.slice().sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp)),
  };
}

function buildTimeSeries(events: AnalyticsEventRecord[], granularity: "hour" | "day"): AnalyticsTimeBucket[] {
  if (events.length === 0) return [];
  const bucketMap = new Map<
    string,
    { events: number; sessions: Set<string>; visitors: Set<string>; totalDurationMs: number }
  >();

  for (const event of events) {
    const bucketKey = bucketIso(event.timestamp, granularity);
    const cell = bucketMap.get(bucketKey) ?? {
      events: 0,
      sessions: new Set<string>(),
      visitors: new Set<string>(),
      totalDurationMs: 0,
    };
    cell.events += 1;
    cell.sessions.add(event.sessionId);
    cell.visitors.add(event.visitorId);
    if (event.type === "heartbeat" && event.durationMs) {
      cell.totalDurationMs += clampDuration(event.durationMs);
    }
    bucketMap.set(bucketKey, cell);
  }

  return [...bucketMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([bucket, cell]) => ({
      bucket,
      events: cell.events,
      sessions: cell.sessions.size,
      visitors: cell.visitors.size,
      totalDurationMs: cell.totalDurationMs,
    }));
}

const TZ_OFFSET_MS = 8 * 60 * 60 * 1000; // Asia/Shanghai UTC+8, no DST

function buildHourlyHeatmap(events: AnalyticsEventRecord[]): AnalyticsHeatmapCell[] {
  const cells: number[][] = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const event of events) {
    if (event.type !== "page_view" && event.type !== "heartbeat") continue;
    const date = new Date(event.timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const local = new Date(date.getTime() + TZ_OFFSET_MS);
    cells[local.getUTCDay()][local.getUTCHours()] += 1;
  }
  const out: AnalyticsHeatmapCell[] = [];
  for (let weekday = 0; weekday < 7; weekday += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      out.push({ weekday, hour, count: cells[weekday][hour] });
    }
  }
  return out;
}

function computeRangeInfo(
  events: AnalyticsEventRecord[],
  range?: { from?: string; to?: string },
): AnalyticsRangeInfo {
  const from = range?.from;
  const to = range?.to;
  let granularity: "hour" | "day" = "day";
  let spanMs: number | undefined;
  if (from && to) spanMs = new Date(to).getTime() - new Date(from).getTime();
  else if (events.length > 0) {
    spanMs = dateValue(events[events.length - 1].timestamp) - dateValue(events[0].timestamp);
  }
  if (typeof spanMs === "number" && spanMs <= 2 * DAY_MS) granularity = "hour";
  return { from, to, granularity };
}

function bucketIso(timestamp: string, granularity: "hour" | "day"): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  const local = new Date(date.getTime() + TZ_OFFSET_MS);
  if (granularity === "day") {
    return local.toISOString().slice(0, 10);
  }
  return local.toISOString().slice(0, 13) + ":00";
}

function pagesFromSession(session: MutableSession): AnalyticsVisitorPage[] {
  const allPaths = new Set<string>([
    ...session.pageViewCounts.keys(),
    ...session.pageDurations.keys(),
  ]);
  return [...allPaths]
    .map<AnalyticsVisitorPage>((path) => ({
      path,
      views: session.pageViewCounts.get(path) ?? 0,
      durationMs: session.pageDurations.get(path) ?? 0,
    }))
    .sort((a, b) => b.durationMs - a.durationMs || b.views - a.views);
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
    contactClicks: 0,
    maxScrollDepth: 0,
    pageDurations: new Map(),
    pageViewCounts: new Map(),
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
    ip: session.visitor.ip,
    ipHash: session.visitor.ipHash,
    city: session.visitor.city,
    region: session.visitor.region,
    country: session.visitor.country,
    asn: session.visitor.asn,
    org: session.visitor.org,
    suspectOrg: session.visitor.suspectOrg,
    device: session.device,
    referrer: session.referrer,
    interest: inferInterest(session, topPage, topSection),
    pagesVisited: pagesFromSession(session).slice(0, 12),
  };
}

function inferInterest(session: MutableSession, topPage?: string, topSection?: string) {
  const sectionSignal = [...session.sectionDurations.keys(), topSection ?? ""].join(" ");
  if (session.durationMs < 10_000 && session.pageViews <= 1 && session.maxScrollDepth < 25) return "快速跳出";
  if (session.contactClicks > 0 || (session.clicks > 0 && /contact|联系|mailto|tel/i.test(`${sectionSignal} ${topPage ?? ""}`))) {
    return "有联系意向";
  }
  if (/case|work|project|作品|案例|experience|经历/i.test(sectionSignal) && session.durationMs >= 30_000) {
    return "重点查看案例";
  }
  if (topPage && topPage !== "/" && session.durationMs >= 30_000) return "重点查看案例";
  if (session.maxScrollDepth >= 75 || session.durationMs >= 60_000) return "深度浏览";
  return "普通浏览";
}

export function summarizeUserAgent(userAgent: string) {
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

function minIso(a: string, b: string) {
  return dateValue(a) <= dateValue(b) ? a : b;
}
