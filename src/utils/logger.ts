import fs from 'fs';
import path from 'path';
import 'winston-daily-rotate-file';
import { logDirectory } from '../utils/common';
import { createLogger, format, transports } from 'winston';

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

fs.chmodSync(logDirectory, '0777');

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join(logDirectory, '%DATE%-error.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
});
/**
 * Determine log level based on LOG_LEVEL environment variable
 * - high: All logs including debug (debug)
 * - medium: Error and info logs (info)
 * - low: Only error logs (error)
 * Default: info (medium)
 */
const getLogLevel = (): string => {
    const logLevel = process.env.LOGGER_LEVEL?.toLowerCase() || 'medium';

    switch (logLevel) {
        case 'high':
            return 'debug';
        case 'medium':
            return 'info';
        case 'low':
            return 'error';
        default:
            return 'error'; // Default to low
    }
};

const logger = createLogger({
    level: getLogLevel(),
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [dailyRotateFileTransport, new transports.Console()],
});

export default logger;
