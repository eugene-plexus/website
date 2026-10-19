import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import pages from '../data/public-pages.json';
import registry from '../data/checks.json';

/**
 * A guide is one Markdown file in src/content/guides/ plus its line in
 * public-pages.json (title, description, group), which also puts it in the
 * sitemap, /llms.txt and the Markdown export. Either without the other fails
 * the build.
 *
 * A guide's `checks` name entries in checks.json: paths it describes that
 * have, or have not yet, been tested for real. Its page shows one badge each.
 * An id not in checks.json fails the build.
 */
export interface Check {
    id: string;
    label: string;
    /** Automated tests exercise it, against stand-ins for outside services. */
    automated: boolean;
    /** A person has tried it for real; `evidence` is the record. */
    handTested: boolean;
    evidence: string | null;
}

export interface Guide {
    slug: string;
    path: string;
    title: string;
    description: string;
    group: string;
    checks: Check[];
    Content: AstroComponentFactory;
}

const files = import.meta.glob<{ Content: AstroComponentFactory }>('../content/guides/*.md', { eager: true });
const known = registry as unknown as Record<string, Omit<Check, 'id'> | string>;

function check(path: string, id: string): Check {
    const entry = id.startsWith('_') ? undefined : known[id];
    if (!entry || typeof entry === 'string') throw new Error(`${path} lists the check ${id}, which is not in checks.json`);
    if (entry.handTested && !entry.evidence) throw new Error(`checks.json marks ${id} hand-tested without evidence`);
    return { id, ...entry };
}

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
        const ids: string[] = 'checks' in page && Array.isArray(page.checks) ? page.checks : [];
        return { slug, path: page.path, title: page.title, description: page.description, group: page.group, checks: ids.map((id) => check(page.path, id)), Content };
    });
}
