'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import { Logger } from '@/lib/logger';

interface Props {
  post: BlogPost;
}

export default function BlogCard({ post }: Props) {
  const handleClick = () => {
    Logger.info('Blog kartına tıklandı:', {
      slug: post.slug,
      title: post.title
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} onClick={handleClick} className="block h-full">
      <article className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <div className="relative h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-white text-center line-clamp-2">
              {post.title}
            </h2>
          </div>
        </div>
        
        <div className="p-8 flex-1 flex flex-col">
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-1 text-lg">
            {post.description}
          </p>
          <div className="mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                <span>·</span>
                <span>{post.readingTime} dk okuma</span>
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={`${post.slug}-${tag}`}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
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
  );
} 