export interface Source {
  title: string;
  url: string;
  description?: string;
}

export interface Author {
  name: string;
  title?: string;
  image: string;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  publishedAt: string;
  updatedAt?: string;
  isDraft: boolean;
  tags: string[];
  author: {
    name: string;
    image?: string;
  };
  sources?: Source[];
  seo?: SEO;
}

export type BlogFormData = BlogPost; 