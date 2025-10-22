import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});


const systemLogs = createLogger({
    level: 'http',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(
                colorize(),
                logFormat
            )
        }),
        new transports.DailyRotateFile({
            filename: 'logs/system-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' })
    ]
});

const morganMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            contentLength: tokens.res(req, res, 'content-length'),
            responseTime: Number(tokens['response-time'](req, res)),
            timestamp: tokens.date(req, res, 'iso'),
          });
    },
    {
        stream: {
            write: (message) => {
                try {
                    const logMessage = JSON.parse(message);

                    if (logMessage.status >= 500) {
                        systemLogs.error(`HTTP ${logMessage.status}: ${logMessage.method} ${logMessage.url} - ${logMessage.responseTime}ms`);
                    } else if (logMessage.status >= 400) {
                        systemLogs.warn(`HTTP ${logMessage.status}: ${logMessage.method} ${logMessage.url} - ${logMessage.responseTime}ms`);
                    } else {
                        systemLogs.http(`HTTP ${logMessage.status}: ${logMessage.method} ${logMessage.url} - ${logMessage.responseTime}ms`);
                    }
                } catch (error) {
                    systemLogs.error('Failed to parse log message:', message);
                }
            },
        },
    }
);

export { systemLogs, morganMiddleware };
