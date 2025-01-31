# API Endpoints

Blog sistemi için tüm API endpoint'leri ve kullanımları.

## Base URL

```
/api/blog
```

## Endpoints

### 1. Blog Yazılarını Listele

```http
GET /api/blog
```

#### Query Parameters

| Parametre | Tip     | Açıklama                |
|-----------|---------|-------------------------|
| page      | number  | Sayfa numarası         |
| limit     | number  | Sayfa başına öğe sayısı |
| isDraft   | boolean | Taslak durumu filtresi  |
| tag       | string  | Etiket filtresi         |

#### Başarılı Yanıt

```json
{
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "excerpt": "string",
      "readingTime": "number",
      "publishedAt": "date",
      "isDraft": "boolean"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

### 2. Tek Blog Yazısı Getir

```http
GET /api/blog/{id}
```

#### Path Parameters

| Parametre | Tip    | Açıklama        |
|-----------|--------|-----------------|
| id        | string | Blog yazısı ID  |

#### Başarılı Yanıt

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "content": "string",
  "excerpt": "string",
  "readingTime": "number",
  "coverImage": "string?",
  "tags": ["string"],
  "isDraft": "boolean",
  "publishedAt": "date",
  "updatedAt": "date?",
  "author": {
    "name": "string",
    "title": "string",
    "avatarUrl": "string"
  },
  "sources": [
    {
      "title": "string",
      "url": "string",
      "description": "string?"
    }
  ],
  "seo": {
    "metaTitle": "string?",
    "metaDescription": "string?",
    "keywords": "string?",
    "canonicalUrl": "string?"
  }
}
```

### 3. Yeni Blog Yazısı Oluştur

```http
POST /api/blog
```

#### Request Body

```json
{
  "title": "string",
  "description": "string",
  "content": "string",
  "excerpt": "string",
  "readingTime": "number",
  "coverImage": "string?",
  "tags": ["string"],
  "isDraft": "boolean",
  "author": {
    "name": "string",
    "title": "string",
    "avatarUrl": "string"
  },
  "sources": [
    {
      "title": "string",
      "url": "string",
      "description": "string?"
    }
  ],
  "seo": {
    "metaTitle": "string?",
    "metaDescription": "string?",
    "keywords": "string?",
    "canonicalUrl": "string?"
  }
}
```

#### Başarılı Yanıt

```json
{
  "_id": "string",
  "message": "Blog yazısı başarıyla oluşturuldu"
}
```

### 4. Blog Yazısını Güncelle

```http
PUT /api/blog/{id}
```

#### Path Parameters

| Parametre | Tip    | Açıklama       |
|-----------|--------|----------------|
| id        | string | Blog yazısı ID |

#### Request Body

```json
{
  "title": "string?",
  "description": "string?",
  "content": "string?",
  "excerpt": "string?",
  "readingTime": "number?",
  "coverImage": "string?",
  "tags": ["string"]?,
  "isDraft": "boolean?",
  "author": {
    "name": "string?",
    "title": "string?",
    "avatarUrl": "string?"
  },
  "sources": [
    {
      "title": "string?",
      "url": "string?",
      "description": "string?"
    }
  ],
  "seo": {
    "metaTitle": "string?",
    "metaDescription": "string?",
    "keywords": "string?",
    "canonicalUrl": "string?"
  }
}
```

#### Başarılı Yanıt

```json
{
  "_id": "string",
  "message": "Blog yazısı başarıyla güncellendi"
}
```

### 5. Blog Yazısını Sil

```http
DELETE /api/blog/{id}
```

#### Path Parameters

| Parametre | Tip    | Açıklama       |
|-----------|--------|----------------|
| id        | string | Blog yazısı ID |

#### Başarılı Yanıt

```json
{
  "message": "Blog yazısı başarıyla silindi"
}
```

## Hata Yanıtları

### 400 Bad Request

```json
{
  "error": "Geçersiz istek formatı"
}
```

### 401 Unauthorized

```json
{
  "error": "Yetkilendirme başarısız"
}
```

### 404 Not Found

```json
{
  "error": "Blog yazısı bulunamadı"
}
```

### 500 Internal Server Error

```json
{
  "error": "Sunucu hatası"
}
```

## Rate Limiting

- Her IP için dakikada 100 istek
- Admin endpoint'leri için dakikada 50 istek

## Güvenlik

1. **Authentication**
   - Admin işlemleri için JWT token gerekli
   - Token `Authorization` header'ında gönderilmeli

2. **Input Validation**
   - Tüm girdiler sanitize edilir
   - XSS koruması uygulanır

3. **CORS**
   - Sadece izin verilen originler kabul edilir
   - Preflight istekleri desteklenir 