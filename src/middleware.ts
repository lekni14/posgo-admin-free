import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

const publicRoutes = ["/signin", "/signup"];
import { all_routes } from "@/data/all_routes";
const router = Object.values(all_routes).filter(item => !publicRoutes.includes(item));
const protectedRoutes = router;


export default async function middleware(request: NextRequest) {
  const router = Object.values(all_routes).filter(item => !publicRoutes.includes(item));
  console.log("Middleware running for request:", router);
  // if (!request.nextUrl.pathname.startsWith("/upload")) {
  //   if (!isPublicRoute && (!token || Date.now() > JSON.parse(token).expiredAt)) {
  //     return NextResponse.redirect(new URL("/login", request.nextUrl));
  //   }
  //   if (
  //     isPublicRoute &&
  //     (!token || Date.now() > JSON.parse(token).expiredAt) &&
  //     !request.nextUrl.pathname.startsWith("/")
  //   ) {
  //     return NextResponse.redirect(new URL("/", request.nextUrl));
  //   }

  //   if (token && request.nextUrl.pathname.startsWith("/login")) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  if (path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
