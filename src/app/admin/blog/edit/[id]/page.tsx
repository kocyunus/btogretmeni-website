// page.tsx - Server Component
import { Metadata } from 'next';
import { getBlogPost } from '@/lib/blog';
import EditBlogPostClient from './EditBlogPostClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id);
  
  return {
    title: `${post?.title || 'Blog Yazısı'} Düzenle`,
    description: 'Blog yazısını düzenle',
    robots: 'noindex, nofollow'
  };
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  return <EditBlogPostClient params={params} />;
} 