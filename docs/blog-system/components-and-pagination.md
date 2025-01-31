# Bileşenler ve Sayfalama

Bu dokümantasyon, blog sisteminde kullanılan bileşenleri ve sayfalama yapısını detaylı olarak açıklar.

## Bileşenler

### 1. Blog Listesi Bileşenleri

#### BlogList
Ana blog listesi bileşeni.

```typescript
interface BlogListProps {
  posts: Post[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

#### BlogCard
Her bir blog yazısı için kart bileşeni.

```typescript
interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    description: string;
    excerpt: string;
    readingTime: number;
    publishedAt: Date;
    coverImage?: string;
    tags: string[];
    author: {
      name: string;
      avatarUrl: string;
    };
  };
}
```

### 2. Blog Detay Bileşenleri

#### BlogPost
Blog yazısı detay bileşeni.

```typescript
interface BlogPostProps {
  post: Post;
  isPreview?: boolean;
}
```

#### BlogAuthor
Yazar bilgileri bileşeni.

```typescript
interface BlogAuthorProps {
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
}
```

#### BlogSources
Kaynaklar bileşeni.

```typescript
interface BlogSourcesProps {
  sources: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}
```

### 3. Admin Bileşenleri

#### AdminBlogList
Admin paneli blog listesi bileşeni.

```typescript
interface AdminBlogListProps {
  posts: Post[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
}
```

#### BlogEditor
Blog yazısı düzenleme bileşeni.

```typescript
interface BlogEditorProps {
  post?: Post;
  onSave: (post: Partial<Post>) => Promise<void>;
  onCancel: () => void;
}
```

## Sayfalama Yapısı

### 1. Sayfalama Parametreleri

```typescript
interface PaginationParams {
  page: number;       // Mevcut sayfa numarası
  limit: number;      // Sayfa başına öğe sayısı
  total: number;      // Toplam öğe sayısı
  totalPages: number; // Toplam sayfa sayısı
}
```

### 2. Sayfalama Bileşeni

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}
```

### 3. Sayfalama Mantığı

```typescript
// Sayfa numaralarını hesapla
function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): number[] {
  const pages: number[] = [];
  
  // Başlangıç ve bitiş sayfalarını hesapla
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Başlangıç sayfasını ayarla
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Sayfa numaralarını oluştur
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
}
```

### 4. Sayfalama Hook'u

```typescript
function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };
  
  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage
  };
}
```

## Performans Optimizasyonları

### 1. Bileşen Optimizasyonları

```typescript
// Memo kullanımı
const BlogCard = memo<BlogCardProps>(({ post }) => {
  // Bileşen içeriği
}, (prevProps, nextProps) => {
  return prevProps.post._id === nextProps.post._id;
});

// Virtualization
import { VirtualList } from 'react-virtualized';

const BlogList = ({ posts }) => {
  return (
    <VirtualList
      width={width}
      height={height}
      rowCount={posts.length}
      rowHeight={200}
      rowRenderer={({ index, style }) => (
        <BlogCard
          key={posts[index]._id}
          post={posts[index]}
          style={style}
        />
      )}
    />
  );
};
```

### 2. Veri Yükleme Optimizasyonları

```typescript
// Infinite Loading
function useInfiniteScroll(callback: () => void) {
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        !== document.documentElement.offsetHeight
        || isFetching
      ) return;
      
      setIsFetching(true);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);
  
  useEffect(() => {
    if (!isFetching) return;
    
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);
  
  return [isFetching, setIsFetching];
}
```

## SEO Optimizasyonları

### 1. Meta Etiketleri

```typescript
interface BlogSEOProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  tags,
  coverImage
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="keywords" content={tags.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {coverImage && <meta property="og:image" content={coverImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {coverImage && <meta name="twitter:image" content={coverImage} />}
      
      {/* Article Meta */}
      <meta property="article:published_time" content={publishedAt} />
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Head>
  );
};
```

### 2. Yapısal Veri

```typescript
function generateBlogPostSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.title
    },
    keywords: post.tags.join(','),
    publisher: {
      '@type': 'Organization',
      name: 'Blog Adı',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.com/logo.png'
      }
    }
  };
}
``` 