// Hata tipleri
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
}

// Hata detayları için tip
export interface ErrorDetails {
  [key: string]: unknown;
}

// Hata sınıfı
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Hata mesajları
export const ErrorMessages = {
  [ErrorType.VALIDATION]: 'Geçersiz veri formatı.',
  [ErrorType.DATABASE]: 'Veritabanı işlemi başarısız.',
  [ErrorType.AUTHENTICATION]: 'Kimlik doğrulama başarısız.',
  [ErrorType.AUTHORIZATION]: 'Bu işlem için yetkiniz yok.',
  [ErrorType.NOT_FOUND]: 'İstenen kaynak bulunamadı.',
  [ErrorType.RATE_LIMIT]: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
  [ErrorType.SERVER]: 'Sunucu hatası oluştu.',
};

// Mongoose hata tipleri
interface MongooseValidationError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongooseDuplicateKeyError {
  code: 11000;
  keyValue: Record<string, unknown>;
}

// Hata işleme fonksiyonu
export function handleError(error: unknown): AppError {
  // AppError tipinde hata
  if (error instanceof AppError) {
    return error;
  }

  // Mongoose validation hatası
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'ValidationError'
  ) {
    const validationError = error as MongooseValidationError;
    return new AppError(
      ErrorType.VALIDATION,
      'Geçersiz veri formatı.',
      400,
      validationError.errors
    );
  }

  // Mongoose duplicate key hatası
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    const duplicateError = error as MongooseDuplicateKeyError;
    return new AppError(
      ErrorType.VALIDATION,
      'Bu kayıt zaten mevcut.',
      400,
      { duplicateKey: duplicateError.keyValue }
    );
  }

  // Bilinmeyen hata
  console.error('Beklenmeyen hata:', error);
  return new AppError(
    ErrorType.SERVER,
    'Sunucu hatası oluştu.',
    500,
    { originalError: error }
  );
}

// Hata loglama
export function logError(error: AppError) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    details: error.details,
    stack: error.stack,
  };

  // Hata tipine göre log seviyesi
  switch (error.type) {
    case ErrorType.VALIDATION:
    case ErrorType.NOT_FOUND:
    case ErrorType.RATE_LIMIT:
      console.warn(JSON.stringify(logEntry));
      break;
    default:
      console.error(JSON.stringify(logEntry));
  }

  // TODO: Hataları bir veritabanına veya harici bir servise kaydet
} 