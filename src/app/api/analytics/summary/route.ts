import { readAnalyticsSummary } from "@/lib/analytics/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await readAnalyticsSummary(), {
    headers: { "cache-control": "no-store" },
  });
}
