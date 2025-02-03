'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/project';

interface EditProjectPageProps {
  params: {
    slug: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projeler/${params.slug}`);
        if (!response.ok) {
          throw new Error('Proje bulunamadı');
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Proje bulunamadı');
        }
        setProject(data.project);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  const handleSuccess = () => {
    router.push('/admin/projects');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg text-center">
          <p>Proje yüklenirken bir hata oluştu:</p>
          <p className="font-mono text-sm mt-2">{error || 'Proje bulunamadı'}</p>
          <Button
            onClick={() => router.push('/admin/projects')}
            className="mt-4"
          >
            Projelere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Proje Düzenle: {project.title}</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/projects')}
        >
          Projelere Dön
        </Button>
      </div>

      <Card className="p-6">
        <ProjectForm 
          project={project}
          onSuccess={handleSuccess}
          onSubmit={async (data) => {
            const response = await fetch(`/api/projeler/${project.slug}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Proje güncellenirken bir hata oluştu');
            }
            
            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || 'Proje güncellenirken bir hata oluştu');
            }
          }}
        />
      </Card>
    </div>
  );
} 