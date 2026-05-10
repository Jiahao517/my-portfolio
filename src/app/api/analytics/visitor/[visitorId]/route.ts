import type { NextRequest } from "next/server";
import { readVisitorDetail } from "@/lib/analytics/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ visitorId: string }> },
) {
  const { visitorId } = await params;
  const detail = await readVisitorDetail(visitorId);
  if (!detail) return new Response("Not found", { status: 404 });
  return Response.json(detail, { headers: { "cache-control": "no-store" } });
}
