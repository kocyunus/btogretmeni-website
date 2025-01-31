import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';
import { NextRequest } from 'next/server';

// İstek sayısı sınırlaması için Map
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// İstek limiti ayarları
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 100; // 1 dakikada maksimum istek sayısı

// Blog yazısı şeması
export const blogPostSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(200),
  content: z.string().min(50),
  excerpt: z.string().min(10).max(200),
  readingTime: z.string(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).min(1),
  isDraft: z.boolean().optional(),
  publishedAt: z.date().optional(),
  author: z.object({
    name: z.string(),
    title: z.string(),
    image: z.string()
  }),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string().optional()
  })).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    canonicalUrl: z.string().url().optional()
  }).optional()
});

// Kullanıcı şeması
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

// HTML içeriğini temizle
export async function sanitizeHtml(html: string): Promise<string> {
  if (typeof window === 'undefined') {
    const { default: createDOMPurify } = await import('dompurify');
    const { JSDOM } = await import('jsdom');
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  } else {
    const DOMPurify = (await import('isomorphic-dompurify')).default;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  }
}

// Metin içeriğini temizle (HTML olmayan)
export function sanitizeText(text: string): string {
  return text.trim().replace(/[<>]/g, '');
}

// Güvenli URL kontrolü
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

// E-posta adresi kontrolü
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Kullanıcı adı kontrolü
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

// Parola gücü kontrolü
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 && // minimum 8 karakter
    /[A-Z]/.test(password) && // en az bir büyük harf
    /[a-z]/.test(password) && // en az bir küçük harf
    /[0-9]/.test(password) && // en az bir rakam
    /[^A-Za-z0-9]/.test(password) // en az bir özel karakter
  );
}

// Dosya boyutu kontrolü (bytes)
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

// Dosya türü kontrolü
export function isValidFileType(type: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(type);
}

// Tarih kontrolü
export function isValidDate(date: string): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

// Telefon numarası kontrolü (TR)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/;
  return phoneRegex.test(phone);
}

// İstek limiti kontrolü
export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Eski kayıtları temizle
  Array.from(requestCounts.entries()).forEach(([key, data]) => {
    if (data.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  });

  // Mevcut istek sayısını kontrol et
  const currentCount = requestCounts.get(ip);
  if (!currentCount) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (currentCount.count >= MAX_REQUESTS) {
    return false;
  }

  // İstek sayısını güncelle
  requestCounts.set(ip, {
    count: currentCount.count + 1,
    timestamp: now
  });

  return true;
}

// Blog yazısı doğrulama
export function validateBlogPost(data: unknown) {
  return blogPostSchema.safeParse(data);
}

// Kullanıcı doğrulama
export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}

// Blog yazısı validasyonu
export interface BlogValidationErrors {
  title?: string;
  description?: string;
  content?: string;
  tags?: string;
  sources?: string;
}

export function validateBlogPostData(data: any) {
  const errors: string[] = [];

  // Zorunlu alanları kontrol et
  if (!data.title?.trim()) {
    errors.push('Başlık zorunludur');
  } else if (data.title.length < 3) {
    errors.push('Başlık en az 3 karakter olmalıdır');
  }

  if (!data.description?.trim()) {
    errors.push('Açıklama zorunludur');
  } else if (data.description.length < 10) {
    errors.push('Açıklama en az 10 karakter olmalıdır');
  }

  if (!data.content?.trim()) {
    errors.push('İçerik zorunludur');
  } else if (data.content.length < 50) {
    errors.push('İçerik en az 50 karakter olmalıdır');
  }

  if (!data.excerpt?.trim()) {
    errors.push('Özet zorunludur');
  } else if (data.excerpt.length < 10) {
    errors.push('Özet en az 10 karakter olmalıdır');
  }

  if (!data.readingTime?.trim()) {
    errors.push('Okuma süresi zorunludur');
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push('En az bir etiket eklemelisiniz');
  }

  if (!data.author?.name?.trim()) {
    errors.push('Yazar adı zorunludur');
  }

  if (!data.author?.title?.trim()) {
    errors.push('Yazar ünvanı zorunludur');
  }

  if (!data.author?.image?.trim()) {
    errors.push('Yazar resmi zorunludur');
  }

  return errors;
}

// TC Kimlik numarası doğrulama
export function validateTCKN(tckn: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(tckn)) {
    return false;
  }

  const digits = tckn.split('').map(Number);
  const lastDigit = digits[10];

  // İlk 10 hanenin algoritması
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i];
  }

  return (sum % 10) === lastDigit;
} 