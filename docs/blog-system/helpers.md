# Yardımcı Fonksiyonlar ve Bileşenler

Bu dokümantasyon, blog sisteminde kullanılan yardımcı fonksiyonları ve bileşenleri detaylı olarak açıklar.

## Tarih İşlemleri

### 1. Tarih Formatlama

```typescript
// Tarih formatları
const DATE_FORMATS = {
  FULL: 'dd MMMM yyyy',
  SHORT: 'dd.MM.yyyy',
  WITH_TIME: 'dd MMMM yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
} as const;

// Tarihi formatla
function formatDate(date: Date | string, format: keyof typeof DATE_FORMATS = 'FULL'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, DATE_FORMATS[format], { locale: tr });
}

// Göreceli tarih
function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { locale: tr, addSuffix: true });
}

// Okuma süresi hesapla
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

## Metin İşlemleri

### 1. Slug Oluşturma

```typescript
function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'tr'
  });
}
```

### 2. Metin Kısaltma

```typescript
function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return `${truncated.slice(0, lastSpace)}...`;
}
```

### 3. Markdown İşleme

```typescript
interface MarkdownOptions {
  removeImages?: boolean;
  removeLinks?: boolean;
  maxLength?: number;
}

function processMarkdown(markdown: string, options: MarkdownOptions = {}): string {
  let processed = markdown;
  
  if (options.removeImages) {
    processed = processed.replace(/!\[.*?\]\(.*?\)/g, '');
  }
  
  if (options.removeLinks) {
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  }
  
  if (options.maxLength) {
    processed = truncateText(processed, options.maxLength);
  }
  
  return processed;
}
```

## Dosya İşlemleri

### 1. Resim Optimizasyonu

```typescript
interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'avif';
}

async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    format = 'webp'
  } = options;
  
  // Sharp ile resim optimizasyonu
  const optimized = await sharp(await file.arrayBuffer())
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, { quality: quality * 100 })
    .toBuffer();
    
  return new Blob([optimized], { type: `image/${format}` });
}
```

### 2. Dosya Boyutu Formatlama

```typescript
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
```

## Form İşlemleri

### 1. Form Validasyonu

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [field: string]: ValidationRule[];
}

interface ValidationErrors {
  [field: string]: string[];
}

function validateForm(
  values: Record<string, any>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = values[field];
    const fieldErrors: string[] = [];
    
    fieldRules.forEach(rule => {
      if (rule.required && !value) {
        fieldErrors.push(rule.message);
      }
      
      if (rule.minLength && value?.length < rule.minLength) {
        fieldErrors.push(rule.message);
      }
      
      if (rule.maxLength && value?.length > rule.maxLength) {
        fieldErrors.push(rule.message);
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message);
      }
      
      if (rule.custom && !rule.custom(value)) {
        fieldErrors.push(rule.message);
      }
    });
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return errors;
}
```

### 2. Form Hook'u

```typescript
function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validationRules) {
      const fieldErrors = validateForm({ [name]: values[name] }, {
        [name]: validationRules[name]
      });
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };
  
  const handleSubmit = (onSubmit: (values: T) => void) => {
    return (event: FormEvent) => {
      event.preventDefault();
      
      if (validationRules) {
        const formErrors = validateForm(values, validationRules);
        setErrors(formErrors);
        
        if (Object.keys(formErrors).length === 0) {
          onSubmit(values);
        }
      } else {
        onSubmit(values);
      }
    };
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched
  };
}
```

## Yardımcı Bileşenler

### 1. ErrorBoundary

```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}
```

### 2. Portal

```typescript
interface PortalProps {
  children: React.ReactNode;
  container?: Element;
}

const Portal: React.FC<PortalProps> = ({
  children,
  container = document.body
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted ? createPortal(children, container) : null;
};
```

### 3. LoadingSpinner

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'currentColor'
}) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  return (
    <svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
};
``` 