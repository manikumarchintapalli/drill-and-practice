import fs from 'fs';
import dotenv from 'dotenv';

// ✅ Load .env.test manually before Jest runs
const envPath = ".env";
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn("⚠️  .env.test file not found.");
}

export default {
  testEnvironment: 'node',



  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(slugify|other-esm-lib)/)'
  ],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testTimeout: 10000,
};