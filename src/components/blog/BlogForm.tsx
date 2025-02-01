import React from 'react';
import type { BlogFormData } from '@/types/blog';

interface BlogFormProps {
  formData: BlogFormData;
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BlogForm({ formData, saving, onChange, onSubmit }: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Başlık
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={(e) => onChange({
              ...e,
              target: { ...e.target, name: 'isDraft', value: e.target.checked }
            } as any)}
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
  );
} 