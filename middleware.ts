export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  try {
    // Prepare response
    let response = NextResponse.next({ request });

    // Create Supabase client (Node runtime-safe)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Check user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect routes
    const protectedRoutes = ["/learner", "/teacher", "/admin"];
    const needsAuth = protectedRoutes.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (needsAuth && !user) {
      const redirectUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (err) {
    console.error("🔥 Middleware error:", err);
    return new NextResponse("Middleware failed", { status: 500 });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
