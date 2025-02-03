'use client';

import { Suspense } from 'react';
import ProjectList from '@/components/admin/ProjectList';
import ProjectForm from '@/components/admin/ProjectForm';
import { Card } from '@/components/ui/Card';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Proje Yönetimi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yeni Proje Ekleme Formu */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Yeni Proje Ekle</h2>
          <ProjectForm />
        </Card>

        {/* Mevcut Projeler Listesi */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Mevcut Projeler</h2>
          <Suspense fallback={<div>Projeler yükleniyor...</div>}>
            <ProjectList />
          </Suspense>
        </Card>
      </div>
    </div>
  );
} 