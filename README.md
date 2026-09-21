# Eugene Plexus Website

The public project website for **Eugene Plexus**, a self-hosted control plane for local LLM inference.

- Repository: <https://github.com/eugene-plexus/website>
- Production domain: <https://eugeneplexus.com>
- Stack: Astro, TypeScript, self-hosted Inter and JetBrains Mono, Lucide icons.
- Hosting: GitHub Pages. The build produces static files in `dist/`; no server, database, or platform service is required to serve them.
- Status: v0.1.0-alpha.2 for early testing, 2026-09-21. No stable release yet. Deployment is manual.

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

`npm test` builds the production site first, then tests it with Chromium at 320, 390, 768, 1440, and 1920 pixels wide. Checks cover current capability and release-status copy, evidence caveats, Modern theme colors, local asset loading, overflow, accessibility, keyboard navigation, FAQs, 404 recovery, license notices, and JavaScript-disabled use. Homepage and architecture screenshots and failure traces are written to ignored `test-results/`.

Tests start their own preview on port 4322 and do not reuse existing servers. They ignore Astro's shared preview lock so a preview on a different port can keep running. The test configuration prevents Astro's agent detection from detaching this process, so Playwright can stop it on completion. Keep that port free; do not stop another project's process to make room.

## Editing

| File                                                           | Purpose                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [src/pages/index.astro](src/pages/index.astro)                 | Homepage copy, workflow, FAQs, and source links                          |
| [src/pages/install.astro](src/pages/install.astro)             | Beginner alpha installation, first reply, updates, removal and help |
| [src/pages/recovery.astro](src/pages/recovery.astro)           | Public backup and recovery guide, with alpha/development version guidance |
| [src/content/recovery.md](src/content/recovery.md)             | Reviewed snapshot of the specs recovery procedure, rendered on the recovery page |
| [src/data/alpha-release.json](src/data/alpha-release.json)     | Release manifest copied from the published distribution artifacts |
| [src/pages/releases/[version]/[file].ts](src/pages/releases/[version]/[file].ts) | Generate versioned installers from immutable upstream blobs, rejecting hash mismatches |
| [src/pages/architecture.astro](src/pages/architecture.astro)   | Layers, request flow, topologies, verification links, and current limits |
| [src/layouts/SiteLayout.astro](src/layouts/SiteLayout.astro)   | Shared navigation, footer, fonts, metadata, canonical URLs               |
| [src/styles/global.css](src/styles/global.css)                 | Modern theme tokens and responsive layout                                |
| [public/eugene-transparent.svg](public/eugene-transparent.svg) | Owner-supplied logo, also used as the favicon                            |
| [src/pages/404.astro](src/pages/404.astro)                     | GitHub Pages 404 page                                                    |
| [src/pages/licenses.txt.ts](src/pages/licenses.txt.ts)         | Build-time generation of bundled font and icon license notices           |
| [public/sitemap.xml](public/sitemap.xml)                       | Public page index; update when adding pages                              |
| [astro.config.mjs](astro.config.mjs)                           | Static output and production origin                                      |
| [.github/workflows/pages.yml](.github/workflows/pages.yml)     | CI checks and manual deployment                                          |

The design follows the application's **light Modern theme**: near-white surfaces, blue and magenta accents, Inter, and 6px corners. Tokens are maintained here, not imported from the application repo. There is no theme chooser or dark variant.

The alpha's versioned installer URLs are generated at build time from the specs
commit recorded in `alpha-release.json`, with size and SHA-256 verification.
Never hand-edit or copy installers into `public/`. Publish and verify the GitHub
prerelease assets before deploying the site. A new release needs its own manifest
and versioned paths; retain old manifests/routes when adding later versions so
existing commands remain available. Engine/model downloads and Python dependencies
are upstream-selected; only Eugene source revisions are fixed by this manifest.

The recovery page includes the full procedure without a runtime dependency on
GitHub or a working Eugene installation. `src/content/recovery.md` is a snapshot
of specs `docs/recovery.md` at `ba0e6f7273ccc7063045da64cfe860ec87d7316c`, with
its first heading supplied by the page and its helper link made absolute to that
revision. Update the snapshot and the page's source revision together after
reviewing future procedure changes. Alpha.2 includes the recovery guard; retain
the separate alpha.1 cold-copy instructions for its first upgrade.
`src/data/archived-releases.json` preserves earlier manifests and installer URLs.

The [direction document](https://github.com/eugene-plexus/specs/blob/main/docs/design/local-inference-control-plane.md) defines the positioning; the [release roadmap](https://github.com/eugene-plexus/specs/blob/main/docs/design/release-roadmap.md) owns the work order. Older README and milestone summaries can lag behind completed work. Use dated implementation and acceptance records for current claims. The training direction is retired. Do not restore a training pipeline or promote planned features as available. Keep the pre-release notice until a public platform release actually exists.

### Copy Evidence

The 2026-09-19 refresh keeps the existing Modern design and updates the homepage, architecture and shared description metadata. The architecture page dates its snapshot and separates implemented features from validation gaps and remaining pre-release work.

| Claim                                                               | Source and boundary                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engine setup, hardware-led recommendations, then tools and backends | [Adopted positioning](https://github.com/eugene-plexus/specs/blob/main/docs/design/local-inference-control-plane.md#2-the-differentiators); no uniqueness claim about competing products                                                                                         |
| Two-screen setup, Download and run, tasks, issues and client keys   | [Hobbyist implementation records](https://github.com/eugene-plexus/specs/blob/main/docs/design/hobbyist-ux.md); later fixes are recorded in the roadmap                                                                                                                          |
| Anthropic Messages alongside OpenAI-compatible APIs                 | [Gateway contract](https://github.com/eugene-plexus/specs/blob/main/openapi/gateway.yaml) and [application acceptance](https://github.com/eugene-plexus/specs/blob/ba0e6f7273ccc7063045da64cfe860ec87d7316c/docs/acceptance/a4-application-workflows.md); real clients and local models, not full vendor parity |
| Optional node-local model copies                                    | [Design and live measurement, section 14.3](https://github.com/eugene-plexus/specs/blob/main/docs/design/node-local-model-copy.md); originals stay untouched, first copy has a cost, 21 s was a warm-cache start                                                                 |
| Replica survival and wake timings                                   | [M6 run](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/m6-six-process-run.md); one GPU, 1.7B model, 172 ms completion after exclusion of a dead replica, not cascade latency                                                                                  |
| Control-plane overhead                                              | [One-client run](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/one-client-run.md); Windows/Python 3.12 and a fixed-delay stub, not engine throughput                                                                                                          |
| Timeouts and failover                                               | [Still-computing run](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/still-computing-run.md); computing deadlines do not cascade                                                                                                                               |
| Public-key verification and legacy-to-Ed25519 rotation | [R7 acceptance](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/r7-signing-run.md); trusted agents still sign; existing installs migrate by explicit rotation after upgrading |
| Model profile generation defaults | [R8 acceptance](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/r8-profile-defaults-run.md); caller settings win; cached profile reads; launch settings remain copy-at-launch |
| Profile benchmarks and remaining usability work | [Roadmap R6](https://github.com/eugene-plexus/specs/blob/main/docs/design/release-roadmap.md); profile context-depth benchmarks shipped, usability work remains; no release forecast |
| Timing evidence and its limits | [Control-plane measurement record](https://github.com/eugene-plexus/specs/blob/main/docs/acceptance/control-plane-measurements.md); historical observations, not current-version or competitor benchmarks |

On 2026-09-20, the standalone numbers section was removed. The records above remain technical evidence, linked from Current boundaries, rather than public-facing benchmarks. Prominent metrics must answer a prospective user's question with a relevant baseline; internal improvements and isolated hardware timings are not enough. Site publication remains the manual Pages workflow; a website refresh is not a platform release.

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
