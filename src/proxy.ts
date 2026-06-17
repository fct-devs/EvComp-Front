import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const isColetor = request.cookies.get('is_coletor')?.value;
  
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/cadastro';
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/perfil') || 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/coletor');

  // Next.js 14+ Server Actions: Evitar redirecionamentos indesejados durante chamadas de ação
  const isServerAction = request.headers.has('next-action');

  // If user is trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    if (isServerAction) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin pages protection
  if (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    if (isServerAction) return NextResponse.next();
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Coletor pages protection
  if (request.nextUrl.pathname.startsWith('/coletor') && isColetor !== 'true') {
    if (isServerAction) return NextResponse.next();
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is already logged in and tries to access login/cadastro, redirect to correct dashboard
  if (isAuthRoute && token) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (isColetor === 'true' || userRole === 'COLETOR') {
      return NextResponse.redirect(new URL('/coletor/scan', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    '/perfil/:path*', 
    '/dashboard/:path*', 
    '/admin/:path*',
    '/coletor/:path*',
    '/login',
    '/cadastro'
  ],
};
