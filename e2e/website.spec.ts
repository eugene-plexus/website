import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the homepage describes current capabilities with an explicit alpha boundary', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-statement')).toHaveText('A self-hosted control plane for local LLM inference.');
    await expect(page.locator('.hero-description')).toHaveText(/^Run AI models on your hardware,/);
    await expect(page.locator('.hero-description')).toContainText('OpenAI and Anthropic Messages APIs');
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
        await expect(page.locator(selector)).toHaveAttribute('content', /OpenAI and Anthropic Messages APIs.*Alpha available for testing/);
    }
    await expect(page.locator('.principle h3')).toHaveText([
        'Engine setup, handled', 'Settings start with your machine', 'Your files stay yours',
    ]);
    await expect(page.locator('#configure')).toContainText('two-screen setup');
    await expect(page.locator('#runtimes')).toContainText('Download and run');
    await expect(page.locator('#routing')).toContainText('revocable client keys');
    await expect(page.locator('#open-source')).toContainText('There is no stable release yet');
    const engines = page.locator('details').filter({ hasText: 'Which inference engines does it support?' });
    await engines.locator('summary').click();
    await expect(engines).toContainText('user-installed vLLM');
    await expect(engines).toContainText('separate branch, not on main');
    const clients = page.locator('details').filter({ hasText: 'Can I use Claude Code and my other tools?' });
    await clients.locator('summary').click();
    await expect(clients).toContainText('stub backend');
    await expect(clients.getByRole('link', { name: 'compatibility limits' })).toHaveAttribute('href', '/architecture#status');
    await clients.getByRole('link', { name: 'compatibility limits' }).click();
    await expect(page).toHaveURL(/\/architecture#status$/);
    await expect(page.locator('#status-title')).toBeInViewport();
});

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
    await expect(page.locator('.release-note')).toContainText('is available for early testing. No stable release yet.');
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
test('the architecture page explains the layers and stays inside the viewport', async ({ page }, testInfo) => {
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
    await expect(page.locator('#components-title')).toHaveText('Six building blocks, distinct jobs.');
    await expect(page.locator('#ui')).toContainText('Static files, not a separate server');
    await expect(page.locator('#principles')).toContainText('Originals stay yours; local copies are optional');
    await expect(page.locator('#principles')).not.toContainText('Never copied');
    await expect(page.locator('#request')).toContainText('Embeddings fail over only between replicas of the same model');
    await expect(page.locator('#request')).toContainText('not a second computation on another replica');
    await expect(page.locator('#status')).toContainText('There is no stable release yet');
    await expect(page.locator('#status')).toContainText('stub driver, not a real model');
    await expect(page.locator('#status')).toContainText('not full vendor API parity');
    await expect(page.locator('#status')).toContainText('public-only verification');
    await expect(page.locator('#status')).toContainText('Older installs retain legacy signing until explicitly rotated');
    await expect(page.locator('#status')).toContainText('Explicit app settings win');
    await expect(page.locator('#measurements')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/3\.2 ms|172 ms|2\.5 s|21 s vs 266 s/);
    await expect(page.locator('#status').getByRole('link', { name: 'acceptance records', exact: true }))
        .toHaveAttribute('href', 'https://github.com/eugene-plexus/specs/tree/main/docs/acceptance');
    await expect(page.locator('.arch-section .section-index')).toHaveText([
        '01 /', '02 /', '03 /', '04 /', '05 /', '06 /', '07 /',
    ]);
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
    await page.getByRole('heading', { level: 1 }).click();
    await page.screenshot({ path: testInfo.outputPath('architecture.png'), fullPage: true });
    await page.locator('#status').screenshot({ path: testInfo.outputPath('boundaries.png') });
    await page.getByRole('link', { name: 'The platform' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
});
