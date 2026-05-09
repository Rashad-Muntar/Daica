import pino from 'pino';
import { config } from '@/config/app.config.ts';
const isDev =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// FIX: build options object separately, only add transport if isDev
const options: pino.LoggerOptions = {
  level: config.logLevel || 'info',
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'authorization',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
  // ✅ only add transport key when in dev — key is completely absent in production
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
};

export const logger = pino(options);