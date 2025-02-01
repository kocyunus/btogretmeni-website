import { useState } from 'react';
import type { BlogFormData } from '@/types/blog';

interface UseBlogFormProps {
  onSuccess?: () => void;
  initialData?: Partial<BlogFormData>;
}

export function useBlogForm({ onSuccess, initialData }: UseBlogFormProps = {}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    _id: initialData?._id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    readingTime: initialData?.readingTime || 5,
    coverImage: initialData?.coverImage || '',
    tags: initialData?.tags || [],
    isDraft: initialData?.isDraft ?? false,
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
    author: initialData?.author || {
      name: 'Yunus Koç',
      image: '/images/avatar.jpg'
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'readingTime') {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
    } else if (name.startsWith('author.')) {
      const authorField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        author: { ...prev.author, [authorField]: value }
      }));
    } else if (name === 'tags') {
      setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          excerpt: formData.excerpt,
          readingTime: formData.readingTime,
          coverImage: formData.coverImage,
          tags: formData.tags || [],
          isDraft: formData.isDraft || true,
          publishedAt: new Date(),
          updatedAt: new Date(),
          seo: formData.seo ? {
            metaTitle: formData.seo.metaTitle || formData.title,
            metaDescription: formData.seo.metaDescription || formData.description,
            keywords: formData.seo.keywords || formData.tags?.join(', '),
            canonicalUrl: formData.seo.canonicalUrl
          } : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Blog yazısı oluşturulamadı');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Blog yazısı oluşturulurken hata:', err);
      setError(err instanceof Error ? err.message : 'Blog yazısı kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    error,
    saving,
    handleChange,
    handleSubmit,
    setFormData
  };
} 