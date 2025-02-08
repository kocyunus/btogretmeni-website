# Oyun Şablonu Dokümantasyonu

Bu dokümantasyon, eğitim platformundaki tüm oyunlar için kullanılacak standart şablonu açıklar.

## Sayfa Yapısı

Oyun sayfası üç ana bölümden oluşur:

### 1. Üst Alan - Seviyeler

- Grid yapısında 3 seviye kartı
- Her seviye için:
  - Başlık ve açıklama
  - Kilit sistemi (önceki seviye tamamlanmadan açılmaz)
  - İlerleme çubuğu
  - Seviye durumu (kilitli/açık)

```tsx
// Seviye veri yapısı
interface Level {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
}

// Örnek seviye kartı
<div className="relative p-4 rounded-xl border-2">
  <div className="flex items-center justify-between">
    <h3>Seviye {level.id}</h3>
    <LockIcon /> {/* Kilit ikonu */}
  </div>
  <h4>{level.title}</h4>
  <p>{level.description}</p>
  <div className="progress-bar" /> {/* İlerleme çubuğu */}
</div>
```

### 2. Sol Panel - Bilgi Alanı (1/5)

Ekranın sol tarafında yer alan, oyuncuya yardımcı bilgiler içeren panel:

- Aktif seviye bilgisi
- Kullanılabilir komutlar listesi
- İpuçları ve yönlendirmeler
- Yardımcı bilgiler

```tsx
<aside className="w-1/5 bg-card rounded-xl p-4">
  <h2>Yardım & İpuçları</h2>
  
  {/* Aktif Seviye */}
  <div className="mb-6">
    <h3>Aktif Seviye: {currentLevel}</h3>
    <p>Seviye açıklaması...</p>
  </div>

  {/* Komutlar */}
  <div className="mb-6">
    <h3>Kullanılabilir Komutlar</h3>
    <ul>
      <li>komut1() - Açıklama</li>
      <li>komut2() - Açıklama</li>
    </ul>
  </div>

  {/* İpuçları */}
  <div>
    <h3>İpuçları</h3>
    <ul>
      <li>İpucu 1</li>
      <li>İpucu 2</li>
    </ul>
  </div>
</aside>
```

### 3. Sağ Alan - Oyun Alanı (4/5)

Ana oyun içeriğinin gösterileceği alan:

- Oyun motoru entegrasyonu
- Etkileşimli oyun alanı
- Görsel geri bildirimler
- Kontrol arayüzü

```tsx
<section className="flex-1 bg-card rounded-xl p-4">
  <div className="h-full">
    {/* Oyun motoru veya içeriği buraya gelecek */}
  </div>
</section>
```

## Özellikler ve Gereksinimler

1. **Responsive Tasarım**
   - Tüm alanlar farklı ekran boyutlarına uyumlu
   - Mobil görünüm için özel düzenlemeler

2. **Tema Desteği**
   - Koyu/açık tema uyumlu
   - Tutarlı renk şeması

3. **İlerleme Sistemi**
   - Seviye kilitleri
   - İlerleme kaydetme
   - Başarı göstergeleri

4. **Performans**
   - Lazy loading desteği
   - Optimize edilmiş assets
   - Minimum yükleme süreleri

## Kullanım

1. Yeni bir oyun oluştururken bu şablonu temel alın
2. Oyuna özel komponentleri sağ alana entegre edin
3. Sol paneldeki bilgileri oyuna göre özelleştirin
4. Seviyeleri ve kilit sistemini ayarlayın

## Örnek Kod

```tsx
import { Metadata } from "next";
import { LockIcon } from "@heroicons/react/24/solid";

export default function GamePage() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      {/* Üst Alan - Seviyeler */}
      <section className="mb-8">
        {/* Seviye kartları */}
      </section>

      {/* Alt Alan */}
      <div className="flex gap-4 h-[calc(100vh-300px)]">
        {/* Sol Panel - Bilgi Alanı */}
        <aside className="w-1/5">
          {/* Yardım ve ipuçları */}
        </aside>

        {/* Sağ Alan - Oyun Alanı */}
        <section className="flex-1">
          {/* Oyun içeriği */}
        </section>
      </div>
    </main>
  );
}
```

## Önemli Notlar

- Her oyun bu şablonu kullanmalı
- Tutarlı kullanıcı deneyimi için yapıyı bozmayın
- Oyuna özel özellikler sağ alanda implement edilmeli
- Sol panel içeriği hedef kitleye uygun yazılmalı
- Seviye sistemi mantıklı bir zorluk artışı içermeli 