import { defineConfig } from '@playwright/test';
import process from 'node:process';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: 2,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:4322',
        browserName: 'chromium',
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'small-phone', use: { viewport: { width: 320, height: 740 } } },
        { name: 'phone', use: { viewport: { width: 390, height: 844 } } },
        { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
        { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
        { name: 'wide-desktop', use: { viewport: { width: 1920, height: 1080 } } },
    ],
    webServer: {
        command: 'npm run preview -- --host 127.0.0.1 --port 4322 --ignore-lock',
        env: { ASTRO_PREVIEW_BACKGROUND: '1' },
        url: 'http://127.0.0.1:4322',
        reuseExistingServer: false,
        timeout: 30_000,
    },
});
