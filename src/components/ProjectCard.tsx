'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaGooglePlay, FaAppStore, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Açıklama metnini kısaltma fonksiyonu
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Varsayılan resim URL'si
  const defaultImage = '/images/project-placeholder.jpg';

  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="block group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Resim Alanı */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.images?.[0] || defaultImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* İçerik Alanı */}
        <div className="flex-1 p-6">
          {/* Kategori */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {project.category}
            </span>
          </div>

          {/* Başlık */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>

          {/* Açıklama */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {truncateDescription(project.description)}
          </p>

          {/* Teknolojiler */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alt Kısım - Linkler */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
                <span>Demo</span>
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FaGithub className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
            )}
            {project.playStoreUrl && (
              <Link
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
              >
                <FaGooglePlay className="w-4 h-4" />
                <span>Play Store</span>
              </Link>
            )}
            {project.appStoreUrl && (
              <Link
                href={project.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <FaAppStore className="w-4 h-4" />
                <span>App Store</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 