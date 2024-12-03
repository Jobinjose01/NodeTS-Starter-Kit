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

const logger = createLogger({
    level: 'error',
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
