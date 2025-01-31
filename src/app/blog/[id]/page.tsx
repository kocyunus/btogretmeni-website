import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import BlogLoading from '@/components/blog/BlogLoading';
import BlogError from '@/components/blog/BlogError';
import { getBlogPost } from '@/lib/blog';
import { Metadata } from 'next';

// Varsayılan gradient arka plan renkleri
const gradientColors = {
  from: 'from-blue-500',
  to: 'to-purple-600'
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id);
  
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
      url: `https://yunuskoc.com/blog/${post.id}`,
      type: 'article',
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  
  if (!post) {
    notFound();
  }

  return (
    <Suspense fallback={<BlogLoading type="detail" />}>
      <BlogPostDetail id={params.id} />
    </Suspense>
  );
} 
