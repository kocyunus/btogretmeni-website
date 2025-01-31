import React, { Suspense } from 'react';
import { getBlogPosts } from '@/lib/blog';
import BlogLoading from '@/components/blog/BlogLoading';
import BlogError from '@/components/blog/BlogError';
import Link from 'next/link';

// Gradient renk kombinasyonları
const gradients = [
  'from-blue-500 via-purple-500 to-pink-500',
  'from-green-400 via-teal-500 to-blue-500',
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-500 via-indigo-500 to-blue-500',
  'from-yellow-400 via-orange-500 to-red-500'
];

async function BlogPosts() {
  try {
    const posts = await getBlogPosts();

    if (!posts || posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Henüz blog yazısı bulunmuyor</h2>
          <p className="text-gray-400">Yakında yeni yazılar eklenecek...</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <div className={`relative h-48 bg-gradient-to-r ${gradients[index % gradients.length]} p-6 flex items-center justify-center`}>
                <h2 className="text-2xl font-bold text-white text-center line-clamp-3">
                  {post.title}
                </h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold">
                        {post.author.name.charAt(0)}
                      </div>
                      <span className="text-gray-300 ml-2">{post.author.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{post.readingTime} dk okuma</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Blog yazıları yüklenirken hata oluştu:', error);
    return <BlogError />;
  }
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Blog</h1>
      <Suspense fallback={<BlogLoading type="list" />}>
        <BlogPosts />
      </Suspense>
    </div>
  );
} 