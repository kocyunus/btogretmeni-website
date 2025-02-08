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
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
ADMIN_TOKEN=admin-access-token
ADMIN_USERNAME=admin-username
ADMIN_PASSWORD=admin-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
``` 