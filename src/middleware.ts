import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isProfileRoute = pathname.startsWith('/profile');
  const isLearnRoute = pathname.includes('/learn');

  if (!isLoggedIn && (isAdminRoute || isDashboardRoute || isProfileRoute || isLearnRoute)) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, req.url));
  }

  if (isLoggedIn && isAdminRoute && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/courses/:path*/learn'],
};
