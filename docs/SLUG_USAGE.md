# Slug Kullanımı Kılavuzu

## Önemli Not

Next.js projemizde dinamik rotalar için **SADECE** `slug` parametresi kullanılmalıdır. `id` veya başka parametre isimleri kullanılmamalıdır.

## Neden Slug Kullanmalıyız?

1. **URL Tutarlılığı**: Next.js, aynı dinamik rota için farklı parametre isimleri kullanıldığında hata verir. Örneğin:
   - ✅ Doğru: `/blog/[slug]`, `/projects/[slug]`
   - ❌ Yanlış: `/blog/[slug]`, `/projects/[id]`

2. **SEO Dostu**: Sluglar, URL'lerde anlamlı kelimeler kullanarak SEO performansını artırır.
   - ✅ Doğru: `/projects/my-awesome-project`
   - ❌ Yanlış: `/projects/123456`

## Slug Kullanım Kuralları

1. **Dinamik Rotalar**:
   ```typescript
   // ✅ Doğru
   app/projects/[slug]/page.tsx
   app/blog/[slug]/page.tsx

   // ❌ Yanlış
   app/projects/[id]/page.tsx
   app/blog/[postId]/page.tsx
   ```

2. **API Rotaları**:
   ```typescript
   // ✅ Doğru
   app/api/projects/[slug]/route.ts
   app/api/blog/[slug]/route.ts

   // ❌ Yanlış
   app/api/projects/[id]/route.ts
   app/api/blog/[postId]/route.ts
   ```

3. **Veritabanı Sorguları**:
   ```typescript
   // ✅ Doğru
   const project = await Project.findOne({ slug: params.slug });

   // ❌ Yanlış
   const project = await Project.findById(params.id);
   ```

## Slug Oluşturma

Slugları oluştururken `slugify` kütüphanesini kullanın:

```typescript
import slugify from 'slugify';

const slug = slugify(title, {
  lower: true,     // Küçük harfe çevir
  strict: true,    // Özel karakterleri kaldır
  locale: 'tr'     // Türkçe karakter desteği
});
```

## Önemli Hatırlatmalar

1. Her yeni içerik oluşturulduğunda otomatik olarak slug oluşturulmalıdır.
2. Sluglar benzersiz olmalıdır.
3. URL'lerde ID yerine her zaman slug kullanılmalıdır.
4. Mevcut kodda ID kullanan yerler tespit edilip slug'a geçirilmelidir.

## Yaygın Hatalar ve Çözümleri

1. **Next.js Route Hatası**:
   ```
   Error: You cannot use different slug names for the same dynamic path
   ```
   Bu hata, aynı yapıdaki rotalarda farklı parametre isimleri kullanıldığında ortaya çıkar.
   Çözüm: Tüm dinamik rotalarda `[slug]` kullanın.

2. **MongoDB Sorgu Hatası**:
   ```typescript
   // ❌ Yanlış
   router.get('/api/projects/:id', ...)

   // ✅ Doğru
   router.get('/api/projects/:slug', ...)
   ```

## Geçiş Süreci

1. Mevcut ID kullanan rotaları tespit edin
2. Her rotayı slug kullanacak şekilde güncelleyin
3. Veritabanı sorgularını slug'a göre güncelleyin
4. Frontend linklerini slug kullanacak şekilde güncelleyin

## Kontrol Listesi

- [ ] Tüm dinamik rotalar `[slug]` kullanıyor mu?
- [ ] API rotaları slug tabanlı mı?
- [ ] Veritabanı sorguları slug kullanıyor mu?
- [ ] Frontend linkleri slug kullanıyor mu?
- [ ] Yeni içerik oluşturma süreçlerinde slug otomatik oluşturuluyor mu? 