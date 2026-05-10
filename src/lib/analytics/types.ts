export type AnalyticsEventType =
  | "page_view"
  | "heartbeat"
  | "scroll_depth"
  | "section_view"
  | "click";

export interface AnalyticsScreenInfo {
  width?: number;
  height?: number;
  dpr?: number;
}

export interface AnalyticsViewportInfo {
  width?: number;
  height?: number;
}

export interface AnalyticsDeviceInfo {
  userAgent?: string;
  language?: string;
  timezone?: string;
}

export interface AnalyticsVisitorInfo {
  ip?: string;
  ipHash?: string;
  city?: string;
  region?: string;
  country?: string;
  asn?: string;
  org?: string;
  suspectOrg?: string;
}

export interface AnalyticsEventInput {
  type: AnalyticsEventType;
  sessionId: string;
  visitorId: string;
  timestamp?: string;
  path?: string;
  title?: string;
  referrer?: string;
  screen?: AnalyticsScreenInfo;
  viewport?: AnalyticsViewportInfo;
  device?: AnalyticsDeviceInfo;
  durationMs?: number;
  depth?: number;
  sectionId?: string;
  sectionLabel?: string;
  targetText?: string;
  targetRole?: string;
  targetHref?: string;
}

export interface AnalyticsEventRecord extends AnalyticsEventInput {
  id: string;
  timestamp: string;
  receivedAt: string;
  path: string;
  visitor: AnalyticsVisitorInfo;
}

export interface AnalyticsTimeBucket {
  bucket: string;
  events: number;
  sessions: number;
  visitors: number;
  totalDurationMs: number;
}

export interface AnalyticsHeatmapCell {
  weekday: number;
  hour: number;
  count: number;
}

export interface AnalyticsRangeInfo {
  from?: string;
  to?: string;
  granularity: "hour" | "day";
}

export interface AnalyticsChatRecord {
  id: string;
  sessionId: string;
  visitorId: string;
  timestamp: string;
  visitor: AnalyticsVisitorInfo;
  userMessage: string;
  assistantMessage: string;
  promptTokens?: number;
  completionTokens?: number;
  durationMs: number;
  model: string;
  error?: string;
}

export interface AnalyticsSummary {
  generatedAt: string;
  range: AnalyticsRangeInfo;
  totalEvents: number;
  totalSessions: number;
  totalVisitors: number;
  suspectOrgSessions: number;
  totalChats: number;
  recentVisitors: AnalyticsVisitorSummary[];
  pages: AnalyticsPageSummary[];
  sections: AnalyticsSectionSummary[];
  clicks: AnalyticsClickSummary[];
  maxScrollDepthByPath: AnalyticsScrollSummary[];
  devices: AnalyticsCountSummary[];
  referrers: AnalyticsCountSummary[];
  timeSeries: AnalyticsTimeBucket[];
  hourlyHeatmap: AnalyticsHeatmapCell[];
  recentChats: AnalyticsChatRecord[];
}

export interface AnalyticsVisitorSummary {
  sessionId: string;
  visitorId: string;
  lastSeen: string;
  startedAt: string;
  durationMs: number;
  pageViews: number;
  clicks: number;
  maxScrollDepth: number;
  topPage?: string;
  topSection?: string;
  ip?: string;
  ipHash?: string;
  city?: string;
  region?: string;
  country?: string;
  asn?: string;
  org?: string;
  suspectOrg?: string;
  device?: string;
  referrer?: string;
  interest: string;
  pagesVisited: AnalyticsVisitorPage[];
}

export interface AnalyticsVisitorPage {
  path: string;
  views: number;
  durationMs: number;
}

export interface AnalyticsVisitorIp {
  ip?: string;
  ipHash?: string;
  city?: string;
  region?: string;
  country?: string;
  asn?: string;
  org?: string;
  suspectOrg?: string;
  firstSeen: string;
  lastSeen: string;
  sessions: number;
  events: number;
}

export interface AnalyticsVisitorTimelineItem {
  at: string;
  type: AnalyticsEventType;
  path: string;
  durationMs?: number;
  label?: string;
  depth?: number;
  href?: string;
}

export interface AnalyticsVisitorSession {
  sessionId: string;
  startedAt: string;
  lastSeen: string;
  durationMs: number;
  pageViews: number;
  clicks: number;
  maxScrollDepth: number;
  device?: string;
  referrer?: string;
  ip?: string;
  ipHash?: string;
  city?: string;
  country?: string;
  org?: string;
  pages: AnalyticsVisitorPage[];
  timeline: AnalyticsVisitorTimelineItem[];
}

export interface AnalyticsVisitorDetail {
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  totalSessions: number;
  totalDurationMs: number;
  totalPageViews: number;
  totalClicks: number;
  ips: AnalyticsVisitorIp[];
  devices: AnalyticsCountSummary[];
  sessions: AnalyticsVisitorSession[];
  chats: AnalyticsChatRecord[];
}

export interface AnalyticsPageSummary {
  path: string;
  views: number;
  durationMs: number;
}

export interface AnalyticsSectionSummary {
  id: string;
  label: string;
  path: string;
  views: number;
  durationMs: number;
}

export interface AnalyticsClickSummary {
  label: string;
  role?: string;
  href?: string;
  path: string;
  count: number;
}

export interface AnalyticsScrollSummary {
  path: string;
  maxDepth: number;
  sessions: number;
}

export interface AnalyticsCountSummary {
  label: string;
  count: number;
}
