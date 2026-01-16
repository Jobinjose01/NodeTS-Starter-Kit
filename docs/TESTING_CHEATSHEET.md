# Testing Cheat Sheet

Quick reference for all testing commands in the Node.js Starter Kit.

## 🎯 Quick Commands

### Run All Tests
```bash
npm test                    # All tests with coverage
npm run test:all           # Unit → Integration (sequential)
```

### Unit Tests (Fast, No Database)
```bash
npm run test:unit                    # All unit tests
npm run test:unit:module user        # Only user unit tests
npm run test:unit:module role        # Only role unit tests
npm run test:unit:module product     # Only product unit tests
```

### Integration Tests (Real API + Database)
```bash
npm run test:integration            # All integration tests
```

### Module-Specific (Unit + Integration)
```bash
npm run test:module user            # All user tests
npm run test:module role            # All role tests
npm run test:module product         # All product tests
```

### Development
```bash
npm run test:watch                  # Watch mode (TDD)
```

## 📊 Use Cases

### 1. Developing a Feature
```bash
# Fast feedback loop - unit tests only
npm run test:unit:module user

# Once passing, run full module tests
npm run test:module user
```

### 2. Before Committing
```bash
# Quick check
npm run test:unit

# Full check
npm test
```

### 3. After Code Generation
```bash
npm run generate                    # Generate Product module

# Test the new module
npm run test:module product         # All product tests
npm run test:unit:module product    # Just unit tests first
```

### 4. Debugging Failures
```bash
# Run specific test file
npm run test:module userController

# Run all controller tests
npm run test:module Controller

# Run all service tests
npm run test:module Service
```

### 5. Performance Testing
```bash
# Integration tests include performance tracking
npm run test:integration

# Check benchmark logs
cat logs/benchmark/*.log | jq .
```

## 🎨 Pattern Matching

The `test:module` and `test:unit:module` commands use pattern matching:

| Command | Matches |
|---------|---------|
| `npm run test:module user` | user.test.ts, userController.test.ts, userService.test.ts |
| `npm run test:module role` | role.test.ts, roleController.test.ts, roleService.test.ts |
| `npm run test:module Controller` | All *Controller.test.ts files |
| `npm run test:module Service` | All *Service.test.ts files |
| `npm run test:module integration` | All files in integration/ folder |

## 💡 Pro Tips

### 1. Fast Iteration
```bash
# Use unit tests for rapid development
npm run test:unit:module user -- --watch
```

### 2. Coverage Reports
```bash
# Generate HTML coverage report
npm test

# Open report
open coverage/lcov-report/index.html
```

### 3. Verbose Output
```bash
# See detailed test output
npm run test:module user -- --verbose
```

### 4. Run Specific Test
```bash
# Run only tests matching a name
npm test -- -t "should create user"
```

### 5. Update Snapshots
```bash
# Update Jest snapshots
npm test -- -u
```

## ⚡ Speed Comparison

| Command | Speed | Database | Use Case |
|---------|-------|----------|----------|
| `test:unit:module` | ⚡⚡⚡ Fast (< 1s) | ❌ No | Development, TDD |
| `test:unit` | ⚡⚡ Medium (< 5s) | ❌ No | Quick validation |
| `test:module` | ⚡ Slower (5-10s) | ✅ Yes | Feature testing |
| `test:integration` | 🐌 Slowest (10-30s) | ✅ Yes | Full API testing |
| `test` or `test:all` | 🐌 Slowest (30-60s) | ✅ Yes | Pre-commit, CI/CD |

## 🔍 Examples by Scenario

### New Developer Onboarding
```bash
# 1. Run all tests to verify setup
npm test

# 2. Run integration tests to verify database
npm run test:integration

# 3. Run unit tests to understand structure
npm run test:unit
```

### Feature Development (User Story)
```bash
# 1. Start with unit tests (TDD)
npm run test:unit:module product -- --watch

# 2. Once unit tests pass, run integration
npm run test:module product

# 3. Before commit, run all tests
npm test
```

### Bug Fix
```bash
# 1. Run failing test
npm run test:module user

# 2. Watch mode while fixing
npm run test:unit:module user -- --watch

# 3. Verify fix with full suite
npm run test:module user
```

### Refactoring
```bash
# 1. Run unit tests (should pass)
npm run test:unit

# 2. Run integration tests (verify behavior)
npm run test:integration

# 3. Full coverage check
npm test
```

### Performance Optimization
```bash
# 1. Run integration tests with performance tracking
npm run test:integration

# 2. Check benchmark logs
cat logs/benchmark/*.log | jq -r 'select(.duration > 500)'

# 3. After optimization, compare results
npm run test:integration
diff logs/benchmark/before.log logs/benchmark/after.log
```

## 📝 Test Output

### Unit Test Output
```
PASS  src/tests/unit/controllers/userController.test.ts
  UserController - create
    ✓ should create user successfully (15ms)
    ✓ should handle validation errors (8ms)
  UserController - getById
    ✓ should get user by id (5ms)
    ✓ should return 404 for non-existent user (6ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        2.451s
```

### Integration Test Output (with Performance)
```
PASS  src/tests/integration/user.test.ts
  User Module - Integration Tests
    POST /api/v1/user - Create User
      ✓ should create user successfully (245ms)
        ⏱️  API Call: Create User - 245ms 🟡 Acceptable

    GET /api/v1/user - Get All Users
      ✓ should fetch all users successfully (89ms)
        ⏱️  API Call: Get All Users - 89ms 🟢 Fast

========================================
  Performance Test Summary
========================================
Total Tests: 15
Average Time: 156ms
Fast: 8 tests 🟢
Acceptable: 6 tests 🟡
Slow: 1 test 🟠
```

## 🛠️ Troubleshooting

### Tests Not Running
```bash
# Regenerate Jest config
npm install

# Clear Jest cache
npx jest --clearCache
```

### Database Connection Issues
```bash
# Start database
docker-compose up -d

# Run migrations
npm run prisma:migrate

# Seed data
npm run seed
```

### Performance Tests Failing
```bash
# Check database performance
docker-compose logs db

# Increase timeout in jest.config.js
# testTimeout: 30000
```

## 📚 Related Documentation

- [TESTING.md](./TESTING.md) - Complete testing guide
- [BENCHMARKING.md](./BENCHMARKING.md) - Performance optimization
- [CODE_GENERATION.md](./CODE_GENERATION.md) - Generate tests automatically

## 🎓 Best Practices

✅ **Do:**
- Use `test:unit:module` during development (fast feedback)
- Use `test:module` before committing a feature
- Use `test` before pushing to remote
- Run integration tests after database changes
- Check performance benchmarks regularly

❌ **Don't:**
- Skip unit tests to save time
- Run integration tests without database
- Ignore slow performance warnings
- Commit without running tests
- Mix unit and integration test logic

---

**Quick Tip:** Bookmark this cheat sheet or keep it open while developing! 🚀
