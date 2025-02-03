'use client';

import { useState } from 'react';
import { BlogPost } from '@/types/blog';

interface BlogFormProps {
  post?: BlogPost | null;
  onClose: () => void;
  isOpen: boolean;
}

export function BlogForm({ post, onClose, isOpen }: BlogFormProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    post || {
      title: '',
      description: '',
      content: '',
      excerpt: '',
      readingTime: 5,
      tags: [],
      isDraft: true,
      author: {
        name: 'Yunus Koç',
        image: '/images/avatar.jpg'
      }
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        post ? `/api/blog/${post.slug}` : '/api/blog',
        {
          method: post ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Bir hata oluştu');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setSaving(false);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {post ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Başlık</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Açıklama</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1">İçerik</label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Özet</label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Etiketler (virgülle ayırın)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={handleTagsChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">Okuma Süresi (dakika)</label>
            <input
              type="number"
              name="readingTime"
              value={formData.readingTime || 5}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              min="1"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDraft"
              checked={formData.isDraft}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isDraft: e.target.checked }))
              }
              className="rounded dark:bg-gray-700"
            />
            <label>Taslak olarak kaydet</label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={saving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 