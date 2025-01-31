# Vercel Deployment Süreci ve Yapılandırma

## 1. Environment Variables (Ortam Değişkenleri)

### MongoDB Bağlantısı
```env
MONGODB_URI=mongodb+srv://yunus:yunus123db@cluster0.mfdje.mongodb.net/?retryWrites=true&w=majority
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://yunus:yunus123db@cluster0.mfdje.mongodb.net/?retryWrites=true&w=majority
```

### Admin Bilgileri
```env
ADMIN_TOKEN=admin123token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=gizli-jwt-anahtari-buraya-yazilacak
```

### Email Ayarları
```env
EMAIL_USER=kocyns1@gmail.com
EMAIL_PASS=baugqnttqkrbzwjt
```

## 2. Build Ayarları

### next.config.js Yapılandırması
```javascript
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['dummyimage.com'],
  }
};
```

## 3. Deployment Adımları

1. GitHub'a kod push edilir
2. Vercel otomatik olarak değişiklikleri algılar
3. Build süreci başlar:
   - `npm install` - Bağımlılıklar yüklenir
   - `npm run build` - Next.js build işlemi yapılır
   - Environment variables kontrol edilir
   - Statik dosyalar oluşturulur

## 4. Sık Karşılaşılan Hatalar ve Çözümleri

### MongoDB Bağlantı Hatası
```
Error: MongoDB bağlantı bilgisi eksik. Lütfen .env dosyasını kontrol edin.
```
**Çözüm:** Vercel'de environment variables'ların doğru ayarlandığından emin olun.

### Build Hataları
```
Error: Command "npm run build" exited with 1
```
**Çözüm:** 
1. Local'de build'i test edin
2. Environment variables'ları kontrol edin
3. Bağımlılıkları güncelleyin

## 5. Performans Optimizasyonları

1. **Statik Sayfa Optimizasyonu**
   - getStaticProps kullanımı
   - Incremental Static Regeneration (ISR)

2. **Image Optimizasyonu**
   - next/image kullanımı
   - Uygun format ve boyutlar

3. **Cache Stratejisi**
   - CDN cache
   - Static page cache
   - API route cache

## 6. Güvenlik Ayarları

1. **Headers**
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options

2. **API Rate Limiting**
   - IP bazlı limit
   - Token bazlı limit

## 7. Monitoring ve Logging

1. **Vercel Analytics**
   - Sayfa görüntülenmeleri
   - Performans metrikleri
   - Hata takibi

2. **Custom Logging**
   - API hataları
   - Authentication hataları
   - Database işlemleri

## 8. CI/CD Pipeline

1. GitHub'a push
2. Otomatik deployment trigger
3. Environment variable kontrolü
4. Build ve test
5. Production deployment

## 9. Domain ve SSL Ayarları

1. Custom domain ekleme
2. SSL sertifikası
3. DNS ayarları
4. Redirect kuralları

## 10. Maintenance ve Backup

1. Database yedekleme
2. Log rotasyonu
3. Dependency güncelleme
4. Security patch'leri 