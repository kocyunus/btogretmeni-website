## Eğitim API'si

### GET /api/egitim
Tüm eğitim içeriklerini getirir.

```typescript
// Request
GET /api/egitim

// Response 200 OK
{
  courses: [{
    _id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    level: "beginner" | "intermediate" | "advanced";
    duration: number;
    features: string[];
    topics: string[];
    createdAt: Date;
    updatedAt: Date;
  }]
}

// Response 500 Internal Server Error
{
  error: "Internal Server Error"
}
```

### GET /api/egitim/seed
Development ortamında örnek kurs verisi oluşturur.

```typescript
// Request
GET /api/egitim/seed

// Response 200 OK
{
  message: "Kurs başarıyla oluşturuldu",
  course: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    level: string;
    duration: number;
    features: string[];
    topics: string[];
    createdAt: Date;
    updatedAt: Date;
  }
}

// Response 200 OK (Kurs zaten varsa)
{
  message: "Kurs zaten mevcut"
}

// Response 500 Internal Server Error
{
  error: "Internal Server Error"
}
```

### CORS Yapılandırması
```typescript
// API Route Yapılandırması
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
};

// CORS Headers
{
  'Cache-Control': 'no-store, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

// OPTIONS Method
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### Hata Yönetimi
```typescript
try {
  // API işlemleri
} catch (error) {
  console.error('API Hatası:', error);
  return NextResponse.json(
    { error: 'Internal Server Error' }, 
    { status: 500 }
  );
}
``` 