'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

interface Props {
  posts: BlogPost[];
}

export default function BlogList({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post._id} href={`/blog/${post._id}`}>
          <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <div className="relative h-48">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-gray-200 mb-2">{post.title}</h2>
              <p className="text-gray-400 mb-4 flex-1">{post.excerpt}</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {post.author.image && (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={post.author.image}
                          alt={post.author.name}
                        />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-200">
                        {post.author.name}
                      </p>
                    </div>
                  </div>
                  <span>{post.readingTime} dk okuma</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
}