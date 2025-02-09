# Sistem Özellikleri ve Modüller

## Loglama Sistemi

### Log Seviyeleri
- `info`: Genel bilgi mesajları
- `warn`: Uyarı mesajları
- `error`: Hata mesajları
- `debug`: Geliştirme ortamında görünen detaylı mesajlar

### Özel Loglama Fonksiyonları
```typescript
// API çağrıları için
Logger.api(method: string, url: string, status?: number, data?: any)

// Veritabanı işlemleri için
Logger.db(operation: string, collection: string, result?: any)
```

### Örnek Kullanım
```typescript
Logger.info('Blog yazısı yükleniyor', { slug: 'ornek-yazi' });
Logger.error('Bağlantı hatası', error);
Logger.api('GET', '/api/blog', 200, { count: 5 });
Logger.db('insert', 'posts', { id: 123 });
```

## Toast Bildirim Sistemi

### Özellikler
- Maksimum 1 toast gösterimi
- Otomatik kaldırma (1000 saniye)
- Action butonu desteği
- Özelleştirilebilir görünüm

### Kullanım
```typescript
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// Basit bildirim
toast({
  title: "Başarılı",
  description: "İşlem tamamlandı"
})

// Aksiyon butonlu bildirim
toast({
  title: "Dikkat",
  description: "Değişiklikler kaydedilmedi",
  action: <ToastAction>Kaydet</ToastAction>
})
```

## Kimlik Doğrulama Sistemi

### Özellikler
- Cookie tabanlı oturum yönetimi (`auth_token`)
- Admin paneli erişim kontrolü
- Yetkilendirme kontrolleri

### API Güvenliği
```typescript
// Admin API'leri için yetkilendirme kontrolü
async function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');
  return !!token;
}

// Kullanım örneği
const isAuthorized = await checkAuth();
if (!isAuthorized) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Middleware Sistemi

### Özellikler
- Admin sayfaları için otomatik yetkilendirme kontrolü
- Yetkisiz erişimlerde login sayfasına yönlendirme

### Yapılandırma
```typescript
// Middleware yapılandırması
export const config = {
  matcher: ['/admin/:path*'],
};

// Middleware fonksiyonu
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth_token');
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}
```

## E-posta Sistemi

### Yapılandırma
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Özellikler
- Gmail SMTP kullanımı
- Hata yönetimi
- Async/await desteği

### API Kullanımı
```typescript
// E-posta gönderimi için endpoint
POST /api/send-email

// İstek gövdesi
{
  "to": "alici@ornek.com",
  "subject": "Konu",
  "message": "Mesaj içeriği"
}
```

## Doğrulama Sistemi

### Veri Doğrulama Modülleri
```typescript
// Blog Doğrulaması
const blogValidation = {
  schema: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(200),
    content: z.string().min(50),
    tags: z.array(z.string()).min(1)
  })
};

// Kullanıcı Doğrulaması
const userValidation = {
  schema: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
  })
};
```

### Güvenlik Doğrulamaları
```typescript
// HTML Sanitizasyonu
const securityValidation = {
  sanitizeHtml: (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  }
};
```

### İstek Limitleme
```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 100; // 1 dakikada maksimum istek sayısı

function checkRateLimit(request: NextRequest): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  // ... limit kontrolü
}
```

## Sürükle-Bırak Sistemi

### StrictMode Uyumluluğu
```typescript
// StrictModeDroppable bileşeni
function StrictModeDroppable({ children, ...props }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
}
```

### Özellikler
- Next.js Strict Mode desteği
- Animasyonlu sürükleme efektleri
- Dokunmatik cihaz desteği
- Benzersiz öğe tanımlayıcıları
- Oyun durumuna göre devre dışı bırakma

### Kullanım
```typescript
// Sürüklenebilir komut listesi
<DragDropContext onDragEnd={handleDragEnd}>
  <StrictModeDroppable droppableId="commands">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {commands.map((cmd, index) => (
          <Draggable 
            key={cmd + "-" + index}
            draggableId={cmd + "-" + index}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`
                  ${snapshot.isDragging ? 'scale-105 rotate-1 z-50' : ''}
                  cursor-grab active:cursor-grabbing
                `}
              >
                {/* Komut içeriği */}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </StrictModeDroppable>
</DragDropContext>
```

### Görsel Geri Bildirim
- Sürükleme sırasında ölçekleme efekti
- Hafif rotasyon animasyonu
- Gölge efektleri
- Tutma/bırakma imleç değişimi
- Vurgu renkleri ve kenarlıklar

### Performans Optimizasyonları
- `touch-none` ile dokunmatik kaydırma iyileştirmesi
- `select-none` ile metin seçimini engelleme
- `transform-gpu` ile donanım hızlandırma
- Animasyon optimizasyonları

### Hata Yönetimi
- Oyun çalışırken sürüklemeyi devre dışı bırakma
- Geçersiz hedef kontrolü
- Benzersiz ID çakışma kontrolü
- Strict Mode uyumluluk kontrolleri 

## Eğitim Sistemi

### Kurs Modeli
```typescript
// MongoDB Şeması
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  topics: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Otomatik güncelleme tarihi
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
```

### Kurs Listesi Görünümü
```typescript
// Kurs Kartı Bileşeni
<div className="bg-card hover:bg-card/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
  {/* Görsel */}
  <div className="relative aspect-video rounded-lg overflow-hidden">
    <Image
      src={course.imageUrl}
      alt={course.title}
      fill
      className="object-cover"
    />
  </div>

  {/* İçerik */}
  <div className="mt-4">
    <h3 className="text-2xl font-bold">{course.title}</h3>
    <p className="text-muted-foreground">{course.description}</p>
    
    {/* Özellikler */}
    <div className="grid grid-cols-2 gap-2 mt-4">
      {course.features.map((feature, index) => (
        <div key={index} className="flex items-center text-sm">
          <CheckIcon className="w-4 h-4 mr-2" />
          {feature}
        </div>
      ))}
    </div>
  </div>
</div>
```

### Veri Yönetimi
```typescript
// Kurs Verilerini Getir
async function getEducationContent() {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return { courses };
  } catch (error) {
    console.error("Eğitim içerikleri yüklenirken hata:", error);
    throw error;
  }
}

// Tekil Kurs Detayı
async function getCourse(slug: string) {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ slug });
    return course;
  } catch (error) {
    console.error("Kurs detayları getirilirken hata:", error);
    return null;
  }
}
```

### Hata Yönetimi
```typescript
// Veri Yükleme Hatası
if (!educationData?.courses?.length) {
  return (
    <div className="text-center p-8">
      <p className="text-amber-400">
        Henüz eğitim içeriği bulunmamaktadır.
      </p>
    </div>
  );
}

// API Hatası
catch (error) {
  return (
    <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
      <p>Eğitim içerikleri yüklenirken bir hata oluştu.</p>
      <p className="text-sm mt-2 text-red-400">
        {error instanceof Error ? error.message : 'Bilinmeyen hata'}
      </p>
    </div>
  );
} 