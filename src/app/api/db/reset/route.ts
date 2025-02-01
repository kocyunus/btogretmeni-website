import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Logger } from '@/lib/logger';

export async function GET() {
  try {
    Logger.api('GET', '/api/db/reset');
    
    // Veritabanına bağlan
    await connectToDatabase();
    Logger.db('connect', 'mongodb');

    if (!mongoose.connection.db) {
      throw new Error('Veritabanı bağlantısı başarısız');
    }

    // Mevcut tüm veritabanlarını listele
    const adminDb = mongoose.connection.db.admin();
    const dbList = await adminDb.listDatabases();
    
    // Her veritabanını kontrol et ve sil
    for (const db of dbList.databases) {
      // Admin ve config veritabanlarını atla
      if (!['admin', 'config', 'local'].includes(db.name)) {
        Logger.debug(`${db.name} veritabanı siliniyor...`);
        await mongoose.connection.useDb(db.name).dropDatabase();
        Logger.db('drop', `database: ${db.name}`);
      }
    }

    Logger.info('Tüm veritabanları temizlendi');

    // Yeni veritabanı yapısını oluştur
    const btogretmeniDb = mongoose.connection.useDb('btogretmeni');
    
    // blogposts koleksiyonunu oluştur
    await btogretmeniDb.createCollection('blogposts');
    Logger.db('create', 'btogretmeni.blogposts');

    return NextResponse.json({ 
      message: 'Veritabanı yapısı başarıyla sıfırlandı',
      database: 'btogretmeni',
      collections: ['blogposts']
    });

  } catch (error) {
    Logger.error('Veritabanı sıfırlanırken hata oluştu', error);
    return NextResponse.json(
      { error: 'Veritabanı sıfırlanamadı' },
      { status: 500 }
    );
  }
} 