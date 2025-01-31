import { User } from './auth';

// Log tipleri
export enum AuditLogType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  SETTINGS = 'SETTINGS',
  OTHER = 'OTHER',
}

// Log detayları için tip
export interface AuditLogDetails {
  [key: string]: unknown;
}

// Log kaydı
export interface AuditLog {
  id: string;
  type: AuditLogType;
  action: string;
  userId: string;
  userEmail: string;
  userRole: string;
  timestamp: Date;
  details?: AuditLogDetails;
  ip?: string;
  userAgent?: string;
}

// Log oluştur
export async function createAuditLog(
  type: AuditLogType,
  action: string,
  user: User,
  details?: AuditLogDetails,
  ip?: string,
  userAgent?: string
): Promise<void> {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    type,
    action,
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    timestamp: new Date(),
    details,
    ip,
    userAgent,
  };

  // TODO: Logları veritabanına kaydet
  console.log('Audit Log:', JSON.stringify(log, null, 2));
}

// Log tipine göre mesaj oluştur
export function getAuditLogMessage(log: AuditLog): string {
  const timestamp = log.timestamp.toLocaleString('tr-TR');
  const user = `${log.userEmail} (${log.userRole})`;

  switch (log.type) {
    case AuditLogType.LOGIN:
      return `${timestamp}: ${user} sisteme giriş yaptı.`;
    case AuditLogType.LOGOUT:
      return `${timestamp}: ${user} sistemden çıkış yaptı.`;
    case AuditLogType.CREATE:
      return `${timestamp}: ${user} yeni bir ${log.action} oluşturdu.`;
    case AuditLogType.UPDATE:
      return `${timestamp}: ${user} ${log.action} güncelledi.`;
    case AuditLogType.DELETE:
      return `${timestamp}: ${user} ${log.action} sildi.`;
    case AuditLogType.VIEW:
      return `${timestamp}: ${user} ${log.action} görüntüledi.`;
    case AuditLogType.EXPORT:
      return `${timestamp}: ${user} ${log.action} dışa aktardı.`;
    case AuditLogType.IMPORT:
      return `${timestamp}: ${user} ${log.action} içe aktardı.`;
    case AuditLogType.SETTINGS:
      return `${timestamp}: ${user} ${log.action} ayarlarını değiştirdi.`;
    default:
      return `${timestamp}: ${user} ${log.action}`;
  }
}

// Log filtreleme
export interface AuditLogFilter {
  type?: AuditLogType;
  userId?: string;
  userEmail?: string;
  startDate?: Date;
  endDate?: Date;
}

// Logları filtrele
export async function filterAuditLogs(filter: AuditLogFilter): Promise<AuditLog[]> {
  // TODO: Veritabanından filtrelenmiş logları getir
  console.log('Filtreleme kriterleri:', filter);
  return [];
}

// Son logları getir
export async function getRecentAuditLogs(limit: number = 10): Promise<AuditLog[]> {
  // TODO: Veritabanından son logları getir
  console.log('İstenilen log sayısı:', limit);
  return [];
}

// Log istatistikleri
export interface AuditLogStats {
  totalLogs: number;
  logsByType: Record<AuditLogType, number>;
  logsByUser: Record<string, number>;
  logsByDay: Record<string, number>;
}

// Log istatistiklerini hesapla
export async function getAuditLogStats(
  startDate?: Date,
  endDate?: Date
): Promise<AuditLogStats> {
  // TODO: Veritabanından log istatistiklerini hesapla
  console.log('İstatistik aralığı:', { startDate, endDate });
  return {
    totalLogs: 0,
    logsByType: {} as Record<AuditLogType, number>,
    logsByUser: {},
    logsByDay: {},
  };
} 