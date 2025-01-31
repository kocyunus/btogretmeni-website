import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// JWT için secret key
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

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
  role: UserRole;
  twoFactorEnabled?: boolean;
}

// JWT payload tipi
interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// JWT token oluştur
export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);

  return token;
}

// JWT token doğrula
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const jwtPayload = payload as JWTPayload;
    
    return {
      id: jwtPayload.id,
      email: jwtPayload.email,
      name: jwtPayload.name,
      role: jwtPayload.role,
      twoFactorEnabled: false, // Varsayılan değer
    };
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return null;
  }
}

// Mevcut kullanıcıyı al
export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    let token: string | undefined;
    
    if (request) {
      token = request.cookies.get('auth_token')?.value;
    } else {
      const cookieStore = cookies();
      token = (await cookieStore).get('auth_token')?.value;
    }

    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error('Kullanıcı bilgisi alınamadı:', error);
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

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// İki faktörlü kimlik doğrulama için kod oluştur
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// İki faktörlü kimlik doğrulama kodunu doğrula
export function verifyTwoFactorCode(code: string, storedCode: string): boolean {
  return code === storedCode;
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
      role: UserRole.ADMIN,
      twoFactorEnabled: true,
    };
  }
  return null;
}

// Oturum kapatma işlemi
export async function logout(): Promise<void> {
  const cookieStore = cookies();
  (await cookieStore).delete('auth_token');
} 