# Performance Benchmarking Guide

This guide covers performance tracking, benchmarking, and optimization in the Node.js Starter Kit.

## Table of Contents

- [Overview](#overview)
- [Performance Helper](#performance-helper)
- [Benchmark Logging](#benchmark-logging)
- [Using in Tests](#using-in-tests)
- [Analyzing Results](#analyzing-results)
- [Optimization Tips](#optimization-tips)

## Overview

The starter kit includes built-in performance tracking tools to help you:
- Measure API response times
- Track performance over time
- Identify slow endpoints
- Set performance benchmarks
- Log performance metrics

## Performance Helper

The `performanceHelper` utility provides color-coded performance tracking.

### Location
```
src/tests/helpers/performanceHelper.ts
```

### Features

- **Automatic timing**: Measures execution time of API calls
- **Color-coded output**: Visual feedback on performance
- **Threshold tracking**: Compares against expected performance
- **Summary reports**: Aggregate performance statistics
- **Benchmark storage**: Tracks all measurements

### Performance Thresholds

| Category | Time Range | Color | Meaning |
|----------|-----------|-------|---------|
| Fast | < 100ms | 🟢 Green | Excellent performance |
| Acceptable | 100ms - 500ms | 🟡 Yellow | Good performance |
| Slow | 500ms - 1000ms | 🟠 Orange | Needs attention |
| Very Slow | > 1000ms | 🔴 Red | Requires optimization |

## Using Performance Helper

### Basic Usage

```typescript
import { performanceTracker } from '../helpers/performanceHelper';

// Measure a simple API call
const response = await performanceTracker.measureApiCall(
    'Get All Users',
    () => request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
);
```

### With Expected Time

Set a custom expected maximum time:

```typescript
const response = await performanceTracker.measureApiCall(
    'Search Users',
    () => request(app)
        .get('/api/v1/user?search=john')
        .set('Authorization', `Bearer ${token}`)
        .expect(200),
    300  // Expected max time: 300ms
);
```

### In Test Suites

```typescript
describe('User API - Performance Tests', () => {
    let authToken: string;

    beforeAll(async () => {
        // Setup
        authToken = await getAuthToken();
    });

    afterAll(() => {
        // Display performance summary
        performanceTracker.getSummary();
        performanceTracker.reset();
    });

    it('should fetch users within acceptable time', async () => {
        const response = await performanceTracker.measureApiCall(
            'Get All Users',
            () => request(app)
                .get('/api/v1/user')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200),
            500  // Must complete within 500ms
        );

        expect(response.body.result).toBeDefined();
    });

    it('should handle pagination efficiently', async () => {
        const response = await performanceTracker.measureApiCall(
            'Get Users (Paginated)',
            () => request(app)
                .get('/api/v1/user?page=1&limit=10')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200),
            300  // Pagination should be fast
        );

        expect(response.body.result.pagination).toBeDefined();
    });
});
```

### Performance Summary

At the end of your test suite, view the performance summary:

```typescript
afterAll(() => {
    performanceTracker.getSummary();
    performanceTracker.reset();
});
```

**Example Output:**
```
========================================
  Performance Test Summary
========================================

API Call: Get All Users
  ⏱️  Time: 245ms
  Status: 🟡 Acceptable (Expected: 500ms)

API Call: Get User by ID
  ⏱️  Time: 89ms
  Status: 🟢 Fast (Expected: 200ms)

API Call: Create User
  ⏱️  Time: 567ms
  Status: 🟠 Slow (Expected: 500ms)

API Call: Update User
  ⏱️  Time: 123ms
  Status: 🟡 Acceptable (Expected: 300ms)

========================================
  Total Tests: 4
  Average Time: 256ms
========================================
```

## Benchmark Logging

Performance data is automatically logged to files for historical analysis.

### Logger Configuration

**Location:** `src/utils/benchmarkLogger.ts`

**Features:**
- Daily log rotation
- JSON format for easy parsing
- Automatic directory creation
- Separate from application logs

### Log Structure

```json
{
  "level": "info",
  "message": "API Performance Measurement",
  "endpoint": "GET /api/v1/user",
  "duration": 245,
  "status": "Acceptable",
  "expectedTime": 500,
  "timestamp": "2024-12-03T10:30:45.123Z"
}
```

### Log Location

```
logs/benchmark/
├── 2024-12-03-benchmark.log
├── 2024-12-04-benchmark.log
└── 2024-12-05-benchmark.log
```

### Reading Logs

```bash
# View today's benchmark logs
cat logs/benchmark/$(date +%Y-%m-%d)-benchmark.log | jq .

# View slow endpoints (> 500ms)
cat logs/benchmark/*.log | jq 'select(.duration > 500)'

# Calculate average response time
cat logs/benchmark/*.log | jq -s 'add/length | .duration'

# Find slowest endpoints
cat logs/benchmark/*.log | jq -s 'sort_by(.duration) | reverse | .[0:10]'
```

## Analyzing Results

### Identify Slow Endpoints

```bash
# Find all slow or very slow endpoints
grep -r "Slow\|Very Slow" logs/benchmark/

# Count occurrences
cat logs/benchmark/*.log | jq -s 'group_by(.status) | map({status: .[0].status, count: length})'
```

### Track Performance Over Time

```bash
# Compare today vs yesterday
diff \
  <(cat logs/benchmark/2024-12-03-benchmark.log | jq '.duration') \
  <(cat logs/benchmark/2024-12-04-benchmark.log | jq '.duration')
```

### Generate Performance Report

```typescript
// scripts/performance-report.ts
import fs from 'fs';
import path from 'path';

interface BenchmarkLog {
    endpoint: string;
    duration: number;
    status: string;
    timestamp: string;
}

const logDir = path.join(__dirname, '../logs/benchmark');
const logs: BenchmarkLog[] = [];

// Read all log files
fs.readdirSync(logDir).forEach(file => {
    const content = fs.readFileSync(path.join(logDir, file), 'utf-8');
    content.split('\n').filter(Boolean).forEach(line => {
        logs.push(JSON.parse(line));
    });
});

// Group by endpoint
const byEndpoint = logs.reduce((acc, log) => {
    if (!acc[log.endpoint]) {
        acc[log.endpoint] = [];
    }
    acc[log.endpoint].push(log.duration);
    return acc;
}, {} as Record<string, number[]>);

// Calculate statistics
Object.entries(byEndpoint).forEach(([endpoint, durations]) => {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    console.log(`\n${endpoint}`);
    console.log(`  Calls: ${durations.length}`);
    console.log(`  Avg: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min}ms`);
    console.log(`  Max: ${max}ms`);
});
```

## Optimization Tips

### Database Queries

**Problem:** Slow database queries

```typescript
// ❌ Bad: N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
    user.role = await prisma.role.findUnique({ where: { id: user.roleId } });
}

// ✅ Good: Include relations
const users = await prisma.user.findMany({
    include: {
        role: true,
    },
});
```

**Problem:** Unindexed queries

```prisma
// Add indexes to frequently queried fields
model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  email    String  @unique
  roleId   Int
  
  @@index([roleId])        // Index foreign keys
  @@index([username])      // Index search fields
  @@index([email])
}
```

### Pagination

**Problem:** Loading all records

```typescript
// ❌ Bad: Load everything
const users = await prisma.user.findMany();

// ✅ Good: Paginate
const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
});
```

### Response Size

**Problem:** Sending too much data

```typescript
// ❌ Bad: Return everything
return await prisma.user.findMany({
    include: {
        role: true,
        permissions: true,
        sessions: true,
        logs: true,
    },
});

// ✅ Good: Return only what's needed
return await prisma.user.findMany({
    select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: {
            select: {
                id: true,
                name: true,
            },
        },
    },
});
```

### Caching

Add caching for frequently accessed data:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

async getUsers() {
    const cacheKey = 'all_users';
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }
    
    // Fetch from database
    const users = await prisma.user.findMany();
    
    // Store in cache
    cache.set(cacheKey, users);
    
    return users;
}
```

### Async Operations

**Problem:** Sequential async operations

```typescript
// ❌ Bad: Sequential (slow)
const user = await getUser(id);
const role = await getRole(user.roleId);
const permissions = await getPermissions(role.id);

// ✅ Good: Parallel (fast)
const [user, roles, permissions] = await Promise.all([
    getUser(id),
    getAllRoles(),
    getAllPermissions(),
]);
```

### Validation

**Problem:** Heavy validation on every request

```typescript
// ❌ Bad: Validate on every call
app.get('/api/v1/user/:id', validate(userSchema), controller.getById);

// ✅ Good: Only validate on create/update
app.get('/api/v1/user/:id', controller.getById);
app.post('/api/v1/user', validate(createUserSchema), controller.create);
app.put('/api/v1/user/:id', validate(updateUserSchema), controller.update);
```

## Performance Testing Best Practices

### 1. Set Realistic Thresholds

```typescript
// Consider your infrastructure
const thresholds = {
    simple_get: 100,      // Simple SELECT query
    with_relations: 300,  // JOIN queries
    with_filters: 500,    // Complex WHERE clauses
    create_update: 400,   // INSERT/UPDATE operations
    delete: 200,          // DELETE operations
};
```

### 2. Test Under Load

```typescript
it('should handle concurrent requests', async () => {
    const requests = Array(10).fill(null).map(() =>
        performanceTracker.measureApiCall(
            'Concurrent Get Users',
            () => request(app)
                .get('/api/v1/user')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        )
    );

    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
        expect(response.status).toBe(200);
    });
});
```

### 3. Measure Key Operations

Focus on:
- Most frequently used endpoints
- Complex queries
- Operations with multiple database calls
- File uploads/downloads
- Report generation

### 4. Regular Monitoring

```bash
# Add to package.json
{
  "scripts": {
    "test:performance": "jest --testNamePattern='Performance' --runInBand",
    "benchmark:report": "ts-node scripts/performance-report.ts"
  }
}
```

Run performance tests regularly:
```bash
npm run test:performance
npm run benchmark:report
```

## Alerting

Set up alerts for performance degradation:

```typescript
// In your test suite
afterAll(() => {
    const summary = performanceTracker.getSummary();
    
    // Check for slow endpoints
    const slowTests = summary.filter(test => 
        test.duration > test.expectedTime
    );
    
    if (slowTests.length > 0) {
        console.error('⚠️  Performance degradation detected:');
        slowTests.forEach(test => {
            console.error(`  - ${test.name}: ${test.duration}ms (expected: ${test.expectedTime}ms)`);
        });
        
        // Optionally fail the test
        // throw new Error('Performance benchmarks not met');
    }
});
```

## Integration with CI/CD

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - run: npm ci
      - run: npm run test:performance
      
      - name: Upload benchmark logs
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-logs
          path: logs/benchmark/
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            // Parse logs and comment performance metrics
```

## Additional Resources

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Express.js Performance Tips](https://expressjs.com/en/advanced/best-practice-performance.html)

For testing documentation, see [TESTING.md](./TESTING.md).

For code generation, see [CODE_GENERATION.md](./CODE_GENERATION.md).
