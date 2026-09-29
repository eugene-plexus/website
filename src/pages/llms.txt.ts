import type { APIRoute } from 'astro';
import release from '../data/alpha-release.json';
import pages from '../data/public-pages.json';
import { markdownPath, projectDescription } from '../lib/site-metadata';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
    if (!site) throw new Error('A production site URL is required for llms.txt');
    const source = `https://raw.githubusercontent.com/eugene-plexus/specs/${release.specsCommit}`;
    const links = pages.map(page => `- [${page.title}](${new URL(markdownPath(page.path), site)}): ${page.description}`).join('\n');
    return new Response(`# Eugene Plexus

> ${projectDescription}

Published release: ${release.version}, an alpha for early testing. There is no stable release yet.
Use the installation guide and support matrix for available capabilities and platform limits.
The roadmap describes development plans, not a promise of shipped features.
The Markdown pages below are generated from the same HTML content as the public website on every build.
Each includes a link to its human-readable source page. Website: ${site.href}

## Website guides

${links}

## Published release documentation

- [Release notes](${source}/docs/releases/${release.version}.md): Changes and upgrade guidance for the published alpha.
- [Support matrix](${source}/docs/support-matrix.md): Measured, simulated, and unverified configurations at the release revision.
- [Application workflows](${source}/docs/application-workflows.md): Connecting applications and the limits of API compatibility.
- [Gateway API](${source}/openapi/gateway.yaml): OpenAPI contract for client requests; relative schema references resolve beside this file.
- [Control API](${source}/openapi/control.yaml): Control-plane API contract.
- [Library API](${source}/openapi/library.yaml): Model library API contract.
- [Agent API](${source}/openapi/agent.yaml): Machine agent API contract.
- [Inference driver API](${source}/openapi/inference-driver.yaml): Inference driver API contract.

## Development and source

- [Development roadmap](https://raw.githubusercontent.com/eugene-plexus/specs/main/docs/design/adoption-roadmap.md): Current work order and future plans; may be ahead of the published alpha.
- [Project repositories](https://github.com/eugene-plexus): Source code and contributions.
- [Core source license](https://raw.githubusercontent.com/eugene-plexus/specs/${release.specsCommit}/LICENSE): Apache License 2.0; models and third-party assets have their own licenses.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
