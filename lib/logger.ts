type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  path?: string;
  error?: any;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(logMessage: LogMessage): string {
    const { level, message, timestamp, path, error, metadata } = logMessage;
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (path) {
      formattedMessage += ` [Path: ${path}]`;
    }
    
    if (metadata) {
      formattedMessage += ` [Metadata: ${JSON.stringify(metadata)}]`;
    }
    
    if (error) {
      formattedMessage += ` [Error: ${error instanceof Error ? error.message : JSON.stringify(error)}]`;
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, options: { path?: string; error?: any; metadata?: Record<string, any> } = {}) {
    const logMessage: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...options,
    };

    const formattedMessage = this.formatMessage(logMessage);

    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(formattedMessage);
          if (options.error) console.error(options.error);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'debug':
          console.debug(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    } else {
      // In production, you might want to send logs to a service like CloudWatch, Datadog, etc.
      // For now, we'll just use console.log
      console.log(formattedMessage);
    }
  }

  public info(message: string, options?: { path?: string; metadata?: Record<string, any> }) {
    this.log('info', message, options);
  }

  public warn(message: string, options?: { path?: string; metadata?: Record<string, any> }) {
    this.log('warn', message, options);
  }

  public error(message: string, options?: { path?: string; error?: any; metadata?: Record<string, any> }) {
    this.log('error', message, options);
  }

  public debug(message: string, options?: { path?: string; metadata?: Record<string, any> }) {
    if (this.isDevelopment) {
      this.log('debug', message, options);
    }
  }
}

export const logger = Logger.getInstance(); 