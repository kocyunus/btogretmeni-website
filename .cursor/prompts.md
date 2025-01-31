# BT Öğretmeni Prompt Şablonları

## 🔧 Teknoloji Yığını

### Son Güncelleme
*2024-01-20*

### Core Teknolojiler ve Dökümanlar

#### Next.js (v14.0.0)

- **Açıklama**: React tabanlı framework, SSR ve SSG özellikleri sunar
- **Döküman**: [Next.js Dokümantasyon](https://nextjs.org/docs)
- **GitHub**: [Next.js Repository](https://github.com/vercel/next.js)

#### React (v18.0.0)

- **Açıklama**: Kullanıcı arayüzleri oluşturmak için JavaScript kütüphanesi
- **Döküman**: [React Dokümantasyon](https://react.dev/)

#### Node.js (v20.0.0)

- **Açıklama**: JavaScript runtime, sunucu tarafı geliştirme
- **Döküman**: [Node.js Dokümantasyon](https://nodejs.org/en/docs/)

#### JavaScript

- **Açıklama**: Temel programlama dili
- **Döküman**: [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

#### CSS & Tailwind CSS

- **Açıklama**: Modern stil kütüphanesi
- **Döküman**: [Tailwind CSS Dokümantasyon](https://tailwindcss.com/docs)
- **Resmi Site**: [Tailwind CSS](https://tailwindcss.com)
- **Next-Themes**:
  - **GitHub**: [next-themes Repository](https://github.com/pacocoursey/next-themes)
  - **npm**: [next-themes Paketi](https://www.npmjs.com/package/next-themes)

#### TypeScript

- **Açıklama**: JavaScript için tip güvenliği
- **Döküman**: [TypeScript Dokümantasyon](https://www.typescriptlang.org/docs/)

#### MongoDB

- **Açıklama**: NoSQL veritabanı sistemi
- **Döküman**: [MongoDB Resmi Sürücü Belgeleri](https://www.mongodb.com/docs/drivers/)
- **Next.js Entegrasyonu**: [Next.js + MongoDB Best Practices](https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/)
- **Önemli Noktalar**:
  - MongoDB bağlantıları sadece server-side'da yapılmalı
  - Client componentlerde API routes üzerinden veri çekilmeli
  - `.env.local` dosyasında `MONGODB_URI` tanımlı olmalı
  - Development modunda hot-reload için connection pooling kullanılmalı

## 🎯 Geliştirme Prensipleri

### Son Güncelleme
*2024-01-20*

### 1. Minimalist Yaklaşım

- **Prensip**: En az kod ile en etkili çözüm
- **Kontrol Listesi**:
  - [ ] Çözüm gereksiz kod içeriyor mu?
  - [ ] Daha basit bir yaklaşım mümkün mü?
  - [ ] Performans etkileniyor mu?

### 2. Mevcut Yapıyı Koruma

- **Prensip**: Var olan sistemi bozmadan geliştirme
- **Kontrol Listesi**:
  - [ ] Mevcut fonksiyonlar etkileniyor mu?
  - [ ] Var olan API'lar değişiyor mu?
  - [ ] Geriye dönük uyumluluk korunuyor mu?

### 3. Sistematik Geliştirme Adımları

```markdown
1. Analiz
   - Problemi tanımla
   - Gereksinimleri listele
   - Kısıtlamaları belirle

2. Planlama
   - Çözüm alternatiflerini çıkar
   - En uygun yaklaşımı seç
   - Görev listesi oluştur

3. Geliştirme
   - Adım adım ilerle
   - Her adımı test et
   - Dokümantasyonu güncelle

4. Kontrol
   - Gereksinimleri karşılıyor mu?
   - Performans yeterli mi?
   - Kod kalitesi uygun mu?
```

### 4. Problem Çözme Yaklaşımı

- **Adım 1**: Problemi analiz et ve parçala
- **Adım 2**: Her parça için alternatif çözümler üret
- **Adım 3**: En basit ve etkili çözümü seç
- **Adım 4**: Test et ve optimize et

## 📝 Kullanım Talimatları

1. Bu dosyayı referans olarak kullanın
2. Teknoloji güncellemelerinde versiyonları güncelleyin
3. Yeni kaynaklar eklendikçe listeyi genişletin

## 🏷️ Prompt Etiketleri

- `#tech-stack`: Tüm teknoloji yığınını göster
- `#docs`: Sadece dökümanları listele
- `#versions`: Güncel versiyonları göster

## 🏷️ Yeni Prompt Etiketleri

- `#checklist`: Geliştirme kontrol listesini göster
- `#principles`: Geliştirme prensiplerini listele
- `#solve`: Problem çözme adımlarını göster

## 📚 Örnek Kullanım

```markdown
@cursor #tech-stack
// Tüm teknoloji yığınını gösterir

@cursor #docs
// Sadece döküman linklerini gösterir

@cursor #checklist
// Geliştirme kontrol listesini gösterir

@cursor #principles
// Geliştirme prensiplerini gösterir

@cursor #solve
// Problem çözme adımlarını gösterir
```

---
*Not: Bu şablon sürekli güncellenecektir. Yeni özellikler ve kaynaklar eklendikçe güncelleyiniz.* 