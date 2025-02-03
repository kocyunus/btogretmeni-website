import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projelerim | BT Öğretmeni',
  description: 'Mobil oyunlar, web siteleri, eğitim projeleri ve daha fazlası.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 