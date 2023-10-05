// Console Log Manager
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const winston = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      level: 'error'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d'
    })
  ]
});

// If not in production, also log to the console with winston's simple format, and show debug logs
if (process.env.NODE_ENV !== 'production') {
    winston.add(new transports.Console({
        format: format.simple(),
        level: 'debug',
    }));
} else {
    winston.add(new transports.Console({
        format: format.simple(),
        level: 'info',
    }));
}


export default winston;
