'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';

export default function EditBlogPostClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) {
          throw new Error('Blog yazısı bulunamadı');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Blog yazısı yüklenirken hata:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      }
    }

    fetchPost();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!post) return;

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!post) return;
    
    const { name, checked } = e.target;
    setPost({
      ...post,
      [name]: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          seo: {
            ...post.seo,
            metaTitle: post.seo?.metaTitle || post.title,
            metaDescription: post.seo?.metaDescription || post.description,
            keywords: post.seo?.keywords || post.tags.join(', '),
            canonicalUrl: post.seo?.canonicalUrl || `https://yunuskoc.com/blog/${post.id}`
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Blog yazısı güncellenemedi');
      }

      router.push('/admin/blog');
    } catch (err) {
      console.error('Blog yazısı güncellenirken hata:', err);
      setError(err instanceof Error ? err.message : 'Blog yazısı kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Yazısını Düzenle</h1>

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
            value={post.tags.join(', ')}
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

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isDraft"
            name="isDraft"
            checked={post.isDraft}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded 
              focus:ring-indigo-500"
          />
          <label htmlFor="isDraft" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
            Taslak olarak kaydet
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
              disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 