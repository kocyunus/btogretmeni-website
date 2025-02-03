export type ProjectCategory = 'MobilOyun' | 'WebSite' | 'PlayableAds' | 'RobotikEgitim' | 'Diger';

export interface ProjectImage {
  url: string;
  alt?: string;
}

export type ProjectStatus = 'planned' | 'in-progress' | 'completed';

export interface Project {
  _id: string;
  title: string;
  description: string;
  summary: string;  // En fazla 150 karakter
  slug: string;
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  images: string[];
  status: ProjectStatus;
  isPublished: boolean;
  startDate?: string;
  endDate?: string;
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;  // İndirme bağlantısı
  playStoreUrl?: string;
  appStoreUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type ProjectResponse = Project; 