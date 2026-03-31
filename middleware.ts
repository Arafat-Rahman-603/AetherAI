import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function corsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Handle CORS preflight for API routes
  if (request.method === "OPTIONS" && request.nextUrl.pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // For API routes, continue and inject CORS headers
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    return corsHeaders(response);
  }

  // All other routes: let Clerk handle normally
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Apply to API routes
    "/api/:path*",
    // Clerk's required matcher for auth pages (excludes static files)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
