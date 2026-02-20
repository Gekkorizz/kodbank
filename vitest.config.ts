import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment settings
    environment: 'node',
    
    // Global test timeout (30 seconds)
    testTimeout: 30000,
    
    // Hook timeouts
    hookTimeout: 30000,
    
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        '.next/',
        'dist/',
      ],
    },
    
    // Test file patterns
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
    
    // Setup files to run before tests
    setupFiles: ['./tests/setup.ts'],
    
    // Isolation settings
    isolate: true,
    
    // Pool options for parallel execution
    pool: 'forks',
    
    // Reporter configuration
    reporters: ['verbose'],
    
    // Retry failed tests
    retry: 0,
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
