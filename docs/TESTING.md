# Testing Guide

This guide covers all aspects of testing in the Node.js Starter Kit, including unit tests, integration tests, and performance testing.

> 🚀 **Quick Reference:** See [TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md) for a quick command reference!

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Performance Testing](#performance-testing)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

## Overview

The project uses **Jest 30** as the testing framework with the following testing strategies:

- **Unit Tests**: Test individual components (controllers, services) in isolation with mocked dependencies
- **Integration Tests**: Test complete API endpoints with real server, database, and authentication
- **Performance Tests**: Measure and track API response times with color-coded benchmarks

### Test Data Management

Integration tests automatically manage test data cleanup based on the `CLEAN_TEST_DATA` environment variable:

- **`CLEAN_TEST_DATA=true`** (default): Test data is automatically deleted after tests run
- **`CLEAN_TEST_DATA=false`**: Test data is preserved in the database for debugging

```bash
# In .env file
CLEAN_TEST_DATA=true  # Clean up test data (default)
CLEAN_TEST_DATA=false # Keep test data for inspection
```

**When to use `CLEAN_TEST_DATA=false`:**
- 🐛 Debugging failed tests - inspect the actual data created
- 🔍 Analyzing test behavior - verify database state
- 📊 Manual testing - use test data for manual API testing
- 🎯 Database inspection - check relationships and constraints

**Important:** Remember to set it back to `true` for normal test runs to avoid database clutter.

## Test Structure

```
src/tests/
├── unit/
│   ├── controllers/     # Controller unit tests with mocked services
│   │   ├── userController.test.ts
│   │   └── roleController.test.ts
│   └── services/        # Service unit tests with mocked Prisma
│       ├── userService.test.ts
│       └── roleService.test.ts
├── integration/         # API integration tests
│   ├── user.test.ts
│   └── role.test.ts
└── helpers/
    └── performanceHelper.ts  # Performance tracking utility
```

## Running Tests

### All Tests
```bash
npm test                    # Run all tests with coverage
npm run test:watch         # Run tests in watch mode
npm run test:all           # Run unit tests, then integration tests (sequential)
```

### Unit Tests Only
```bash
npm run test:unit          # Run all unit tests with coverage
npm run test:unit:module user  # Run only user unit tests (fast)
npm run test:unit:module role  # Run only role unit tests (fast)
```

### Integration Tests Only
```bash
npm run test:integration   # Run all integration tests (sequential)
```

### Module-Specific Tests
```bash
# Run all tests (unit + integration) for a specific module
npm run test:module user        # All user tests
npm run test:module role        # All role tests
npm run test:module product     # All product tests

# Run only unit tests for a specific module (fastest)
npm run test:unit:module user   # Only user unit tests
npm run test:unit:module role   # Only role unit tests
```

### Pattern Matching
```bash
# Test names are pattern-matched
npm run test:module Controller  # All controller tests
npm run test:module Service     # All service tests
npm run test:module integration # All integration tests
```

### Practical Examples

**Scenario 1: Working on User feature**
```bash
# Fast feedback loop - run only user unit tests while developing
npm run test:unit:module user

# Once unit tests pass, run full user tests (unit + integration)
npm run test:module user
```

**Scenario 2: Pre-commit checks**
```bash
# Run all tests before committing
npm test

# Or run sequentially for clearer output
npm run test:all
```

**Scenario 3: Testing a new module**
```bash
# After generating a new Product module
npm run generate  # Generate Product module

# Test only the new module
npm run test:module product

# Or just unit tests first
npm run test:unit:module product
```

**Scenario 4: Debugging integration tests**
```bash
# Run only integration tests
npm run test:integration

# Run specific integration test
npm run test:module user.test
```

## Unit Testing

Unit tests isolate components by mocking all external dependencies.

### Controller Tests

Controller tests mock the service layer and test request/response handling:

```typescript
// Example: userController.test.ts
jest.mock('../../services/userService');

describe('UserController - create', () => {
    it('should create user successfully', async () => {
        const mockUser = { id: 1, username: 'test@test.com' };
        (UserService.prototype.create as jest.Mock).mockResolvedValue(mockUser);

        const req = mockRequest({ body: { username: 'test@test.com' } });
        const res = mockResponse();
        
        await userController.create(req, res, mockNext);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: expect.any(String),
            result: mockUser,
        });
    });
});
```

**What's Tested:**
- Request validation
- Service method calls with correct parameters
- Response status codes and structure
- Error handling and error responses

### Service Tests

Service tests mock Prisma and test business logic:

```typescript
// Example: userService.test.ts
jest.mock('../../config/prismaClient', () => ({
    __esModule: true,
    default: {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('UserService - create', () => {
    it('should create user with hashed password', async () => {
        const userData = {
            username: 'test@test.com',
            password: 'password123',
        };
        
        const mockCreatedUser = { id: 1, ...userData, password: 'hashed' };
        (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);
        
        const result = await userService.create(userData);
        
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: expect.objectContaining({ username: userData.username }),
        });
        expect(result).toEqual(mockCreatedUser);
    });
});
```

**What's Tested:**
- Business logic execution
- Data transformation
- Prisma queries with correct parameters
- Pagination logic
- Error scenarios

## Integration Testing

Integration tests validate complete API workflows with real components.

### Setup

Integration tests require:
1. Running database (Docker or local)
2. Authentication token (obtained in `beforeAll`)
3. Real API server

### Example Test Flow

```typescript
describe('User Module - Integration Tests', () => {
    let authToken: string;
    let createdUserId: number;

    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: process.env.TEST_ADMIN_USERNAME || 'admin@test.com',
                password: process.env.TEST_ADMIN_PASSWORD || '123456',
            });
        
        authToken = loginResponse.body.result.token;
    });

    afterAll(async () => {
        // Cleanup test data
        if (createdUserId) {
            await prisma.user.delete({ where: { id: createdUserId } });
        }
        await prisma.$disconnect();
    });

    it('should create user successfully', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                firstName: 'Test',
                lastName: 'User',
                username: `test_${Date.now()}@example.com`,
                password: 'password123',
                roleId: '2',
                status: '1',
            })
            .expect(201);

        expect(response.body.result).toHaveProperty('id');
        createdUserId = response.body.result.id;
    });
});
```

**What's Tested:**
- Complete CRUD operations
- Authentication and authorization
- Pagination and filtering
- Validation errors
- Database constraints (duplicates, etc.)
- Error handling
- Concurrent requests

## Performance Testing

Performance tests use the `performanceHelper` to track response times.

### Using Performance Tracker

```typescript
import { performanceTracker } from '../helpers/performanceHelper';

it('should fetch users quickly', async () => {
    const response = await performanceTracker.measureApiCall(
        'Get All Users',
        () => request(app)
            .get('/api/v1/user')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200),
        500  // Expected max time in ms (optional)
    );
    
    // Test continues normally
    expect(response.body.result).toBeDefined();
});
```

### Performance Thresholds

The performance helper uses color-coded output:

- 🟢 **Fast**: < 100ms
- 🟡 **Acceptable**: 100ms - 500ms
- 🟠 **Slow**: 500ms - 1000ms
- 🔴 **Very Slow**: > 1000ms

### View Performance Summary

```typescript
afterAll(() => {
    performanceTracker.getSummary();  // Displays color-coded summary
    performanceTracker.reset();       // Clear for next test suite
});
```

### Benchmark Logs

Performance data is automatically logged to `logs/benchmark/` with timestamps and metrics.

## Writing Tests

### Using the Generator

Generate tests automatically for new modules:

```bash
npm run generate
```

The generator creates:
- Controller unit tests (mocked service)
- Service unit tests (mocked Prisma)
- Integration tests (full API)

### Manual Test Creation

#### 1. Controller Unit Test Template

```typescript
import { Request, Response, NextFunction } from 'express';
import { YourController } from '../../controllers/YourController';
import { YourService } from '../../services/YourService';

jest.mock('../../services/YourService');

const mockRequest = (data: any): Partial<Request> => ({
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
});

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext: NextFunction = jest.fn();

describe('YourController', () => {
    let controller: YourController;
    
    beforeEach(() => {
        controller = new YourController();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create successfully', async () => {
            // Your test here
        });
    });
});
```

#### 2. Service Unit Test Template

```typescript
import { YourService } from '../../services/YourService';
import prisma from '../../config/prismaClient';

jest.mock('../../config/prismaClient', () => ({
    __esModule: true,
    default: {
        yourModel: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('YourService', () => {
    let service: YourService;
    
    beforeEach(() => {
        service = new YourService();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create successfully', async () => {
            // Your test here
        });
    });
});
```

#### 3. Integration Test Template

```typescript
import request from 'supertest';
import app from '../../app';
import prisma from '../../config/prismaClient';
import { performanceTracker } from '../helpers/performanceHelper';

describe('Your Module - Integration Tests', () => {
    let authToken: string;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: process.env.TEST_ADMIN_USERNAME || 'admin@test.com',
                password: process.env.TEST_ADMIN_PASSWORD || '123456',
            });
        
        authToken = loginResponse.body.result.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
        performanceTracker.getSummary();
        performanceTracker.reset();
    });

    describe('POST /api/v1/your-endpoint', () => {
        it('should create successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Create Item',
                () => request(app)
                    .post('/api/v1/your-endpoint')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ /* data */ })
                    .expect(201)
            );

            expect(response.body.result).toBeDefined();
        });
    });
});
```

## Best Practices

### Unit Tests

✅ **Do:**
- Mock all external dependencies
- Test one component at a time
- Test both success and error cases
- Use descriptive test names
- Keep tests focused and simple

❌ **Don't:**
- Make actual database calls
- Make actual HTTP requests
- Test implementation details
- Share state between tests

### Integration Tests

✅ **Do:**
- Use real database (test database)
- Test complete workflows
- Clean up test data in `afterAll`
- Use unique identifiers (timestamps, UUIDs)
- Test authentication and authorization
- Run sequentially (`--runInBand`)

❌ **Don't:**
- Use production database
- Leave test data behind
- Share IDs between test files
- Rely on test execution order

### Performance Tests

✅ **Do:**
- Set realistic thresholds
- Track all critical endpoints
- Review benchmark logs regularly
- Test under load (concurrent requests)

❌ **Don't:**
- Set unrealistic thresholds
- Ignore slow endpoints
- Test without baseline data

### General

✅ **Do:**
- Write tests for new features
- Update tests when refactoring
- Maintain test coverage > 80%
- Run tests before committing
- Use the generator for consistency

❌ **Don't:**
- Skip tests for "simple" code
- Commit failing tests
- Ignore test warnings
- Test everything in integration tests

## Troubleshooting

### Database Connection Issues

```bash
# Ensure Docker is running
docker-compose up -d

# Check database connection
docker-compose ps

# Reset test database
npm run prisma:migrate
npm run seed
```

### Authentication Failures

Ensure test admin user exists:
```typescript
// In .env
TEST_ADMIN_USERNAME=admin@test.com
TEST_ADMIN_PASSWORD=123456
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Test Timeout

Increase Jest timeout in `jest.config.js`:
```javascript
module.exports = {
    testTimeout: 30000,  // 30 seconds
};
```

## Coverage Reports

View coverage after running tests:

```bash
npm test
```

Open the HTML report:
```bash
open coverage/lcov-report/index.html
```

**Coverage Targets:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run prisma:migrate
      - run: npm run test:all
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

For performance benchmarking details, see [BENCHMARKING.md](./BENCHMARKING.md).

For code generation usage, see [CODE_GENERATION.md](./CODE_GENERATION.md).
