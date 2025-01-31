import { Metadata, Viewport } from 'next';

// Metadata tanımlaması
export const metadata: Metadata = {
  title: 'Yeni Blog Yazısı | BT Öğretmeni',
  description: 'Yeni bir blog yazısı oluştur',
};

// Viewport tanımlaması
export const viewport: Viewport = {
  themeColor: '#4F46E5',
};

export default function NewBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 