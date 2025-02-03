# Proje Yönetim Sistemi

Bu dokümantasyon, BT Öğretmeni web sitesinin proje yönetim sistemini detaylı olarak açıklamaktadır.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Özellikler](#özellikler)
3. [Teknik Detaylar](#teknik-detaylar)
4. [Kurulum](#kurulum)
5. [Kullanım](#kullanım)

## Genel Bakış

Proje yönetim sistemi, BT Öğretmeni web sitesinde yer alan projelerin yönetilmesini, görüntülenmesini ve düzenlenmesini sağlayan bir sistemdir. Sistem, aşağıdaki temel bileşenlerden oluşur:

- Proje Listesi
- Proje Detay Sayfası
- Admin Paneli
- API Endpoints

## Özellikler

### Proje Özellikleri

- Başlık ve açıklama
- Özet (150 karakter)
- Kategori (MobilOyun, WebSite, PlayableAds, RobotikEgitim, Diger)
- Teknolojiler
- Özellikler listesi
- Görseller
- Durum (planned, in-progress, completed)
- Yayın durumu (draft/published)
- Başlangıç ve bitiş tarihleri
- Demo, GitHub, indirme, Play Store ve App Store bağlantıları

### Admin Paneli Özellikleri

- Proje oluşturma
- Proje düzenleme
- Proje silme
- Proje yayınlama/taslağa alma
- Görsel yükleme
- Slug yönetimi

### Genel Özellikler

- Responsive tasarım
- Dark/Light tema desteği
- SEO optimizasyonu
- Otomatik slug oluşturma
- Görsel optimizasyonu

## Teknik Detaylar

### Kullanılan Teknolojiler

- Next.js 14
- TypeScript
- MongoDB
- Tailwind CSS
- shadcn/ui

### Dosya Yapısı

```
src/
├── app/
│   ├── admin/
│   │   └── projects/
│   └── projeler/
├── components/
│   └── project/
├── lib/
├── models/
└── types/
```

### Veri Modeli

```typescript
interface Project {
  _id: string;
  title: string;
  description: string;
  summary: string;
  slug: string;
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  images: string[];
  status: ProjectStatus;
  isPublished: boolean;
  startDate?: string;
  endDate?: string;
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Ortam değişkenlerini ayarlayın:
```env
MONGODB_URI=your_mongodb_uri
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Kullanım

### Proje Oluşturma

1. Admin paneline giriş yapın
2. "Projeler" sekmesine gidin
3. "Yeni Proje" butonuna tıklayın
4. Gerekli alanları doldurun
5. "Kaydet" butonuna tıklayın

### Proje Düzenleme

1. Admin panelinde projeyi bulun
2. "Düzenle" butonuna tıklayın
3. Gerekli değişiklikleri yapın
4. "Kaydet" butonuna tıklayın

### Proje Yayınlama

1. Projeyi düzenleme modunda açın
2. "Yayınla" düğmesini kullanın
3. Değişiklikleri kaydedin

## Daha Fazla Bilgi

Daha detaylı bilgi için aşağıdaki dokümanlara bakın:

- [API Endpoints](./api-endpoints.md)
- [Veritabanı Yapısı](./database-structure.md)
- [Bileşenler](./components.md)
- [Admin Paneli](./admin-panel.md) 