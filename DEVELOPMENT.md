# BT Ogretmeni Web Sitesi Gelistirme Dokumantasyonu

## Proje Yapisi

```
src/
  ├── app/
  │   ├── layout.tsx        # Ana layout (client component)
  │   ├── page.tsx          # Ana sayfa
  │   └── metadata.ts       # SEO metadata tanimlari
  ├── lib/
  │   └── firebase.ts       # Firebase yapilandirmasi
  └── components/
      ├── Navbar/           # Navigasyon bilesenler
      └── icons/            # SVG ikonlar
```

## Firebase Entegrasyonu

Firebase Analytics entegrasyonu icin asagidaki adimlar tamamlandi:

1. Firebase Yapilandirmasi (`src/lib/firebase.ts`):
   - Firebase baslatma
   - Analytics client-side kontrolu
   - Event logging fonksiyonlari

2. Layout Yapilandirmasi:
   - Client component olarak isaretlendi
   - Sayfa goruntuleme analitikleri eklendi
   - Test eventleri tanimlandi

3. Ana Sayfa Entegrasyonu:
   - Firebase kurulum kontrolu
   - Analytics test eventleri
   - Konsol loglari

## Metadata Yapilandirmasi

SEO icin metadata ayri bir dosyada tanimlandi (`src/app/metadata.ts`):
- Sayfa basliklari
- Aciklamalar
- Anahtar kelimeler

## Stil ve Tasarim

- Tailwind CSS kullaniliyor
- Responsive tasarim
- Dark mode destegi
- Gradient arka planlar
- Hover efektleri

## Gelistirme Sureci

1. Projeyi baslatma:
```bash
npm run dev
```

2. Firebase eventlerini kontrol etme:
- Browser Developer Tools > Console
- Firebase Console > Analytics > Realtime

3. Yeni ozellik ekleme sureci:
- Feature branch olustur
- Gelistirme yap
- Test et
- Main branch'e merge et

## Notlar ve Hatirlatmalar

1. Turkce karakter kullanmaktan kacinilmali
2. Client-side islemler 'use client' direktifi ile isaretlenmeli
3. Firebase islemleri her zaman client-side yapilmali
4. Metadata server-side olmali

## Yapilacaklar

- [ ] SEO optimizasyonlari
- [ ] Performance iyilestirmeleri
- [ ] Test coverage artirimi
- [ ] Error boundary eklenmesi
- [ ] Loading state'leri 