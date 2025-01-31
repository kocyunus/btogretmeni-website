import { Metadata } from 'next';
import NewBlogPostClient from './NewBlogPostClient';

export const metadata: Metadata = {
  title: 'Yeni Blog Yazısı',
  description: 'Yeni bir blog yazısı oluştur',
  robots: 'noindex, nofollow'
};

export default function NewBlogPostPage() {
  return <NewBlogPostClient />;
} 