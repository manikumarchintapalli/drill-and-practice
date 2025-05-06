
import fs from 'fs';
import dotenv from 'dotenv';

const envPath = '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  .env file not found.');
}

export default {
  
  testEnvironment: 'node',

 
  collectCoverage: true,


  collectCoverageFrom: [
    'index.js',
    'routes/**/*.{js,mjs}',
    'models/**/*.{js,mjs}',
    'startup/**/*.{js,mjs}',
  
    '!**/*.test.{js,mjs}',
    '!**/__tests__/**',
    '!**/*.d.ts',
  ],

  
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],

  coverageReporters: ['text', 'lcov'],

  
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  
  transformIgnorePatterns: [
    '/node_modules/',
  ],

  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

 
  testTimeout: 10000,
};