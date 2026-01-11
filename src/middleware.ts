import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to prevent 494 REQUEST_HEADER_TOO_LARGE errors.
 * 
 * When session cookies become too large (common with NextAuth chunked tokens),
 * Vercel returns a 494 error BEFORE the app can handle the request.
 * 
 * This middleware detects oversized cookies and clears them, allowing
 * users to continue with a fresh session (they'll need to log in again).
 */
export function middleware(request: NextRequest) {
    // Calculate approximate header size
    const cookieHeader = request.headers.get("cookie") || "";
    const headerSize = cookieHeader.length;

    // Vercel's limit is around 8KB for headers. We trigger cleanup at 6KB to be safe.
    const MAX_COOKIE_SIZE = 6000;

    // Check if we have oversized cookies
    if (headerSize > MAX_COOKIE_SIZE) {
        console.log(`[MIDDLEWARE] Cookie header too large (${headerSize} bytes). Clearing session cookies.`);

        // Create response that clears session cookies
        const response = NextResponse.redirect(request.nextUrl.clone());

        // List of NextAuth cookie prefixes to clear
        const cookiePrefixes = [
            "next-auth.session-token",
            "__Secure-next-auth.session-token",
            "next-auth.csrf-token",
            "__Host-next-auth.csrf-token",
            "next-auth.callback-url",
            "__Secure-next-auth.callback-url",
        ];

        // Parse existing cookies and clear NextAuth ones
        const cookies = cookieHeader.split(";");
        cookies.forEach((cookie) => {
            const name = cookie.trim().split("=")[0];
            if (cookiePrefixes.some((prefix) => name.startsWith(prefix))) {
                // Delete cookie by setting empty value with expired date
                response.cookies.set(name, "", {
                    expires: new Date(0),
                    path: "/",
                });
            }
        });

        // Redirect to login with a message
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("expired", "true");

        return NextResponse.redirect(loginUrl);
    }

    // Also check for specific signs of cookie corruption (many chunks)
    const chunkPattern = /next-auth\.session-token\.\d+/g;
    const chunks = cookieHeader.match(chunkPattern);
    if (chunks && chunks.length > 5) {
        console.log(`[MIDDLEWARE] Too many session chunks detected (${chunks.length}). Clearing.`);

        const response = NextResponse.redirect(new URL("/login?expired=true", request.url));

        // Clear all chunks
        chunks.forEach((chunkName) => {
            response.cookies.set(chunkName, "", {
                expires: new Date(0),
                path: "/",
            });
        });

        // Also clear the base token
        response.cookies.set("next-auth.session-token", "", {
            expires: new Date(0),
            path: "/",
        });
        response.cookies.set("__Secure-next-auth.session-token", "", {
            expires: new Date(0),
            path: "/",
        });

        return response;
    }

    // For lead diploma pages, add the pathname header so layout can detect which diploma
    const pathname = request.nextUrl.pathname;
    if (pathname.includes("-diploma")) {
        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    }

    return NextResponse.next();
}

// Apply middleware to all routes except static files and API routes that don't need it
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
