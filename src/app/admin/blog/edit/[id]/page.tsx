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

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Blog yazısı bulunamadı
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Yazısını Düzenle</h1>
      <EditBlogPostClient post={post} />
    </div>
  );
} 