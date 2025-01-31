import DOMPurify from 'isomorphic-dompurify';

// HTML içeriğini temizle
export function sanitizeHtml(html: string): string {
  // Middleware'de çalışırken basit bir temizleme yapalım
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script taglerini kaldır
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframe taglerini kaldır
    .replace(/on\w+="[^"]*"/g, '') // onclick vb. event handlerları kaldır
    .replace(/javascript:/gi, ''); // javascript: protokolünü kaldır
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

// TC Kimlik numarası kontrolü
export function isValidTCKN(tckn: string): boolean {
  if (!/^[0-9]{11}$/.test(tckn)) return false;

  const digits = tckn.split('').map(Number);
  
  // İlk 9 rakamın toplamının 10. rakam olma kontrolü
  const sum = digits.slice(0, 9).reduce((acc, curr) => acc + curr, 0);
  if ((sum % 10) !== digits[9]) return false;

  // Son kontrolü yap
  const total = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
  return (total % 10) === digits[10];
}

// Blog yazısı validasyonu
export interface BlogValidationErrors {
  title?: string;
  description?: string;
  content?: string;
  tags?: string;
  sources?: string;
}

export function validateBlogPost(data: any): BlogValidationErrors {
  const errors: BlogValidationErrors = {};

  // Başlık kontrolü
  if (!data.title || typeof data.title !== 'string') {
    errors.title = 'Başlık gereklidir.';
  } else if (data.title.length < 3) {
    errors.title = 'Başlık en az 3 karakter olmalıdır.';
  } else if (data.title.length > 100) {
    errors.title = 'Başlık en fazla 100 karakter olmalıdır.';
  }

  // Açıklama kontrolü
  if (!data.description || typeof data.description !== 'string') {
    errors.description = 'Açıklama gereklidir.';
  } else if (data.description.length < 10) {
    errors.description = 'Açıklama en az 10 karakter olmalıdır.';
  } else if (data.description.length > 500) {
    errors.description = 'Açıklama en fazla 500 karakter olmalıdır.';
  }

  // İçerik kontrolü
  if (!data.content || typeof data.content !== 'string') {
    errors.content = 'İçerik gereklidir.';
  } else if (data.content.length < 50) {
    errors.content = 'İçerik en az 50 karakter olmalıdır.';
  }

  // Etiketler kontrolü
  if (data.tags && (!Array.isArray(data.tags) || !data.tags.every((tag: any) => typeof tag === 'string'))) {
    errors.tags = 'Etiketler dizi formatında olmalıdır.';
  }

  // Kaynaklar kontrolü
  if (data.sources) {
    if (!Array.isArray(data.sources)) {
      errors.sources = 'Kaynaklar dizi formatında olmalıdır.';
    } else {
      const hasInvalidSource = data.sources.some((source: any) => {
        return !source.title || !source.url || !isValidUrl(source.url);
      });

      if (hasInvalidSource) {
        errors.sources = 'Geçersiz kaynak formatı. Her kaynak başlık ve geçerli URL içermelidir.';
      }
    }
  }

  return errors;
}

// Rate limiting için yardımcı fonksiyonlar
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Eski kayıtları temizle
  for (const [key, data] of requestCounts.entries()) {
    if (data.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }

  // Mevcut istek sayısını kontrol et
  const current = requestCounts.get(ip);
  if (!current) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (current.timestamp < windowStart) {
    // Yeni pencere başlat
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  // İstek sayısını artır
  current.count++;
  return true;
} 