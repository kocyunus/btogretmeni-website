# Geliştirme Kuralları ve Standartları

## 1. Yazar Bilgileri Standardı

Tüm blog yazılarında yazar bilgileri aşağıdaki şekilde olmalıdır:

```typescript
const defaultAuthor = {
  name: "Yunus Koç",
  title: "BT Öğretmeni",
  avatarUrl: "/images/avatar.jpg"
};
```

### Önemli Noktalar:
- Yazar adı her zaman "Yunus Koç" olarak kullanılmalı
- Unvan her zaman "BT Öğretmeni" olarak kalmalı
- Avatar URL'i `/images/avatar.jpg` olarak sabit kalmalı

### Uygulama Yerleri:
1. MongoDB şemasında (src/models/BlogPost.ts)
2. API route'larında (src/app/api/blog/route.ts)
3. Blog yazısı oluşturma sayfasında (src/app/admin/blog/new/page.tsx)
4. Blog detay sayfasında (src/app/blog/[id]/page.tsx)

## 2. Route Parametreleri

Next.js route'larında parametre isimlendirmesi için kurallar:

1. Tüm dinamik route'larda sadece `id` parametresi kullanılacak
2. `postId`, `userId` gibi özel isimler KULLANILMAYACAK
3. Örnek kullanımlar:
   - ✅ `[id]/page.tsx`
   - ❌ `[postId]/page.tsx`
   - ❌ `[userId]/page.tsx`

## 3. Veritabanı Şeması

Blog yazıları için MongoDB şeması aşağıdaki standartlara uymalıdır:

```typescript
const blogPostSchema = {
  title: String,        // Zorunlu
  description: String,  // Zorunlu
  content: String,      // Zorunlu
  excerpt: String,      // Zorunlu
  readingTime: Number,  // Zorunlu
  coverImage: String,   // Zorunlu, varsayılan değer var
  tags: [String],       // Opsiyonel, varsayılan boş array
  isDraft: Boolean,     // Opsiyonel, varsayılan false
  author: AuthorSchema, // Zorunlu, varsayılan değerler var
  sources: [SourceSchema], // Opsiyonel
  seo: SEOSchema       // Opsiyonel, otomatik doldurulur
}
```

## 4. SEO Standartları

SEO bilgileri aşağıdaki kurallara göre otomatik oluşturulmalıdır:

1. Meta Başlık: Blog yazısının başlığı
2. Meta Açıklama: Blog yazısının açıklaması
3. Anahtar Kelimeler: Blog etiketleri virgülle ayrılmış şekilde
4. Canonical URL: Blog yazısının benzersiz URL'i

## 5. Otomatik Kaydetme

Blog yazısı düzenleme/oluşturma sayfalarında:

1. Her değişiklik 1 saniye sonra otomatik kaydedilmeli
2. Local storage'a kaydedilmeli
3. Kullanıcıya kayıt durumu gösterilmeli

## 6. Görsel Standartları

1. Kapak görseli boyutları: 1200x630 piksel
2. Varsayılan gradient renkleri: from-blue-500 to-purple-600
3. Avatar görseli: 40x40 piksel, yuvarlak

## 7. Güvenlik Kuralları

1. Markdown içeriği güvenli şekilde render edilmeli
2. API rotaları gerektiğinde yetkilendirme kontrolü yapmalı
3. Kullanıcı girdileri temizlenmeli ve doğrulanmalı

## 8. Performans Kuralları

1. Görsel optimizasyonları Next.js Image komponenti ile yapılmalı
2. Sayfa yüklenirken uygun loading state'leri gösterilmeli
3. API çağrıları için error boundary'ler kullanılmalı

Bu standartlar projenin tutarlı ve bakımı kolay olmasını sağlar. Herhangi bir değişiklik yapmadan önce bu dokümana başvurulmalıdır.

## Örnekler

```typescript
// ✅ Doğru Kullanım
export default function BlogPost({ params }: { params: { id: string } }) {
  // ...
}

// ❌ Yanlış Kullanım
export default function BlogPost({ params }: { params: { postId: string } }) {
  // ...
}
```

## API Route'ları

API route'larında da aynı kural geçerli:

```typescript
// ✅ Doğru Kullanım
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // ...
}

// ❌ Yanlış Kullanım
export async function GET(request: Request, { params }: { params: { postId: string } }) {
  // ...
}
```

## Klasör Yapısı

Dinamik route'lar için klasör isimlendirmesi:

```
✅ Doğru:
/blog/[id]
/users/[id]
/products/[id]

❌ Yanlış:
/blog/[postId]
/users/[userId]
/products/[productId]
```

## Veritabanı Sorguları

Veritabanı sorgularında da tutarlı ID kullanımı:

```typescript
// ✅ Doğru Kullanım
const post = await BlogPost.findById(id);

// ❌ Yanlış Kullanım
const post = await BlogPost.findOne({ postId: id });
```

## Genel Kurallar

1. Her zaman tekil `id` kullanın
2. ID'yi açıklayıcı yapmak için değişken isimlerini kullanın
3. Route parametrelerinde asla özel isimler kullanmayın
4. Tüm CRUD operasyonlarında aynı `id` parametresini kullanın

Bu kurallar, kodun tutarlı ve bakımı kolay olmasını sağlar. 
