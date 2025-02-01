type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

export class Logger {
  private static formatTime(): string {
    return new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  }

  private static formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      timestamp: this.formatTime(),
      data
    };
  }

  private static log(level: LogLevel, message: string, data?: any) {
    const logMessage = this.formatMessage(level, message, data);
    
    const styles = {
      info: 'color: #3b82f6; font-weight: bold;',  // mavi
      warn: 'color: #f59e0b; font-weight: bold;',  // turuncu
      error: 'color: #ef4444; font-weight: bold;', // kırmızı
      debug: 'color: #10b981; font-weight: bold;'  // yeşil
    };

    console.log(
      `%c[${logMessage.level.toUpperCase()}] ${logMessage.timestamp}:%c ${logMessage.message}`,
      styles[level],
      'color: inherit'
    );

    if (data) {
      console.log('📦 Veri:', data);
    }
  }

  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  static error(message: string, data?: any) {
    this.log('error', message, data);
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  static api(method: string, url: string, status?: number, data?: any) {
    const statusText = status ? `[${status}]` : '';
    this.log(
      status && status >= 400 ? 'error' : 'info',
      `📡 API ${method} ${url} ${statusText}`,
      data
    );
  }

  static db(operation: string, collection: string, result?: any) {
    this.log(
      'debug',
      `🗄️ DB ${operation} ${collection}`,
      result
    );
  }
}

export default Logger; 