import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit admin kontrolü
export function middleware(request: NextRequest) {
  // Sadece admin sayfaları için kontrol
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth_token');
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 