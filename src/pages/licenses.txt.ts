import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

const assets = [
    ['Inter', 'node_modules/@fontsource-variable/inter/LICENSE'],
    ['JetBrains Mono', 'node_modules/@fontsource-variable/jetbrains-mono/LICENSE'],
    ['Lucide icons', 'node_modules/@lucide/astro/LICENSE'],
] as const;

export const prerender = true;

export const GET: APIRoute = async () => {
    const notices = await Promise.all(assets.map(async ([name, path]) => {
        const license = await readFile(resolve(process.cwd(), path), 'utf8');
        return `${name}\n${'='.repeat(name.length)}\n\n${license}`;
    }));
    return new Response(`Eugene Plexus website: third-party asset licenses\n\n${notices.join('\n\n')}`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};