import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { buildAnalyticsSummary, buildVisitorDetail } from "./summary";
import { readChatRecords } from "./chat-store";
import type {
  AnalyticsEventInput,
  AnalyticsEventRecord,
  AnalyticsSummary,
  AnalyticsVisitorDetail,
  AnalyticsVisitorInfo,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "analytics");
const EVENT_FILE = path.join(DATA_DIR, "events.jsonl");
const MAX_EVENT_BYTES = 1024 * 1024 * 12;
const ROTATE_EVENT_BYTES = 1024 * 1024 * 50;
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const GEO_CACHE_MAX = 500;
const GEO_CACHE = new Map<string, { info: AnalyticsVisitorInfo; expires: number }>();
const SUSPECT_ORG_PATTERNS = [/alibaba/i, /aliyun/i, /ant group/i, /蚂蚁/, /阿里/];
let ensureDataDirPromise: Promise<void> | undefined;
let writeQueue: Promise<unknown> = Promise.resolve();

export async function appendAnalyticsEvent(req: NextRequest, input: AnalyticsEventInput) {
  const visitor = await getVisitorInfo(req);
  const now = new Date().toISOString();
  const record: AnalyticsEventRecord = {
    ...sanitizeInput(input),
    id: randomUUID(),
    timestamp: normalizeIso(input.timestamp) ?? now,
    receivedAt: now,
    visitor,
  };

  await queueWrite(`${JSON.stringify(record)}\n`);
  return record;
}

export async function readAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  try {
    const content = await readRecentEventContent();
    return parseEvents(content);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

export async function readAnalyticsSummary(): Promise<AnalyticsSummary> {
  return buildAnalyticsSummary(await readAnalyticsEvents());
}

export interface AnalyticsRangeOption {
  from?: string;
  to?: string;
}

export async function readAnalyticsSummaryInRange(
  range: AnalyticsRangeOption = {},
): Promise<AnalyticsSummary> {
  const events = await readAnalyticsEvents();
  const filtered = filterByRange(events, range);
  const chats = await readChatRecords({ from: range.from, to: range.to });
  return buildAnalyticsSummary(filtered, { range, chats });
}

export async function readVisitorDetail(visitorId: string): Promise<AnalyticsVisitorDetail | null> {
  const events = await readAnalyticsEvents();
  const visitorEvents = events.filter((event) => event.visitorId === visitorId);
  if (visitorEvents.length === 0) return null;
  const chats = await readChatRecords({ visitorId });
  return buildVisitorDetail(visitorEvents, visitorId, chats);
}

function filterByRange(events: AnalyticsEventRecord[], range: AnalyticsRangeOption): AnalyticsEventRecord[] {
  const fromTs = range.from ? new Date(range.from).getTime() : -Infinity;
  const toTs = range.to ? new Date(range.to).getTime() : Infinity;
  if (!Number.isFinite(fromTs) && !Number.isFinite(toTs)) return events;
  return events.filter((event) => {
    const ts = new Date(event.timestamp).getTime();
    return ts >= fromTs && ts <= toTs;
  });
}

export async function getVisitorInfoForRequest(req: NextRequest) {
  return getVisitorInfo(req);
}

function parseEvents(content: string): AnalyticsEventRecord[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as AnalyticsEventRecord];
      } catch {
        return [];
      }
    });
}

async function getVisitorInfo(req: NextRequest): Promise<AnalyticsVisitorInfo> {
  const ip = getClientIp(req);
  if (!ip) return {};
  const ipHash = hashIp(ip);
  const cached = GEO_CACHE.get(ipHash);
  if (cached && cached.expires > Date.now()) return cached.info;

  const info = await lookupIpInfo(ip, ipHash);
  if (GEO_CACHE.size >= GEO_CACHE_MAX) {
    const oldestKey = GEO_CACHE.keys().next().value;
    if (oldestKey) GEO_CACHE.delete(oldestKey);
  }
  GEO_CACHE.set(ipHash, { info, expires: Date.now() + GEO_CACHE_TTL_MS });
  return info;
}

async function queueWrite(line: string) {
  const next = writeQueue.then(async () => {
    await ensureDataDir();
    await rotateEventsIfNeeded();
    await appendFile(EVENT_FILE, line, "utf8");
  });
  writeQueue = next.catch(() => undefined);
  await next;
}

async function ensureDataDir() {
  ensureDataDirPromise ??= mkdir(DATA_DIR, { recursive: true })
    .then(() => undefined)
    .catch((error) => {
      ensureDataDirPromise = undefined;
      throw error;
    });
  await ensureDataDirPromise;
}

async function rotateEventsIfNeeded() {
  try {
    const fileStat = await stat(EVENT_FILE);
    if (fileStat.size < ROTATE_EVENT_BYTES) return;
    const rotated = `${EVENT_FILE}.1`;
    await unlinkIfExists(rotated);
    await rename(EVENT_FILE, rotated);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
    throw error;
  }
}

async function readRecentEventContent() {
  const chunks: string[] = [];
  const rotated = `${EVENT_FILE}.1`;

  for (const file of [rotated, EVENT_FILE]) {
    try {
      chunks.push(await readFile(file, "utf8"));
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") continue;
      throw error;
    }
  }

  const content = chunks.join("");
  return content.length > MAX_EVENT_BYTES ? content.slice(-MAX_EVENT_BYTES) : content;
}

async function unlinkIfExists(file: string) {
  try {
    await unlink(file);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
    throw error;
  }
}

function getClientIp(req: NextRequest): string | undefined {
  const candidates = [
    req.headers.get("x-real-ip"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
    req.headers.get("x-vercel-forwarded-for"),
  ];
  return candidates.map((value) => value?.trim()).find(Boolean);
}

function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_SALT || "change-me-before-production";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 24);
}

async function lookupIpInfo(ip: string, ipHash: string): Promise<AnalyticsVisitorInfo> {
  const token = process.env.IPINFO_TOKEN;
  if (!token) return { ip, ipHash };

  try {
    const response = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1800),
    });
    if (!response.ok) return { ip, ipHash };
    const data = (await response.json()) as {
      city?: string;
      region?: string;
      country?: string;
      org?: string;
      asn?: { asn?: string; name?: string; domain?: string };
    };
    const org = data.org || data.asn?.name;
    const asn = data.asn?.asn || data.org?.match(/AS\d+/i)?.[0];
    return {
      ip,
      ipHash,
      city: clean(data.city),
      region: clean(data.region),
      country: clean(data.country),
      asn: clean(asn),
      org: clean(org),
      suspectOrg: org && SUSPECT_ORG_PATTERNS.some((pattern) => pattern.test(org)) ? "Alibaba/Ant related network" : undefined,
    };
  } catch {
    return { ip, ipHash };
  }
}

function sanitizeInput(input: AnalyticsEventInput): AnalyticsEventInput & { path: string } {
  return {
    type: input.type,
    sessionId: clean(input.sessionId, 96) || "unknown-session",
    visitorId: clean(input.visitorId, 96) || "unknown-visitor",
    timestamp: normalizeIso(input.timestamp),
    path: clean(input.path, 240) || "/",
    title: clean(input.title, 160),
    referrer: clean(input.referrer, 320),
    screen: input.screen,
    viewport: input.viewport,
    device: input.device
      ? {
          userAgent: clean(input.device.userAgent, 400),
          language: clean(input.device.language, 40),
          timezone: clean(input.device.timezone, 80),
        }
      : undefined,
    durationMs: typeof input.durationMs === "number" ? Math.max(0, Math.min(input.durationMs, 5 * 60 * 1000)) : undefined,
    depth: typeof input.depth === "number" ? Math.max(0, Math.min(Math.round(input.depth), 100)) : undefined,
    sectionId: clean(input.sectionId, 100),
    sectionLabel: clean(input.sectionLabel, 140),
    targetText: clean(input.targetText, 140),
    targetRole: clean(input.targetRole, 80),
    targetHref: clean(input.targetHref, 260),
  };
}

function normalizeIso(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function clean(value?: string, maxLength = 120) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) || undefined : undefined;
}
