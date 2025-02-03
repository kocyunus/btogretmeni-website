# Bileşenler

Bu dokümantasyon, proje yönetim sisteminde kullanılan bileşenleri detaylı olarak açıklamaktadır.

## Proje Listesi Bileşenleri

### ProjectList

```typescript
// src/components/project/ProjectList.tsx
export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Proje verilerini yükle
  useEffect(() => {
    fetchProjects();
  }, []);

  // Yükleme durumu
  if (loading) return <LoadingSpinner />;

  // Hata durumu
  if (error) return <ErrorMessage message={error} />;

  // Boş durum
  if (projects.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
```

### ProjectCard

```typescript
// src/components/project/ProjectCard.tsx
interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projeler/${project.slug}`}>
      <div className="bg-card hover:bg-card/90 rounded-xl p-6">
        {/* Proje görseli */}
        {project.images?.[0] && (
          <Image
            src={project.images[0]}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Proje başlığı ve kategori */}
        <div className="mt-4">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <span className="text-sm text-muted-foreground">
            {project.category}
          </span>
        </div>

        {/* Proje özeti */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {project.summary}
        </p>

        {/* Teknolojiler */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Durum */}
        <StatusBadge status={project.status} className="mt-4" />
      </div>
    </Link>
  );
}
```

## Admin Bileşenleri

### ProjectForm

```typescript
// src/components/admin/ProjectForm.tsx
interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Başlık */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Diğer form alanları */}
      </form>
    </Form>
  );
}
```

### ImageUploader

```typescript
// src/components/admin/ImageUploader.tsx
interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const onDrop = useCallback(async (files: File[]) => {
    // Görsel yükleme işlemi
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  return (
    <div>
      {/* Sürükle-bırak alanı */}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Görselleri sürükleyin veya seçin</p>
      </div>

      {/* Görsel önizleme */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image}
              alt=""
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Yardımcı Bileşenler

### StatusBadge

```typescript
// src/components/ui/StatusBadge.tsx
interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800'
  };

  const labels = {
    planned: 'Planlanıyor',
    'in-progress': 'Devam Ediyor',
    completed: 'Tamamlandı'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
```

### LoadingSpinner

```typescript
// src/components/ui/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}
```

### ErrorMessage

```typescript
// src/components/ui/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
      <p>{message}</p>
    </div>
  );
}
```

### EmptyState

```typescript
// src/components/ui/EmptyState.tsx
export function EmptyState() {
  return (
    <div className="text-center p-8">
      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-medium text-muted-foreground">
        Henüz proje yok
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Yeni bir proje ekleyerek başlayın
      </p>
    </div>
  );
}
```

## Stil Rehberi

### Renk Paletleri

```typescript
const colors = {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  }
};
```

### Tipografi

```typescript
const typography = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6'
};
```

### Boşluklar

```typescript
const spacing = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20',
  card: 'p-6'
};
```

## En İyi Uygulamalar

1. Bileşenleri küçük ve yeniden kullanılabilir tutun
2. Props için TypeScript tiplerini kullanın
3. Stil sınıflarını tailwind-merge ile birleştirin
4. Erişilebilirlik özelliklerini ekleyin
5. Yükleme ve hata durumlarını ele alın
6. Responsive tasarım için medya sorgularını kullanın 