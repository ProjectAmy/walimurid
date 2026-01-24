import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Debug logging
    console.log(`[Middleware] Processing path: ${req.nextUrl.pathname}`);
    console.log(`[Middleware] AUTH_SECRET present: ${!!process.env.AUTH_SECRET}`);

    const isLoggedIn = !!req.auth;
    const isRegistered = !!req.auth?.user?.is_registered;
    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/student") ||
        req.nextUrl.pathname.startsWith("/register") ||
        req.nextUrl.pathname.startsWith("/invoices");

    console.log(`[Middleware] State:`, {
        isLoggedIn,
        isRegistered,
        path: req.nextUrl.pathname
    });

    // Logic 1: Unauthenticated user trying to access protected route -> Redirect to Home (Landing Page)
    if (!isLoggedIn && isProtectedRoute) {
        console.log(`[Middleware] Redirecting to / (Not logged in trying to access protected)`);
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Logic 2: Authenticated but NOT registered -> Force to /register
    if (isLoggedIn && !isRegistered && !req.nextUrl.pathname.startsWith("/register")) {
        console.log(`[Middleware] Redirecting to /register (Logged in but not registered)`);
        return NextResponse.redirect(new URL("/register", req.nextUrl));
    }

    // Logic 3: Authenticated AND registered -> Prevent access to /register, redirect to /dashboard
    if (isLoggedIn && isRegistered && req.nextUrl.pathname.startsWith("/register")) {
        console.log(`[Middleware] Redirecting to /dashboard (Already registered)`);
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
