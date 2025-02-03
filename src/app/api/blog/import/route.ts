import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Logger } from '@/lib/logger';

export async function POST() {
  try {
    Logger.info('Blog yazıları import işlemi başlatıldı');
    
    // MongoDB'ye bağlan
    await connectToDatabase();
    
    // Blog posts dizinini oku
    const postsDirectory = path.join(process.cwd(), 'src/data/blog-posts');
    const files = await fs.readdir(postsDirectory);
    
    let importedCount = 0;
    let updatedCount = 0;
    
    // Her markdown dosyasını işle
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(postsDirectory, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      // Frontmatter ve içeriği ayır
      const { data, content } = matter(fileContent);
      
      // Önce bu başlıkla bir yazı var mı kontrol et
      const existingPost = await BlogPostModel.findOne({ slug: data.slug });
      
      if (existingPost) {
        // Varsa güncelle
        await BlogPostModel.findOneAndUpdate(
          { slug: existingPost.slug },
          {
            ...data,
            content: content,
            excerpt: data.excerpt,
            readingTime: data.readingTime,
            tags: data.tags,
            isDraft: data.isDraft,
            publishedAt: new Date(data.publishedAt),
            author: data.author,
            coverImage: data.coverImage,
            updatedAt: new Date().toISOString()
          }
        );
        updatedCount++;
        Logger.info(`Blog yazısı güncellendi: ${data.title}`);
      } else {
        // Yoksa yeni ekle
        const post = new BlogPostModel({
          title: data.title,
          description: data.description,
          content: content,
          excerpt: data.excerpt,
          readingTime: data.readingTime,
          tags: data.tags,
          isDraft: data.isDraft,
          publishedAt: new Date(data.publishedAt),
          author: data.author,
          coverImage: data.coverImage
        });
        
        await post.save();
        importedCount++;
        Logger.info(`Yeni blog yazısı eklendi: ${data.title}`);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Blog yazıları başarıyla işlendi. ${importedCount} yeni yazı eklendi, ${updatedCount} yazı güncellendi.`
    });
    
  } catch (error) {
    Logger.error('Blog yazıları import edilirken hata oluştu:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Blog yazıları import edilirken bir hata oluştu'
      },
      { status: 500 }
    );
  }
} 