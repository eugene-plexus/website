import type { APIRoute, GetStaticPaths } from 'astro';
import { createHash } from 'node:crypto';
import release from '../../../data/alpha-release.json';
import archived from '../../../data/archived-releases.json';

// Generate from immutable upstream blobs. Never maintain editable installer copies.
export const prerender = true;
export const getStaticPaths: GetStaticPaths = () => [release, ...archived].flatMap(item =>
    Object.entries(item.files).map(([file, artifact]) => ({
        params: { version: item.version, file }, props: { artifact },
    })));

export const GET: APIRoute = async ({ props }) => {
    const artifact = props.artifact as { source: string; sha256: string; size: number };
    const response = await fetch(artifact.source, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Installer fetch failed: ${response.status} ${artifact.source}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length !== artifact.size || createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) {
        throw new Error(`Installer checksum mismatch: ${artifact.source}`);
    }
    return new Response(bytes, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
