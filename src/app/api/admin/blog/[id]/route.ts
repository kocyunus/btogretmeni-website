import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { message: 'Blog yazısı ID\'si gereklidir' },
        { status: 400 }
      );
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return NextResponse.json(
        { message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    await BlogPost.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Blog yazısı başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blog silme hatası:', error);
    return NextResponse.json(
      { message: 'Blog yazısı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 