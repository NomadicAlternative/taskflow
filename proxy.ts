import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const PUBLIC_PATHS = new Set(['/', '/login', '/signup']);
const SIGNED_OUT_ONLY_PATHS = new Set(['/login', '/signup']);

// Optimistic check from the session cookie only. Pages and route handlers
// still verify the user through `lib/session.ts` before touching data.
export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isSignedIn = request.auth !== null;

  if (isSignedIn && SIGNED_OUT_ONLY_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isSignedIn && !PUBLIC_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // API routes answer 401 themselves instead of redirecting.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
