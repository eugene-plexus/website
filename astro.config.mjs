import { defineConfig } from 'astro/config';
import markdownGuides from './integrations/markdown-guides.mjs';

export default defineConfig({
    site: 'https://eugeneplexus.com',
    output: 'static',
    integrations: [markdownGuides()],
    devToolbar: { enabled: false },
});
