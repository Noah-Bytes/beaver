import * as winston from 'winston';

export function createLogger(tag: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${tag}] [${level}]: ${message}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });
}
