# Test Data Management

## Overview

Integration tests in this project automatically manage test data cleanup using the `CLEAN_TEST_DATA` environment variable. This feature helps maintain a clean database during normal testing while allowing data preservation for debugging purposes.

## Configuration

### Environment Variable

```bash
# In .env file
CLEAN_TEST_DATA=true   # Default: Auto-cleanup enabled
CLEAN_TEST_DATA=false  # Debugging: Keep test data
```

## How It Works

### 1. Shared Authentication Token
- All integration tests use a shared authentication token from `getAuthToken()` helper
- Token is obtained once and reused across all tests
- Prevents multiple login requests and token expiration issues

### 2. Smart Cleanup Logic
Each integration test tracks whether its created data has been deleted:

```typescript
describe('Module - Integration Tests', () => {
    let createdItemId: number;
    let itemDeleted = false;  // Track deletion status

    afterAll(async () => {
        const shouldCleanup = process.env.CLEAN_TEST_DATA !== 'false';
        
        // Only cleanup if:
        // 1. Cleanup is enabled
        // 2. Item was created
        // 3. Item wasn't already deleted by a test
        if (shouldCleanup && createdItemId && !itemDeleted) {
            await prisma.item.delete({ where: { id: createdItemId } })
                .catch(() => {}); // Ignore if already deleted
        }
    });

    it('should delete item successfully', async () => {
        // ... delete test
        itemDeleted = true;  // Mark as deleted
    });
});
```

### 3. Delete Test Tracking
When a delete test runs successfully, it sets the `itemDeleted` flag to prevent double-deletion:

```typescript
it('should delete item successfully', async () => {
    const response = await request(app)
        .delete(`/api/v1/items/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

    expect(response.body).toHaveProperty('message');
    itemDeleted = true;  // Mark as deleted to skip cleanup
});
```

## Usage Scenarios

### Scenario 1: Normal Testing (Default)
```bash
# .env
CLEAN_TEST_DATA=true

# Run tests
npm test

# Result: All test data automatically cleaned up ✅
```

### Scenario 2: Debugging Failed Tests
```bash
# .env
CLEAN_TEST_DATA=false

# Run tests
npm test

# Result: Test data remains in database for inspection 🔍
# You can:
# - Check database records manually
# - Verify relationships and foreign keys
# - Test API endpoints with actual test data
# - Analyze data state when tests failed
```

### Scenario 3: Database Inspection
```bash
# Temporarily disable cleanup
CLEAN_TEST_DATA=false npm test

# Inspect database
npx prisma studio  # Visual database browser

# Re-enable cleanup when done
CLEAN_TEST_DATA=true npm test
```

## Benefits

### ✅ Automatic Cleanup
- **No manual cleanup needed**: Test data is automatically removed
- **Clean state**: Each test run starts with predictable data
- **No clutter**: Database doesn't accumulate test records

### 🐛 Debugging Support
- **Preserve data**: Keep test data for investigation
- **Manual inspection**: Check actual database state
- **Data validation**: Verify test data creation and relationships

### 🚀 Performance
- **Shared auth token**: Only 1-2 login requests instead of dozens
- **Smart tracking**: Avoids redundant deletion attempts
- **Error resilience**: Gracefully handles already-deleted records

### 🔒 Safety
- **Default cleanup**: Prevents accidental data accumulation
- **Error handling**: Catches and ignores deletion errors
- **Prisma disconnect**: Properly closes database connections

## Template Integration

The test template (`src/config/templates/test.ts`) includes this feature by default:

```typescript
// Template automatically includes:
let ${modelName}Deleted = false;

afterAll(async () => {
    const shouldCleanup = process.env.CLEAN_TEST_DATA !== 'false';
    
    if (shouldCleanup && created${ModelName}Id && !${modelName}Deleted) {
        await prisma.${modelName}.delete({
            where: { id: created${ModelName}Id },
        }).catch(() => {});
    }
});
```

When you generate a new module, cleanup logic is automatically included!

## Best Practices

### ✅ Do's
- ✅ Keep `CLEAN_TEST_DATA=true` as default
- ✅ Set to `false` temporarily when debugging
- ✅ Mark items as deleted in delete tests
- ✅ Use `.catch(() => {})` for safe deletion
- ✅ Check `shouldCleanup` before deletion

### ❌ Don'ts
- ❌ Don't commit `.env` with `CLEAN_TEST_DATA=false`
- ❌ Don't rely on test data between test runs
- ❌ Don't manually delete test data in individual tests
- ❌ Don't skip `afterAll` cleanup hooks
- ❌ Don't assume test order (tests should be independent)

## Troubleshooting

### Issue: "Record not found" errors
**Cause**: Trying to delete already-deleted records

**Solution**: Already handled by `.catch(() => {})` - this is expected behavior

### Issue: Database fills with test data
**Cause**: `CLEAN_TEST_DATA=false` or cleanup not running

**Solution**: 
```bash
# Check .env
echo $CLEAN_TEST_DATA

# Set to true
CLEAN_TEST_DATA=true npm test

# Or manually clean up
npx prisma studio  # Delete test records manually
```

### Issue: Tests failing due to existing data
**Cause**: Previous test run with cleanup disabled

**Solution**:
```bash
# Clean database
npx prisma migrate reset

# Re-seed
npx prisma db seed

# Run tests with cleanup
CLEAN_TEST_DATA=true npm test
```

## Example Test Output

### With Cleanup Enabled (Default)
```bash
$ CLEAN_TEST_DATA=true npm test

✓ Shared authentication token obtained for integration tests
✓ should create a user successfully
✓ should delete a user successfully

Test Suites: 6 passed, 6 total
Tests:       65 passed, 65 total

# Database: Only seed data remains ✅
```

### With Cleanup Disabled (Debugging)
```bash
$ CLEAN_TEST_DATA=false npm test

✓ Shared authentication token obtained for integration tests
✓ should create a user successfully
✓ should delete a user successfully

Test Suites: 6 passed, 6 total
Tests:       65 passed, 65 total

# Database: Test data preserved for inspection 🔍
# Check: integration.test_1234567890@example.com (user created)
# Check: Test Role 1234567890 (role created)
```

## Related Documentation

- [TESTING.md](./TESTING.md) - Complete testing guide
- [INTEGRATION_TEST_AUTH.md](./INTEGRATION_TEST_AUTH.md) - Shared authentication setup
- [TESTING_CHEATSHEET.md](./TESTING_CHEATSHEET.md) - Quick command reference

## Summary

The test data cleanup feature provides:
- 🎯 **Smart cleanup**: Automatic by default, optional preservation for debugging
- 🚀 **Performance**: Shared auth token, efficient deletion
- 🛡️ **Safety**: Error handling, graceful failures
- 📝 **Template integrated**: Works automatically for generated modules

Set `CLEAN_TEST_DATA=false` when debugging, `true` for normal testing!
