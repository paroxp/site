import { defineConfig } from '@playwright/test';

const url = 'http://127.0.0.1:8081';

export default defineConfig({
  forbidOnly: Boolean(process.env['CI']),
  fullyParallel: true,
  reporter: process.env['CI'] ? 'github' : 'list',
  testDir: 'tests',
  use: { baseURL: url },
  webServer: {
    command: 'npm run -s build && npm start',
    env: { PORT: new URL(url).port },
    url,
  },
});
