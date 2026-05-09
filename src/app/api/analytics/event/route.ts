import type { NextRequest } from "next/server";
import { appendAnalyticsEvent } from "@/lib/analytics/storage";
import type { AnalyticsEventInput } from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_TYPES = new Set(["page_view", "heartbeat", "scroll_depth", "section_view", "click"]);

export async function POST(req: NextRequest) {
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
