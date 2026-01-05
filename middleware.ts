import { NextRequest, NextResponse } from 'next/server';

// Whitelist of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
// Routes that are ONLY for unauthenticated users
const authOnlyRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
// Routes that require authentication
const protectedRoutes = ['/dashboard', '/discover', '/invitations', '/hackathons', '/profile', '/settings', '/user'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets, images, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Handle API routes
  if (pathname.startsWith('/api')) {
    // Skip authentication for auth endpoints
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3. Handle Frontend Routing
  const token = request.cookies.get('hackmate_session_active');

  const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthOnly = authOnlyRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Redirect to login if accessing protected route without token
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth-only routes (login/signup) or landing page while logged in
  if ((isAuthOnly || pathname === '/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};