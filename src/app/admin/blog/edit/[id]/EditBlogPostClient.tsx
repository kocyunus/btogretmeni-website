'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';

export default function EditBlogPostClient({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    _id: post._id,
    title: post.title,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt,
    readingTime: typeof post.readingTime === 'string' ? parseInt(post.readingTime) : post.readingTime,
    coverImage: post.coverImage,
    tags: post.tags,
    isDraft: post.isDraft || false,
    publishedAt: post.publishedAt,
    author: {
      name: post.author.name,
      image: post.author.image
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/blog/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="readingTime" className="block text-sm font-medium text-gray-300">
          Reading Time (minutes)
        </label>
        <input
          type="number"
          id="readingTime"
          name="readingTime"
          value={formData.readingTime}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300">
          Cover Image URL
        </label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="isDraft" className="block text-sm font-medium text-gray-300">
          Draft
        </label>
        <input
          type="checkbox"
          id="isDraft"
          name="isDraft"
          checked={formData.isDraft}
          onChange={(e) => setFormData(prev => ({ ...prev, isDraft: e.target.checked }))}
          className="mt-1 h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-300">
          Published At
        </label>
        <input
          type="date"
          id="publishedAt"
          name="publishedAt"
          value={formData.publishedAt.split('T')[0]}
          onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="author.name" className="block text-sm font-medium text-gray-300">
          Author Name
        </label>
        <input
          type="text"
          id="author.name"
          name="author.name"
          value={formData.author.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="author.image" className="block text-sm font-medium text-gray-300">
          Author Image URL
        </label>
        <input
          type="text"
          id="author.image"
          name="author.image"
          value={formData.author.image || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 