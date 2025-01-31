export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  screenshots: string[];
  rating: number;
  downloads: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  isPublished: boolean;
  features?: string[];
  requirements?: {
    android?: string;
    ios?: string;
  };
  developer: {
    name: string;
    website?: string;
  };
  version: string;
  size?: string;
  lastUpdate?: Date;
  privacyPolicy?: string;
  termsOfService?: string;
  supportEmail?: string;
  status: 'draft' | 'published' | 'archived';
} 