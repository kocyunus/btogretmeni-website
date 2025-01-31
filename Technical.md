# Teknik Dokümantasyon

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

## Teknolojiler

- **Next.js 14.1.0**: React framework'ü
- **React 18.2.0**: UI kütüphanesi
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Stil kütüphanesi
- **next-themes**: Tema yönetimi
- **MongoDB**: Veritabanı

## Temel Özellikler

### 1. Tema Sistemi
- Koyu tema varsayılan olarak aktif
- `next-themes` ile tema yönetimi
- Tema geçişlerinde animasyon desteği

### 2. Navigasyon
- Responsive tasarım
- Aktif sayfa vurgusu
- Saydam arka plan ve blur efekti
- Mobil menü desteği

### 3. Sayfa Yapısı
- Ana Sayfa
  - Hero bölümü
  - Öne çıkan kartlar (Eğitim, Projeler, Blog)
  - Hakkımda bölümü
  - İletişim bölümü
- Blog
  - Yazı listesi
  - Etiket sistemi
  - Okuma süresi
- Eğitim
  - Kurs listesi
  - Detay sayfaları
- Projeler
  - Proje vitrin
  - Detay sayfaları

### 4. Stil Sistemi
- Tailwind CSS ile modüler tasarım
- Özelleştirilmiş renk paleti
- Responsive grid sistem
- Interaktif hover efektleri

## Performans Optimizasyonları

1. **Görüntü Optimizasyonu**
   - Next.js Image komponenti kullanımı
   - Lazy loading
   - Otomatik boyutlandırma

2. **Kod Optimizasyonu**
   - Route-based code splitting
   - Component-level code splitting
   - Tree shaking

3. **Stil Optimizasyonu**
   - Tailwind CSS purge
   - CSS modülleri
   - Minimal CSS bundle

## Güvenlik

1. **API Güvenliği**
   - Rate limiting
   - CORS politikaları
   - Input validasyonu

2. **Uygulama Güvenliği**
   - XSS koruması
   - CSRF koruması
   - Güvenli HTTP başlıkları

## Geliştirme Kılavuzu

### Yeni Sayfa Ekleme
1. `src/app` altında yeni klasör oluştur
2. `page.tsx` dosyası ekle
3. Navigasyon menüsüne link ekle

### Stil Ekleme
1. Tailwind class'ları kullan
2. Özel stiller için CSS modülleri oluştur
3. Global stiller için globals.css'i güncelle

### Komponent Ekleme
1. `src/components` altında yeni dosya oluştur
2. TypeScript interface'leri tanımla
3. Komponenti export et
4. Gerekli yerlerde import et

## Dağıtım

1. **Geliştirme Ortamı**
```bash
npm run dev
```

2. **Üretim Derlemesi**
```bash
npm run build
```

3. **Üretim Sunucusu**
```bash
npm start
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