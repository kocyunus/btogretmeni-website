'use client';

import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { FaBlog, FaProjectDiagram, FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminPage() {
  const adminCards = [
    {
      title: 'Blog Yönetimi',
      description: 'Blog yazılarını ekle, düzenle ve sil',
      icon: FaBlog,
      link: '/admin/blog'
    },
    {
      title: 'Proje Yönetimi',
      description: 'Projelerini yönet ve güncelle',
      icon: FaProjectDiagram,
      link: '/admin/projects'
    },
    {
      title: 'Eğitim Yönetimi',
      description: 'Eğitim içeriklerini düzenle',
      icon: FaGraduationCap,
      link: '/admin/education'
    }
  ];

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Link href={card.link} key={index}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <card.icon className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
} 