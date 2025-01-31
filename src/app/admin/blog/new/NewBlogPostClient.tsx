'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';

export default function NewBlogPostClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    description: '',
    content: '',
    excerpt: '',
    readingTime: 5,
    tags: [],
    isDraft: false,
    author: {
      name: 'Yunus Koç',
      title: 'BT Öğretmeni',
      avatarUrl: '/images/avatar.jpg'
    },
    sources: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPost = { ...post };
    
    if (name === 'tags') {
      updatedPost.tags = value.split(',').map(tag => tag.trim());
    } else if (name === 'readingTime') {
      updatedPost.readingTime = parseInt(value, 10) || 5;
    } else if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      updatedPost.seo = {
        ...updatedPost.seo,
        [seoField]: value
      };
    } else {
      (updatedPost as any)[name] = value;
    }
    
    setPost(updatedPost);
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
          title: post.title,
          description: post.description,
          content: post.content,
          excerpt: post.excerpt,
          readingTime: post.readingTime,
          coverImage: post.coverImage,
          tags: post.tags || [],
          isDraft: post.isDraft || true,
          publishedAt: new Date(),
          updatedAt: new Date(),
          seo: post.seo ? {
            metaTitle: post.seo.metaTitle || post.title,
            metaDescription: post.seo.metaDescription || post.description,
            keywords: post.seo.keywords || post.tags?.join(', '),
            canonicalUrl: post.seo.canonicalUrl
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
            value={post.title}
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
            value={post.description}
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
            value={post.content}
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
            value={post.excerpt}
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
            value={post.tags?.join(', ') || ''}
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
              type="number"
              id="readingTime"
              name="readingTime"
              value={post.readingTime}
              onChange={handleChange}
              min={1}
              required
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
              checked={post.isDraft}
              onChange={(e) => setPost({ ...post, isDraft: e.target.checked })}
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
                post.isDraft 
                ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
              }`}
          >
            {saving ? 'Kaydediliyor...' : (post.isDraft ? 'Taslak Olarak Kaydet' : 'Yayınla')}
          </button>
        </div>
      </form>
    </div>
  );
} 