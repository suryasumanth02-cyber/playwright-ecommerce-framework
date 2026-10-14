import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/environment';

export default defineConfig({
  testDir: './tests',
  timeout: config.defaultTimeout,
  expect: {
    timeout: 8000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: config.retries,
  workers: config.workers,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],
  use: {
    baseURL: config.baseUrl,
    headless: config.isHeadless,
    actionTimeout: 10000,
    navigationTimeout: config.navigationTimeout,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Global Auth Setup Project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Desktop Browsers (reusing storageState from setup)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: config.authFile,
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: config.authFile,
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: config.authFile,
      },
      dependencies: ['setup'],
    },

    // Mobile Emulation
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
        storageState: config.authFile,
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 14'],
        storageState: config.authFile,
      },
      dependencies: ['setup'],
    },
  ],
});
