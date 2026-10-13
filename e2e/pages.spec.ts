import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import release from '../src/data/alpha-release.json' with { type: 'json' };
import pages from '../src/data/public-pages.json' with { type: 'json' };

const guides = pages.filter((page) => page.path.startsWith('/guides/'));

/** Every failed request from here on, for `sound` to report. */
function watch(page: Page): string[] {
    const failed: string[] = [];
    page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', (request) => failed.push(request.url()));
    return failed;
}

/** What every page must hold to: no sideways scroll, no clipped words,
 * every screenshot described and loaded, no raw Markdown, no axe failures. */
async function sound(page: Page, failed: string[]) {
    // Details are content too: open them, so their pictures load and their text is checked.
    await page.locator('main details').evaluateAll((all) => all.forEach((details) => { (details as HTMLDetailsElement).open = true; }));
    const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        overflowing: Array.from(document.querySelectorAll('main h1, main h2, main h3, main p, main a, main li, main summary'))
            .filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.textContent?.trim()),
    }));
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.overflowing).toEqual([]);
    const text = await page.locator('main').textContent() ?? '';
    expect(text, 'Markdown is rendered, never shown raw').not.toMatch(/\*\*|\]\(|<\/?details>|<summary>/);
    for (const image of await page.locator('main figure img').all()) {
        await image.scrollIntoViewIfNeeded();
        expect((await image.getAttribute('alt'))?.trim().length ?? 0, 'every screenshot is described').toBeGreaterThanOrEqual(40);
        expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    // Clicking a screenshot opens its original, at least as wide as any size the page shows.
    for (const image of await page.locator('main [data-shot] img').all()) {
        const href = await image.evaluate((img) => img.closest('a.shot-open')?.getAttribute('href') ?? null);
        expect(href, 'every screenshot opens its original').not.toBeNull();
        const response = await page.request.get(href!);
        expect(response.ok()).toBe(true);
        expect(response.headers()['content-type']).toMatch(/^image\//);
        const shown = await image.evaluate((img: HTMLImageElement) => Math.max(img.naturalWidth, ...Array.from(img.parentElement!.querySelectorAll('source'))
            .flatMap((source) => source.srcset.split(',').map((entry) => Number.parseInt(entry.trim().split(/\s+/)[1] ?? '0', 10) || 0))));
        const original = await page.evaluate(async (url) => { const img = new Image(); img.src = url; await img.decode(); return img.naturalWidth; }, href!);
        expect(original, `${href} is the largest copy`).toBeGreaterThanOrEqual(shown);
    }
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(failed).toEqual([]);
}

test('What Eugene does: every v0.2.0 area, its limits in view, its guides linked', async ({ page }) => {
    const failed = watch(page);
    await page.goto('/features');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Features in ${release.version}`);
    for (const id of ['library', 'search-models', 'tools', 'providers', 'strata', 'machines']) {
        await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    await expect(page.locator('#strata .badge')).toHaveText('Experimental');
    await expect(page.locator('#strata .feature-limits')).toContainText('text only, on one GPU, one request at a time, and its memory fit is unknown');
    await expect(page.locator('#search-models .feature-limits')).toContainText('about 7 s');
    await expect(page.locator('#tools .feature-limits')).toContainText('32,000 tokens');
    await expect(page.locator('#providers .feature-limits')).toContainText('not been seen from a live account');
    await expect(page.locator('#machines .feature-limits')).toContainText('not a button in the console yet');
    await expect(page.locator('.big-two a')).toHaveText(['Workbench', 'Job Sites']);
    // Details stay one click away.
    const details = page.locator('#library details');
    await expect(details).not.toHaveAttribute('open');
    await details.locator('summary').click();
    await expect(details.locator('li').first()).toBeVisible();
    await expect(page.locator('main')).toContainText(`every change and fix in ${release.version}`);
    // A desktop screen is unreadable on a phone; its full size is one tap away.
    const full = page.locator('#library .shot-full').first();
    await expect(full).toHaveText('Full size');
    expect((await page.request.get((await full.getAttribute('href'))!)).ok()).toBe(true);
    await sound(page, failed);
});

test('Workbench describes memory, documents and tools, with the sorter limit in view', async ({ page }) => {
    const failed = watch(page);
    await page.goto('/workbench');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("Workbench, Eugene's chat app");
    for (const id of ['memory', 'documents', 'saved-documents', 'tools', 'more']) {
        await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    await expect(page.locator('#saved-documents .feature-limits')).toContainText('about 0.6 s');
    await expect(page.getByRole('link', { name: 'Install Workbench' })).toHaveAttribute('href', '/guides/install-workbench');
    await expect(page.locator('.checked')).toContainText('still owed');
    await sound(page, failed);
});

test('Job Sites says how it stays yours and what it cannot do yet', async ({ page }) => {
    const failed = watch(page);
    await page.goto('/job-sites');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Let Workbench work on your own computers');
    await expect(page.locator('.promises li')).toHaveCount(6);
    await expect(page.locator('.limits')).toContainText('Job Sites cannot yet copy between machines.');
    await expect(page.getByRole('link', { name: 'Set up a Job Site' })).toHaveAttribute('href', '/guides/set-up-a-job-site');
    await expect(page.locator('main')).not.toContainText(/\bsecure\b/i);
    await sound(page, failed);
});

test('no text on any page is smaller than 14px', async ({ page }) => {
    for (const { path } of pages) {
        await page.goto(path);
        await page.locator('main details').evaluateAll((all) => all.forEach((details) => { (details as HTMLDetailsElement).open = true; }));
        const small = await page.evaluate(() => Array.from(document.body.querySelectorAll('*'))
            .filter((element) => Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim()))
            .filter((element) => element.getClientRects().length > 0 && !element.closest('svg, [hidden], .sr-only'))
            .map((element) => ({ text: element.textContent!.trim().slice(0, 40), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
            .filter((found) => found.size < 14));
        expect(small, path).toEqual([]);
    }
});

test('the guides index lists every guide, and each guide renders and links soundly', async ({ page, request }) => {
    const failed = watch(page);
    await page.goto('/guides');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Step-by-step guides');
    await expect(page.locator('.guide-card a')).toHaveText(guides.map((guide) => guide.title));
    await expect(page.locator('.guide-card > svg.guide-icon')).toHaveCount(guides.length);
    // The guide split after v0.2.0 left an old address; it lands on the list.
    await page.goto('/guides/workbench-documents-and-tools');
    await expect(page).toHaveURL(/\/guides\/?$/);
    await page.goto('/guides');
    await sound(page, failed);
    for (const guide of guides) {
        await page.goto(guide.path);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide.title);
        await expect(page).toHaveTitle(`${guide.title} | Eugene Plexus guides`);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', guide.description);
        const text = await page.locator('main').textContent() ?? '';
        expect(text, `${guide.path} shows raw Markdown`).not.toMatch(/\*\*|\]\(|<\/?details>|<summary>/);
        // Every link inside the site resolves.
        const internal = await page.locator('.guide-body a[href^="/"]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!));
        for (const href of internal) {
            const response = await request.get(href.split('#')[0]);
            expect(response.ok(), `${guide.path} links ${href}`).toBe(true);
        }
        // Each guide is held to the same standard as the list, axe included.
        await sound(page, failed);
    }
});
