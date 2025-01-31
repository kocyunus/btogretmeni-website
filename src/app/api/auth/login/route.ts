import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { isValidUsername } from '@/lib/validation';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Kullanıcı adı validasyonu
    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı formatı' },
        { status: 400 }
      );
    }

    // Admin kullanıcı bilgilerini kontrol et
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);

    // Token'ı cookie olarak kaydet
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 saat
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 