const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: false,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});