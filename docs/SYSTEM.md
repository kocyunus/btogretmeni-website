# Sistem Mimarisi ve Yapılandırma

## Teknoloji Yığını

- **Frontend**: Next.js 14.1.0, React 18.2.0, TypeScript
- **Stil**: Tailwind CSS, next-themes
- **Backend**: Next.js API Routes
- **Veritabanı**: MongoDB
- **Deployment**: Vercel (planlanan)

## Proje Yapısı

```
mywebsite/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Ana layout bileşeni
│   │   ├── page.tsx          # Ana sayfa
│   │   ├── blog/             # Blog sayfaları
│   │   ├── egitim/          # Eğitim sayfaları
│   │   ├── projeler/        # Projeler sayfaları
│   │   ├── hakkimda/        # Hakkımda sayfası
│   │   └── iletisim/        # İletişim sayfası
│   ├── components/
│   │   ├── Navbar.tsx       # Navigasyon menüsü
│   │   ├── theme-toggle.tsx # Tema değiştirici
│   │   └── theme-provider.tsx # Tema sağlayıcı
│   └── styles/
│       └── globals.css      # Global stiller
└── public/                  # Statik dosyalar
```

## Veritabanı Şeması

```typescript
// Blog Post Şeması
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: Date;
  tags: string[];
  readingTime: number;
}

// Proje Şeması
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
}

// Eğitim Şeması
interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}
```

## Temel Özellikler

### Tema Sistemi
- Koyu tema varsayılan olarak aktif
- `next-themes` ile tema yönetimi
- Tema geçişlerinde animasyon desteği

### Navigasyon
- Responsive tasarım
- Aktif sayfa vurgusu
- Saydam arka plan ve blur efekti
- Mobil menü desteği

## Güvenlik Temelleri

1. **API Güvenliği**
   - Rate limiting
   - CORS politikaları
   - Input validasyonu

2. **Uygulama Güvenliği**
   - XSS koruması
   - CSRF koruması
   - Güvenli HTTP başlıkları

## Environment Variables

```env
# Veritabanı
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key

# Admin
ADMIN_TOKEN=admin-access-token
ADMIN_USERNAME=admin-username
ADMIN_PASSWORD=admin-password

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# API ve Deployment
VERCEL_URL=your-vercel-url
NEXT_PUBLIC_API_URL=your-api-url
```

## API Yapısı

### Eğitim İçerikleri API'si
```typescript
// GET /api/egitim
interface Course {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  features: string[];
  topics: string[];
}

// Response
{
  courses: Course[];
}

// Error Handling
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

### API Endpoint Yapılandırması
```typescript
// Base URL Yapılandırması
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
};

// API İstek Yapılandırması
const fetchConfig = {
  cache: 'no-store' as RequestCache,
  headers: {
    'Content-Type': 'application/json',
  },
  next: { revalidate: 0 }
};

// Error Handling
const handleApiError = (error: unknown) => {
  console.error("API Hatası:", error);
  throw new Error(error instanceof Error ? error.message : 'Bilinmeyen hata');
};
```

### Cache Stratejisi
```typescript
// Statik Sayfalar
export const revalidate = 3600; // 1 saat

// Dinamik Sayfalar
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// API Routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
};
```

## Hata Yönetimi

### 1. API Hataları
```typescript
// API Error Handler
export async function handleApiRequest<T>(
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    console.error("API Hatası:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'API isteği sırasında bir hata oluştu'
    );
  }
}
```

### 2. Veritabanı Hataları
```typescript
// MongoDB Error Handler
export async function handleDbRequest<T>(
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    console.error("Veritabanı Hatası:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Veritabanı işlemi sırasında bir hata oluştu'
    );
  }
}
```

### 3. Frontend Hataları
```typescript
// Error Boundary Component
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Frontend Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Bir hata oluştu</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## Performans Optimizasyonları

### 1. API Optimizasyonları
- Rate limiting
- Response caching
- Query optimizasyonu
- Batch requests

### 2. Veritabanı Optimizasyonları
- İndeks stratejisi
- Connection pooling
- Query caching
- Bulk operasyonlar

### 3. Frontend Optimizasyonları
- Code splitting
- Image optimizasyonu
- Bundle size optimizasyonu
- Lazy loading 