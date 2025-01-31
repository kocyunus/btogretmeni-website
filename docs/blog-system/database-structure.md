# Veritabanı Yapısı

Blog sistemi MongoDB veritabanını kullanmaktadır. Bu dokümantasyon, veritabanı şemasını ve ilişkilerini detaylı olarak açıklar.

## Koleksiyonlar

### 1. posts

Blog yazılarının saklandığı ana koleksiyon.

```typescript
interface Post {
  _id: ObjectId;              // MongoDB tarafından otomatik oluşturulan ID
  title: string;              // Blog yazısı başlığı
  description: string;        // Kısa açıklama
  content: string;           // Blog yazısı içeriği (Markdown formatında)
  excerpt: string;           // Önizleme metni
  readingTime: number;       // Tahmini okuma süresi (dakika)
  coverImage?: string;       // Kapak görseli URL'i (opsiyonel)
  tags: string[];            // Etiketler dizisi
  isDraft: boolean;          // Taslak durumu
  publishedAt: Date;         // Yayınlanma tarihi
  updatedAt?: Date;          // Son güncelleme tarihi (opsiyonel)
  
  // Yazar bilgileri (gömülü doküman)
  author: {
    name: string;           // Yazar adı
    title: string;          // Yazar ünvanı
    avatarUrl: string;      // Profil fotoğrafı URL'i
  };
  
  // Kaynaklar (gömülü doküman dizisi)
  sources: Array<{
    title: string;          // Kaynak başlığı
    url: string;            // Kaynak URL'i
    description?: string;   // Kaynak açıklaması (opsiyonel)
  }>;
  
  // SEO meta verileri (gömülü doküman)
  seo: {
    metaTitle?: string;     // Meta başlık (opsiyonel)
    metaDescription?: string; // Meta açıklama (opsiyonel)
    keywords?: string;      // Anahtar kelimeler (opsiyonel)
    canonicalUrl?: string;  // Canonical URL (opsiyonel)
  };
}
```

### 2. tags

Etiket istatistiklerinin tutulduğu koleksiyon.

```typescript
interface Tag {
  _id: ObjectId;           // MongoDB tarafından otomatik oluşturulan ID
  name: string;            // Etiket adı
  slug: string;            // URL-friendly etiket adı
  count: number;           // Bu etiketi kullanan blog yazısı sayısı
  createdAt: Date;         // Oluşturulma tarihi
  updatedAt: Date;         // Son güncelleme tarihi
}
```

## İndeksler

### posts Koleksiyonu

```javascript
// Tekil indeksler
db.posts.createIndex({ "title": 1 });
db.posts.createIndex({ "publishedAt": -1 });
db.posts.createIndex({ "isDraft": 1 });

// Bileşik indeksler
db.posts.createIndex({ "tags": 1, "publishedAt": -1 });
db.posts.createIndex({ "isDraft": 1, "publishedAt": -1 });

// Text indeksi
db.posts.createIndex({
  "title": "text",
  "description": "text",
  "content": "text"
});
```

### tags Koleksiyonu

```javascript
// Tekil indeksler
db.tags.createIndex({ "name": 1 }, { unique: true });
db.tags.createIndex({ "slug": 1 }, { unique: true });
db.tags.createIndex({ "count": -1 });
```

## Veri Bütünlüğü

1. **Timestamps**
   - `publishedAt` ve `updatedAt` alanları otomatik olarak yönetilir
   - Mongoose timestamps özelliği kullanılır

2. **Validasyon**
   - Tüm zorunlu alanlar kontrol edilir
   - String alanlar için minimum ve maksimum uzunluk kontrolleri yapılır
   - URL'ler geçerlilik kontrolünden geçer

3. **Referans Bütünlüğü**
   - Tag silindiğinde ilgili blog yazılarından kaldırılır
   - Blog yazısı silindiğinde tag sayaçları güncellenir

## Yedekleme ve Bakım

1. **Yedekleme Stratejisi**
   ```bash
   # Günlük tam yedekleme
   mongodump --db blog --out /backup/$(date +%Y%m%d)
   
   # Artımlı yedekleme (oplog)
   mongodump --db blog --oplog --out /backup/oplog
   ```

2. **İndeks Bakımı**
   ```bash
   # İndeksleri yeniden oluştur
   db.posts.reIndex()
   db.tags.reIndex()
   ```

3. **Veri Temizliği**
   ```javascript
   // Eski taslakları temizle (30 günden eski)
   db.posts.deleteMany({
     isDraft: true,
     updatedAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
   })
   ```

## Performans İzleme

1. **Sorgu Performansı**
   ```javascript
   // Yavaş sorguları izle
   db.setProfilingLevel(1, { slowms: 100 })
   
   // Profil sonuçlarını görüntüle
   db.system.profile.find().pretty()
   ```

2. **İndeks Kullanımı**
   ```javascript
   // İndeks istatistiklerini görüntüle
   db.posts.aggregate([
     { $indexStats: {} }
   ])
   ```

## Güvenlik

1. **Erişim Kontrolü**
   - MongoDB kullanıcıları RBAC ile yönetilir
   - Her ortam için ayrı kullanıcılar tanımlanır

2. **Şifreleme**
   - Veriler disk üzerinde şifrelenmiş olarak saklanır (encryption at rest)
   - SSL/TLS ile iletişim şifrelenir (encryption in transit)

3. **Audit**
   - Veritabanı işlemleri loglanır
   - Kritik değişiklikler izlenir 