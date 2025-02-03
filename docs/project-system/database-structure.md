# Veritabanı Yapısı

Bu dokümantasyon, proje yönetim sisteminin veritabanı yapısını detaylı olarak açıklamaktadır.

## MongoDB Şeması

### Project Koleksiyonu

```typescript
const ProjectSchema = new Schema<ProjectDocument>({
  title: { 
    type: String, 
    required: true,
    maxlength: 100 
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 5000
  },
  summary: {
    type: String,
    maxlength: 150
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['MobilOyun', 'WebSite', 'PlayableAds', 'RobotikEgitim', 'Diger'],
    default: 'Diger'
  },
  technologies: [{ type: String }],
  features: [{ type: String }],
  images: [{ type: String }],
  status: { 
    type: String, 
    required: true,
    enum: ['planned', 'in-progress', 'completed'],
    default: 'planned'
  },
  isPublished: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  demoUrl: { type: String },
  githubUrl: { type: String },
  downloadUrl: { type: String },
  playStoreUrl: { type: String },
  appStoreUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date }
}, {
  timestamps: true
});
```

## Şema Açıklaması

### Temel Alanlar

| Alan | Tip | Açıklama | Zorunlu | Varsayılan |
|------|-----|----------|---------|------------|
| title | String | Proje başlığı | Evet | - |
| description | String | Proje açıklaması | Evet | - |
| summary | String | Kısa özet (max 150 karakter) | Hayır | - |
| slug | String | URL-dostu benzersiz tanımlayıcı | Evet | - |
| category | String | Proje kategorisi | Evet | 'Diger' |
| technologies | [String] | Kullanılan teknolojiler | Hayır | [] |
| features | [String] | Proje özellikleri | Hayır | [] |
| images | [String] | Proje görselleri | Hayır | [] |
| status | String | Proje durumu | Evet | 'planned' |
| isPublished | Boolean | Yayın durumu | Hayır | false |

### Tarih Alanları

| Alan | Tip | Açıklama | Zorunlu | Varsayılan |
|------|-----|----------|---------|------------|
| startDate | Date | Başlangıç tarihi | Hayır | - |
| endDate | Date | Bitiş tarihi | Hayır | - |
| createdAt | Date | Oluşturulma tarihi | Hayır | Date.now |
| updatedAt | Date | Güncellenme tarihi | Hayır | Date.now |
| publishedAt | Date | Yayınlanma tarihi | Hayır | - |

### Bağlantı Alanları

| Alan | Tip | Açıklama | Zorunlu | Varsayılan |
|------|-----|----------|---------|------------|
| demoUrl | String | Demo bağlantısı | Hayır | - |
| githubUrl | String | GitHub bağlantısı | Hayır | - |
| downloadUrl | String | İndirme bağlantısı | Hayır | - |
| playStoreUrl | String | Play Store bağlantısı | Hayır | - |
| appStoreUrl | String | App Store bağlantısı | Hayır | - |

## Enum Değerleri

### Kategori (category)

- MobilOyun
- WebSite
- PlayableAds
- RobotikEgitim
- Diger

### Durum (status)

- planned (Planlanıyor)
- in-progress (Devam Ediyor)
- completed (Tamamlandı)

## İndeksler

- `slug`: Benzersiz indeks
- `publishedAt`: Sıralama için indeks
- `category`: Filtreleme için indeks
- `status`: Filtreleme için indeks

## Middleware

### Slug Oluşturma

```typescript
ProjectSchema.pre('save', function(next) {
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase();
  }
  next();
});
```

## Örnek Belge

```json
{
  "_id": "ObjectId('...')",
  "title": "BT Öğretmeni Web Sitesi",
  "description": "Kişisel web sitem için modern ve kullanıcı dostu bir arayüz tasarımı.",
  "summary": "Modern ve kullanıcı dostu kişisel web sitesi",
  "slug": "bt-ogretmeni-web-sitesi",
  "category": "WebSite",
  "technologies": [
    "Next.js",
    "TypeScript",
    "MongoDB",
    "Tailwind CSS"
  ],
  "features": [
    "Responsive Tasarım",
    "Dark Mode",
    "Blog Sistemi",
    "Proje Yönetimi"
  ],
  "images": [
    "/projects/bt-ogretmeni/cover.jpg",
    "/projects/bt-ogretmeni/dashboard.jpg"
  ],
  "status": "completed",
  "isPublished": true,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-02-01T00:00:00.000Z",
  "demoUrl": "https://btogretmeni.com",
  "githubUrl": "https://github.com/username/bt-ogretmeni",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-02-01T00:00:00.000Z",
  "publishedAt": "2024-02-01T00:00:00.000Z"
} 