'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

interface Props {
  post: BlogPost;
}

export default function BlogCard({ post }: Props) {
  return (
    <Link href={`/blog/${post._id}`}>
      <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h2 className="text-xl font-bold text-white text-center line-clamp-2">
              {post.title}
            </h2>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-gray-300 mb-4 line-clamp-3 flex-1">
            {post.description}
          </p>
          <div className="mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
              <span>{post.readingTime} dk okuma</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
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
  );
} 