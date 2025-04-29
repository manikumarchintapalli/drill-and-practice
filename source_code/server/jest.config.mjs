// jest.config.mjs
import fs from 'fs';
import dotenv from 'dotenv';

const envPath = '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  .env file not found.');
}

export default {
  // Use Node’s environment (no JSDOM)
  testEnvironment: 'node',

  // Enable coverage collection
  collectCoverage: true,

  // Point coverage at your real code folders/files
  collectCoverageFrom: [
    'index.js',
    'routes/**/*.{js,mjs}',
    'models/**/*.{js,mjs}',
    'startup/**/*.{js,mjs}',
    // add any other directories with source code, e.g.:
    // 'middleware/**/*.{js,mjs}',
    // 'utils/**/*.{js,mjs}',

    // exclude tests and type declarations
    '!**/*.test.{js,mjs}',
    '!**/__tests__/**',
    '!**/*.d.ts',
  ],

  // Don’t try to collect coverage from node_modules or config files
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],

  // Report both console text and lcov/html
  coverageReporters: ['text', 'lcov'],

  // Use babel-jest to transform JS/ESM modules
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // Only transform your source—skip everything else in node_modules
  transformIgnorePatterns: [
    '/node_modules/',
  ],

  // If you import .js files without extension in ESM, this helps Jest resolve them
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Increase if you have long integration tests
  testTimeout: 10000,
};