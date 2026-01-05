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

  // 2. Handle API routes (existing logic)
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

  // Use a hacky way to check for token in cookies (middleware can't see localStorage)
  // We'll trust the client side for now, but for real middleware we need cookies
  const token = request.cookies.get('hackmate_session_active');

  // Skip middleware for root path
  if (pathname === '/') {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthOnly = authOnlyRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};