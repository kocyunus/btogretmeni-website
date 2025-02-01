'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { Logger } from '@/lib/logger';

interface BlogFormProps {
  post?: BlogPost | null;
  onClose: () => void;
  isOpen: boolean;
}

export function BlogForm({ post, onClose, isOpen }: BlogFormProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    description: '',
    content: '',
    excerpt: '',
    readingTime: 5,
    tags: [],
    isDraft: true,
    author: {
      name: 'Yunus Emre',
    },
  });

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = post ? `/api/blog/${post._id}` : '/api/blog';
      const method = post ? 'PUT' : 'POST';

      Logger.api(method, url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Blog yazısı kaydedilemedi');
      }

      Logger.info(`Blog yazısı başarıyla ${post ? 'güncellendi' : 'oluşturuldu'}`);
      onClose();
    } catch (error) {
      Logger.error('Blog yazısı kaydedilirken hata oluştu', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">
          {post ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">İçerik</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Özet</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Etiketler (virgülle ayırın)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags?.join(', ')}
              onChange={handleTagsChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Okuma Süresi (dakika)
            </label>
            <input
              type="number"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              {post ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 