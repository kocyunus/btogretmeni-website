'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { Card } from '@/components/ui/Card';
import { FaEdit, FaTrash, FaClock, FaCalendar, FaTags } from 'react-icons/fa';
import { Logger } from '@/lib/logger';

interface BlogListProps {
  onEdit: (post: BlogPost) => void;
}

export function BlogList({ onEdit }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      Logger.api('GET', '/api/blog');
      const response = await fetch('/api/blog');
      
      if (!response.ok) {
        throw new Error('Blog yazıları alınamadı');
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.posts)) {
        Logger.error('Geçersiz API yanıtı', data);
        setError('Blog yazıları yüklenirken bir hata oluştu');
        setPosts([]);
        return;
      }

      setPosts(data.posts);
      Logger.info(`${data.posts.length} blog yazısı yüklendi`);
    } catch (error) {
      Logger.error('Blog yazıları yüklenirken hata oluştu', error);
      setError('Blog yazıları yüklenirken bir hata oluştu');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      Logger.api('DELETE', `/api/blog/${slug}`);
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Blog yazısı silinirken bir hata oluştu');
      }

      Logger.info(`${slug} ID'li blog yazısı silindi`);
      await fetchPosts();
    } catch (error) {
      Logger.error('Blog yazısı silinirken hata oluştu', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Henüz blog yazısı bulunmuyor
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(post)}
                className="text-blue-600 hover:text-blue-800"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(post.slug)}
                className="text-red-600 hover:text-red-800"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 