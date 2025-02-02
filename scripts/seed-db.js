require('dotenv').config();
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const MONGODB_URI = process.env.MONGODB_URI;
const SKIP_DB_RESET = process.env.SKIP_DB_RESET === 'true';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış.');
}

const blogPostSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  readingTime: {
    type: Number,
    required: true,
    default: 5,
  },
  coverImage: { type: String },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true,
  },
  updatedAt: {
    type: Date,
    index: true,
  },
  author: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Yazar'
    },
    avatarUrl: {
      type: String,
      default: '/images/default-avatar.jpg'
    }
  },
  sources: {
    type: [{
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    }],
    default: [],
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String
  }
}, {
  timestamps: true,
  autoIndex: true
});

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

const testPosts = [
  {
    id: nanoid(),
    title: 'Next.js ile Blog Oluşturma',
    description: 'Next.js kullanarak modern ve performanslı bir blog nasıl oluşturulur?',
    content: `
# Next.js ile Blog Oluşturma

Next.js, React tabanlı web uygulamaları geliştirmek için harika bir framework'tür. Bu yazıda, Next.js kullanarak nasıl modern ve performanslı bir blog oluşturabileceğinizi öğreneceksiniz.

## Neden Next.js?

Next.js'in sunduğu bazı önemli özellikler:

- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-system based routing
- Built-in image optimization
- Zero config
- TypeScript support

## Başlangıç

Yeni bir Next.js projesi oluşturmak için:

\`\`\`bash
npx create-next-app@latest my-blog
cd my-blog
npm run dev
\`\`\`

## Sonuç

Next.js ile blog oluşturmak oldukça kolay ve eğlenceli! Siz de kendi blogunuzu oluşturmaya başlayabilirsiniz.
    `,
    readingTime: 5,
    tags: ['Next.js', 'React', 'Web Development', 'JavaScript'],
    isDraft: false,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'BT Öğretmeni',
      title: 'Bilişim Teknolojileri Öğretmeni',
      avatarUrl: '/images/bt-ogretmeni-logo.png'
    },
    sources: [
      {
        title: 'Next.js Resmi Dokümantasyon',
        url: 'https://nextjs.org/docs',
        description: 'Next.js resmi dokümantasyonu'
      }
    ]
  },
  {
    id: nanoid(),
    title: 'MongoDB ile Veritabanı Yönetimi',
    description: 'MongoDB veritabanı yönetimi ve best practices hakkında kapsamlı bir rehber.',
    content: `
# MongoDB ile Veritabanı Yönetimi

MongoDB, modern web uygulamaları için popüler bir NoSQL veritabanıdır. Bu yazıda, MongoDB'yi etkili bir şekilde nasıl kullanabileceğinizi öğreneceksiniz.

## MongoDB Nedir?

MongoDB:
- Döküman tabanlı bir NoSQL veritabanıdır
- JSON benzeri dökümanlar kullanır
- Yatay ölçeklenebilirlik sunar
- Esnek şema yapısına sahiptir

## Best Practices

1. İndexler kullanın
2. Şema validasyonu yapın
3. Bağlantı havuzu kullanın
4. Hata yönetimini unutmayın
    `,
    readingTime: 8,
    tags: ['MongoDB', 'Database', 'NoSQL', 'Backend'],
    isDraft: false,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'BT Öğretmeni',
      title: 'Bilişim Teknolojileri Öğretmeni',
      avatarUrl: '/images/bt-ogretmeni-logo.png'
    },
    sources: [
      {
        title: 'MongoDB Resmi Dokümantasyon',
        url: 'https://docs.mongodb.com/',
        description: 'MongoDB resmi dokümantasyonu'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    if (SKIP_DB_RESET) {
      console.log('Veritabanı sıfırlama atlanıyor (SKIP_DB_RESET=true)');
      await mongoose.connection.close();
      return;
    }

    // Örnek yazıları ekle (eğer yoksa)
    for (const testPost of testPosts) {
      const existingPost = await BlogPost.findOne({ title: testPost.title });
      if (!existingPost) {
        await BlogPost.create(testPost);
        console.log(`Yeni blog yazısı eklendi: ${testPost.title}`);
      }
    }

    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

seedDatabase(); 