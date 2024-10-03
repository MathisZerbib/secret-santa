import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // List of paths that require authentication
    const authRequiredPaths = ['/dashboard', '/subscription'];

    // Check if the current path requires authentication
    const isAuthRequired = authRequiredPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isAuthRequired && !token) {
        // Redirect to login page if authentication is required but user is not authenticated
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If user is authenticated or the path doesn't require authentication, allow the request
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/subscription'],
}