import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/.well-known/appspecific")) {
    return new Response("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/.well-known/:path*",
};
