import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import type { BlogPost } from '@/types/blog';

// Blog yazısını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const post = await BlogPostModel.findOne({ _id: params.id });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı alınırken hata:', error);
    return NextResponse.json(
      { error: 'Blog yazısı alınamadı' },
      { status: 500 }
    );
  }
}

// Blog yazısını güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      params.id,
      {
        ...data,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Blog yazısı güncellenemedi' },
      { status: 500 }
    );
  }
}

// Blog yazısını sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;
    const deletedPost = await BlogPostModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Blog yazısı başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Blog yazısı silinemedi' },
      { status: 500 }
    );
  }
} 
