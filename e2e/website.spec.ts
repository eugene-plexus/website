import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Modern theme, local assets, accessible content, and responsive layout', async ({ page }, testInfo) => {
    const failedRequests: string[] = [];
    const pageErrors: string[] = [];
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
        if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
    await expect(page).toHaveTitle('Eugene Plexus | A self-hosted control plane for local LLM inference');
    await expect(page.locator('main')).not.toContainText(/training|tokenizer|checkpoints/i);
    await expect(page.locator('.release-note')).toContainText('No public platform release yet');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'modern');
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
    await expect(page.locator('.button').first()).toHaveCSS('border-radius', '6px');
    const theme = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        const probe = document.createElement('span');
        return Object.fromEntries(['--background', '--foreground', '--panel', '--panel-soft', '--accent-left', '--accent-right', '--muted'].map((token) => {
            probe.style.color = styles.getPropertyValue(token).trim();
            return [token, probe.style.color];
        }));
    });
    expect(theme).toEqual({
        '--background': 'rgb(250, 250, 251)', '--foreground': 'rgb(13, 13, 16)', '--panel': 'rgb(255, 255, 255)',
        '--panel-soft': 'rgb(243, 243, 245)', '--accent-left': 'rgb(42, 85, 230)', '--accent-right': 'rgb(207, 58, 133)', '--muted': 'rgb(106, 106, 115)',
    });
    const logo = page.locator('.hero-logo');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.fonts.check('16px "Inter Variable"'))).toBe(true);
    const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        pipelineTop: document.querySelector('.pipeline-strip')!.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
        overflowing: Array.from(document.querySelectorAll('main h1, main h2, main h3, main p, main a, header a')).filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.textContent?.trim()),
    }));
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.pipelineTop).toBeLessThan(layout.viewportHeight);
    expect(layout.overflowing).toEqual([]);
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => new URL(entry.name).origin));
    expect(resources.every((origin) => origin === new URL(page.url()).origin)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
    const licenses = await page.request.get('/licenses.txt');
    expect(licenses.ok()).toBe(true);
    expect(await licenses.text()).toContain('SIL OPEN FONT LICENSE');
    expect(await licenses.text()).toContain('Lucide icons');
    await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
});

test('navigation and FAQs work with a keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.getByRole('link', { name: 'See the workflow' }).click();
    await expect(page).toHaveURL(/#workflow$/);
    await expect(page.locator('#workflow-title')).toBeInViewport();
    const anchors = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).hash.slice(1)));
    for (const anchor of anchors) {
        await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    }
    const question = page.locator('summary').filter({ hasText: 'Can I download it yet?' });
    await question.focus();
    await page.keyboard.press('Enter');
    await expect(question.locator('..')).toHaveAttribute('open', '');
    await expect(question.locator('..').locator('p')).toBeVisible();
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.keyboard.press('Enter');
    await expect(question.locator('..')).not.toHaveAttribute('open');
});

test('custom 404 offers a working route home', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A little off the path.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await page.getByRole('link', { name: 'Back to Eugene Plexus' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
});

test('core content and FAQs work without JavaScript', async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByText('Is this a chatbot or an inference engine?', { exact: true }).click();
    await expect(page.locator('details').first().locator('p')).toBeVisible();
    await context.close();
});
test('the architecture page explains the layers and stays inside the viewport', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('response', (response) => {
        if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    await page.goto('/architecture');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('How it fits together.');
    await expect(page).toHaveTitle('Architecture | Eugene Plexus');
    // The five layers of the diagram, top to bottom, and the three services beside it.
    for (const label of ['Your tools', 'Gateway', 'Inference drivers', 'Engines and backends', 'Your hardware', 'Agent', 'Library', 'Control root']) {
        await expect(page.locator('.layers').getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(page.locator('.component-card')).toHaveCount(6);
    await expect(page.locator('.journey-step')).toHaveCount(5);
    await expect(page.locator('main')).not.toContainText(/training|tokenizer|checkpoints/i);
    const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        overflowing: Array.from(document.querySelectorAll('main h1, main h2, main h3, main p, main a, main li, main dt, main dd, header a')).filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.textContent?.trim()),
    }));
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.overflowing).toEqual([]);
    const anchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).hash.slice(1)));
    for (const anchor of anchors) {
        await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    }
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(failedRequests).toEqual([]);
    await page.getByRole('link', { name: 'The platform' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
});
