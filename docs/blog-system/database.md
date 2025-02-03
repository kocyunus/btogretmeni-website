# Veritabanı Yapısı

## MongoDB Şeması

Blog sistemi MongoDB veritabanını kullanır. Ana koleksiyon `blogposts`'tur.

### BlogPost Şeması

```typescript
{
  _id: ObjectId,            // MongoDB tarafından otomatik oluşturulur
  title: String,            // Zorunlu
  description: String,      // Zorunlu
  content: String,          // Zorunlu
  excerpt: String,          // Zorunlu
  readingTime: Number,      // Zorunlu, varsayılan: 5
  coverImage: String,       // Opsiyonel
  tags: [String],          // Varsayılan: []
  isDraft: Boolean,        // Varsayılan: true
  publishedAt: Date,       // Zorunlu
  updatedAt: Date,         // Opsiyonel
  author: {                // Zorunlu
    name: String,
    title: String,
    avatarUrl: String
  },
  sources: [{              // Opsiyonel
    title: String,
    url: String,
    description: String
  }],
  seo: {                   // Opsiyonel
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String
  }
}
```

## İndeksler

```javascript
// Performans optimizasyonu için indeksler
{
  title: 1,
  tags: 1,
  publishedAt: -1,
  isDraft: 1
}
```

## Veri Tipleri ve Doğrulama

### Zorunlu Alanlar
- `title`: Blog yazısının başlığı
- `description`: Kısa açıklama
- `content`: Markdown formatında içerik
- `excerpt`: Önizleme metni
- `readingTime`: Tahmini okuma süresi (dakika)
- `publishedAt`: Yayın tarihi
- `author`: Yazar bilgileri

### Opsiyonel Alanlar
- `coverImage`: Kapak görseli URL'i
- `tags`: Etiket dizisi
- `sources`: Kaynak bağlantıları
- `seo`: SEO meta verileri
- `updatedAt`: Son güncelleme tarihi

## Veritabanı İlişkileri

Blog sistemi bağımsız çalışacak şekilde tasarlanmıştır. Diğer koleksiyonlarla ilişki kurulmaz.

## Veri Bütünlüğü

1. **Şema Doğrulaması**
   - Mongoose şema validasyonu kullanılır
   - Zorunlu alanlar kontrol edilir
   - Veri tipleri doğrulanır

2. **Tarih İşlemleri**
   - `publishedAt`: Yeni yazı oluşturulduğunda otomatik set edilir
   - `updatedAt`: Güncelleme yapıldığında otomatik güncellenir

3. **Varsayılan Değerler**
   - `isDraft`: `true`
   - `tags`: `[]`
   - `readingTime`: `5`

## Veritabanı İşlemleri

### Okuma İşlemleri
```typescript
// Tüm blog yazılarını getir
const posts = await BlogPost.find().sort({ publishedAt: -1 });

// Tek bir blog yazısı getir
const post = await BlogPost.findById(id);

// Yayındaki yazıları getir
const publishedPosts = await BlogPost.find({ isDraft: false });
```

### Yazma İşlemleri
```typescript
// Yeni blog yazısı oluştur
const newPost = await BlogPost.create(data);

// Blog yazısını güncelle
const updatedPost = await BlogPost.findByIdAndUpdate(
  id,
  { ...data, updatedAt: new Date() },
  { new: true, runValidators: true }
);

// Blog yazısını sil
const deletedPost = await BlogPost.findByIdAndDelete(id);
```

## Performans Optimizasyonu

1. **İndeksleme**
   - Sık kullanılan sorgular için indeksler
   - Metin araması için text indeksi

2. **Sayfalama**
   - Limit ve skip kullanımı
   - Cursor bazlı sayfalama

3. **Projeksiyon**
   - Sadece gerekli alanların getirilmesi
   - Büyük alanların lazy loading'i

## Veri Yedekleme

1. **Otomatik Yedekleme**
   ```bash
   mongodump --uri="your-mongodb-uri" --out=/backup
   ```

2. **Yedekten Geri Yükleme**
   ```bash
   mongorestore --uri="your-mongodb-uri" /backup
   ```

## Güvenlik

1. **Erişim Kontrolü**
   - Admin yetkisi kontrolü
   - API rate limiting

2. **Veri Doğrulama**
   - Input sanitization
   - XSS koruması

3. **Bağlantı Güvenliği**
   - SSL/TLS kullanımı
   - Şifreli bağlantı 