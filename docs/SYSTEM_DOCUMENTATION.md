# BT Öğretmeni Web Sitesi Sistem Dokümantasyonu

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Geliştirme Standartları](#geliştirme-standartları)
3. [Teknoloji Stack](#teknoloji-stack)
4. [Proje Yapısı](#proje-yapısı)
5. [Bileşenler](#bileşenler)
6. [Admin Paneli](#admin-paneli)
7. [Blog Sistemi](#blog-sistemi)
8. [API Endpoints](#api-endpoints)
9. [Veritabanı Yapısı](#veritabanı-yapısı)
10. [Deployment Süreci](#deployment-süreci)
11. [Güvenlik](#güvenlik)
12. [Monitoring ve Logging](#monitoring-ve-logging)
13. [Oyun Şablonu](#oyun-şablonu)
14. [API Yapısı](#api-yapısı)
15. [Tema Sistemi](#tema-sistemi)

## Genel Bakış

BT Öğretmeni web sitesi, modern web teknolojileri kullanılarak geliştirilmiş bir eğitim platformudur. Site, blog yazıları, eğitim içerikleri ve interaktif kodlama oyunları sunmaktadır.

## Geliştirme Standartları

### 1. Yazar Bilgileri Standardı
```typescript
const defaultAuthor = {
  name: "Yunus Koç",
  title: "BT Öğretmeni",
  avatarUrl: "/images/avatar.jpg"
};
```

### 2. Route Parametreleri
- Tüm dinamik route'larda sadece `id` parametresi kullanılacak
- `postId`, `userId` gibi özel isimler KULLANILMAYACAK
- Örnek: `[id]/page.tsx`

### 3. SEO Standartları
1. Meta Başlık: Blog yazısının başlığı
2. Meta Açıklama: Blog yazısının açıklaması
3. Anahtar Kelimeler: Blog etiketleri virgülle ayrılmış şekilde
4. Canonical URL: Blog yazısının benzersiz URL'i

### 4. Görsel Standartları
1. Kapak görseli boyutları: 1200x630 piksel
2. Varsayılan gradient renkleri: from-blue-500 to-purple-600
3. Avatar görseli: 40x40 piksel, yuvarlak

### 5. Otomatik Kaydetme
1. Her değişiklik 1 saniye sonra otomatik kaydedilmeli
2. Local storage'a kaydedilmeli
3. Kullanıcıya kayıt durumu gösterilmeli

## Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Stil**: Tailwind CSS, next-themes (karanlık/aydınlık mod)
- **Backend**: Next.js API Routes
- **Veritabanı**: MongoDB
- **Deployment**: Vercel

## Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── blog/              # Blog sayfaları
│   ├── egitim/           # Eğitim sayfaları
│   └── admin/            # Admin paneli
├── components/            # React bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
└── styles/               # CSS stilleri
```

## Bileşenler

### Proje Listesi Bileşenleri

#### ProjectList

```typescript
export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (projects.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
```

#### ProjectCard

```typescript
interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projeler/${project.slug}`}>
      <div className="bg-card hover:bg-card/90 rounded-xl p-6">
        {project.images?.[0] && (
          <Image
            src={project.images[0]}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <div className="mt-4">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <span className="text-sm text-muted-foreground">
            {project.category}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {project.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <StatusBadge status={project.status} className="mt-4" />
      </div>
    </Link>
  );
}
```

### Yardımcı Bileşenler

#### StatusBadge

```typescript
interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800'
  };

  const labels = {
    planned: 'Planlanıyor',
    'in-progress': 'Devam Ediyor',
    completed: 'Tamamlandı'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[status],
      className
    )}>
      {labels[status]}
    </span>
  );
}
```

## Admin Paneli

### Genel Özellikler

- Proje listesi görüntüleme
- Yeni proje oluşturma
- Mevcut projeleri düzenleme
- Proje silme
- Proje durumu yönetimi
- Görsel yükleme ve yönetimi

### Form Yönetimi

```typescript
interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form alanları */}
      </form>
    </Form>
  );
}
```

### Görsel Yönetimi

```typescript
interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const onDrop = useCallback(async (files: File[]) => {
    // Görsel yükleme işlemi
  }, [onChange]);

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Görselleri sürükleyin veya seçin</p>
      </div>
      {/* Görsel önizleme */}
    </div>
  );
}
```

## Blog Sistemi

### Genel Özellikler
1. Blog Yazıları Yönetimi
   - Markdown formatında blog yazıları
   - Frontmatter ile meta veri desteği
   - Otomatik içe aktarma sistemi
   - Tekil ve toplu yazı görüntüleme

2. Veritabanı Entegrasyonu
   - MongoDB bağlantısı
   - Otomatik bağlantı yönetimi
   - Hata durumu kontrolü
   - Bağlantı havuzu optimizasyonu

### Blog Post Şeması
```typescript
interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}
```

### Blog API Endpoints

```http
# Blog yazılarını listele
GET /api/blog

# Tek bir blog yazısı getir
GET /api/blog/[slug]

# Blog yazısı ara
GET /api/blog/search?q=arama-terimi

# Blog yazısı oluştur (Admin)
POST /api/blog

# Blog yazısı güncelle (Admin)
PUT /api/blog/[slug]

# Blog yazısı sil (Admin)
DELETE /api/blog/[slug]
```

## API Endpoints

### Proje API

#### Tüm Projeleri Getir

```http
GET /api/projeler
```

Yanıt:
```json
{
  "success": true,
  "projects": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "summary": "string",
      "slug": "string",
      "category": "MobilOyun | WebSite | PlayableAds | RobotikEgitim | Diger",
      "technologies": ["string"],
      "features": ["string"],
      "images": ["string"],
      "status": "planned | in-progress | completed",
      "isPublished": "boolean",
      "startDate": "string (ISO date)",
      "endDate": "string (ISO date)",
      "demoUrl": "string",
      "githubUrl": "string",
      "downloadUrl": "string",
      "playStoreUrl": "string",
      "appStoreUrl": "string",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)",
      "publishedAt": "string (ISO date)"
    }
  ]
}
```

#### Proje Detayı Getir

```http
GET /api/projeler/{slug}
```

#### Yeni Proje Oluştur

```http
POST /api/projeler
```

#### Proje Güncelle

```http
PUT /api/projeler/{slug}
```

#### Proje Sil

```http
DELETE /api/projeler/{slug}
```

## Veritabanı Yapısı

### Project Şeması

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
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});
```

### İndeksler

```javascript
// Blog indeksleri
{
  slug: 1,  // Benzersiz indeks
  tags: 1,  // Arama için indeks
  publishedAt: -1  // Sıralama için indeks
}

// Proje indeksleri
{
  slug: 1,  // Benzersiz indeks
  category: 1,  // Filtreleme için indeks
  status: 1,  // Filtreleme için indeks
  isPublished: 1  // Yayın durumu için indeks
}
```

## Deployment Süreci

### Environment Variables
```env
# MongoDB Bağlantısı
MONGODB_URI=your-mongodb-connection-string
NEXT_PUBLIC_MONGODB_URI=your-mongodb-connection-string

# Admin Bilgileri
ADMIN_TOKEN=your-admin-token
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=your-jwt-secret-key

# Email Ayarları
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

# Vercel URL
VERCEL_URL=your-vercel-url
NEXT_PUBLIC_API_URL=your-api-url
```

### Sık Karşılaşılan Hatalar ve Çözümleri

1. MongoDB Bağlantı Hatası
```
Error: MongoDB bağlantı bilgisi eksik
```
**Çözüm:** 
- Vercel'de environment variables'ların doğru ayarlandığından emin olun
- MongoDB URI'nin geçerli olduğunu kontrol edin
- IP whitelist ayarlarını kontrol edin

2. Build Hataları
```
Error: Command "npm run build" exited with 1
```
**Çözüm:** 
- Local'de build'i test edin
- Environment variables'ları kontrol edin
- Bağımlılıkları güncelleyin
- TypeScript hatalarını düzeltin

3. API Endpoint Hataları
```
Error: Failed to fetch API endpoint
```
**Çözüm:**
- API URL'lerinin doğru yapılandırıldığından emin olun
- CORS ayarlarını kontrol edin
- Rate limiting ayarlarını kontrol edin

4. Eğitim İçerikleri Görüntülenme Hataları
```
Error: Eğitim içerikleri yüklenemedi
```
**Çözüm:**
- API endpoint'in doğru çalıştığından emin olun
- MongoDB bağlantısını kontrol edin
- Cache ayarlarını kontrol edin:
```typescript
const response = await fetch(`${baseUrl}/api/egitim`, {
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
  },
  next: { revalidate: 0 }
});
```

### Deployment Kontrol Listesi

1. Environment Variables
- [ ] MongoDB URI ayarlandı
- [ ] API URL'leri yapılandırıldı
- [ ] Admin bilgileri tanımlandı
- [ ] JWT Secret key ayarlandı

2. Build Öncesi Kontroller
- [ ] TypeScript hataları giderildi
- [ ] Lint hataları düzeltildi
- [ ] Test suite çalıştırıldı
- [ ] Local build test edildi

3. Deployment Sonrası Kontroller
- [ ] API endpoints çalışıyor
- [ ] MongoDB bağlantısı aktif
- [ ] Eğitim içerikleri görüntüleniyor
- [ ] Cache mekanizması doğru çalışıyor

## Monitoring ve Logging

1. **Vercel Analytics**
- Sayfa görüntülenmeleri
- Performans metrikleri
- Hata takibi

2. **Custom Logging**
- API hataları
- Authentication hataları
- Database işlemleri

## Güvenlik

1. **API Güvenliği**
- Rate limiting
- CORS yapılandırması
- Input validasyonu

2. **Veritabanı Güvenliği**
- MongoDB connection string güvenliği
- Şifreleme (at rest & in transit)
- Yedekleme stratejisi

3. **Admin Paneli**
- JWT tabanlı kimlik doğrulama
- Role-based access control
- Session yönetimi

## Bakım ve İzleme

1. **Performans İzleme**
- Vercel Analytics
- MongoDB performans metrikleri
- Error tracking

2. **Yedekleme**
- Günlük veritabanı yedekleri
- Dosya sistemi yedekleri

3. **Güncelleme Süreci**
- Dependency updates
- Security patches
- Feature updates 

## Oyun Şablonu

Platformdaki tüm eğitsel oyunlar için standart bir şablon kullanılır. Bu şablon üç ana bölümden oluşur:

### 1. Üst Alan - Seviyeler
- Grid yapısında seviye kartları
- Kilit sistemi ve ilerleme takibi
- Her seviye için başlık, açıklama ve durum

### 2. Sol Panel - Bilgi Alanı (1/5)
- Aktif seviye bilgisi
- Kullanılabilir komutlar
- İpuçları ve yönlendirmeler

### 3. Sağ Alan - Oyun Alanı (4/5)
- Ana oyun içeriği
- Etkileşimli arayüz
- Oyun motoru entegrasyonu

Detaylı bilgi için: [Oyun Şablonu Dokümantasyonu](GAME_TEMPLATE.md)

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
```

## Tema Sistemi
- Koyu/açık tema desteği
- Responsive tasarım
- Tutarlı renk şeması

### Tema Değişkenleri
```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
}

.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --card: hsl(222.2 84% 4.9%);
  --card-foreground: hsl(210 40% 98%);
  --primary: hsl(210 40% 98%);
  --primary-foreground: hsl(222.2 47.4% 11.2%);
}
``` 