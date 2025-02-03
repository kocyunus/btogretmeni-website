import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

// İzin verilen dosya türleri
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Dosya adını oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = join(uploadDir, fileName);
      
      // Dosyayı kaydet
      await writeFile(filePath, buffer);
      urls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ 
      success: true, 
      urls 
    });
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Dosyalar yüklenirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
} 