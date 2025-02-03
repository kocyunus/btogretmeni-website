import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import slugify from 'slugify';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({});
    
    for (const project of projects) {
      if (!project.slug) {
        project.slug = slugify(project.title, {
          lower: true,
          strict: true,
          locale: 'tr'
        });
        await project.save();
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${projects.length} projenin slug'ları güncellendi` 
    });
  } catch (error) {
    console.error('Slug güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Slug\'lar güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 