import mongoose from 'mongoose';
import { Logger } from './logger';

if (!process.env.NEXT_PUBLIC_MONGODB_URI && !process.env.MONGODB_URI) {
  Logger.error('MONGODB_URI ortam değişkeni tanımlanmamış.');
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış.');
}

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global tip tanımlaması
declare global {
  var mongooseCache: MongooseCache;
}

// Global cache başlatma
if (!global.mongooseCache) {
  global.mongooseCache = {
    conn: null,
    promise: null
  };
}

export async function connectDB() {
  try {
    if (global.mongooseCache.conn) {
      Logger.debug('🗄️ DB connect mongodb - Mevcut bağlantı kullanılıyor');
      return global.mongooseCache.conn;
    }

    if (!global.mongooseCache.promise) {
      Logger.debug('🗄️ DB connect mongodb - Yeni bağlantı oluşturuluyor');
      
      const opts = {
        bufferCommands: true,
      };

      global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        Logger.info('MongoDB bağlantısı başarılı');
        return mongoose;
      });
    }

    global.mongooseCache.conn = await global.mongooseCache.promise;
    Logger.debug('🗄️ DB connect mongodb');
    return global.mongooseCache.conn;
  } catch (e) {
    Logger.error('MongoDB bağlantı hatası:', e);
    global.mongooseCache.promise = null;
    throw e;
  }
}

// TypeScript için global tip tanımlaması
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: typeof mongoose | undefined;
    }
  }
} 