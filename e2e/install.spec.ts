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
        await page.getByText('Already running a NAS or Docker control plane?', { exact: true }).click();
        await expect(page.locator('#update details')).toContainText(release.container);
        await expect(page.locator('#update details p')).toBeVisible();
    } finally {
        await context.close();
    }
});
