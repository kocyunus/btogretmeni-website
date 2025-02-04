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
    <article className="p-6 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg mb-8 shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4">
          {post.author.image && (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-12 h-12 rounded-full border-2 border-white/20"
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
      <div className="prose prose-lg max-w-none bg-white dark:bg-transparent rounded-lg
        prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-h1:text-3xl prose-h1:font-bold
        prose-h2:text-2xl prose-h2:font-semibold
        prose-h3:text-xl prose-h3:font-medium
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-bold
        prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg
        prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4
        prose-ul:text-gray-700 dark:prose-ul:text-gray-300
        prose-ol:text-gray-700 dark:prose-ol:text-gray-300
        prose-li:text-gray-700 dark:prose-li:text-gray-300
        prose-table:border-collapse
        prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:p-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-2
        prose-img:rounded-lg prose-img:shadow-md">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium leading-relaxed">{post.description}</p>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Etiketler</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kaynaklar</h2>
          <ul className="list-disc list-inside space-y-3">
            {post.sources.map((source, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {source.title}
                </a>
                {source.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 ml-6">
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
