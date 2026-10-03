import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * The cache-aware balancing story reports measurements. These checks keep it
 * honest in shape: the chart is a real table a screen reader and the Markdown
 * guide can read, the page says who else does this, and it fits every width.
 * The numbers themselves come from the specs repo's measurement record.
 */

test('the chart is a readable table and the page names who else does this', async ({ page }) => {
    await page.goto('/cache-aware-balancing');
    const rows = page.locator('figure.chart table tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.last()).toContainText('81.5%');
    await expect(page.locator('#others')).toContainText('We are not the first');
    for (const name of ['SGLang', 'llm-d', 'Dynamo', 'LiteLLM', 'GPUStack']) {
        await expect(page.locator('#others')).toContainText(name);
    }
});

test('the story is reachable from every page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.site-footer').getByRole('link', { name: 'Sending each conversation home' }).click();
    await expect(page).toHaveURL(/\/cache-aware-balancing$/);
});

test('the story fits the screen, loads nothing remote and passes accessibility checks', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (request) => failed.push(request.url()));
    page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
    await page.goto('/cache-aware-balancing');
    const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        overflowing: Array.from(document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main code'))
            .filter((element) => element.scrollWidth > element.clientWidth + 1)
            .map((element) => element.textContent?.trim().slice(0, 60)),
    }));
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.overflowing).toEqual([]);
    const origins = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => new URL(entry.name).origin));
    expect(origins.every((origin) => origin === new URL(page.url()).origin)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(failed).toEqual([]);
});
