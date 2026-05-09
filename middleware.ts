import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/admin/analytics", "/api/analytics/summary"];

export function middleware(req: NextRequest) {
  if (!PROTECTED_PATHS.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const password = process.env.ANALYTICS_ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse("Analytics admin is not configured.", { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (isAuthorized(auth, password)) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Portfolio analytics", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/analytics/:path*", "/api/analytics/summary"],
};

function isAuthorized(auth: string | null, password: string) {
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(auth.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator === -1) return false;
    return decoded.slice(separator + 1) === password;
  } catch {
    return false;
  }
}
