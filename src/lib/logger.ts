enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  component?: string;
  details?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private isDebugMode: boolean = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatTime(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, component?: string, details?: any) {
    const entry: LogEntry = {
      timestamp: this.formatTime(),
      level,
      message,
      component,
      details
    };

    this.logs.push(entry);
    
    if (this.isDebugMode) {
      const componentStr = component ? `[${component}]` : '';
      const detailsStr = details ? `\nDetails: ${JSON.stringify(details, null, 2)}` : '';
      
      switch (level) {
        case LogLevel.INFO:
          console.log(`🔵 ${componentStr} ${message}${detailsStr}`);
          break;
        case LogLevel.WARN:
          console.warn(`🟡 ${componentStr} ${message}${detailsStr}`);
          break;
        case LogLevel.ERROR:
          console.error(`🔴 ${componentStr} ${message}${detailsStr}`);
          break;
        case LogLevel.DEBUG:
          console.debug(`⚪ ${componentStr} ${message}${detailsStr}`);
          break;
      }
    }
  }

  info(message: string, component?: string, details?: any) {
    this.log(LogLevel.INFO, message, component, details);
  }

  warn(message: string, component?: string, details?: any) {
    this.log(LogLevel.WARN, message, component, details);
  }

  error(message: string, component?: string, details?: any) {
    this.log(LogLevel.ERROR, message, component, details);
  }

  debug(message: string, component?: string, details?: any) {
    if (this.isDebugMode) {
      this.log(LogLevel.DEBUG, message, component, details);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 