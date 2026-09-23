import { expect, test, type Page } from '@playwright/test';

/**
 * The console's own plain-words rule, applied to the copy a casual visitor
 * reads first.
 *
 * The console bans a handful of internal words on its golden-path screens and
 * caps a sentence at 25 words (`ui/src/lib/vocabulary.ts`). The website's first
 * screens are the same audience one step earlier, so they get the same rule,
 * plus the words that only the website was using. Copy marked `data-plain` is
 * checked; the precise terms stay available in the technical line under the
 * hero, the workflow, the FAQ answers written for enthusiasts and the
 * architecture page.
 */
const BANNED = [
    // The console's list.
    'companion driver', 'declaration', 'admission', 'mint', 'epoch', 'advertiseurl',
    'trust root', 'topology', 'routing table', 'runtime',
    // The website's own jargon, kept out of casual copy.
    'control plane', 'inference', 'gateway', 'endpoint', 'llm', 'context length',
    'replica', 'failover', 'proxy', 'backend', 'node',
];
const MAX_WORDS = 25;

/** One string per block of copy. `textContent` of a list runs its items
 * together ("Tailscale.Power your"), which would read two sentences as one. */
async function plainCopy(page: Page): Promise<string[]> {
    return page.locator('[data-plain]').evaluateAll((elements) => elements.flatMap((element) => {
        const blocks = element.querySelectorAll('p, li, dt, dd, h2, h3, figcaption, summary');
        const parts = blocks.length ? Array.from(blocks) : [element];
        return parts.map((part) => (part.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    }));
}

function offences(texts: string[]): string[] {
    const found: string[] = [];
    for (const text of texts) {
        const low = text.toLowerCase();
        for (const term of BANNED) {
            // `node` means a machine in an install, not Node.js.
            const pattern = term === 'node' ? /\bnodes?\b(?!\.js)/ : new RegExp(`\\b${term}s?\\b`);
            if (pattern.test(low)) found.push(`"${term}" in: ${text.slice(0, 90)}`);
        }
        for (const sentence of text.split(/(?<=[.!?])\s+/)) {
            const words = sentence.split(/\s+/).filter(Boolean).length;
            if (words > MAX_WORDS) found.push(`${words} words: ${sentence.slice(0, 90)}`);
        }
    }
    return found;
}

for (const path of ['/', '/install']) {
    test(`casual copy on ${path} uses plain words`, async ({ page }) => {
        await page.goto(path);
        const texts = await plainCopy(page);
        expect(texts.length, 'the page marks its casual copy').toBeGreaterThan(3);
        expect(offences(texts)).toEqual([]);
    });
}

test('the checker catches what it is for', () => {
    expect(offences(['A self-hosted control plane for local LLM inference.'])).toHaveLength(3);
    expect(offences(['Turn off any key.'])).toEqual([]);
    expect(offences(['You do not need Node.js.'])).toEqual([]);
    expect(offences(['Add a node.'])).toHaveLength(1);
    expect(offences([Array.from({ length: 26 }, () => 'word').join(' ') + '.'])).toHaveLength(1);
});
