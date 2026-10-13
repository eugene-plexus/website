// Place a reviewed run of specs scripts/website-screenshots.py into the site.
//
//   node scripts/place-screenshots.mjs <run-folder>
//
// The feature pages' pictures go to src/assets/screenshots/<name>.png, where
// Astro makes their WebP sizes. Home's three go to public/screenshots as WebP
// at the sizes its markup declares. Crops keep a picture to what its caption
// is about. Review every picture before running this; nothing here checks
// what a picture shows.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const run = process.argv[2];
if (!run) throw new Error('Usage: node scripts/place-screenshots.mjs <run-folder>');
const assets = new URL('../src/assets/screenshots/', import.meta.url);
const publicShots = new URL('../public/screenshots/', import.meta.url);
mkdirSync(assets, { recursive: true });

// name: [source file, optional crop { top, height } in source pixels]
const features = {
    discover: ['04-discover-works-here-now.png'],
    'runs-as': ['05-library-runs-as.png'],
    delete: ['05b-library-delete-confirmation.png'],
    // Ends above the setting's raw default.
    sources: ['06-settings-where-to-find-models.png', { top: 0, height: 715 }],
    // From "Set up" to the end: the Codex recipe.
    'apps-codex': ['03-home-use-from-apps-codex.png', { top: 1810 }],
    gemini: ['07-backends-add-gemini.png'],
    'search-order': ['08-routing-web-search-order.png'],
    machines: ['09-machines.png'],
    metrics: ['10-metrics-request-outcomes.png'],
    'workbench-document': ['11-workbench-attached-document.png'],
    'workbench-memory': ['12-workbench-memory.png'],
    'workbench-citation': ['13-workbench-cited-passage.png'],
    'workbench-approval': ['14-workbench-tool-approval.png'],
    'workbench-phone': ['15-workbench-chat-phone.png'],
};

async function cropped(file, crop) {
    const image = sharp(join(run, file));
    if (!crop) return image;
    const { width, height } = await image.metadata();
    const top = crop.top ?? 0;
    return image.extract({ left: 0, top, width, height: Math.min(crop.height ?? height - top, height - top) });
}

for (const [name, [file, crop]] of Object.entries(features)) {
    await (await cropped(file, crop)).png().toFile(new URL(`${name}.png`, assets).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    console.log(`src/assets/screenshots/${name}.png`);
}

// Home's three, at the widths its markup gives them.
const home = {
    'first-reply': ['01-home-reply-desktop.png', 1200],
    'phone-first-reply': ['02-home-reply-phone.png', 480],
    // Address, model and key: the top of the card.
    'connect-your-apps': ['03-home-use-from-apps-codex.png', 1200, { top: 0, height: 560 }],
};
for (const [name, [file, width, crop]] of Object.entries(home)) {
    const out = new URL(`${name}.webp`, publicShots).pathname.replace(/^\/([A-Za-z]:)/, '$1');
    const info = await (await cropped(file, crop)).resize({ width }).webp({ quality: 82 }).toFile(out);
    console.log(`public/screenshots/${name}.webp ${info.width}x${info.height}`);
}
