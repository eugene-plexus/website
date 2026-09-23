import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';
import release from '../src/data/alpha-release.json' with { type: 'json' };
import archived from '../src/data/archived-releases.json' with { type: 'json' };

test('a visitor can find, read and copy the versioned installer', async ({ page, context }, testInfo) => {
    await page.goto('/');
    await page.locator('.hero-actions').getByRole('link', { name: 'Install the alpha' }).click();
    await expect(page).toHaveURL(/\/install\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get your first model answering.');
    await expect(page.locator('.alpha-notice')).toContainText('There is no stable release yet');
    await page.getByRole('navigation', { name: 'Installation sections' }).getByRole('link', { name: 'Windows', exact: true }).click();
    await expect(page.locator('#windows-title')).toBeInViewport();
    const command = `irm https://eugeneplexus.com/releases/${release.version}/install.ps1 | iex`;
    await expect(page.locator('#windows-command')).toHaveText(command);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy windows install command', exact: true }).click();
    await expect(page.locator('#windows .copy-status')).toHaveText('Copied.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(command);
    await expect(page.locator('#linux-command')).toHaveText(`curl -fsSL https://eugeneplexus.com/releases/${release.version}/install.sh | sh`);
    await expect(page.locator('#remove')).toContainText('Run as administrator');
    await expect(page.locator('#update')).toContainText('they do not silently follow development changes');
    await expect(page.locator('#mac')).toContainText('physical Mac verification remains outstanding');
    for (const hash of await page.locator('.install-nav a').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).hash.slice(1)))) {
        await expect(page.locator(`[id="${hash}"]`)).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('install.png'), fullPage: true });
});

test('current and archived installers retain exact release bytes', async ({ request }) => {
    for (const item of [release, ...archived]) {
      for (const [name, artifact] of Object.entries(item.files)) {
        const response = await request.get(`/releases/${item.version}/${name}`);
        expect(response.ok()).toBe(true);
        const bytes = await response.body();
        expect(bytes.length).toBe(artifact.size);
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(artifact.sha256);
        expect(bytes.toString()).not.toContain('<!DOCTYPE html>');
      }
    }
});

test('Docker is a top-level option with a copyable pinned Compose setup', async ({ page, context }, testInfo) => {
    await page.goto('/install');
    await page.getByRole('navigation', { name: 'Installation sections' }).getByRole('link', { name: 'Docker / NAS', exact: true }).click();
    await expect(page.locator('#docker-title')).toBeInViewport();
    const configuration = await page.locator('#docker-compose').innerText();
    expect(configuration).toContain(`image: ${release.container}`);
    for (const mapping of ['8279:8079', '8280:8080', '8283:8083']) {
        expect(configuration).toContain(`"${mapping}"`);
    }
    expect(configuration).toContain('plexus-data:/data');
    expect(configuration).toContain('target: /models');
    expect(configuration).toContain('create_host_path: false');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy docker compose configuration', exact: true }).click();
    // Windows clipboard APIs translate line endings; YAML indentation must survive.
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(configuration);
    await expect(page.locator('.docker-addresses')).toContainText('http://NAS-IP:8280/v1');
    await expect(page.locator('.docker-addresses')).toContainText('http://NAS-IP:8283');
    await expect(page.locator('#docker-join-windows')).toContainText(`/releases/${release.version}/install.ps1`);
    await expect(page.locator('#docker-join-linux')).toContainText(`/releases/${release.version}/install.sh`);
    await expect(page.locator('#docker')).toContainText('The container does not run GPU inference');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.locator('#docker-compose').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('docker-compose.png') });
});

test('recovery distinguishes the first alpha upgrade from checkpoint-capable releases', async ({ browser, baseURL, page: scriptedPage }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
    try {
        const page = await context.newPage();
        await page.goto(`${baseURL}/install`);
        await page.locator('#update').getByRole('link', { name: 'Read the backup and recovery guide before updating.' }).click();
        await expect(page.locator('.version-notice')).toContainText('will refuse alpha.1');
        await expect(page.locator('.version-notice')).toContainText(`Published alpha (${release.version})`);
        await expect(page.locator('.version-notice')).toContainText('follow the checkpoint procedure below');
        await expect(page.getByRole('heading', { name: 'Windows worker', exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'scripts/recovery.py', exact: true })).toHaveAttribute('href', `https://github.com/eugene-plexus/specs/blob/${release.specsCommit}/scripts/recovery.py`);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    } finally {
        await context.close();
    }
    // axe injects JavaScript, so run it separately from the no-JavaScript check.
    await scriptedPage.goto('/recovery');
    expect((await new AxeBuilder({ page: scriptedPage }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('installation instructions remain usable without JavaScript', async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
    try {
        const page = await context.newPage();
        await page.goto(`${baseURL}/install`);
        await expect(page.locator('#windows-command')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Copy windows install command' })).toBeHidden();
        await page.getByRole('navigation', { name: 'Installation sections' }).getByRole('link', { name: 'Docker / NAS', exact: true }).click();
        await expect(page.locator('#docker-title')).toBeInViewport();
        await expect(page.locator('#docker-compose')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Copy docker compose configuration' })).toBeHidden();
        await expect(page.locator('#docker-join-windows')).toBeVisible();
        await page.getByText('Already running a NAS or Docker control plane?', { exact: true }).click();
        await expect(page.locator('#update details')).toContainText(release.container);
        await expect(page.locator('#update details p')).toBeVisible();
    } finally {
        await context.close();
    }
});

test('the chooser marks the visitor\'s own computer, and leaves a phone unmarked', async ({ browser, baseURL }, testInfo) => {
    const agents = {
        windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
        phone: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36',
    };
    for (const [name, userAgent] of Object.entries(agents)) {
        const context = await browser.newContext({ userAgent, viewport: testInfo.project.use.viewport });
        try {
            const page = await context.newPage();
            await page.goto(`${baseURL}/install`);
            const detected = page.locator('.choice[data-detected="true"]');
            if (name === 'windows') {
                await expect(detected).toHaveAttribute('data-os', 'windows');
                await expect(detected.locator('.choice-detected')).toBeVisible();
            } else {
                await expect(detected).toHaveCount(0);
            }
            // The whole card follows its link, not only the name in it.
            await page.locator('.choice[data-os="linux"]').click();
            await expect(page).toHaveURL(/#linux$/);
            await expect(page.locator('#linux-title')).toBeInViewport();
        } finally {
            await context.close();
        }
    }
});

test('each install path says what you will see, and where help is', async ({ page }) => {
    await page.goto('/install');
    await expect(page.locator('#windows .expect li')).toHaveCount(4);
    await expect(page.locator('#windows .expect')).toContainText('Choose a passphrase');
    await expect(page.locator('#windows .expect')).toContainText('done.');
    await expect(page.locator('#linux .expect')).toContainText('Eugene Plexus is running');
    await expect(page.locator('#windows .expect-help').getByRole('link', { name: 'If something goes wrong' })).toHaveAttribute('href', '#help');
    await expect(page.locator('#help').getByRole('link', { name: 'Ask it on GitHub' })).toHaveAttribute('href', /issues\/new\?title=Question/);
    await expect(page.locator('#before details')).not.toHaveAttribute('open');
    await expect(page.locator('#before details')).toContainText('SHA-256 checksums');
});
