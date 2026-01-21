import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Definisikan warna
const colors: Record<string, string> = {
    GET: '\x1b[32m',    // Hijau
    POST: '\x1b[33m',   // Kuning
    PUT: '\x1b[34m',    // Biru
    DELETE: '\x1b[31m', // Merah
    reset: '\x1b[0m'    // Reset warna
};

// Tambahkan tipe data (any atau interface) pada parameter printf
const consoleFormat = printf(({ level, message, timestamp }: any) => {
    let coloredMessage = String(message); // Pastikan message dianggap string

    Object.keys(colors).forEach(method => {
        if (coloredMessage.includes(method)) {
            coloredMessage = coloredMessage.replace(
                method, 
                `${colors[method]}${method}${colors.reset}`
            );
        }
    });

    return `${timestamp} [${level}]: ${coloredMessage}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(colorize({ all: true }), consoleFormat)
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.json()
        })
    ]
});