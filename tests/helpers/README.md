# Test Helpers

This directory contains utility functions and helpers for the KodBank test suite.

## Database Helpers (`database.ts`)

Provides database management utilities for test isolation and cleanup.

### Key Functions

#### `getTestPrismaClient()`
Returns a singleton Prisma client configured for the test environment.
- Automatically loads `.env.test` configuration
- Configures logging based on `PRISMA_LOG_QUERIES` environment variable
- Reuses the same client instance across tests for efficiency

```typescript
import { getTestPrismaClient } from './helpers/database';

const prisma = getTestPrismaClient();
const user = await prisma.user.create({ data: { ... } });
```

#### `resetTestDatabase()`
Clears all data from the test database while preserving the schema.
- Deletes all records from `user_tokens` table
- Deletes all records from `users` table
- Respects foreign key constraints (deletes in correct order)

```typescript
import { resetTestDatabase } from './helpers/database';

beforeEach(async () => {
  await resetTestDatabase();
});
```

#### `cleanupTestUser(email: string)`
Removes a specific test user and their associated tokens.
- Cascade delete automatically removes related tokens
- Useful for cleaning up after specific test cases

```typescript
import { cleanupTestUser } from './helpers/database';

afterEach(async () => {
  await cleanupTestUser('test@example.com');
});
```

#### `cleanupTestToken(token: string)`
Removes a specific test token from the database.

```typescript
import { cleanupTestToken } from './helpers/database';

await cleanupTestToken(testToken);
```

#### `disconnectTestDatabase()`
Disconnects the Prisma client and cleans up connections.
- Should be called in global teardown
- Automatically called in `tests/setup.ts`

#### `verifyDatabaseConnection()`
Checks if the database connection is working.
- Returns `true` if connected, `false` otherwise
- Useful for debugging connection issues

```typescript
import { verifyDatabaseConnection } from './helpers/database';

const isConnected = await verifyDatabaseConnection();
if (!isConnected) {
  throw new Error('Database connection failed');
}
```

#### `getDatabaseInfo()`
Returns information about the current database connection (without sensitive data).
- Returns: `{ host, database, isTest }`
- Useful for debugging and safety checks

```typescript
import { getDatabaseInfo } from './helpers/database';

const dbInfo = getDatabaseInfo();
console.log(`Connected to: ${dbInfo.database} on ${dbInfo.host}`);
```

#### `withTransaction(callback)`
Wraps test execution in a database transaction.
- Advanced pattern for test isolation
- Transaction can be rolled back after test
- Note: Basic cleanup with `deleteMany` is often sufficient

```typescript
import { withTransaction } from './helpers/database';

await withTransaction(async (prisma) => {
  const user = await prisma.user.create({ data: { ... } });
  // Test operations...
});
```

### Test Database Configuration

The test suite uses a separate database to ensure test isolation:

1. **Production Database**: `kodbank` (defined in `.env`)
2. **Test Database**: `kodbank_test` (defined in `.env.test`)

### Safety Checks

The test setup includes safety checks to prevent accidentally running tests against the production database:

- Verifies that `DATABASE_URL` contains "test" in the database name
- Throws an error if the safety check fails
- Prevents data loss in production database

### Environment Variables

Test-specific environment variables are defined in `.env.test`:

```env
DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/kodbank_test"
NODE_ENV="test"
PRISMA_LOG_QUERIES="true"
```

### Database Logging

Database logging is controlled by the `PRISMA_LOG_QUERIES` environment variable:

- `PRISMA_LOG_QUERIES="true"`: Logs queries, errors, and warnings (useful for debugging)
- `PRISMA_LOG_QUERIES="false"`: Logs only errors (cleaner test output)

### Test Isolation Strategy

The test suite uses the following isolation strategy:

1. **Global Setup** (`beforeAll`):
   - Verify database connection
   - Reset database to clean state
   - Run safety checks

2. **Global Teardown** (`afterAll`):
   - Disconnect Prisma client
   - Clean up connections

3. **Per-Test Cleanup** (optional, per test suite):
   - Individual test suites can add `beforeEach`/`afterEach` hooks
   - Use `resetTestDatabase()` for complete isolation
   - Use `cleanupTestUser()` for targeted cleanup

### Example Usage

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { getTestPrismaClient, resetTestDatabase } from './helpers/database';

describe('User API Tests', () => {
  const prisma = getTestPrismaClient();

  beforeEach(async () => {
    // Reset database before each test for complete isolation
    await resetTestDatabase();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        fullName: 'Test User',
      },
    });

    expect(user.email).toBe('test@example.com');
  });
});
```

### Troubleshooting

#### Database Connection Errors

If you see database connection errors:

1. Verify the test database exists:
   ```bash
   mysql -u johndoe -p
   CREATE DATABASE kodbank_test;
   ```

2. Run migrations on the test database:
   ```bash
   NODE_ENV=test npx prisma migrate deploy
   ```

3. Check `.env.test` configuration:
   - Ensure `DATABASE_URL` points to the test database
   - Verify credentials are correct

#### Tests Failing Due to Data Conflicts

If tests fail due to existing data:

1. Reset the database manually:
   ```typescript
   import { resetTestDatabase } from './helpers/database';
   await resetTestDatabase();
   ```

2. Add `beforeEach` hook to your test suite:
   ```typescript
   beforeEach(async () => {
     await resetTestDatabase();
   });
   ```

#### Slow Test Execution

If tests are slow due to database operations:

1. Reduce logging by setting `PRISMA_LOG_QUERIES="false"` in `.env.test`
2. Use targeted cleanup instead of full database reset
3. Consider using transactions for test isolation (advanced)
