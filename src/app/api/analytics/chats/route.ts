import type { NextRequest } from "next/server";
import { readChatRecords } from "@/lib/analytics/chat-store";
import { resolveRange } from "@/lib/analytics/range";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const visitorId = url.searchParams.get("visitorId") ?? undefined;
  const range = resolveRange({
    range: url.searchParams.get("range"),
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
  });
  const records = await readChatRecords({
    visitorId,
    from: range.from,
    to: range.to,
    limit: 200,
  });
  return Response.json(records, { headers: { "cache-control": "no-store" } });
}
