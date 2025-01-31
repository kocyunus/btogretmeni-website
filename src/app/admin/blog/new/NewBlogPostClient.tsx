'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';

interface BlogFormData {
  title: string;
  description: string;
  content: string;
  excerpt: string;
  readingTime: string;
  coverImage: string;
  tags: string[];
  isDraft: boolean;
  publishedAt: Date;
  author: {
    name: string;
    title: string;
    image: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
}

export default function NewBlogPostClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    description: '',
    content: '',
    excerpt: '',
    readingTime: '5 dakika',
    coverImage: '',
    tags: [],
    isDraft: false,
    publishedAt: new Date(),
    author: {
      name: 'BT Öğretmeni',
      title: 'Bilişim Teknolojileri Öğretmeni',
      image: '/authors/bt-ogretmeni.jpg'
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPost = { ...formData };
    
    if (name === 'tags') {
      updatedPost.tags = value.split(',').map(tag => tag.trim());
    } else if (name === 'readingTime') {
      updatedPost.readingTime = value;
    } else if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      updatedPost.seo = {
        ...updatedPost.seo,
        [seoField]: value
      };
    } else {
      (updatedPost as any)[name] = value;
    }
    
    setFormData(updatedPost);
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

      router.push('/admin/blog');
    } catch (err) {
      console.error('Blog yazısı oluşturulurken hata:', err);
      setError(err instanceof Error ? err.message : 'Blog yazısı kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            İçerik (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 
              font-mono"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Özet (Kısa açıklama)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags?.join(', ') || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
              border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="readingTime" className="block text-sm font-medium mb-2">
              Okuma Süresi (dakika)
            </label>
            <input
              type="text"
              id="readingTime"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
                border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDraft"
              name="isDraft"
              checked={formData.isDraft}
              onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isDraft" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
              Taslak olarak kaydet
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 
              disabled:cursor-not-allowed ${
                formData.isDraft 
                ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
              }`}
          >
            {saving ? 'Kaydediliyor...' : (formData.isDraft ? 'Taslak Olarak Kaydet' : 'Yayınla')}
          </button>
        </div>
      </form>
    </div>
  );
} 