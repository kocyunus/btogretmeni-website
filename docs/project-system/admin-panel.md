# Admin Paneli

Bu dokümantasyon, proje yönetim sisteminin admin panelini detaylı olarak açıklamaktadır.

## Genel Bakış

Admin paneli, projelerin yönetilmesi için gerekli tüm işlevleri sağlayan bir arayüz sunar. Panel, aşağıdaki temel özellikleri içerir:

- Proje listesi görüntüleme
- Yeni proje oluşturma
- Mevcut projeleri düzenleme
- Proje silme
- Proje durumu yönetimi
- Görsel yükleme ve yönetimi

## Sayfa Yapısı

### Proje Listesi (/admin/projects)

```typescript
// src/app/admin/projects/page.tsx
export default function ProjectsPage() {
  // Proje listesi sayfası
}
```

- Tüm projelerin listelendiği ana sayfa
- Filtreleme ve sıralama özellikleri
- Her proje için hızlı eylemler (düzenle, sil, yayınla/taslağa al)
- Yeni proje oluşturma butonu

### Proje Düzenleme (/admin/projects/[slug])

```typescript
// src/app/admin/projects/[slug]/page.tsx
export default function EditProjectPage() {
  // Proje düzenleme sayfası
}
```

- Mevcut projeyi düzenleme formu
- Görsel yükleme arayüzü
- Kaydet ve İptal butonları
- Yayınlama durumu kontrolü

## Bileşenler

### ProjectForm

```typescript
interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  // Proje formu bileşeni
}
```

Form alanları:
- Başlık
- Açıklama
- Özet
- Kategori (dropdown)
- Teknolojiler (çoklu seçim)
- Özellikler (dinamik liste)
- Görseller (çoklu yükleme)
- Durum (dropdown)
- Tarihler (başlangıç/bitiş)
- Bağlantılar (demo, GitHub, indirme, vb.)

### ImageUploader

```typescript
interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  // Görsel yükleme bileşeni
}
```

Özellikler:
- Sürükle-bırak desteği
- Çoklu görsel yükleme
- Görsel önizleme
- Görsel sıralama
- Görsel silme

### StatusBadge

```typescript
interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Durum rozeti bileşeni
}
```

Durumlar:
- Planlanıyor (gri)
- Devam Ediyor (sarı)
- Tamamlandı (yeşil)

## Form Yönetimi

### useProjectForm Hook'u

```typescript
export function useProjectForm({ 
  initialData, 
  onSuccess 
}: UseProjectFormProps) {
  // Form state ve işleyicileri
  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error
  };
}
```

Özellikler:
- Form durumu yönetimi
- Doğrulama
- API entegrasyonu
- Hata yönetimi
- Yükleme durumu

## API Entegrasyonu

### Proje Oluşturma

```typescript
async function createProject(data: ProjectFormData) {
  const response = await fetch('/api/projeler', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

### Proje Güncelleme

```typescript
async function updateProject(slug: string, data: ProjectFormData) {
  const response = await fetch(`/api/projeler/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

## Yetkilendirme

Admin paneline erişim, middleware tarafından korunur:

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // Admin yetkilendirme kontrolü
}

export const config = {
  matcher: ['/admin/:path*']
};
```

## Görsel Yönetimi

### Yükleme İşlemi

```typescript
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  return response.json();
}
```

### Optimizasyon

- Görseller otomatik olarak optimize edilir
- Birden fazla boyut oluşturulur
- WebP formatına dönüştürülür
- CDN üzerinden sunulur

## Hata Yönetimi

- Form doğrulama hataları
- API hataları
- Yükleme hataları
- Yetkilendirme hataları

Her hata türü için uygun geri bildirim gösterilir.

## Kullanıcı Arayüzü

- Responsive tasarım
- Dark/Light tema desteği
- Klavye navigasyonu
- Erişilebilirlik standartları
- Yükleme durumu göstergeleri
- Toast bildirimleri

## En İyi Uygulamalar

1. Her değişiklik için onay al
2. Otomatik kaydetme özelliği kullan
3. Form değişikliklerini izle
4. Sayfa terk uyarıları göster
5. İşlem geçmişi tut
6. Hata ayıklama logları ekle

## Güvenlik

1. CSRF koruması
2. Rate limiting
3. Dosya türü kontrolü
4. Dosya boyutu sınırlaması
5. Yetkilendirme kontrolleri
6. Input sanitization 