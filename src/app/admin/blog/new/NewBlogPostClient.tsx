'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlogForm } from '@/hooks/useBlogForm';
import BlogForm from '@/components/blog/BlogForm';

export default function NewBlogPostClient() {
  const router = useRouter();
  const { formData, error, saving, handleChange, handleSubmit } = useBlogForm({
    onSuccess: () => router.push('/admin/blog')
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <BlogForm
        formData={formData}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 