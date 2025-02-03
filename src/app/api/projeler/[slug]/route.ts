import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const project = await Project.findOne({ slug: params.slug });
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    const formattedProject = {
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
      startDate: project.startDate ? project.startDate.toISOString() : undefined,
      endDate: project.endDate ? project.endDate.toISOString() : undefined,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      downloadUrl: project.downloadUrl || '',
      createdAt: project.createdAt ? project.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: project.updatedAt ? project.updatedAt.toISOString() : new Date().toISOString(),
      publishedAt: project.publishedAt ? project.publishedAt.toISOString() : project.createdAt ? project.createdAt.toISOString() : new Date().toISOString()
    };

    return NextResponse.json({ success: true, project: formattedProject });
  } catch (error) {
    console.error('Proje alınırken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Proje alınamadı' },
      { status: 500 }
    );
  }
}

// Projeyi güncelle
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    const project = await Project.findOneAndUpdate(
      { slug: params.slug },
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Proje güncellenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

// Projeyi sil
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const project = await Project.findOneAndDelete({ slug: params.slug });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Proje başarıyla silindi' 
    });
  } catch (error) {
    console.error('Proje silinirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Proje silinemedi' },
      { status: 500 }
    );
  }
} 