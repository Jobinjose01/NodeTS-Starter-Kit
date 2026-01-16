#!/usr/bin/env node

/**
 * Benchmark Log Analyzer
 * 
 * Analyzes benchmark logs to provide performance insights
 * 
 * Usage:
 *   npm run analyze-benchmark
 *   npm run analyze-benchmark -- --date 2026-01-07
 *   npm run analyze-benchmark -- --slow
 *   npm run analyze-benchmark -- --endpoint /api/v1/roles
 */

const fs = require('fs');
const path = require('path');

const logDirectory = process.env.ERROR_LOGS_PATH || './logs';
const benchmarkDirectory = path.join(logDirectory, 'benchmark');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    date: null,
    showSlow: false,
    endpoint: null,
    method: null,
};

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
        options.date = args[i + 1];
        i++;
    } else if (args[i] === '--slow') {
        options.showSlow = true;
    } else if (args[i] === '--endpoint' && args[i + 1]) {
        options.endpoint = args[i + 1];
        i++;
    } else if (args[i] === '--method' && args[i + 1]) {
        options.method = args[i + 1].toUpperCase();
        i++;
    }
}

// Get the benchmark log file
const today = options.date || new Date().toISOString().split('T')[0];
const logFile = path.join(benchmarkDirectory, `${today}-benchmark.log`);

if (!fs.existsSync(logFile)) {
    console.error(`❌ Log file not found: ${logFile}`);
    console.log('\n💡 Available log files:');
    if (fs.existsSync(benchmarkDirectory)) {
        const files = fs.readdirSync(benchmarkDirectory)
            .filter(f => f.endsWith('-benchmark.log'))
            .sort()
            .reverse();
        files.forEach(f => console.log(`   - ${f}`));
    }
    process.exit(1);
}

// Read and parse log file
const content = fs.readFileSync(logFile, 'utf-8');
const lines = content.trim().split('\n').filter(line => line);
const logs = lines.map(line => {
    try {
        return JSON.parse(line);
    } catch (e) {
        return null;
    }
}).filter(Boolean);

// Filter logs based on options
let filteredLogs = logs;

if (options.showSlow) {
    filteredLogs = filteredLogs.filter(log => log.performance?.slow || log.performance?.verySlow);
}

if (options.endpoint) {
    filteredLogs = filteredLogs.filter(log => log.endpoint?.includes(options.endpoint));
}

if (options.method) {
    filteredLogs = filteredLogs.filter(log => log.method === options.method);
}

// Calculate statistics
const stats = {
    total: logs.length,
    filtered: filteredLogs.length,
    fast: logs.filter(l => l.performance?.fast).length,
    acceptable: logs.filter(l => l.performance?.acceptable && !l.performance?.fast).length,
    slow: logs.filter(l => l.performance?.slow).length,
    verySlow: logs.filter(l => l.performance?.verySlow).length,
    avgResponseTime: logs.reduce((sum, l) => sum + (l.responseTime || 0), 0) / logs.length,
    minResponseTime: Math.min(...logs.map(l => l.responseTime || 0)),
    maxResponseTime: Math.max(...logs.map(l => l.responseTime || 0)),
};

// Group by endpoint
const byEndpoint = {};
logs.forEach(log => {
    const key = `${log.method} ${log.endpoint}`;
    if (!byEndpoint[key]) {
        byEndpoint[key] = {
            count: 0,
            totalTime: 0,
            minTime: Infinity,
            maxTime: 0,
            statusCodes: {},
        };
    }
    byEndpoint[key].count++;
    byEndpoint[key].totalTime += log.responseTime || 0;
    byEndpoint[key].minTime = Math.min(byEndpoint[key].minTime, log.responseTime || 0);
    byEndpoint[key].maxTime = Math.max(byEndpoint[key].maxTime, log.responseTime || 0);
    byEndpoint[key].statusCodes[log.statusCode] = (byEndpoint[key].statusCodes[log.statusCode] || 0) + 1;
});

// Calculate average for each endpoint
Object.keys(byEndpoint).forEach(key => {
    byEndpoint[key].avgTime = byEndpoint[key].totalTime / byEndpoint[key].count;
});

// Sort endpoints by average response time (slowest first)
const sortedEndpoints = Object.entries(byEndpoint)
    .sort(([, a], [, b]) => b.avgTime - a.avgTime);

// Display results
console.log('\n' + '='.repeat(70));
console.log(`📊 BENCHMARK ANALYSIS - ${today}`);
console.log('='.repeat(70));

console.log('\n📈 OVERALL STATISTICS');
console.log('-'.repeat(70));
console.log(`Total Requests:     ${stats.total}`);
console.log(`⚡ Fast (<100ms):    ${stats.fast} (${((stats.fast / stats.total) * 100).toFixed(1)}%)`);
console.log(`✅ Acceptable:       ${stats.acceptable} (${((stats.acceptable / stats.total) * 100).toFixed(1)}%)`);
console.log(`⚠️  Slow (>500ms):    ${stats.slow} (${((stats.slow / stats.total) * 100).toFixed(1)}%)`);
console.log(`🐌 Very Slow (>1s):  ${stats.verySlow} (${((stats.verySlow / stats.total) * 100).toFixed(1)}%)`);
console.log(`\nAverage Time:       ${stats.avgResponseTime.toFixed(2)}ms`);
console.log(`Fastest:            ${stats.minResponseTime}ms`);
console.log(`Slowest:            ${stats.maxResponseTime}ms`);

console.log('\n🎯 TOP 10 ENDPOINTS BY AVERAGE RESPONSE TIME');
console.log('-'.repeat(70));
sortedEndpoints.slice(0, 10).forEach(([endpoint, data], index) => {
    const emoji = data.avgTime < 100 ? '⚡' : data.avgTime < 500 ? '✅' : data.avgTime < 1000 ? '⚠️' : '🐌';
    console.log(`${index + 1}. ${emoji} ${endpoint}`);
    console.log(`   Count: ${data.count} | Avg: ${data.avgTime.toFixed(2)}ms | Min: ${data.minTime}ms | Max: ${data.maxTime}ms`);
    console.log(`   Status Codes: ${Object.entries(data.statusCodes).map(([code, count]) => `${code}(${count})`).join(', ')}`);
});

if (options.showSlow && filteredLogs.length > 0) {
    console.log('\n🐌 SLOW REQUESTS');
    console.log('-'.repeat(70));
    filteredLogs.slice(0, 20).forEach(log => {
        console.log(`${log.method} ${log.endpoint} - ${log.statusCode} - ${log.responseTime}ms - ${log.timestamp}`);
    });
}

console.log('\n' + '='.repeat(70));
console.log(`📁 Log file: ${logFile}`);
console.log('='.repeat(70) + '\n');

// Usage examples
if (args.length === 0) {
    console.log('💡 TIP: Use filters to analyze specific data:');
    console.log('   --date 2026-01-06     Filter by specific date');
    console.log('   --slow                Show only slow requests');
    console.log('   --endpoint /roles     Filter by endpoint');
    console.log('   --method GET          Filter by HTTP method\n');
}
