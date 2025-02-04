'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';
import { Logger } from '@/lib/logger';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        Logger.info('Projeler yükleniyor...');
        const response = await fetch('/api/projeler');
        
        if (!response.ok) {
          const errorText = await response.text();
          Logger.error('API yanıtı başarısız:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error('Projeler yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        Logger.debug('API yanıtı:', data);
        
        if (!data.success) {
          Logger.error('API yanıtı başarısız:', data);
          throw new Error(data.error || 'Projeler yüklenirken bir hata oluştu');
        }
        
        if (!Array.isArray(data.projects)) {
          Logger.error('API yanıtı geçersiz:', {
            projects: data.projects
          });
          throw new Error('Geçersiz API yanıtı');
        }
        
        setProjects(data.projects);
        Logger.info('Projeler başarıyla yüklendi:', { count: data.projects.length });
      } catch (err) {
        Logger.error('Projeler yüklenirken hata:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg text-center">
          <p>Projeler yüklenirken bir hata oluştu:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>Henüz hiç proje eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Projeler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/projeler/${project.slug}`}
            className="group block"
          >
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              {project.images && project.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={`${project.title} görüntüsü`}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {project.category}
                  </span>
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
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 