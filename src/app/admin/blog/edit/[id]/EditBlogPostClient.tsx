'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';

interface FormData {
  title: string;
  description: string;
  content: string;
  excerpt: string;
  readingTime: number;
  coverImage?: string;
  tags: string[];
  isDraft: boolean;
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
}

const initialFormData: FormData = {
  title: '',
  description: '',
  content: '',
  excerpt: '',
  readingTime: 5,
  coverImage: '',
  tags: [],
  isDraft: true,
  author: {
    name: '',
    title: '',
    avatarUrl: ''
  }
};

export default function EditBlogPostClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) throw new Error('Blog yazısı yüklenemedi');
        const data: BlogPost = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content,
          excerpt: data.excerpt,
          readingTime: data.readingTime,
          coverImage: data.coverImage,
          tags: data.tags,
          isDraft: data.isDraft || false,
          author: data.author
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      }
    }
    fetchPost();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Blog yazısı güncellenirken bir hata oluştu');
      }

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Hata: {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Başlık
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          placeholder="Blog yazısı başlığı"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          placeholder="Blog yazısının kısa açıklaması"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          İçerik
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          placeholder="Blog yazısının içeriği"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Etiketler (virgülle ayırın)
        </label>
        <input
          id="tags"
          type="text"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Örnek: eğitim, teknoloji, kodlama"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
      </button>
    </form>
  );
} 