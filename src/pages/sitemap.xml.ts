import type { APIRoute } from 'astro';
import pages from '../data/public-pages.json';

export const prerender = true;

// Every public page, from the same list as /llms.txt and the Markdown export,
// so a new page or guide cannot be left out of one of them.
export const GET: APIRoute = ({ site }) => {
    if (!site) throw new Error('A production site URL is required for the sitemap');
    const urls = pages.map((page) => `  <url>\n    <loc>${new URL(page.path, site).href}</loc>\n  </url>`).join('\n');
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
