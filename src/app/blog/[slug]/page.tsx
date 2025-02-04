import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import BlogLoading from '@/components/blog/BlogLoading';
import { getBlogPost } from '@/lib/blog';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı',
      description: 'Aradığınız blog yazısı bulunamadı.'
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://yunuskoc.com/blog/${post.slug}`,
      type: 'article',
      authors: [post.author.name]
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800/50 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          <Suspense fallback={<BlogLoading type="detail" />}>
            <BlogPostDetail slug={params.slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 