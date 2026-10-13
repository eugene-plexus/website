import { defineConfig } from 'astro/config';
import markdownGuides from './integrations/markdown-guides.mjs';

export default defineConfig({
    site: 'https://eugeneplexus.com',
    output: 'static',
    integrations: [markdownGuides()],
    // Split into memory, documents, and folders and tools guides after v0.2.0.
    redirects: { '/guides/workbench-documents-and-tools': '/guides' },
    devToolbar: { enabled: false },
});
