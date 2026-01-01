import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Debug logging
    console.log(`[Middleware] Processing path: ${req.nextUrl.pathname}`);

    const isLoggedIn = !!req.auth;
    const isWalimurid = !!req.auth?.user?.walimurid_profile || !!req.auth?.user?.backendToken;
    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/student") ||
        req.nextUrl.pathname.startsWith("/register") ||
        req.nextUrl.pathname.startsWith("/invoices");

    console.log(`[Middleware] State:`, {
        isLoggedIn,
        isWalimurid,
        isProtectedRoute,
        path: req.nextUrl.pathname
    });

    // Logic 1: Unauthenticated user trying to access protected route -> Redirect to Home (Landing Page)
    if (!isLoggedIn && isProtectedRoute) {
        console.log(`[Middleware] Redirecting to / (Not logged in trying to access protected)`);
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Logic 2: Authenticated user but NOT Walimurid trying to access protected route -> Redirect to Register
    // Fix: Ensure we don't redirect if already on the register page to avoid loop
    if (isLoggedIn && !isWalimurid && isProtectedRoute && !req.nextUrl.pathname.startsWith("/register")) {
        console.log(`[Middleware] Redirecting to /register (Logged in but not Walimurid)`);
        return NextResponse.redirect(new URL("/register", req.nextUrl));
    }

    // Debug: Check if we are staying on register page correctly
    if (isLoggedIn && !isWalimurid && req.nextUrl.pathname.startsWith("/register")) {
        console.log(`[Middleware] Allowing access to /register (Logged in, not Walimurid)`);
    }

    // Optional: Prevent infinite loop if already on register page and not walimurid
    // If user is logged in, not walimurid, and visits /, we might want to encourage registration, but requirement says "visit dashboard... throw to register"

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
