import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage screenshots open over a blurred page and close without losing your place', async ({ page }, testInfo) => {
    await page.goto('/');
    const viewer = page.getByRole('dialog', { name: 'Screenshot viewer' });
    const close = viewer.getByRole('button', { name: 'Close screenshot' });
    const image = viewer.locator('img');
    const url = page.url();
    const historyLength = await page.evaluate(() => history.length);

    for (const link of await page.locator('#see .shot-open').all()) {
        await link.scrollIntoViewIfNeeded();
        const scrollY = await page.evaluate(() => window.scrollY);
        await link.click();
        await expect(viewer).toBeVisible();
        await expect(close).toBeFocused();
        await expect(image).toHaveAttribute('src', new URL((await link.getAttribute('href'))!, url).href);
        await expect(image).toHaveAttribute('alt', (await link.locator('img').getAttribute('alt'))!);
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        expect(await viewer.evaluate((dialog) => getComputedStyle(dialog, '::backdrop').backdropFilter)).toBe('blur(8px)');
        await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
        const bounds = await image.boundingBox();
        const viewport = page.viewportSize()!;
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.y).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);

        await image.click();
        await expect(viewer).toBeVisible();
        await close.click();
        await expect(viewer).not.toBeVisible();
        await expect(link).toBeFocused();
        await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
        expect(page.url()).toBe(url);
        expect(await page.evaluate(() => history.length)).toBe(historyLength);
    }

    await page.locator('#see .shot-open').first().click();
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('screenshot-viewer.png') });
});

test('feature screenshots support actual size, keyboard dismissal, and backdrop clicks', async ({ page }, testInfo) => {
    await page.goto('/features');
    const link = page.locator('#library .shot-open').first();
    const fullSizeLink = page.locator('#library .shot-full').first();
    const viewer = page.getByRole('dialog', { name: 'Screenshot viewer' });
    const image = viewer.locator('img');
    const close = viewer.getByRole('button', { name: 'Close screenshot' });
    const viewport = viewer.getByRole('region', { name: 'Screenshot image' });
    await fullSizeLink.focus();
    await page.keyboard.press('Enter');
    await expect(viewer).toBeVisible();
    await expect(image).toHaveAttribute('src', new URL((await fullSizeLink.getAttribute('href'))!, page.url()).href);
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((img: HTMLImageElement) => img.getBoundingClientRect().width)).toBe(await image.evaluate((img: HTMLImageElement) => img.naturalWidth));
    expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)).toBe(true);
    await close.focus();
    await page.keyboard.press('Tab');
    await expect(viewport).toBeFocused();
    // Modal focus cannot move back into the page underneath it.
    await link.evaluate((element: HTMLAnchorElement) => element.focus());
    await expect(viewport).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(viewer).not.toBeVisible();
    await expect(fullSizeLink).toBeFocused();

    await link.click();
    await expect(viewer.getByRole('button', { name: 'Actual size' })).toBeVisible();
    await viewer.getByRole('button', { name: 'Actual size' }).click();
    await expect(viewer.getByRole('button', { name: 'Fit to screen' })).toBeVisible();
    await viewer.getByRole('button', { name: 'Fit to screen' }).click();
    await expect(viewer.getByRole('button', { name: 'Actual size' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('feature-screenshot-viewer.png') });

    // A drag that starts inside the image is not a backdrop click.
    const bounds = (await image.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(4, 4);
    await page.mouse.up();
    await expect(viewer).toBeVisible();
    await page.mouse.click(4, 4);
    await expect(viewer).not.toBeVisible();
    await expect(link).toBeFocused();
    await expect(page).toHaveURL(/\/features\/?$/);
});

test('modified screenshot clicks still open the original in another tab', async ({ page, context }) => {
    await page.goto('/');
    const link = page.locator('#see .shot-open').first();
    const original = new URL((await link.getAttribute('href'))!, page.url()).href;
    const opened = context.waitForEvent('page');
    await link.click({ modifiers: ['ControlOrMeta'] });
    const tab = await opened;
    await expect(tab).toHaveURL(original);
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await tab.close();
});

test('screenshot links still work without JavaScript', async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
    const page = await context.newPage();
    for (const [path, selector] of [['/', '#see .shot-open'], ['/features', '#library .shot-full']]) {
        await page.goto(new URL(path, baseURL).href);
        const link = page.locator(selector).first();
        const original = new URL((await link.getAttribute('href'))!, page.url()).href;
        await link.click();
        await expect(page).toHaveURL(original);
        await expect.poll(() => page.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    await context.close();
});
