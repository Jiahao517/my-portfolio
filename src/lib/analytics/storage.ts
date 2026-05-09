import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { buildAnalyticsSummary } from "./summary";
import type { AnalyticsEventInput, AnalyticsEventRecord, AnalyticsSummary, AnalyticsVisitorInfo } from "./types";

const DATA_DIR = process.env.ANALYTICS_DATA_DIR || "/data/analytics";
const EVENT_FILE = path.join(DATA_DIR, "events.jsonl");
const MAX_EVENT_BYTES = 1024 * 1024 * 12;
const GEO_CACHE = new Map<string, AnalyticsVisitorInfo>();
const SUSPECT_ORG_PATTERNS = [/alibaba/i, /aliyun/i, /ant group/i, /蚂蚁/, /阿里/];

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

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(EVENT_FILE, `${JSON.stringify(record)}\n`, { flag: "a" });
  return record;
}

export async function readAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  try {
    const fileStat = await stat(EVENT_FILE);
    if (fileStat.size > MAX_EVENT_BYTES) {
      return parseEvents((await readFile(EVENT_FILE, "utf8")).slice(-MAX_EVENT_BYTES));
    }
    return parseEvents(await readFile(EVENT_FILE, "utf8"));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

export async function readAnalyticsSummary(): Promise<AnalyticsSummary> {
  return buildAnalyticsSummary(await readAnalyticsEvents());
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
  if (cached) return cached;

  const info = await lookupIpInfo(ip, ipHash);
  GEO_CACHE.set(ipHash, info);
  return info;
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
  if (!token) return { ipHash };

  try {
    const response = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1800),
    });
    if (!response.ok) return { ipHash };
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
      ipHash,
      city: clean(data.city),
      region: clean(data.region),
      country: clean(data.country),
      asn: clean(asn),
      org: clean(org),
      suspectOrg: org && SUSPECT_ORG_PATTERNS.some((pattern) => pattern.test(org)) ? "Alibaba/Ant related network" : undefined,
    };
  } catch {
    return { ipHash };
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
