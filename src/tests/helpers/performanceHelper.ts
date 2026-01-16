import { Response } from 'supertest';

interface BenchmarkResult {
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    timestamp: string;
}

class PerformanceTracker {
    private results: BenchmarkResult[] = [];
    private thresholds = {
        fast: 100, // ms
        acceptable: 500, // ms
        slow: 1000, // ms
    };

    /**
     * Measure API response time
     * @param testName - Name of the test
     * @param apiCall - The API call function that returns a supertest Response
     * @param expectedTime - Optional expected max time in ms (for assertions)
     */
    async measureApiCall(
        testName: string,
        apiCall: () => Promise<Response>,
        expectedTime?: number,
    ): Promise<Response> {
        const startTime = Date.now();
        const response = await apiCall();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Extract endpoint and method from response
        const endpoint =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((response.request as any)?.url as string) || 'unknown';
        const method =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((response.request as any)?.method as string) || 'unknown';

        // Store result
        const result: BenchmarkResult = {
            endpoint,
            method,
            statusCode: response.status,
            responseTime,
            timestamp: new Date().toISOString(),
        };
        this.results.push(result);

        // Color-coded output
        const statusColor = this.getStatusColor(response.status);
        const timeColor = this.getTimeColor(responseTime);

        console.log(
            `  📊 ${testName}\n` +
                `     ${method} ${endpoint}\n` +
                `     Status: ${statusColor}${response.status}\x1b[0m | ` +
                `Time: ${timeColor}${responseTime}ms\x1b[0m | ` +
                `${this.getPerformanceLabel(responseTime)}`,
        );

        // Optional: Assert on response time
        if (expectedTime !== undefined && responseTime > expectedTime) {
            console.warn(
                `     ⚠️  Warning: Response time (${responseTime}ms) exceeded expected (${expectedTime}ms)`,
            );
        }

        return response;
    }

    private getStatusColor(status: number): string {
        if (status >= 200 && status < 300) return '\x1b[32m'; // Green
        if (status >= 300 && status < 400) return '\x1b[33m'; // Yellow
        if (status >= 400 && status < 500) return '\x1b[33m'; // Yellow
        return '\x1b[31m'; // Red
    }

    private getTimeColor(time: number): string {
        if (time < this.thresholds.fast) return '\x1b[32m'; // Green
        if (time < this.thresholds.acceptable) return '\x1b[33m'; // Yellow
        if (time < this.thresholds.slow) return '\x1b[33m'; // Yellow
        return '\x1b[31m'; // Red
    }

    private getPerformanceLabel(time: number): string {
        if (time < this.thresholds.fast) return '⚡ Fast';
        if (time < this.thresholds.acceptable) return '✅ Acceptable';
        if (time < this.thresholds.slow) return '⚠️  Slow';
        return '🐌 Very Slow';
    }

    /**
     * Get performance summary
     */
    getSummary(): void {
        if (this.results.length === 0) {
            console.log('\n📊 No performance data collected');
            return;
        }

        const avgTime =
            this.results.reduce((sum, r) => sum + r.responseTime, 0) /
            this.results.length;
        const minTime = Math.min(...this.results.map((r) => r.responseTime));
        const maxTime = Math.max(...this.results.map((r) => r.responseTime));
        const slowCalls = this.results.filter(
            (r) => r.responseTime > this.thresholds.acceptable,
        ).length;

        console.log('\n' + '='.repeat(60));
        console.log('📊 PERFORMANCE SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total API Calls: ${this.results.length}`);
        console.log(`Average Time: ${avgTime.toFixed(2)}ms`);
        console.log(`Fastest: ${minTime}ms`);
        console.log(`Slowest: ${maxTime}ms`);
        console.log(
            `Slow Calls (>${this.thresholds.acceptable}ms): ${slowCalls}`,
        );
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Clear results
     */
    reset(): void {
        this.results = [];
    }

    /**
     * Get all results
     */
    getResults(): BenchmarkResult[] {
        return this.results;
    }
}

export const performanceTracker = new PerformanceTracker();
export type { BenchmarkResult };
