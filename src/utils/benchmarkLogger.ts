import fs from 'fs';
import path from 'path';
import 'winston-daily-rotate-file';
import { logDirectory } from '../utils/common';
import { createLogger, format, transports } from 'winston';

// Create benchmark directory inside the main log directory
const benchmarkDirectory = path.join(logDirectory, 'benchmark');

if (!fs.existsSync(benchmarkDirectory)) {
    fs.mkdirSync(benchmarkDirectory, { recursive: true });
}

fs.chmodSync(benchmarkDirectory, '0777');

/**
 * Determine log level for benchmark logger
 * Always use 'info' level for performance logs
 */
const getBenchmarkLogLevel = (): string => {
    const logLevel =
        process.env.BENCHMARK_LOGGER_LEVEL?.toLowerCase() || 'info';

    switch (logLevel) {
        case 'high':
            return 'debug';
        case 'medium':
            return 'info';
        case 'low':
            return 'warn';
        default:
            return 'info';
    }
};

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join(benchmarkDirectory, '%DATE%-benchmark.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info', // Only log info and above to file
});

/**
 * Benchmark Logger
 *
 * Dedicated logger for API performance metrics.
 * Logs are stored in: logDirectory/benchmark/%DATE%-benchmark.log
 *
 * Usage:
 *   benchmarkLogger.info('API call details', { endpoint, method, responseTime });
 */
const benchmarkLogger = createLogger({
    level: getBenchmarkLogLevel(),
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json(), // Use JSON format for easier parsing of performance data
    ),
    transports: [
        dailyRotateFileTransport,
        // Console transport for development
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info) =>
                        `${info.timestamp} ${info.level}: ${info.message}`,
                ),
            ),
        }),
    ],
});

export default benchmarkLogger;
export { benchmarkDirectory };
