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

export interface AnalyticsSummary {
  generatedAt: string;
  totalEvents: number;
  totalSessions: number;
  totalVisitors: number;
  suspectOrgSessions: number;
  recentVisitors: AnalyticsVisitorSummary[];
  pages: AnalyticsPageSummary[];
  sections: AnalyticsSectionSummary[];
  clicks: AnalyticsClickSummary[];
  maxScrollDepthByPath: AnalyticsScrollSummary[];
  devices: AnalyticsCountSummary[];
  referrers: AnalyticsCountSummary[];
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
  city?: string;
  region?: string;
  country?: string;
  asn?: string;
  org?: string;
  suspectOrg?: string;
  device?: string;
  referrer?: string;
  interest: string;
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
