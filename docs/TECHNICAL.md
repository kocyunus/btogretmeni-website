# Teknik Dokümantasyon

## 🎨 Tema Sistemi

### Kullanılan Teknolojiler
- **Next.js**: v15.1.6
- **next-themes**: Tema yönetimi için
- **Tailwind CSS**: Stil ve dark mode desteği
- **PostCSS**: CSS işleme ve derleme

### Tema Sistemi Yapısı

#### 1. Tema Sağlayıcı (ThemeProvider)
```tsx
// src/components/theme-provider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### 2. Tema Değiştirici (ThemeToggle)
```tsx
// src/components/theme-toggle.tsx
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Tema değiştirme mantığı
}
```

#### 3. CSS Yapılandırması
```css
/* src/app/globals.css */
@layer base {
  :root {
    --background: theme('colors.white');
    --foreground: theme('colors.gray.900');
  }

  :root[class~="dark"] {
    --background: theme('colors.gray.900');
    --foreground: theme('colors.gray.100');
  }
}
```

### Tema Değişimi Nasıl Çalışır?

1. **Başlangıç**:
   - ThemeProvider layout.tsx içinde tanımlanır
   - Sistem teması varsayılan olarak kullanılır
   - `enableSystem: false` ile manuel kontrol sağlanır

2. **Tema Değiştirme**:
   - Kullanıcı butona tıklar
   - `setTheme()` fonksiyonu çağrılır
   - HTML'e tema class'ı eklenir/çıkarılır
   - CSS değişkenleri güncellenir

3. **Kalıcı Depolama**:
   - Tema tercihi localStorage'da saklanır
   - Sayfa yenilendiğinde tercih korunur

### Yapılandırma Dosyaları

#### Tailwind Yapılandırması
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
}
```

#### PostCSS Yapılandırması
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### VS Code Entegrasyonu

#### Ayarlar
```json
// .vscode/settings.json
{
  "css.validate": false,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Debug ve Geliştirme

1. **Debug Göstergesi**:
   ```css
   .theme-debug::after {
     content: attr(data-theme);
     /* Debug stil ayarları */
   }
   ```

2. **Log Sistemi**:
   ```typescript
   const logThemeChange = (message: string, data?: any) => {
     console.log(`🎨 [Tema Log] ${message}`, data);
   };
   ```

### Performans Optimizasyonları

1. **Geçiş Animasyonları**:
   ```css
   .theme-transition {
     @apply transition-colors duration-300;
   }
   ```

2. **Hydration Koruması**:
   ```tsx
   <html suppressHydrationWarning>
   ```

### Bilinen Sınırlamalar
- İlk yüklemede kısa bir FOUC (Flash of Unstyled Content) olabilir
- Sistem teması değişikliklerinde manuel güncelleme gerekebilir

### Gelecek Geliştirmeler
- [ ] Tema geçiş animasyonlarının iyileştirilmesi
- [ ] Özel tema renkleri desteği
- [ ] Sistem teması ile otomatik senkronizasyon
- [ ] Tema değişim API'si

### İyileştirmeler ve En İyi Uygulamalar

#### Mühendislik İyileştirmeleri
1. **ThemeProvider Optimizasyonu**:
   ```tsx
   <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem={true}
     storageKey="bt-theme"
   >
   ```
   - Sistem temasını varsayılan olarak kullan
   - Sistem tema değişikliklerini otomatik takip et
   - Özel storage key ile tema tercihini sakla

2. **Performans İyileştirmeleri**:
   - FOUC Önleme:
     ```tsx
     // pages/_document.tsx
     <script
       dangerouslySetInnerHTML={{
         __html: `
           try {
             if (localStorage.getItem('bt-theme') === 'dark' || 
                (!localStorage.getItem('bt-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
               document.documentElement.classList.add('dark')
             }
           } catch (e) {}
         `
       }}
     />
     ```
   - Lazy Loading ve Code Splitting kullan
   - Tema değişimlerini throttle/debounce ile optimize et

#### Kullanıcı Deneyimi İyileştirmeleri
1. **Yumuşak Geçişler**:
   ```css
   /* globals.css */
   @layer components {
     .theme-transition {
       @apply transition-all duration-300 ease-in-out;
     }
   }
   ```

2. **Görsel Feedback**:
   ```tsx
   const ThemeToggle = () => {
     const { theme, setTheme } = useTheme();
     const [isChanging, setIsChanging] = useState(false);

     const handleThemeChange = () => {
       setIsChanging(true);
       setTheme(theme === 'dark' ? 'light' : 'dark');
       setTimeout(() => setIsChanging(false), 300);
     };

     return (
       <button 
         onClick={handleThemeChange}
         className={`theme-toggle ${isChanging ? 'animate-spin' : ''}`}
       >
         {/* ... */}
       </button>
     );
   };
   ```

3. **Erişilebilirlik İyileştirmeleri**:
   ```tsx
   <button
     onClick={handleThemeChange}
     aria-label={`Temayı ${theme === 'dark' ? 'aydınlık' : 'karanlık'} moda geçir`}
     title="Tema değiştir"
   >
   ```

### Sistem Entegrasyonu İçin Kontrol Listesi
1. **Yeni Özellik Eklerken**:
   - [ ] Mevcut tema değişkenlerini kontrol et
   - [ ] Dark/Light mode için renkleri test et
   - [ ] Geçiş animasyonlarını doğrula
   - [ ] Erişilebilirlik kontrolü yap

2. **Performans Kontrolleri**:
   - [ ] FOUC kontrolü
   - [ ] Tema değişim hızı testi
   - [ ] Memory leak kontrolü
   - [ ] Bundle size etkisi analizi

3. **Kullanıcı Deneyimi Testleri**:
   - [ ] Farklı cihazlarda test
   - [ ] Farklı tarayıcılarda test
   - [ ] Bağlantı hızı testleri
   - [ ] A11y kontrolleri

### Tema Entegrasyon Sorunları ve Çözümleri

#### Sayfa Bazlı Tema Entegrasyonu
1. **Tema Değişkenlerinin Doğru Uygulanması**:
   ```tsx
   // src/app/[page]/page.tsx
   'use client';
   
   const Page = () => {
     return (
       <div className="bg-background text-foreground min-h-screen">
         {/* Sayfa içeriği */}
       </div>
     );
   };
   ```

2. **Tema Geçiş Sınıflarının Eklenmesi**:
   ```css
   /* Her sayfanın ana container'ına eklenecek */
   .theme-aware-container {
     @apply bg-background text-foreground transition-colors duration-300;
   }
   ```

3. **Sayfa Bileşenlerinin Tema Uyumluluğu**:
   ```tsx
   // Örnek bileşen
   const ThemedComponent = () => {
     return (
       <div className="theme-aware-container">
         <h1 className="text-foreground">Başlık</h1>
         <p className="text-foreground/80">İçerik</p>
         {/* Diğer içerikler */}
       </div>
     );
   };
   ```

#### Kontrol Listesi - Tema Entegrasyonu
1. **Sayfa Kontrolü**:
   - [ ] Sayfanın 'use client' direktifini içerdiğinden emin ol
   - [ ] Ana container'da tema class'larının kullanıldığını kontrol et
   - [ ] Tüm metin ve arka plan renklerinin tema değişkenlerini kullandığını doğrula

2. **Bileşen Kontrolü**:
   - [ ] Bileşenlerin tema değişkenlerini kullandığını kontrol et
   - [ ] Geçiş animasyonlarının doğru çalıştığını test et
   - [ ] Özel stil tanımlarının tema uyumlu olduğunu doğrula

3. **Test Adımları**:
   - [ ] Tema değişimini test et
   - [ ] Sayfa yenilemede tema tercihinin korunduğunu kontrol et
   - [ ] Farklı ekran boyutlarında tema uyumluluğunu test et

#### Yaygın Sorunlar ve Çözümleri
1. **Tema Değişiminin Sayfalara Yansımaması**:
   - Sorun: Sayfalar tema değişikliğini algılamıyor
   - Çözüm: 'use client' direktifini ekle ve tema class'larını kullan

2. **Geçiş Animasyonlarının Çalışmaması**:
   - Sorun: Tema değişiminde ani geçişler oluyor
   - Çözüm: theme-transition class'ını ana container'a ekle

3. **Özel Bileşenlerde Tema Sorunları**:
   - Sorun: Özel bileşenler tema renklerini kullanmıyor
   - Çözüm: Tailwind tema değişkenlerini (@apply) kullan

### Metin Renkleri ve Tema Desteği

#### Renk Değişkenleri
```css
/* tailwind.config.js */
colors: {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
}
```

#### En İyi Uygulamalar
1. **Temel Metin Renkleri**:
   ```tsx
   // Doğru Kullanım ✅
   className="text-foreground"         // Ana metin
   className="text-foreground/80"      // İkincil metin
   className="text-foreground/60"      // Üçüncül metin

   // Yanlış Kullanım ❌
   className="text-gray-300"           // Sabit renk
   className="text-white"              // Sabit renk
   ```

2. **Tema Duyarlı Bileşenler**:
   ```tsx
   className="bg-gray-800/20 dark:bg-gray-800/50"  // Arka plan
   className="border-gray-200/20 dark:border-gray-700/50"  // Kenarlık
   ```

3. **Erişilebilirlik İçin Kontrast**:
   ```tsx
   // Ana başlıklar
   className="text-foreground font-bold"
   
   // Alt başlıklar
   className="text-foreground/80 font-medium"
   
   // Açıklamalar
   className="text-foreground/60"
   ```

#### Kontrol Listesi
- [ ] Sabit renk kodları yerine tema değişkenleri kullan
- [ ] Metin opaklıklarını hiyerarşi için kullan (100%, 80%, 60%)
- [ ] Her iki temada kontrast oranlarını kontrol et
- [ ] Özel durumlar için dark: önekini kullan

## 👤 Hakkımda Sayfası

### Sayfa Yapısı
```tsx
// src/app/hakkimda/page.tsx
'use client';

import React from 'react';

export default function HakkimdaPage() {
  // Sayfa bileşeni
}
```

### Özellikler ve Bileşenler

1. **Sayfa Düzeni**:
   - Responsive tasarım
   - Dark mode desteği
   - Özelleştirilmiş tipografi
   - Hiyerarşik metin yapısı

2. **Stil Özellikleri**:
   - Tailwind CSS ile stillendirilmiş
   - Tema değişimine duyarlı renkler
   - Özelleştirilmiş boşluklar ve kenar yumuşatmaları
   - Gölge efektleri

3. **İçerik Yapısı**:
   - Başlık bölümü
   - Kişisel tanıtım
   - Deneyim ve uzmanlık alanları
   - Projeler ve çalışmalar
   - İletişim bilgileri

### Teknik Detaylar

#### 1. Bileşen Yapısı
```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div className="max-w-4xl mx-auto px-4 py-12">
    {/* Başlık */}
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Hakkımda
    </h1>
    
    {/* İçerik Kartı */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* İçerik Paragrafları */}
      </div>
    </div>
  </div>
</div>
```

#### 2. Stil Sınıfları
- `min-h-screen`: Tam ekran yüksekliği
- `bg-gray-50 dark:bg-gray-900`: Tema duyarlı arka plan
- `max-w-4xl`: Maksimum içerik genişliği
- `prose prose-lg`: Tipografi ayarları
- `rounded-lg shadow-lg`: Kart tasarımı
- `text-gray-600 dark:text-gray-300`: Tema duyarlı metin renkleri

#### 3. Performans Optimizasyonları
- Client-side rendering
- Minimal JavaScript kullanımı
- Optimize edilmiş CSS sınıfları
- Tailwind JIT derlemesi

### İyileştirme Önerileri

1. **Teknik İyileştirmeler**:
   - [ ] SEO optimizasyonu için metadata eklenmesi
   - [ ] Sayfa yükleme performansının iyileştirilmesi
   - [ ] Erişilebilirlik özelliklerinin artırılması
   - [ ] Animasyon ve geçiş efektlerinin eklenmesi

2. **İçerik İyileştirmeleri**:
   - [ ] Dinamik içerik yönetimi
   - [ ] İnteraktif elementler eklenmesi
   - [ ] Sosyal medya entegrasyonu
   - [ ] İletişim formu eklenmesi

3. **Tasarım İyileştirmeleri**:
   - [ ] Responsive tasarımın geliştirilmesi
   - [ ] Görsel elementlerin eklenmesi
   - [ ] Kullanıcı deneyiminin iyileştirilmesi
   - [ ] Tema geçişlerinin yumuşatılması

### Yapılacaklar
- [ ] Metin opaklıklarını hiyerarşi için kullan (100%, 80%, 60%)
- [ ] Her iki temada kontrast oranlarını kontrol et
- [ ] Özel durumlar için dark: önekini kullan

## 🔄 Diğer Sistemler
(Diğer sistemler için dokümantasyon buraya eklenecek)

## Blog Sistemi

### Mevcut Yapı
- **Veri Yapısı**: 
  ```typescript
  type BlogPost = {
    id: string;
    title: string;
    description: string;
    content: string;
    readingTime: number;
    tags: string[];
    publishedAt: string;
    author: {
      name: string;
      title: string;
      avatar: string;
    };
    sources?: {
      title: string;
      url: string;
      description?: string;
    }[];
  }
  ```

- **Dosya Yapısı**:
  - `/src/data/blog-posts.ts`: Blog verileri
  - `/src/app/blog/page.tsx`: Blog listesi sayfası
  - `/src/app/blog/[slug]/page.tsx`: Blog detay sayfası

### İyileştirme Önerileri

#### Mühendislik İyileştirmeleri
1. **Veri Yönetimi**:
   - JSON dosyası yerine veritabanı kullanımı (MongoDB/PostgreSQL)
   - Blog içeriklerinin Markdown dosyalarında saklanması
   - Resim optimizasyonu ve CDN kullanımı

2. **Performans**:
   - Sayfalama (pagination) implementasyonu
   - İçerik önbellekleme (caching)
   - Lazy loading ve code splitting
   - SEO optimizasyonları

3. **Güvenlik**:
   - Input validasyonu
   - XSS koruması
   - Rate limiting
   - Admin yetkilendirme sistemi

#### Kullanıcı Deneyimi İyileştirmeleri
1. **İçerik Yönetimi**:
   - Zengin metin editörü (WYSIWYG)
   - Taslak olarak kaydetme
   - Otomatik kaydetme
   - Markdown önizleme

2. **Arama ve Filtreleme**:
   - Tam metin arama
   - Kategori/etiket bazlı filtreleme
   - Tarih bazlı sıralama
   - İlgili yazılar önerisi

3. **Etkileşim**:
   - Yorum sistemi
   - Beğeni/paylaşım özellikleri
   - Okunma istatistikleri
   - Newsletter entegrasyonu

### Admin Paneli Gereksinimleri
1. **Blog Yönetimi**:
   - Blog oluşturma/düzenleme/silme
   - Markdown/WYSIWYG editör desteği
   - Resim yükleme ve yönetimi
   - Etiket ve kategori yönetimi

2. **İçerik Organizasyonu**:
   - Taslak/yayınlanmış yazı yönetimi
   - Toplu işlem özellikleri
   - İçerik takvimi
   - SEO ayarları

3. **Analitik**:
   - Okunma istatistikleri
   - Popüler içerikler
   - Etkileşim metrikleri
   - Performans raporları 