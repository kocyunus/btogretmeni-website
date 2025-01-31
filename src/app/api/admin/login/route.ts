import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_TOKEN || '';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ message: 'Şifre gerekli' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Giriş başarısız' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Giriş başarısız' }, { status: 401 });
  }
} 