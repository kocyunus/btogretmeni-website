# BT Öğretmeni Web Sitesi

Modern ve kullanıcı dostu kişisel web sitesi.

## Özellikler

- 🌙 Dark/Light tema desteği
- 📱 Responsive tasarım
- 📝 Blog sistemi
- 🚀 Proje yönetimi
- 📊 Admin paneli
- 🔍 SEO optimizasyonu
- 🖼️ Görsel optimizasyonu
- 🔒 Güvenli yetkilendirme

## Teknolojiler

- Next.js 14
- TypeScript
- MongoDB
- Tailwind CSS
- shadcn/ui

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/username/website.git
cd website
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin:
- MongoDB bağlantı bilgilerinizi ekleyin
- Admin kullanıcı bilgilerinizi belirleyin
- Email ayarlarınızı yapılandırın

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Dokümantasyon

### Blog Sistemi
- [Genel Bakış](docs/blog-system/README.md)
- [API Endpoints](docs/blog-system/api-endpoints.md)
- [Veritabanı Yapısı](docs/blog-system/database-structure.md)
- [Bileşenler](docs/blog-system/components-and-pagination.md)
- [Yardımcı Fonksiyonlar](docs/blog-system/helpers.md)
- [Kararlı Sürüm 1.0](docs/blog-system/STABLE-VERSION-1.0.md)

### Proje Sistemi
- [Genel Bakış](docs/project-system/README.md)
- [API Endpoints](docs/project-system/api-endpoints.md)
- [Veritabanı Yapısı](docs/project-system/database-structure.md)
- [Bileşenler](docs/project-system/components.md)
- [Admin Paneli](docs/project-system/admin-panel.md)

### Diğer
- [Teknik Detaylar](docs/TECHNICAL.md)
- [Slug Kullanımı](docs/SLUG_USAGE.md)

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

İletişim için [GitHub Issues](https://github.com/username/website/issues) kullanabilirsiniz.
