import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

// Create logs/emails directory if it doesn't exist
const emailLogDirectory = path.join(process.cwd(), 'logs', 'emails');

if (!fs.existsSync(emailLogDirectory)) {
    fs.mkdirSync(emailLogDirectory, { recursive: true });
}

fs.chmodSync(emailLogDirectory, '0777');

// Daily rotate file transport for emails
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join(emailLogDirectory, '%DATE%-emails.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info) => {
            return `${info.timestamp}\n${info.message}\n${'='.repeat(80)}\n`;
        }),
    ),
});

// Create email logger
const emailLogger = createLogger({
    level: 'info',
    transports: [
        dailyRotateFileTransport,
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf((info) => {
                    return `${info.timestamp} ${info.level}: Email logged to file`;
                }),
            ),
        }),
    ],
});

/**
 * Log email to file instead of sending
 */
export const logEmail = (to: string, subject: string, html: string): void => {
    const emailLog = `
📧 EMAIL LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TO: ${to}
SUBJECT: ${subject}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTML CONTENT:
${html}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    emailLogger.info(emailLog);
};

export default emailLogger;
