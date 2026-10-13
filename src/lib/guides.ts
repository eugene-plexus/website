import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import pages from '../data/public-pages.json';

/**
 * A guide is one Markdown file in src/content/guides/ plus its line in
 * public-pages.json (title, description, group), which also puts it in the
 * sitemap, /llms.txt and the Markdown export. Either without the other fails
 * the build.
 */
export interface Guide {
    slug: string;
    path: string;
    title: string;
    description: string;
    group: string;
    Content: AstroComponentFactory;
}

const files = import.meta.glob<{ Content: AstroComponentFactory }>('../content/guides/*.md', { eager: true });

export function guides(): Guide[] {
    const bySlug = new Map(Object.entries(files).map(([file, module]) => [file.replace(/^.*\/|\.md$/g, ''), module.Content]));
    const listed = pages.filter((page) => page.path.startsWith('/guides/'));
    for (const slug of bySlug.keys()) {
        if (!listed.some((page) => page.path === `/guides/${slug}`)) throw new Error(`Guide ${slug}.md is not in public-pages.json`);
    }
    return listed.map((page) => {
        const slug = page.path.slice('/guides/'.length);
        const Content = bySlug.get(slug);
        if (!Content) throw new Error(`public-pages.json lists ${page.path}, but src/content/guides/${slug}.md is missing`);
        if (!('group' in page) || typeof page.group !== 'string') throw new Error(`${page.path} needs a group in public-pages.json`);
        return { slug, path: page.path, title: page.title, description: page.description, group: page.group, Content };
    });
}
