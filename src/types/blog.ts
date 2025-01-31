export interface Source {
  title: string;
  url: string;
  description?: string;
}

export interface Author {
  name: string;
  title: string;
  avatarUrl: string;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  readingTime: number;
  coverImage?: string;
  tags: string[];
  isDraft: boolean;
  publishedAt: Date;
  updatedAt?: Date;
  author: Author;
  sources?: Source[];
  seo?: SEO;
}

export type BlogFormData = BlogPost; 