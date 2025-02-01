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

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      Logger.api('DELETE', `/api/blog/${postId}`);
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Blog yazısı silinemedi');
      }

      Logger.info(`${postId} ID'li blog yazısı silindi`);
      await fetchPosts();
    } catch (error) {
      Logger.error('Blog yazısı silinirken hata oluştu', error);
      setError('Blog yazısı silinirken bir hata oluştu');
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post._id} className="flex flex-col h-full">
          {/* Kapak Resmi */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => onEdit(post)}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                title="Düzenle"
              >
                <FaEdit className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                title="Sil"
              >
                <FaTrash className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* İçerik */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {post.description}
            </p>
            
            {/* Meta Bilgiler */}
            <div className="mt-auto space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>{post.readingTime} dakika okuma</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTags className="w-4 h-4" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Durum */}
          {post.isDraft && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                Taslak
              </span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
} 