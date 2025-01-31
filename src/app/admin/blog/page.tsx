'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Blog yazıları alınamadı');
      }
      const data = await response.json();
      const formattedPosts = data.map((post: any) => ({
        ...post,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.error('Blog yazıları getirilirken hata:', err);
      setError('Blog yazıları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Blog yazısı silinemedi');
      }

      // Başarılı silme işleminden sonra listeyi güncelle
      await fetchPosts();
    } catch (err) {
      console.error('Blog yazısı silinirken hata:', err);
      setError('Blog yazısı silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Yazıları</h1>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Yeni Yazı
          </Link>
        </div>
        <div className="text-center py-8">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Yazıları</h1>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Yeni Yazı
          </Link>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Yazıları</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Yeni Yazı
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Henüz blog yazısı bulunmuyor
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{post.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                    <span>{post.readingTime} dk okuma</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 