import mongoose from 'mongoose';
import { Logger } from './logger';

type CachedType = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: CachedType | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

let cached: CachedType = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    Logger.debug('Mevcut MongoDB bağlantısı kullanılıyor');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    Logger.debug('Yeni MongoDB bağlantısı oluşturuluyor');
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      Logger.info('MongoDB bağlantısı başarılı');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    Logger.error('MongoDB bağlantısı başarısız', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectFromDatabase() {
  try {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      console.log('MongoDB bağlantısı kapatıldı');
    }
  } catch (error) {
    console.error('MongoDB bağlantısı kapatılırken hata:', error);
    throw error;
  }
}

export default connectToDatabase; 