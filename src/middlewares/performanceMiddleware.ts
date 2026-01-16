import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import benchmarkLogger from '../utils/benchmarkLogger';

interface PerformanceMetrics {
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    timestamp: string;
    userAgent?: string;
    ip?: string;
}

/**
 * Middleware to track API performance
 */
export const performanceMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const startTime = Date.now();

    // Override res.end to capture response time
    const originalEnd = res.end.bind(res);

    // Note: res.end has multiple overload signatures, so we use any[] for args
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.end = function (...args: any[]): Response {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const metrics: PerformanceMetrics = {
            endpoint: req.originalUrl || req.url,
            method: req.method,
            statusCode: res.statusCode,
            responseTime,
            timestamp: new Date().toISOString(),
            userAgent: req.get('user-agent'),
            ip: req.ip || req.socket.remoteAddress,
        };

        // Log performance
        logPerformance(metrics);

        // Call original end with all arguments
        return originalEnd(...args);
    };

    next();
};

/**
 * Log performance metrics with appropriate level
 */
function logPerformance(metrics: PerformanceMetrics): void {
    const { endpoint, method, statusCode, responseTime } = metrics;

    // Determine log level based on response time and status
    let logLevel: 'info' | 'warn' | 'error' = 'info';
    let emoji = '✅';

    if (responseTime > 1000) {
        logLevel = 'warn';
        emoji = '🐌';
    } else if (responseTime > 500) {
        logLevel = 'warn';
        emoji = '⚠️';
    } else if (responseTime < 100) {
        emoji = '⚡';
    }

    if (statusCode >= 400) {
        logLevel = 'error';
        emoji = '❌';
    }

    // Log message for console/general logger
    const message = `${emoji} ${method} ${endpoint} - ${statusCode} - ${responseTime}ms`;

    // Log to general logger (console + error logs)
    logger[logLevel](message);

    // Always log to benchmark logger with detailed metrics (file only)
    benchmarkLogger.info(`API Performance: ${method} ${endpoint}`, {
        ...metrics,
        performance: {
            fast: responseTime < 100,
            acceptable: responseTime < 500,
            slow: responseTime >= 500,
            verySlow: responseTime >= 1000,
        },
    });
}

/**
 * Performance stats collector for aggregation
 */
class PerformanceStats {
    private metrics: PerformanceMetrics[] = [];
    private maxSize = 1000; // Keep last 1000 requests

    add(metric: PerformanceMetrics): void {
        this.metrics.push(metric);
        if (this.metrics.length > this.maxSize) {
            this.metrics.shift();
        }
    }

    getStats() {
        if (this.metrics.length === 0) {
            return null;
        }

        const responseTimes = this.metrics.map((m) => m.responseTime);
        const avgTime =
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minTime = Math.min(...responseTimes);
        const maxTime = Math.max(...responseTimes);

        const statusCodes = this.metrics.reduce(
            (acc, m) => {
                acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
                return acc;
            },
            {} as Record<number, number>,
        );

        const endpoints = this.metrics.reduce(
            (acc, m) => {
                const key = `${m.method} ${m.endpoint}`;
                if (!acc[key]) {
                    acc[key] = {
                        count: 0,
                        avgTime: 0,
                        totalTime: 0,
                    };
                }
                acc[key].count++;
                acc[key].totalTime += m.responseTime;
                acc[key].avgTime = acc[key].totalTime / acc[key].count;
                return acc;
            },
            {} as Record<
                string,
                { count: number; avgTime: number; totalTime: number }
            >,
        );

        return {
            totalRequests: this.metrics.length,
            avgResponseTime: avgTime,
            minResponseTime: minTime,
            maxResponseTime: maxTime,
            statusCodes,
            slowRequests: this.metrics.filter((m) => m.responseTime > 500)
                .length,
            endpoints: Object.entries(endpoints)
                .sort(([, a], [, b]) => b.avgTime - a.avgTime)
                .slice(0, 10) // Top 10 slowest endpoints
                .map(([endpoint, stats]) => ({
                    endpoint,
                    ...stats,
                })),
        };
    }

    reset(): void {
        this.metrics = [];
    }
}

export const performanceStats = new PerformanceStats();
