import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import slugify from 'slugify';
import type { ProjectResponse } from '@/types/project';
import { Logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// Tüm projeleri getir
export async function GET() {
  Logger.info('GET /api/projeler isteği alındı');
  
  try {
    await connectDB();
    Logger.info('MongoDB bağlantısı başarılı');

    const projects = await Project.find({})
      .sort({ publishedAt: -1 })
      .lean();
    
    Logger.info(`${projects.length} adet proje bulundu`);
    Logger.debug('Ham proje verileri:', projects);

    // Projeleri formatla
    const formattedProjects: ProjectResponse[] = projects.map(project => {
      try {
        return {
          _id: String(project._id),
          title: project.title || '',
          description: project.description || '',
          summary: project.summary || '',
          slug: project.slug || '',
          category: project.category || 'Diger',
          technologies: project.technologies || [],
          features: project.features || [],
          images: project.images || [],
          status: project.status || 'planned',
          isPublished: project.isPublished || false,
          startDate: project.startDate ? new Date(project.startDate).toISOString() : undefined,
          endDate: project.endDate ? new Date(project.endDate).toISOString() : undefined,
          demoUrl: project.demoUrl || '',
          githubUrl: project.githubUrl || '',
          downloadUrl: project.downloadUrl || '',
          playStoreUrl: project.playStoreUrl || '',
          appStoreUrl: project.appStoreUrl || '',
          createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : new Date().toISOString(),
          publishedAt: project.publishedAt ? new Date(project.publishedAt).toISOString() : project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString()
        };
      } catch (err) {
        Logger.error('Proje formatlanırken hata:', {
          error: err,
          project: project
        });
        throw err;
      }
    });

    Logger.debug('Formatlanmış proje verileri:', formattedProjects);

    return NextResponse.json({ 
      success: true, 
      projects: formattedProjects 
    });
  } catch (error) {
    Logger.error('Projeler getirilirken hata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Projeler getirilirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
}

// Yeni proje ekle
export async function POST(request: Request) {
  Logger.info('POST /api/projeler isteği alındı');
  
  try {
    const body = await request.json();
    Logger.debug('Gelen proje verisi:', body);
    
    await connectDB();
    Logger.info('MongoDB bağlantısı başarılı');

    // Slug oluştur
    const slug = slugify(body.title, {
      lower: true,
      strict: true,
      locale: 'tr'
    });

    // Slug'ın benzersiz olduğunu kontrol et
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      Logger.warn('Aynı başlıkta proje zaten var:', {
        title: body.title,
        slug: slug
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bu başlıkta bir proje zaten var' 
        },
        { status: 400 }
      );
    }

    // Status ve tarihleri ekle
    const projectData = {
      ...body,
      slug,
      status: 'planned',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.isPublished ? new Date() : undefined
    };
    
    const project = await Project.create(projectData);
    Logger.info('Yeni proje eklendi:', {
      id: project._id,
      title: project.title,
      slug: project.slug
    });
    
    const formattedProject: ProjectResponse = {
      _id: String(project._id),
      title: project.title,
      description: project.description,
      summary: project.summary || '',
      slug: project.slug,
      category: project.category,
      technologies: project.technologies || [],
      features: project.features || [],
      images: project.images || [],
      status: project.status,
      isPublished: project.isPublished,
      startDate: project.startDate ? new Date(project.startDate).toISOString() : undefined,
      endDate: project.endDate ? new Date(project.endDate).toISOString() : undefined,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      downloadUrl: project.downloadUrl || '',
      playStoreUrl: project.playStoreUrl || '',
      appStoreUrl: project.appStoreUrl || '',
      createdAt: new Date(project.createdAt).toISOString(),
      updatedAt: new Date(project.updatedAt).toISOString(),
      publishedAt: project.publishedAt ? new Date(project.publishedAt).toISOString() : undefined
    };

    Logger.debug('Formatlanmış yeni proje:', formattedProject);

    return NextResponse.json({ 
      success: true, 
      project: formattedProject
    }, { status: 201 });
  } catch (error) {
    Logger.error('Proje eklenirken hata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Proje eklenirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
} 