# BT Ogretmeni

Kisisel blog ve egitim platformu.

## Ozellikler

- 📝 Blog yazilari
  - Modern kart tasarımı
  - Responsive grid layout
  - Etiket sistemi
  - Okuma süresi hesaplama
- 🎓 Egitim icerikleri
- 💼 Proje portfoyu
- 📊 Analytics entegrasyonu
- 🔍 SEO optimizasyonu
- 🌙 Karanlık/Aydınlık tema
- 🌐 Responsive tasarım
- ⚡ Modern UI/UX

## Teknolojiler

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- MongoDB
- Next-themes
- React-icons
- Mongoose
- Vercel Deployment

## Baslangic

1. Gereksinimleri yukleyin:
```bash
npm install
```

2. MongoDB URI'yi ayarlayın:
```bash
# .env.local dosyasında
MONGODB_URI=your_mongodb_uri
```

3. Gelistirme sunucusunu baslatın:
```bash
npm run dev
```

4. Tarayicinizda acin:
```
http://localhost:3000
```

## Veritabanı Yapısı

### MongoDB Koleksiyonları

- `blogposts`: Blog yazıları
  - title: String
  - description: String
  - content: String
  - tags: [String]
  - publishedAt: Date
  - readingTime: Number

## API Endpoints

### Blog API

- `GET /api/blog`: Tüm blog yazılarını getirir
- `GET /api/blog/:id`: Belirli bir blog yazısını getirir
- `POST /api/blog`: Yeni blog yazısı oluşturur
- `PUT /api/blog/:id`: Blog yazısını günceller
- `DELETE /api/blog/:id`: Blog yazısını siler

## Katki

Katki saglamak icin:
1. Fork yapin
2. Feature branch olusturun
3. Degisikliklerinizi commit edin
4. Pull request gonderin

## Lisans

MIT

## Iletisim

- Website: [btogretmeni.com](https://btogretmeni.com)
- Email: info@btogretmeni.com

## Veritabanı Kaynakları

### MongoDB

MongoDB ile ilgili kaynaklar:

- [MongoDB Resmi Sürücü Belgeleri](https://www.mongodb.com/docs/drivers/) - MongoDB sürücüleri hakkında detaylı bilgi ve kullanım kılavuzları.
