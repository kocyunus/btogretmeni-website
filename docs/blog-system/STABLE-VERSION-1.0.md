# Blog Sistemi - Stabil Sürüm 1.0

Bu dokümantasyon, blog sisteminin stabil 1.0 sürümünün özelliklerini ve yapısını detaylandırmaktadır.

## Genel Bakış

Blog sistemi şu an aşağıdaki temel özelliklere sahiptir:

1. **Blog Yazıları Yönetimi**
   - Markdown formatında blog yazıları
   - Frontmatter ile meta veri desteği
   - Otomatik içe aktarma (import) sistemi
   - Tekil ve toplu yazı görüntüleme

2. **Veritabanı Entegrasyonu**
   - MongoDB bağlantısı
   - Otomatik bağlantı yönetimi
   - Hata durumu kontrolü
   - Bağlantı havuzu optimizasyonu

3. **API Endpoints**
   - Blog yazılarını listeleme (`GET /api/blog`)
   - Tekil blog yazısı görüntüleme (`GET /api/blog/[slug]`)
   - Blog yazısı ekleme (`POST /api/blog`)
   - Blog yazısı güncelleme (`PUT /api/blog/[slug]`)
   - Blog yazısı silme (`DELETE /api/blog/[slug]`)
   - Markdown import (`POST /api/blog/import`)

4. **Güvenlik Özellikleri**
   - Admin paneli yetkilendirmesi
   - API rate limiting
   - Input validasyonu
   - XSS koruması

## Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── blog/
│   │       ├── [id]/
│   │       │   └── route.ts       # Tekil blog işlemleri
│   │       ├── [slug]/
│   │       │   └── route.ts       # Tekil blog işlemleri
│   │       ├── import/
│   │       │   └── route.ts       # Markdown import
│   │       └── route.ts           # Blog liste işlemleri
│   └── blog/
│       └── [slug]/
│           └── page.tsx           # Blog detay sayfası
├── components/
│   └── blog/
│       ├── BlogCard.tsx          # Blog kartı komponenti
│       └── BlogList.tsx          # Blog listesi komponenti
├── data/
│   └── blog-posts/              # Markdown blog yazıları
├── lib/
│   ├── blog.ts                  # Blog yardımcı fonksiyonları
│   └── mongodb.ts               # MongoDB bağlantı yönetimi
└── models/
    └── BlogPost.ts              # Blog post modeli
```

## Veritabanı Şeması

```typescript
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  readingTime: number;
  coverImage?: string;
  tags: string[];
  isDraft: boolean;
  publishedAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
  sources?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalUrl: string;
  };
}
```

## Markdown Blog Yazısı Formatı

```markdown
---
title: "Blog Yazısı Başlığı"
description: "Blog yazısının kısa açıklaması"
excerpt: "Blog yazısının ön izleme metni"
readingTime: 5
publishedAt: "2024-02-14"
tags:
  - "Tag1"
  - "Tag2"
author:
  name: "Yazar Adı"
  title: "Yazar Ünvanı"
  avatarUrl: "/images/avatar.jpg"
---

# Blog Yazısı İçeriği

Markdown formatında yazı içeriği...
```

## Güvenlik Önlemleri

1. **Veritabanı Güvenliği**
   - Blog yazılarının toplu silinmesi engellendi
   - Import işleminde var olan yazılar korunuyor
   - Admin paneli erişimi token ile korunuyor

2. **API Güvenliği**
   - Rate limiting uygulandı
   - Input validasyonu yapılıyor
   - XSS koruması aktif

## Bilinen Sınırlamalar

1. Blog yazıları şu an sadece markdown formatında destekleniyor
2. Resim yükleme özelliği henüz eklenmedi
3. Yorum sistemi henüz implement edilmedi
4. Etiket bazlı filtreleme henüz eklenmedi

## Gelecek Özellikler İçin Notlar

Yeni özellikler eklerken aşağıdaki noktalara dikkat edilmeli:

1. **Veritabanı Değişiklikleri**
   - Mevcut şemayı bozmadan yeni alanlar eklenebilir
   - Var olan alanların tipleri değiştirilmemeli
   - Yeni koleksiyonlar eklenebilir

2. **API Değişiklikleri**
   - Mevcut endpoint'lerin davranışları değiştirilmemeli
   - Yeni özellikler için yeni endpoint'ler oluşturulmalı
   - Versiyon kontrolü eklenebilir (örn: /api/v1/blog)

3. **Frontend Değişiklikleri**
   - Mevcut komponentler korunmalı
   - Yeni özellikler için yeni komponentler oluşturulmalı
   - Stil değişiklikleri tema sistemi üzerinden yapılmalı

## Test Etme

Yeni bir özellik eklemeden önce:

1. Development ortamında test:
```bash
npm run dev
curl http://localhost:3000/api/blog
```

2. Blog yazısı import testi:
```bash
curl -X POST http://localhost:3000/api/blog/import
```

3. Vercel deployment testi:
- Development branch'ine push
- Preview deployment kontrolü
- Production'a merge

## Deployment

Şu anki deployment yapılandırması:

1. **Vercel**
   - Auto deployment aktif
   - Environment variables tanımlı
   - MongoDB bağlantısı stabil
   - Domain ve SSL ayarları tamam

2. **MongoDB Atlas**
   - Production cluster aktif
   - Backup sistemi kurulu
   - Network access kısıtlamaları aktif
   - Performance monitoring aktif 