import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// JWT için secret key
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
const TOKEN_NAME = 'token';

// Oturum süresi (24 saat)
const SESSION_DURATION = 24 * 60 * 60; // saniye cinsinden

// Kullanıcı rolleri
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// JWT payload tipi
export interface JWTPayload {
  [key: string]: string | undefined;
  id: string;
  email: string;
  name: string;
  role: string;
}

// JWT token oluştur
export async function signJWT(payload: JWTPayload): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(JWT_SECRET);
    return token;
  } catch (error) {
    console.error('JWT imzalanırken hata:', error);
    throw error;
  }
}

// JWT token doğrula
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string
    };
  } catch (error) {
    console.error('JWT doğrulanırken hata:', error);
    throw error;
  }
}

// Mevcut kullanıcıyı al
export async function getToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME);
  return token?.value;
}

// Oturum açma işlemi
export async function login(email: string, password: string): Promise<User | null> {
  // TODO: Veritabanından kullanıcıyı bul ve şifreyi kontrol et
  // Bu örnek için sabit bir kullanıcı döndürüyoruz
  if (email === 'admin@btogretmeni.com' && password === process.env.ADMIN_PASSWORD) {
    return {
      id: '1',
      email: 'admin@btogretmeni.com',
      name: 'Admin',
      role: UserRole.ADMIN.toString(),
    };
  }
  return null;
}

// Oturum kapatma işlemi
export async function logout(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getUser(request?: NextRequest): Promise<User | null> {
  try {
    const token = request
      ? request.cookies.get(TOKEN_NAME)?.value
      : (await getToken());

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
  } catch (error) {
    console.error('Kullanıcı bilgisi alınırken hata:', error);
    return null;
  }
}

// Yetki kontrolü
export function checkPermission(user: User | null, requiredRole: UserRole): boolean {
  if (!user) {
    return false;
  }

  const roleHierarchy = {
    [UserRole.ADMIN]: 3,
    [UserRole.EDITOR]: 2,
    [UserRole.VIEWER]: 1,
  };

  return roleHierarchy[user.role as UserRole] >= roleHierarchy[requiredRole];
}

// İki faktörlü kimlik doğrulama için kod oluştur
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// İki faktörlü kimlik doğrulama kodunu doğrula
export function verifyTwoFactorCode(code: string, storedCode: string): boolean {
  return code === storedCode;
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 1 gün
  });
}

export async function removeToken(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_NAME);
} 