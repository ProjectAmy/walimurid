import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isWalimurid = !!req.auth?.user?.walimurid_profile || !!req.auth?.user?.backendToken;
    const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isPublicRoute = req.nextUrl.pathname === "/";
    // Protected routes regex or list
    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/student") ||
        req.nextUrl.pathname.startsWith("/register") ||
        req.nextUrl.pathname.startsWith("/invoices");

    // Logic 1: Unauthenticated user trying to access protected route -> Redirect to Home (Landing Page)
    // User request: "jika belum login maka lempar ke halaman awal"
    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Logic 2: Authenticated user but NOT Walimurid trying to access protected route -> Redirect to Register
    // User request: "jika sudah login tapi ternyata bukan wali murid maka lempar ke halaman register"
    if (isLoggedIn && !isWalimurid && isProtectedRoute) {
        return NextResponse.redirect(new URL("/register", req.nextUrl));
    }

    // Optional: Prevent infinite loop if already on register page and not walimurid
    // If user is logged in, not walimurid, and visits /, we might want to encourage registration, but requirement says "visit dashboard... throw to register"

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
