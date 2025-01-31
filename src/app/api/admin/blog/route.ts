import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// Admin yetkisi kontrolü
async function checkAuth() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;
  return adminToken === process.env.ADMIN_TOKEN;
}

// Tüm blog yazılarını getir
export async function GET() {
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    await connectDB();
    const posts = await BlogPost.find({}).sort({ publishedAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog yazıları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Blog yazıları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı ekle
export async function POST(request: Request) {
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();
    const newPost = new BlogPost({
      ...data,
      publishedAt: new Date().toISOString().split('T')[0]
    });

    await newPost.save();
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Blog yazısı eklenirken hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Blog yazısını güncelle
export async function PUT(request: Request) {
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(
      data._id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Blog yazısını sil
export async function DELETE(request: Request) {
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await request.json();
    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 