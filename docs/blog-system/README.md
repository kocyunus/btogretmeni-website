# Blog Sistemi Dokümantasyonu

Bu dokümantasyon, blog sisteminin genel yapısını, kurulumunu ve kullanımını detaylı olarak açıklar.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Yığını](#teknoloji-yığını)
3. [Başlangıç](#başlangıç)
4. [Sistem Mimarisi](#sistem-mimarisi)
5. [Modüler Yapı](#modüler-yapı)
6. [Güvenlik](#güvenlik)
7. [Bakım ve İzleme](#bakım-ve-izleme)
8. [Katkıda Bulunma](#katkıda-bulunma)

## Genel Bakış

Blog sistemi, modern web teknolojileri kullanılarak geliştirilmiş, ölçeklenebilir ve modüler bir yapıya sahiptir. Sistem, blog yazılarının yönetimi, yayınlanması ve görüntülenmesi için gerekli tüm özellikleri içerir.

### Temel Özellikler

- 📝 Markdown desteği ile blog yazısı oluşturma ve düzenleme
- 🏷️ Etiketleme ve kategorilendirme
- 🔍 Tam metin arama
- 📊 SEO optimizasyonu
- 📱 Responsive tasarım
- 🔒 Güvenli yetkilendirme
- 📈 Performans optimizasyonları
- 🌐 Çoklu dil desteği

## Teknoloji Yığını

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Zustand

### Backend
- Next.js API Routes
- MongoDB
- Mongoose
- JWT Authentication

### Araçlar ve Servisler
- ESLint & Prettier
- Jest & React Testing Library
- GitHub Actions
- Vercel
- MongoDB Atlas

## Başlangıç

### Gereksinimler

- Node.js 18.0.0 veya üzeri
- MongoDB 5.0 veya üzeri
- pnpm 8.0.0 veya üzeri

### Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/kullanici/blog-sistemi.git
cd blog-sistemi
```

2. Bağımlılıkları yükleyin:
```bash
pnpm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

4. Geliştirme sunucusunu başlatın:
```bash
pnpm dev
```

### Ortam Değişkenleri

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/blog

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Upload
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3000/uploads
UPLOAD_DIR=./public/uploads

# SEO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Blog Adı
NEXT_PUBLIC_SITE_DESCRIPTION=Blog Açıklaması
```

## Sistem Mimarisi

### Dizin Yapısı

```
blog-sistemi/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   ├── components/          # React bileşenleri
│   ├── lib/                 # Yardımcı fonksiyonlar
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript tipleri
│   └── utils/              # Genel yardımcı fonksiyonlar
├── public/                 # Statik dosyalar
├── docs/                   # Dokümantasyon
│   ├── api-endpoints.md
│   ├── database-structure.md
│   ├── components-and-pagination.md
│   └── helpers.md
├── tests/                  # Test dosyaları
└── scripts/               # Yardımcı scriptler
```

### Veri Akışı

1. **İstemci Tarafı**
   - Zustand ile global state yönetimi
   - React Query ile sunucu state yönetimi
   - Form state'leri için custom hooks

2. **Sunucu Tarafı**
   - Next.js API Routes ile RESTful API
   - MongoDB ile veri depolama
   - JWT ile kimlik doğrulama

## Modüler Yapı

Blog sistemi, bağımsız modüller halinde tasarlanmıştır:

1. **Core Module**
   - Temel yapılandırma
   - Veritabanı bağlantısı
   - Middleware yönetimi

2. **Auth Module**
   - Kullanıcı yönetimi
   - Yetkilendirme
   - Oturum yönetimi

3. **Blog Module**
   - Blog yazıları
   - Kategoriler
   - Etiketler

4. **Media Module**
   - Dosya yükleme
   - Resim optimizasyonu
   - Medya yönetimi

## Güvenlik

### Güvenlik Önlemleri

1. **API Güvenliği**
   - Rate limiting
   - CORS yapılandırması
   - Input validasyonu

2. **Veri Güvenliği**
   - Şifreleme (at rest & in transit)
   - Güvenli session yönetimi
   - XSS & CSRF koruması

3. **Erişim Kontrolü**
   - Role-based access control
   - JWT token validasyonu
   - API route koruması

## Bakım ve İzleme

### Performans İzleme

1. **Metrikler**
   - Sayfa yüklenme süreleri
   - API yanıt süreleri
   - Veritabanı sorgu performansı

2. **Loglama**
   - Error tracking
   - User activity logs
   - System logs

### Bakım Görevleri

1. **Düzenli Bakım**
   - Veritabanı yedekleme
   - İndeks optimizasyonu
   - Önbellek temizleme

2. **Güncelleme Prosedürleri**
   - Dependency updates
   - Security patches
   - Feature updates

## Katkıda Bulunma

### Geliştirme Süreci

1. **Branch Stratejisi**
   - `main`: Production branch
   - `develop`: Development branch
   - `feature/*`: Yeni özellikler
   - `bugfix/*`: Hata düzeltmeleri

2. **Kod Standartları**
   - ESLint kuralları
   - Prettier yapılandırması
   - TypeScript strict mode

3. **Test Gereksinimleri**
   - Unit testler
   - Integration testler
   - E2E testler

### Pull Request Süreci

1. Feature branch oluşturun
2. Değişikliklerinizi commit'leyin
3. Testleri çalıştırın
4. Pull request oluşturun
5. Code review bekleyin

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
