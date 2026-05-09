import type { NextRequest } from "next/server";
import { appendAnalyticsEvent } from "@/lib/analytics/storage";
import type { AnalyticsEventInput } from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_TYPES = new Set(["page_view", "heartbeat", "scroll_depth", "section_view", "click"]);
const RATE = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 240;
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return Response.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  if (!rateLimit(getClientIp(req))) {
    return Response.json({ ok: false, error: "Too many analytics events" }, { status: 429 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Analytics event is too large" }, { status: 413 });
  }

  let body: AnalyticsEventInput;
  try {
    body = (await req.json()) as AnalyticsEventInput;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || !EVENT_TYPES.has(body.type) || !body.sessionId || !body.visitorId) {
    return Response.json({ ok: false, error: "Invalid analytics event" }, { status: 400 });
  }

  await appendAnalyticsEvent(req, body);
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}

function rateLimit(ip: string) {
  const now = Date.now();
  for (const [key, value] of RATE) {
    if (value.reset < now) RATE.delete(key);
  }

  const current = RATE.get(ip);
  if (!current || current.reset < now) {
    RATE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_EVENTS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

function isSameOrigin(req: NextRequest) {
  const expectedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!expectedHost) return false;

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  return [origin, referer].some((value) => {
    if (!value) return false;
    try {
      return new URL(value).host === expectedHost;
    } catch {
      return false;
    }
  });
}

function getClientIp(req: NextRequest) {
  const candidates = [
    req.headers.get("x-real-ip"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
    req.headers.get("x-vercel-forwarded-for"),
  ];
  return candidates.map((value) => value?.trim()).find(Boolean) ?? "anon";
}
