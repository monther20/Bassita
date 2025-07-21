import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/login',
  '/login/email',
  '/signup',
  '/signup/email',
  '/forgot-password',
  '/reset-password',
];

const authRoutes = [
  '/login',
  '/login/email',
  '/signup',
  '/signup/email',
  '/forgot-password',
  '/reset-password',
];

async function isFirebaseTokenValid(token: string): Promise<boolean> {
  try {
    // In middleware, we can't use Firebase Admin SDK directly
    // So we'll do basic JWT validation and let client-side handle detailed validation
    
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    // Check if it's a Firebase token (has iss field with Firebase URL)
    if (!payload.iss || !payload.iss.includes('firebase')) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root path redirects
  if (pathname === '/') {
    // Get token from cookie or header
    const tokenFromCookie = request.cookies.get('firebase-auth-token')?.value;
    const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = tokenFromCookie || tokenFromHeader;

    let isAuthenticated = false;
    
    if (token) {
      isAuthenticated = await isFirebaseTokenValid(token);
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Get token from cookie or header
  const tokenFromCookie = request.cookies.get('firebase-auth-token')?.value;
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = tokenFromCookie || tokenFromHeader;

  let isAuthenticated = false;
  
  if (token) {
    isAuthenticated = await isFirebaseTokenValid(token);
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};