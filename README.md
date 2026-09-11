# Eugene Plexus Website

The public project website for **Eugene Plexus**, a self-hosted control plane for local LLM inference.

- Repository: <https://github.com/eugene-plexus/website>
- Intended production domain: <https://eugeneplexus.com>
- Stack: Astro, TypeScript, self-hosted Inter and JetBrains Mono, Lucide icons.
- Hosting: GitHub Pages. The build produces static files in `dist/`; no server, database, or platform service is required to serve them.
- Status: initial website, with no public platform release to advertise. Deployment is manual.

## Development

Use Node.js 24 LTS and npm. Work from this repository's directory:

```sh
npm ci
npm run dev
```

Astro normally serves the site at <http://localhost:4321>. It reports the selected port if that port is occupied. In an AI-agent environment, Astro 7 may run its server in the background; stop that server with `npm run dev -- stop`.

```sh
npm run check
npx playwright install chromium
npm test
npm run preview
```

`npm test` builds the production site first, then tests it with Chromium at 320, 390, 768, 1440, and 1920 pixels wide. Checks cover Modern theme colors, local asset loading, overflow, accessibility, keyboard navigation, FAQs, 404 recovery, license notices, and JavaScript-disabled use. Screenshots and failure traces are written to ignored `test-results/`.

Tests start their own preview on port 4322 and do not reuse existing servers. The test configuration prevents Astro's agent detection from detaching this process, so Playwright can stop it on completion. Keep that port free; do not stop another project's process to make room.

## Editing

| File                                                           | Purpose                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| [src/pages/index.astro](src/pages/index.astro)                 | Homepage copy, workflow, FAQs, and source links                |
| [src/layouts/SiteLayout.astro](src/layouts/SiteLayout.astro)   | Shared navigation, footer, fonts, metadata, canonical URLs     |
| [src/styles/global.css](src/styles/global.css)                 | Modern theme tokens and responsive layout                      |
| [public/eugene-transparent.svg](public/eugene-transparent.svg) | Owner-supplied logo, also used as the favicon                  |
| [src/pages/404.astro](src/pages/404.astro)                     | GitHub Pages 404 page                                          |
| [src/pages/licenses.txt.ts](src/pages/licenses.txt.ts)         | Build-time generation of bundled font and icon license notices |
| [public/sitemap.xml](public/sitemap.xml)                       | Public page index; update when adding pages                    |
| [astro.config.mjs](astro.config.mjs)                           | Static output and production origin                            |
| [.github/workflows/pages.yml](.github/workflows/pages.yml)     | CI checks and manual deployment                                |

The design follows the application's **light Modern theme**: near-white surfaces, blue and magenta accents, Inter, and 6px corners. Tokens are maintained here, not imported from the application repo. There is no theme chooser or dark variant.

The current product definition is in [specs/README.md](https://github.com/eugene-plexus/specs#what-is-eugene-plexus), with UI capabilities in [ui/README.md](https://github.com/eugene-plexus/ui#readme). The training direction is retired; older workspace bootstrap documents may still describe it. Do not restore a training pipeline or promote planned features as available. Keep the pre-release notice until a public platform release actually exists.

The website is independent of the running platform. It makes no API calls to an installation, loads its fonts and icons locally, and has no analytics or contact-form backend. A future server-side feature would require a separate service because GitHub Pages does not run application backends.

## GitHub Pages

The workflow runs checks on pushes to `main` and on pull requests. **Only a manual workflow run on `main` deploys.** Repository creation alone does not publish the site.

1. Review, commit with a DCO sign-off, and push the website source to this repository's `main` branch. Do not commit `node_modules/`, `dist/`, or local environment files.
2. In repository **Settings > Pages**, select **GitHub Actions** as the source.
3. Verify ownership of `eugeneplexus.com` in the GitHub organization's Pages settings using GitHub's generated DNS TXT record. Keep that verification record.
4. Set **Custom domain** in this repository's Pages settings to `eugeneplexus.com` before pointing web traffic at GitHub.
5. Configure the DNS records below at the domain provider, without changing unrelated mail or other service records.
6. In **Actions > Website > Run workflow**, select `main`. The workflow checks types, builds, runs browser tests, uploads `dist/`, then deploys.
7. Enable **Enforce HTTPS** in Pages settings when GitHub's certificate is ready. DNS propagation and certificate provisioning can take up to 24 hours.

### DNS

For the apex domain, use these four A records:

| Type  | Name | Value                   |
| ----- | ---- | ----------------------- |
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| CNAME | www  | eugene-plexus.github.io |

The `www` record is recommended; GitHub redirects it to the configured apex domain. Its value contains **no repository path**. A provider supporting apex `ALIAS` or `ANAME` can instead point the apex to `eugene-plexus.github.io`. Avoid wildcard DNS records.

With an Actions-based deployment, GitHub uses the custom domain in **Pages settings**. A committed `CNAME` file is not required and does not configure that setting. See [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The site intentionally uses root-relative URLs for `eugeneplexus.com`, not `/website/`. It is not configured to run at `eugene-plexus.github.io/website/`. Using that subpath instead requires changing Astro's `site` and `base`, and updating internal asset and link paths. Do not add `/website` to `base` for the custom-domain deployment.

Useful DNS checks in PowerShell:

```powershell
Resolve-DnsName eugeneplexus.com -Type A
Resolve-DnsName www.eugeneplexus.com -Type CNAME
```

## Contributing And License

See [CONTRIBUTING.md](CONTRIBUTING.md). Source is licensed under [Apache 2.0](LICENSE). Third-party asset licenses are preserved in the generated `/licenses.txt` output. Trademark rights in the project name and logo are not granted by the source license.