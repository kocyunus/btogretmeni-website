# API Endpoints

Bu dokümantasyon, proje yönetim sisteminin API endpoints'lerini detaylı olarak açıklamaktadır.

## Genel Bilgiler

- Base URL: `/api/projeler`
- Tüm istekler JSON formatında yanıt döndürür
- Başarılı yanıtlar `success: true` içerir
- Hata yanıtları `success: false` ve `error` mesajı içerir

## Endpoints

### Tüm Projeleri Getir

```http
GET /api/projeler
```

#### Yanıt

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

### Proje Detayı Getir

```http
GET /api/projeler/{slug}
```

#### Parametreler

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| slug | string | Projenin slug değeri |

#### Yanıt

```json
{
  "success": true,
  "project": {
    // Proje detayları (yukarıdaki ile aynı yapı)
  }
}
```

### Yeni Proje Oluştur

```http
POST /api/projeler
```

#### İstek Gövdesi

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "summary": "string (max 150 char)",
  "category": "string (required)",
  "technologies": ["string"],
  "features": ["string"],
  "images": ["string"],
  "status": "string",
  "isPublished": "boolean",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "demoUrl": "string",
  "githubUrl": "string",
  "downloadUrl": "string",
  "playStoreUrl": "string",
  "appStoreUrl": "string"
}
```

#### Yanıt

```json
{
  "success": true,
  "project": {
    // Oluşturulan proje detayları
  }
}
```

### Proje Güncelle

```http
PUT /api/projeler/{slug}
```

#### Parametreler

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| slug | string | Projenin slug değeri |

#### İstek Gövdesi

```json
{
  // Güncellenecek alanlar (yukarıdaki POST isteği ile aynı yapı)
}
```

#### Yanıt

```json
{
  "success": true,
  "project": {
    // Güncellenmiş proje detayları
  }
}
```

### Proje Sil

```http
DELETE /api/projeler/{slug}
```

#### Parametreler

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| slug | string | Projenin slug değeri |

#### Yanıt

```json
{
  "success": true
}
```

## Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 400 | Geçersiz istek (örn: eksik veya hatalı parametreler) |
| 401 | Yetkisiz erişim |
| 404 | Proje bulunamadı |
| 500 | Sunucu hatası |

## Örnekler

### Yeni Proje Oluşturma Örneği

```javascript
const response = await fetch('/api/projeler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Örnek Proje',
    description: 'Bu bir örnek projedir.',
    summary: 'Kısa özet',
    category: 'WebSite',
    technologies: ['React', 'TypeScript'],
    features: ['Responsive Tasarım', 'Dark Mode'],
    isPublished: false
  })
});

const data = await response.json();
```

### Proje Güncelleme Örneği

```javascript
const response = await fetch('/api/projeler/ornek-proje', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Güncellenmiş Proje',
    isPublished: true
  })
});

const data = await response.json();
``` 