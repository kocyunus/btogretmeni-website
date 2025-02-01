'use client';

import { useEffect, useState } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import { Logger } from '@/lib/logger';
import type { BlogPost } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        Logger.debug('Blog yazıları yükleniyor...');
        
        const response = await fetch('/api/blog');
        const data = await response.json();
        
        if (!response.ok) {
          Logger.error('API yanıtı başarısız', {
            status: response.status,
            statusText: response.statusText,
            error: data.error
          });
          throw new Error(data.error);
        }
        
        Logger.info(`${data.posts.length} blog yazısı yüklendi`);
        setPosts(data.posts);
      } catch (err) {
        const errorMessage = 'Blog yazıları yüklenirken bir hata oluştu';
        Logger.error(errorMessage, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    Logger.debug('Blog sayfası yükleniyor...');
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    Logger.warn('Blog sayfasında hata görüntüleniyor', { error });
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-100">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  Logger.debug('Blog sayfası render ediliyor', { postCount: posts.length });
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Henüz blog yazısı bulunmuyor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
