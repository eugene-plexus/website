import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import chat from '../src/data/first-search-chat.json' with { type: 'json' };
import release from '../src/data/alpha-release.json' with { type: 'json' };

/**
 * The first-search story shows a real chat, and says so. These checks keep
 * it real: the page's answers are the record's answers, word for word; every
 * question and source is on the page; reasoning starts folded; and the page
 * does not claim Workbench is in a release it is not in.
 */

const answerFile = (name: string) =>
    readFileSync(new URL(`../src/content/first-search/${name}`, import.meta.url), 'utf8').replace(/\n$/, '');

test('the answer files are the recorded chat, word for word', () => {
    const replies = chat.messages.filter((m) => m.role === 'assistant');
    expect(replies).toHaveLength(3);
    for (const reply of replies) {
        // Workbench joined a reply's rounds with a blank line pair; the files
        // split there and nowhere else.
        expect(reply.parts!.map(answerFile).join('\n\n\n\n')).toBe(reply.content);
    }
    expect(replies.map((r) => r.parts!.length)).toEqual([1, 2, 2]);
});

test('the chat is on the page, reasoning folded and every source linked', async ({ page }) => {
    await page.goto('/first-search');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('It looked itself up.');
    const questions = chat.messages.filter((m) => m.role === 'user').map((m) => m.content);
    await expect(page.locator('.question')).toHaveText(questions);

    const reasoning = page.locator('details.reasoning');
    await expect(reasoning).toHaveCount(3);
    for (const fold of await reasoning.all()) await expect(fold).not.toHaveAttribute('open');
    await reasoning.first().locator('summary').click();
    await expect(reasoning.first()).toContainText('I should search the web to find out what this is.');

    // A sentence from each answer, from both rounds of a two-round reply.
    // Astro's Markdown curls quotes and apostrophes; the words are the record's.
    const shown = (await page.locator('.chat').innerText()).replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    for (const sentence of [
        'is an open-source, self-hosted',
        'Is there a particular angle on "importance" you were thinking about',
        'my second search (on the broader 2025 self-hosted-AI landscape) hit a rate limit',
        'the system\'s first confirmed external action was',
        'The first human-verified "the LLM just searched the web through Eugene" moment is',
    ]) {
        expect(shown).toContain(sentence);
    }
    await expect(page.locator('.round-break')).toHaveCount(2);

    const sources = chat.messages.flatMap((m) => m.sources ?? []).map((s) => s.url);
    const links = await page.locator('.sources a').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(links).toEqual(sources);
    // The model is named by size and family only (Troy, 2026-10-01).
    await expect(page.locator('.chat-model')).toContainText('a 27B Qwen model');
    await expect(page.locator('main')).not.toContainText(/abliterated|huihui/i);
});

test('the page keeps the alpha boundary and is reachable from every page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.site-footer').getByRole('link', { name: 'It looked itself up' }).click();
    await expect(page).toHaveURL(/\/first-search$/);
    await expect(page.locator("#try-title + p")).toContainText(`Workbench and web search are in ${release.version}`);
});

test('the story fits the screen, loads nothing remote and passes accessibility checks', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (request) => failed.push(request.url()));
    page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
    await page.goto('/first-search');
    // Open every fold: the widest content must fit too.
    for (const summary of await page.locator('details.reasoning summary').all()) await summary.click();
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
