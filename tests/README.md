# KodBank Testing Infrastructure

This directory contains the comprehensive test suite for the KodBank application.

## Testing Stack

- **Vitest**: Unit and integration testing framework
- **Playwright**: End-to-end UI testing
- **Supertest**: HTTP API testing
- **fast-check**: Property-based testing
- **bcrypt**: Password hashing verification

## Directory Structure

```
tests/
├── api/                    # API endpoint tests
│   ├── auth/              # Authentication API tests
│   └── dashboard/         # Dashboard API tests
├── ui/                    # Playwright UI tests
├── security/              # Security vulnerability tests
├── database/              # Database and Prisma tests
├── performance/           # Performance and load tests
├── helpers/               # Test utilities and helpers
├── setup.ts               # Global test setup
└── setup.test.ts          # Infrastructure verification
```

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### UI Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npm run playwright:install

# Run Playwright tests
npm run test:playwright

# Run Playwright tests with UI
npm run test:playwright:ui
```

## Test Configuration

- **vitest.config.ts**: Vitest configuration
- **playwright.config.ts**: Playwright configuration
- **tests/setup.ts**: Global test setup and teardown

## Writing Tests

### Unit Tests

Place unit tests in the appropriate directory:
- API tests: `tests/api/`
- Database tests: `tests/database/`
- Security tests: `tests/security/`

### UI Tests

Place UI tests in `tests/ui/` using Playwright.

### Property-Based Tests

Use fast-check for property-based testing to validate universal properties across randomized inputs.

## Test Isolation

Each test should be isolated and not depend on other tests. Use the setup and teardown hooks to ensure clean state between tests.
