import { readFile, writeFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';
import pages from '../src/data/public-pages.json' with { type: 'json' };

/** Convert the rendered content, retaining commands, tables, FAQs, and warnings. */
export function pageMarkdown(html, pageUrl) {
    const { document } = parseHTML(html);
    const main = document.querySelector('main');
    if (!main?.querySelector('h1')) throw new Error(`Missing main content: ${pageUrl}`);

    // Closed details are content, so keep them. Only remove controls and decoration.
    for (const element of main.querySelectorAll('script, style, nav, button, svg, [aria-hidden="true"], [role="status"], img[alt=""]')) {
        element.remove();
    }
    for (const link of main.querySelectorAll('a[href]')) {
        link.setAttribute('href', new URL(link.getAttribute('href'), pageUrl).href);
    }
    for (const image of main.querySelectorAll('img[src]')) {
        image.setAttribute('src', new URL(image.getAttribute('src'), pageUrl).href);
    }
    // CSS supplies spacing in these compact rows. Supply text separators in the
    // export, and keep headings with visual line breaks on one Markdown line.
    for (const heading of main.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
        for (const br of heading.querySelectorAll('br')) br.replaceWith(document.createTextNode(' '));
    }
    for (const label of main.querySelectorAll('.fact > span:first-child')) {
        label.after(document.createTextNode(': '));
    }
    for (const label of main.querySelectorAll('.stage-meta > span')) {
        label.after(document.createTextNode(' — '));
    }

    const converter = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
    });
    converter.use(tables);
    converter.addRule('definitionTerm', {
        filter: 'dt',
        replacement: content => `\n\n**${content.trim()}**\n\n`,
    });
    converter.addRule('definitionBody', {
        filter: 'dd',
        replacement: content => `\n\n${content.trim()}\n\n`,
    });
    converter.addRule('question', {
        filter: 'summary',
        replacement: content => `\n\n**${content.trim()}**\n\n`,
    });
    // Preserve exact whitespace inside shell commands and Compose YAML, even when
    // syntax highlighting wraps code in spans. Choose a safe fence for its content.
    converter.addRule('codeBlock', {
        filter: 'pre',
        replacement: (_content, node) => {
            const code = node.textContent ?? '';
            const fence = '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), match => match[0].length + 1)));
            return `\n\n${fence}\n${code}${code.endsWith('\n') ? '' : '\n'}${fence}\n\n`;
        },
    });
    return `Source: ${pageUrl}\n\n${converter.turndown(main.innerHTML)}\n`;
}

/** @returns {import('astro').AstroIntegration} */
export default function markdownGuides() {
    let site;
    return {
        name: 'markdown-guides',
        hooks: {
            'astro:config:done': ({ config }) => {
                if (!config.site) throw new Error('A production site URL is required for Markdown guides');
                site = config.site;
            },
            'astro:build:done': async ({ dir, logger }) => {
                for (const page of pages) {
                    const folder = page.path.replace(/^\//, '');
                    const prefix = folder ? `${folder}/` : '';
                    const html = await readFile(new URL(`${prefix}index.html`, dir), 'utf8');
                    const markdown = pageMarkdown(html, new URL(page.path, site).href);
                    await writeFile(new URL(`${prefix}index.md`, dir), markdown, 'utf8');
                }
                logger.info(`Generated ${pages.length} Markdown guides from rendered pages.`);
            },
        },
    };
}
