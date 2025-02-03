'use server';

import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel, { BlogPostDocument } from '@/models/BlogPost';
import type { Document } from 'mongoose';
import type { BlogPost } from '@/types/blog';
import slugify from 'slugify';
import { Logger } from './logger';

// Model kontrolü
function getModel() {
  if (!BlogPostModel) {
    throw new Error('BlogPost modeli sadece server tarafında kullanılabilir.');
  }
  return BlogPostModel;
}

// MongoDB dökümanını BlogPost tipine dönüştür
function formatPost(doc: Document): BlogPost {
  const post = doc.toObject();
  return {
    ...post,
    _id: String(post._id),
    publishedAt: new Date(post.publishedAt || new Date()).toISOString()
  };
}

// Blog yazılarını getir
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    await connectToDatabase();
    const posts = await getModel().find()
      .sort({ publishedAt: -1 })
      .lean();
    return posts.map(post => ({
      ...post,
      _id: String(post._id),
      slug: post.slug || '',
      title: post.title || '',
      description: post.description || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      readingTime: post.readingTime || 0,
      tags: post.tags || [],
      isDraft: post.isDraft || false,
      publishedAt: post.publishedAt || new Date().toISOString(),
      author: {
        name: post.author?.name || '',
        image: post.author?.image || ''
      }
    }));
  } catch (error) {
    console.error('Blog yazıları getirilirken hata:', error);
    throw error;
  }
}

// Blog yazısını getir
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    await connectToDatabase();
    const post = await getModel().findOne({ slug }).lean();
    
    if (!post) return null;

    const formattedPost: BlogPost = {
      _id: String(post._id || ''),
      slug: String(post.slug || ''),
      title: String(post.title || ''),
      description: String(post.description || ''),
      content: String(post.content || ''),
      excerpt: String(post.excerpt || ''),
      readingTime: Number(post.readingTime || 0),
      tags: Array.isArray(post.tags) ? post.tags : [],
      isDraft: Boolean(post.isDraft),
      publishedAt: String(post.publishedAt || new Date().toISOString()),
      author: {
        name: String(post.author?.name || ''),
        image: String(post.author?.image || '')
      }
    };

    return formattedPost;
  } catch (error) {
    console.error('Blog yazısı getirilirken hata:', error);
    throw error;
  }
}

// Blog yazısı oluştur
export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  try {
    await connectToDatabase();
    const Model = getModel();
    const newPost = new Model({
      ...post,
      publishedAt: new Date(),
      isDraft: post.isDraft ?? true
    });
    await newPost.save();
    return formatPost(newPost);
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata:', error);
    throw error;
  }
}

// Blog yazısını güncelle
export async function updateBlogPost(slug: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    await connectToDatabase();
    const updatedPost = await getModel().findOneAndUpdate(
      { slug },
      { ...post, updatedAt: new Date() },
      { new: true }
    );
    return updatedPost ? formatPost(updatedPost) : null;
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    throw error;
  }
}

// Blog yazısını sil
export async function deleteBlogPost(slug: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const result = await getModel().findOneAndDelete({ slug });
    return !!result;
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    throw error;
  }
}

export async function updateAllBlogSlugs() {
  try {
    await connectToDatabase();
    
    // Tüm blog yazılarını al
    const posts = await getModel().find({});
    
    // Her bir yazı için slug oluştur ve güncelle
    for (const post of posts) {
      if (!post.slug && post.title) {
        const slug = slugify(post.title, {
          lower: true,
          strict: true,
          locale: 'tr'
        });
        
        await getModel().findByIdAndUpdate(post._id, { slug });
        Logger.info('Blog yazısı slug değeri güncellendi:', {
          id: post._id,
          title: post.title,
          slug
        });
      }
    }
    
    return { success: true, message: 'Tüm blog yazılarının slug değerleri güncellendi' };
  } catch (error) {
    Logger.error('Blog yazıları güncellenirken hata:', error);
    throw error;
  }
} 