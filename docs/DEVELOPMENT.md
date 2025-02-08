# Geliştirici Kılavuzu

## Geliştirme Ortamı Kurulumu

### Gereksinimler
- Node.js v20+
- MongoDB veritabanı
- Git

### Kurulum Adımları
1. Repoyu klonlayın
```bash
git clone <repo-url>
cd mywebsite
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. Environment variables dosyasını oluşturun
```bash
cp .env.example .env
```

4. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

## Yeni Özellik Geliştirme

### Yeni Sayfa Ekleme
1. `src/app` altında yeni klasör oluştur
2. `page.tsx` dosyası ekle
3. Navigasyon menüsüne link ekle

### Stil Ekleme
1. Tailwind class'ları kullan
2. Özel stiller için CSS modülleri oluştur
3. Global stiller için globals.css'i güncelle

### Komponent Ekleme
1. `src/components` altında yeni dosya oluştur
2. TypeScript interface'leri tanımla
3. Komponenti export et
4. Gerekli yerlerde import et

## Performans Optimizasyonları

### Görüntü Optimizasyonu
- Next.js Image komponenti kullanımı
- Lazy loading
- Otomatik boyutlandırma

### Kod Optimizasyonu
- Route-based code splitting
- Component-level code splitting
- Tree shaking

### Stil Optimizasyonu
- Tailwind CSS purge
- CSS modülleri
- Minimal CSS bundle

## Deployment

### Vercel Deployment
1. Vercel hesabı oluştur
2. GitHub reposunu bağla
3. Environment variables ayarla
4. Build ve deploy

### Manuel Deployment
1. Üretim derlemesi
```bash
npm run build
```

2. Üretim sunucusu başlatma
```bash
npm start
```

## Monitoring ve Logging

### Hata Takibi
- Error boundary kullanımı
- Hata loglama sistemi
- Kullanıcı dostu hata sayfaları

### Audit Logging
- Admin işlemlerinin loglanması
- Güvenlik logları
- Performans metrikleri

## Troubleshooting

### Sık Karşılaşılan Sorunlar

1. **next-themes modülü hataları**
   - Çözüm: `.next` klasörünün temizlenmesi ve bağımlılıkların yeniden yüklenmesi
   ```bash
   rm -rf .next
   npm install
   ```

2. **MongoDB bağlantı hataları**
   - Connection string kontrolü
   - Environment variables doğrulama
   - MongoDB servisinin çalıştığından emin olma

3. **Image optimizasyon hataları**
   - next.config.js ayarlarının kontrolü
   - Image domain whitelist kontrolü

### Debug Araçları
- Next.js development tools
- MongoDB Compass
- Chrome DevTools
- React Developer Tools

## Test

### Unit Testler
```bash
npm run test
```

### E2E Testler
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
``` 