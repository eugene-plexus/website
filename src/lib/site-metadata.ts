import release from '../data/alpha-release.json';

export const projectDescription = 'Eugene Plexus is an open-source, self-hosted control plane for local LLM inference.';

export function markdownPath(path: string): string {
    return `${path.replace(/\/$/, '')}/index.md`;
}

export function structuredData(site: URL, canonical: URL, title: string, description: string) {
    const websiteId = new URL('/#website', site).href;
    const projectId = new URL('/#project', site).href;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': websiteId,
                name: 'Eugene Plexus',
                url: site.href,
                inLanguage: 'en',
                about: { '@id': projectId },
            },
            {
                '@type': 'SoftwareSourceCode',
                '@id': projectId,
                name: 'Eugene Plexus',
                url: site.href,
                description: projectDescription,
                version: release.version,
                creativeWorkStatus: 'Alpha; available for early testing. No stable release yet.',
                license: 'https://github.com/eugene-plexus/specs/blob/main/LICENSE',
                codeRepository: Object.keys(release.components).map(name => `https://github.com/eugene-plexus/${name}`),
            },
            {
                '@type': 'WebPage',
                '@id': canonical.href,
                url: canonical.href,
                name: title,
                description,
                inLanguage: 'en',
                isPartOf: { '@id': websiteId },
                about: { '@id': projectId },
            },
        ],
    };
}
