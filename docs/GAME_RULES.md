# Zindandan Kaçış - Oyun Kuralları ve Tasarım Prensipleri

## Temel Oyun Mekanikleri

### Karakter Özellikleri
- Karakter her zaman bir yöne bakarak başlar (varsayılan: doğu)
- Her hamlede bir kare ilerleyebilir
- 90 derece sağa veya sola dönebilir
- Duvarlardan geçemez

### Komut Sistemi
1. **Mevcut Komutlar:**
   - `ileri()`: Karakteri baktığı yönde bir kare ilerletir
   - `sağaDön()`: Karakteri 90 derece sağa döndürür
   - `solaDön()`: Karakteri 90 derece sola döndürür

2. **Komut Limitleri:**
   - Her seviye için belirlenen maksimum komut sayısı vardır
   - Dönüş komutları da birer komut olarak sayılır
   - Tüm komutlar sırayla çalıştırılır

## Level Tasarım Prensipleri

### 1. Zorluk Artışı
- **Seviye 1:** Tek komut (ileri)
- **Seviye 2:** İki komut (dönüş + ileri)
- **Seviye 3 ve sonrası:** Üç komut (karışık kombinasyonlar)

### 2. Level Tasarım Kuralları
- Her level TAM OLARAK verilen komut sayısı ile çözülebilmeli
- Daha az komutla çözülebilecek levellerden kaçınılmalı
- Her levelin tek bir optimal çözümü olmalı

### 3. Grid Yapısı
- Minimum 3x3, maksimum 8x8 grid boyutu
- Her zaman dış duvarlar olmalı (1 ile çevrili)
- Başlangıç noktası (mavi karakter) ve bitiş noktası (yeşil kapı) net görünmeli

## Seviye Özellikleri

### Başlangıç Seviyesi (1)
- Tek komut: `ileri()`
- Karakter ve kapı aynı hizada
- Dönüş gerektirmez

### Dönüşler Seviyesi (2)
- İki komut: Örnek `sağaDön()` + `ileri()`
- Tek dönüş ve tek hareket gerektirir

### Labirent Seviyesi (3)
- Üç komut
- Karmaşık olmayan yol
- Genelde bir dönüş ve iki hareket

### Uzun Yolculuk (4)
- Üç komut
- Farklı kombinasyonlar gerektirir
- Net bir çözüm yolu olmalı

### Büyük Final (5)
- Tüm öğrenilenleri içerir
- Daha karmaşık labirent
- Maksimum 6 komut

## Oyun İlerleyişi

### Level Kilitleri
- İlk seviye açık başlar
- Sonraki seviyeler önceki seviye tamamlanınca açılır
- Tamamlanan seviyeler yeşil tik ile işaretlenir

### İlerleme Kaydetme
- Oyuncu ilerlemesi otomatik kaydedilir
- Tamamlanan seviyeler localStorage'da tutulur
- Oyun açıldığında kaldığı yerden devam edilebilir

## Görsel Tasarım

### Karakter
- Mavi kare şeklinde
- Yönü ok işareti ile belirtilir
- Hareket ve dönüş animasyonları

### Grid
- Koyu arka plan
- Duvarlar belirgin
- Kapı yeşil renkte
- Kilitli bölümler gri tonlarda

## Hata Kontrolü
- Duvar çarpışma kontrolü
- Maksimum komut sayısı kontrolü
- Geçersiz komut kontrolü

## Başarı Koşulları
- Karakterin kapıya ulaşması
- Verilen komut limitinde çözüm
- Tüm komutların başarıyla tamamlanması 