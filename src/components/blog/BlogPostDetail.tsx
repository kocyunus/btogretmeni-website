'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getBlogPost } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogError from './BlogError';
import BlogLoading from './BlogLoading';
import { Logger } from '@/lib/logger';

// Varsayılan gradient arka plan renkleri
const gradientColors = {
  from: 'from-blue-500',
  to: 'to-purple-600'
};

// Alt bileşenler
const BlogHeader = ({ post }: { post: BlogPost }) => (
  <div className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} text-white p-8 rounded-lg mb-8`}>
    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
    <div className="flex items-center gap-4">
      {post.author.image && (
        <img
          src={post.author.image}
          alt={post.author.name}
          className="w-12 h-12 rounded-full"
        />
      )}
      <div>
        <p className="font-medium">{post.author.name}</p>
      </div>
    </div>
  </div>
);

const BlogContent = ({ content, description }: { content: string; description: string }) => (
  <div className="prose prose-lg max-w-none">
    <p className="text-xl text-gray-600 mb-8">{description}</p>
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);

const BlogTags = ({ tags }: { tags: string[] }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Etiketler</h2>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const BlogSources = ({ sources }: { sources: BlogPost['sources'] }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Kaynaklar</h2>
    <ul className="list-disc list-inside space-y-2">
      {sources?.map((source, index) => (
        <li key={index}>
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
);

interface Props {
  slug: string;
}

export default function BlogPostDetail({ slug }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPost() {
      try {
        Logger.info('Blog yazısı yükleniyor:', { slug });
        const data = await getBlogPost(slug);
        
        if (!isMounted) {
          Logger.info('Bileşen unmount edildi, state güncellenmeyecek');
          return;
        }
        
        if (!data) {
          Logger.error('Blog yazısı bulunamadı:', { slug });
          setError('Blog yazısı bulunamadı');
          return;
        }

        Logger.info('Blog yazısı başarıyla yüklendi:', { 
          slug: data.slug,
          title: data.title 
        });
        setPost(data);
      } catch (err) {
        if (!isMounted) return;
        Logger.error('Blog yazısı yüklenirken hata:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      }
    }

    fetchPost();
    return () => { isMounted = false; };
  }, [slug]);

  if (error) {
    Logger.warn('Blog yazısı görüntülenirken hata:', { error });
    return <BlogError message={error} />;
  }

  if (!post) {
    Logger.debug('Blog yazısı yükleniyor...');
    return <BlogLoading type="detail" />;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4">
          {post.author.image && (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="text-white font-medium">{post.author.name}</p>
            <p className="text-white/80 text-sm">
              {new Date(post.publishedAt).toLocaleDateString('tr-TR')} · {post.readingTime} dk okuma
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{post.description}</p>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Etiketler</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Kaynaklar</h2>
          <ul className="list-disc list-inside space-y-2">
            {post.sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {source.title}
                </a>
                {source.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm ml-6">
                    {source.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
} 
