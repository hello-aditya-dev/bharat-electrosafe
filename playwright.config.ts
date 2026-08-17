import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for accessibility tests.
 *
 * These tests are DEV-ONLY — they are not part of the production bundle.
 * Run with: npx playwright test
 *
 * Tests use @axe-core/playwright to verify no critical or serious axe
 * violations exist on each public route. They also include keyboard
 * tests for header navigation, products menu, mobile sheet, FAQ,
 * contact form, document actions and the back-to-top button.
 */
export default defineConfig({
  testDir: './tests/a11y',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
