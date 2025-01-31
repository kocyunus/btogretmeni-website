'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getBlogPost } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';

// Varsayılan gradient arka plan renkleri
const gradientColors = {
  from: 'from-blue-500',
  to: 'to-purple-600'
};

interface Props {
  id: string;
}

export default function BlogPostDetail({ id }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getBlogPost(id);
        if (!data) {
          setError('Blog yazısı bulunamadı');
          return;
        }
        setPost(data);
      } catch (err) {
        console.error('Blog yazısı yüklenirken hata:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      }
    }

    fetchPost();
  }, [id]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} text-white p-8 rounded-lg mb-8`}>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            {post.author.name[0]}
          </div>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm opacity-75">{post.author.title}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">{post.description}</p>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Etiketler</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={`${post.id}-tag-${index}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {post.sources && post.sources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Kaynaklar</h2>
          <ul className="list-disc list-inside space-y-2">
            {post.sources.map((source, index) => (
              <li key={`${post.id}-source-${index}`}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {source.title}
                </a>
                {source.description && (
                  <p className="text-gray-600 text-sm ml-6">{source.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
} 
