'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import type { ProjectResponse } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Projeleri getir
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projeler');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Projeler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Projeyi sil
  const handleDelete = async (slug: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/projeler/${slug}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        setProjects(projects.filter(p => p.slug !== slug));
        toast({
          title: 'Başarılı',
          description: 'Proje başarıyla silindi.'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Proje silinirken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  // Projenin yayın durumunu değiştir
  const togglePublish = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/projeler/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isPublished: !currentStatus
        })
      });
      const data = await response.json();

      if (data.success) {
        setProjects(projects.map(p => 
          p.slug === slug ? { ...p, isPublished: !currentStatus } : p
        ));
        toast({
          title: 'Başarılı',
          description: `Proje ${!currentStatus ? 'yayınlandı' : 'yayından kaldırıldı'}.`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem sırasında bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (projects.length === 0) {
    return <div className="text-gray-500">Henüz proje eklenmemiş.</div>;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.slug} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePublish(project.slug, project.isPublished || false)}
                title={project.isPublished ? 'Yayından Kaldır' : 'Yayınla'}
              >
                {project.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
              </Button>
              <div className="flex space-x-2">
                <Link
                  href={`/admin/projects/${project.slug}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(project.slug)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 