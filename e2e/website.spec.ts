import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the homepage describes current capabilities with an explicit alpha boundary', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-statement')).toHaveText('Run AI models on your own computer.');
    await expect(page.locator('.hero-description')).toHaveText(/^Private and free\./);
    await expect(page.locator('.hero-technical')).toContainText('self-hosted control plane for local LLM inference');
    await expect(page.locator('.hero-technical')).toContainText('OpenAI and Anthropic Messages APIs');
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
    await expect(engines).toContainText('neither is in alpha.2');
    await expect(engines).not.toContainText('separate branch');
    await expect(page.getByRole('link', { name: 'current roadmap' })).toHaveAttribute('href', /adoption-roadmap\.md$/);
    const clients = page.locator('details').filter({ hasText: 'Can I use Claude Code and my other tools?' });
    await clients.locator('summary').click();
    await expect(clients).toContainText('actual local models');
    await expect(clients.getByRole('link', { name: 'compatibility limits' })).toHaveAttribute('href', '/architecture#status');
    await clients.getByRole('link', { name: 'compatibility limits' }).click();
    await expect(page).toHaveURL(/\/architecture#status$/);
    await expect(page.locator('#status-title')).toBeInViewport();
});

// The console's own default theme, by value: ui/src/app/globals.css
// `:root, [data-theme="plexus"]`. A visitor who installs sees the same
// ground, the same ice blue for every action and the same type.
const PLEXUS = {
    '--background': 'rgb(20, 22, 25)', '--foreground': 'rgb(230, 232, 234)', '--panel': 'rgb(27, 30, 34)',
    '--panel-soft': 'rgb(35, 39, 44)', '--panel-hover': 'rgb(43, 48, 55)', '--border': 'rgb(58, 64, 72)',
    '--border-hover': 'rgb(92, 100, 110)', '--accent-left': 'rgb(127, 176, 207)', '--accent-right': 'rgb(207, 154, 114)',
    '--on-accent-left': 'rgb(12, 18, 22)', '--on-accent-right': 'rgb(26, 16, 9)', '--muted': 'rgb(179, 185, 191)',
    '--accent-engine': 'rgb(127, 176, 148)', '--accent-hardware': 'rgb(184, 190, 196)',
};

test('Plexus theme, local assets, accessible content, and responsive layout', async ({ page }, testInfo) => {
    const failedRequests: string[] = [];
    const pageErrors: string[] = [];
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
        if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    // Dark whatever the visitor's system asks for: the console does not
    // follow the OS by default either.
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
    await expect(page).toHaveTitle('Eugene Plexus | A self-hosted control plane for local LLM inference');
    await expect(page.locator('main')).not.toContainText(/training|tokenizer|checkpoints/i);
    await expect(page.locator('.release-note')).toContainText('is available for early testing. No stable release yet.');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'plexus');
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#141619');
    await expect(page.locator('body')).toHaveCSS('background-color', PLEXUS['--background']);
    await expect(page.locator('.button').first()).toHaveCSS('border-radius', '4px');
    const theme = await page.evaluate((tokens) => {
        const styles = getComputedStyle(document.documentElement);
        const probe = document.createElement('span');
        return Object.fromEntries(tokens.map((token) => {
            probe.style.color = styles.getPropertyValue(token).trim();
            return [token, probe.style.color];
        }));
    }, Object.keys(PLEXUS));
    expect(theme).toEqual(PLEXUS);
    // Nothing glows: no shadow anywhere on the page.
    expect(await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
        .filter((element) => getComputedStyle(element).boxShadow !== 'none').map((element) => element.className))).toEqual([]);
    const logo = page.locator('.hero-logo');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    // document.fonts.check() answers true for a family no @font-face
    // declares, so it cannot tell a loaded font from a missing one. Ask
    // which faces actually loaded, and what the page is set in.
    const fonts = await page.evaluate(async () => {
        await document.fonts.load('600 16px "IBM Plex Mono"');
        return {
            loaded: [...new Set(Array.from(document.fonts).filter((face) => face.status === 'loaded').map((face) => face.family.replace(/"/g, '')))].sort(),
            body: getComputedStyle(document.body).fontFamily,
            code: getComputedStyle(document.querySelector('.stage-number')!).fontFamily,
        };
    });
    expect(fonts.loaded).toEqual(['IBM Plex Mono', 'IBM Plex Sans Variable']);
    expect(fonts.body).toMatch(/^"IBM Plex Sans Variable"/);
    expect(fonts.code).toMatch(/^"IBM Plex Mono"/);
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
    expect(await licenses.text()).toContain('IBM Plex Sans\n=');
    expect(await licenses.text()).toContain('IBM Plex Mono\n=');
    expect(await licenses.text()).not.toMatch(/^(Inter|JetBrains Mono)\n=/m);
    expect(await licenses.text()).toContain('Lucide icons');
    await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
});

test('navigation and FAQs work with a keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.getByRole('link', { name: 'See what it can do' }).click();
    await expect(page).toHaveURL(/#uses$/);
    await expect(page.locator('#uses-title')).toBeInViewport();
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
    const chatbot = page.locator('details').filter({ hasText: 'Is this a chatbot or an inference engine?' });
    await chatbot.getByText('Is this a chatbot or an inference engine?', { exact: true }).click();
    await expect(chatbot.locator('p')).toBeVisible();
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
    // Engines and hardware take Plexus's own layer roles, not Modern's green and grey.
    await expect(page.locator('.layer-engines')).toHaveCSS('border-left-color', PLEXUS['--accent-engine']);
    await expect(page.locator('.layer-hardware')).toHaveCSS('border-left-color', PLEXUS['--accent-hardware']);
    await expect(page.locator('.journey-step')).toHaveCount(5);
    await expect(page.locator('#components-title')).toHaveText('Six building blocks, distinct jobs.');
    await expect(page.locator('#ui')).toContainText('Static files, not a separate server');
    await expect(page.locator('#principles')).toContainText('Originals stay yours; local copies are optional');
    await expect(page.locator('#principles')).not.toContainText('Never copied');
    await expect(page.locator('#request')).toContainText('Embeddings fail over only between replicas of the same model');
    await expect(page.locator('#request')).toContainText('not a second computation on another replica');
    await expect(page.locator('#status')).toContainText('There is no stable release yet');
    await expect(page.locator('#status')).toContainText('actual local models');
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
    await page.getByRole('link', { name: 'What it does' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eugene Plexus.');
});

test('a casual visitor sees what it does, what it looks like and what it needs', async ({ page }) => {
    await page.goto('/');
    // "Reach on Home" reads as a feature's name to someone who has never
    // seen the console, where Home is a page; casual copy names the feature.
    for (const section of ['#uses', '#see']) {
        expect(await page.locator(section).innerText()).not.toMatch(/\bon Home\b/);
    }
    await expect(page.locator('#uses')).toContainText('Turn on Reach, then open the address it shows.');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/eugene-face.svg');
    const face = page.locator('.ask img.face');
    await face.scrollIntoViewIfNeeded();
    expect(await face.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(face).toHaveAttribute('alt', '');
    // The hair's outer silhouette is navy #061a2e and would vanish into
    // the dark ground; each mark carries a rim around it that does not.
    for (const mark of ['/eugene-face.svg', '/eugene-transparent.svg']) {
        const rim = await page.evaluate(async (url) => {
            const svg = new DOMParser().parseFromString(await (await fetch(url)).text(), 'image/svg+xml');
            const silhouette = svg.getElementById('hair-and-glasses-silhouette')!;
            const luminance = (hex: string) => {
                const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
                    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };
            const ground = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
            const contrast = (a: string, b: string) => {
                const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
                return (hi + 0.05) / (lo + 0.05);
            };
            const stroke = silhouette.getAttribute('stroke') ?? '';
            return {
                fillOnGround: contrast(silhouette.getAttribute('fill')!, ground),
                rimOnGround: /^#[0-9a-f]{6}$/i.test(stroke) ? contrast(stroke, ground) : 0,
                behindFill: silhouette.getAttribute('paint-order'),
            };
        }, mark);
        expect(rim.fillOnGround, `${mark} hair on the ground`).toBeLessThan(1.5);
        expect(rim.rimOnGround, `${mark} rim on the ground`).toBeGreaterThanOrEqual(3);
        expect(rim.behindFill, `${mark} rim sits outside the silhouette`).toBe('stroke');
    }
    await expect(page.locator('#uses .use h3')).toHaveText([
        'Chat privately on your PC', 'Use it from your phone', 'Power your coding tools', 'Keep what you already run',
    ]);
    const shots = page.locator('#see figure img');
    await expect(shots).toHaveCount(3);
    for (const image of await shots.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveAttribute('alt', /\S{10,}/);
        expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    await expect(page.locator('#requirements dt')).toHaveText(['Computer', 'Memory', 'Disk space', 'Graphics card']);
    await expect(page.locator('#requirements').getByRole('link', { name: 'Everything you need' })).toHaveAttribute('href', '/install#before');
    for (const question of ['Is it free?', 'Does anything I type leave my computer?', 'How is this different from Ollama, LM Studio or ChatGPT?', 'Do I need to use the command line?']) {
        await expect(page.locator('#questions summary').filter({ hasText: question })).toHaveCount(1);
    }
    await expect(page.locator('.ask').getByRole('link', { name: 'Ask it on GitHub' })).toHaveAttribute('href', /issues\/new\?title=Question/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
