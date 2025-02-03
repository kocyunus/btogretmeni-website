import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proje Yönetimi | Admin Panel',
  description: 'Proje ekleme, düzenleme ve silme işlemleri.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 