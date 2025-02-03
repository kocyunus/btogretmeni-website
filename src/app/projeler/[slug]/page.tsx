'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg text-center">
          <p>Proje yüklenirken bir hata oluştu:</p>
          <p className="font-mono text-sm mt-2">{error || 'Proje bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Kısım - Başlık ve Kategori */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/projeler"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            ← Projelere Dön
          </Link>
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {project.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold">{project.title}</h1>
      </div>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Proje Detayları */}
        <div className="lg:col-span-2">
          {/* Resim Galerisi */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={image}
                      alt={`${project.title} - Görsel ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proje Açıklaması */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{project.description}</div>
          </div>
        </div>

        {/* Sağ Kolon - Proje Bilgileri */}
        <div className="space-y-6">
          {/* Proje Durumu */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Proje Bilgileri</h2>
            
            {/* Proje Özeti */}
            {project.summary && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Özet</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {project.summary}
                </dd>
              </div>
            )}

            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Durum</dt>
                <dd className="mt-1 font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {project.status === 'completed' ? 'Tamamlandı' :
                     project.status === 'in-progress' ? 'Devam Ediyor' :
                     'Planlanıyor'}
                  </span>
                </dd>
              </div>
              
              {project.startDate && (
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Başlangıç Tarihi</dt>
                  <dd className="mt-1 font-medium">
                    {new Date(project.startDate).toLocaleDateString('tr-TR')}
                  </dd>
                </div>
              )}
              
              {project.endDate && (
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Bitiş Tarihi</dt>
                  <dd className="mt-1 font-medium">
                    {new Date(project.endDate).toLocaleDateString('tr-TR')}
                  </dd>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Teknolojiler</dt>
                  <dd className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Proje Bağlantıları */}
          {(project.demoUrl || project.githubUrl || project.downloadUrl) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Bağlantılar</h2>
              <div className="space-y-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Canlı Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    GitHub
                  </a>
                )}
                {project.downloadUrl && (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    İndir
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 