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
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya yüklenemedi.' },
        { status: 400 }
      );
    }

    // Dosya türü kontrolü
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya türü. Sadece JPEG, PNG ve WebP formatları desteklenir.' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Dosya boyutu çok büyük. Maksimum 5MB desteklenir.' },
        { status: 400 }
      );
    }

    // Dosya adı oluştur
    const ext = file.type.split('/')[1];
    const filename = `${nanoid()}.${ext}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path, buffer);

    // Dosya URL'ini döndür
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 