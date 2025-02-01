'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash/debounce';
import type { BlogFormData, BlogPost } from '@/types/blog';

// Varsayılan gradient arka plan renkleri
const gradientClasses = 'bg-gradient-to-r from-blue-500 to-purple-600';

interface Props {
  id: string;
}

export default function BlogEditForm({ id }: Props) {
  const router = useRouter();
  const initialPost: BlogPost = {
    _id: '',
    title: '',
    description: '',
    content: '',
    excerpt: '',
    readingTime: 5,
    coverImage: '',
    tags: [],
    isDraft: true,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'Yunus Koç',
      image: '/images/avatar.jpg'
    },
    sources: []
  };
  const [post, setPost] = useState<BlogFormData>(initialPost);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');

  // Blog yazısını getir
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error('Blog yazısı getirilemedi');
        }
        const data = await response.json();
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Blog yazısı getirilirken hata:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      }
    }

    fetchPost();
  }, [id]);

  // Form verilerini local storage'a kaydet
  const saveToLocalStorage = useCallback((data: BlogFormData) => {
    localStorage.setItem(`blog-edit-${id}`, JSON.stringify(data));
    setAutoSaveStatus('Taslak otomatik kaydedildi');
    setTimeout(() => setAutoSaveStatus(''), 2000);
  }, [id]);

  // Otomatik kaydetme için debounce fonksiyonu
  const debouncedSave = useCallback(
    debounce((data: BlogFormData) => saveToLocalStorage(data), 1000),
    [saveToLocalStorage]
  );

  // Local storage'dan form verilerini yükle
  useEffect(() => {
    const savedData = localStorage.getItem(`blog-edit-${id}`);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setPost(prevPost => ({ ...prevPost, ...data }));
      } catch (err) {
        console.error('Kaydedilmiş veri yüklenirken hata:', err);
      }
    }
  }, [id]);

  // Form değişikliklerini işle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPost = { ...post };
    
    if (name === 'tags') {
      updatedPost.tags = value.split(',').map(tag => tag.trim());
    } else if (name === 'readingTime') {
      updatedPost.readingTime = Number(value);
    } else {
      (updatedPost as any)[name] = value;
    }
    
    setPost(updatedPost);
    debouncedSave(updatedPost);
  };

  // Form gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Blog yazısı güncellenemedi');
      }

      localStorage.removeItem(`blog-edit-${id}`);
      router.push('/admin/blog');
    } catch (err) {
      console.error('Blog yazısı güncellenirken hata:', err);
      setError('Blog yazısı kaydedilirken bir hata oluştu');
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Yazısını Düzenle</h1>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
            hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {showPreview ? 'Düzenlemeye Dön' : 'Önizleme'}
        </button>
      </div>

      {autoSaveStatus && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {autoSaveStatus}
        </div>
      )}

      {showPreview ? (
        <div className="prose dark:prose-invert max-w-none">
          <div className={`relative w-full h-64 mb-8 rounded-lg overflow-hidden ${gradientClasses}`}>
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
              {post.title || 'Blog Yazısı'}
            </div>
          </div>
          <h1>{post.title || 'Başlık'}</h1>
          <p className="lead">{post.description || 'Açıklama'}</p>
          <ReactMarkdown>{post.content || 'İçerik'}</ReactMarkdown>
        </div>
      ) : (
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
              rows={2}
              className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
                border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
              placeholder="Blog yazısının kısa bir özeti"
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
              value={post.tags?.join(', ')}
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
                value={post.readingTime.toString()}
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
                checked={post.isDraft}
                onChange={handleChange}
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
      )}
    </div>
  );
} 