import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
  timeout: 20000,
  globalTimeout: 120000,
  expect: { timeout: 2000 },

  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200/',
    globalsQaUrl: 'http://globalsqa.com/demo-site/draganddrop/',
    //uiTestingPlayground: 'http://uitestingplayground.com/ajax' // ___ commented to use env variable instead
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/',
      },
    },    

    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },

    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    }
  ],

});
