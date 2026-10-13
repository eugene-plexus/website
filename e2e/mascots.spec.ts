import { expect, test } from '@playwright/test';

/**
 * Eugene's animated poses move, and hold still for reduced motion.
 *
 * Chrome does not pass an emulated reduced-motion preference into an SVG
 * shown through <img>, so each file is checked as a document of its own.
 */
const ANIMATED = ['welcome', 'guide', 'working', 'curious'];

test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'An SVG animates the same at every width');
});

for (const pose of ANIMATED) {
    test(`${pose} moves, and holds still for reduced motion`, async ({ browser }) => {
        const moving = await browser.newContext({ reducedMotion: 'no-preference' });
        const page = await moving.newPage();
        await page.goto(`/mascots/eugene-${pose}.svg`);
        // Sample the moving parts across one loop: their transforms must change.
        const samples = await page.evaluate(async () => {
            const parts = [...new Set(document.getAnimations().map((animation) => (animation.effect as KeyframeEffect).target as Element))];
            const seen = new Set<string>();
            for (let i = 0; i < 12; i++) {
                for (const animation of document.getAnimations()) animation.currentTime = i * 500;
                seen.add(parts.map((part) => `${getComputedStyle(part).transform}/${getComputedStyle(part).opacity}`).join('|'));
            }
            return { animations: document.getAnimations().length, distinct: seen.size };
        });
        expect(samples.animations).toBeGreaterThan(0);
        expect(samples.distinct).toBeGreaterThan(3);
        await moving.close();

        const still = await browser.newContext({ reducedMotion: 'reduce' });
        const quiet = await still.newPage();
        await quiet.goto(`/mascots/eugene-${pose}.svg`);
        expect(await quiet.evaluate(() => document.getAnimations().length)).toBe(0);
        await still.close();
    });
}
