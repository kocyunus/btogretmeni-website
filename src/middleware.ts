import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sanitizeHtml, isValidUrl } from '@/lib/validation';

// Admin sayfaları için güvenlik kontrolü
export function middleware(request: NextRequest) {
  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Form verilerini kontrol et
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type');
    
    // JSON verilerini kontrol et
    if (contentType?.includes('application/json')) {
      return handleJsonRequest(request);
    }
  }

  return NextResponse.next();
}

// JSON isteklerini işle
async function handleJsonRequest(request: NextRequest) {
  try {
    const body = await request.json();

    // HTML içeriği varsa temizle
    if (body.content) {
      body.content = sanitizeHtml(body.content);
    }
    if (body.description) {
      body.description = sanitizeHtml(body.description);
    }

    // URL'leri kontrol et
    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { error: 'Geçersiz URL formatı.' },
        { status: 400 }
      );
    }

    // Temizlenmiş veriyi isteğe ekle
    const response = NextResponse.next();
    response.headers.set('x-sanitized', 'true');
    return response;
  } catch (error) {
    console.error('İstek işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Middleware yapılandırması
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}; 