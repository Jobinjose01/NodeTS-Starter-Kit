/**
 * Global setup for all integration tests
 * This file is loaded once before all test suites
 */

// Global token storage that persists across test files
(global as any).__AUTH_TOKEN__ = null;

export {};
