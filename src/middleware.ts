import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'mayasura-session';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'mayasura-default-secret-change-in-production';
  return new Uint8Array(Buffer.from(secret, 'utf-8'));
}

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard'];

// Routes that require auth but redirect to signup instead of login
const SIGNUP_REDIRECT_ROUTES = ['/create'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const needsSignup = SIGNUP_REDIRECT_ROUTES.some(prefix => pathname.startsWith(prefix));

  if (!isProtected && !needsSignup) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (needsSignup) {
      const url = request.nextUrl.clone();
      url.pathname = '/signup';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    // Invalid/expired token — clear it and redirect
    const url = request.nextUrl.clone();
    url.pathname = isProtected ? '/login' : '/signup';
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/create/:path*'],
};
