# Contributing

This repo is the project website, not the application UI or a platform service. Keep changes here independent of the other Eugene Plexus repositories.

## Local Checks

Use Node.js 24 LTS:

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

Review the generated phone and desktop screenshots in `test-results/` when changing layout. Test keyboard navigation and respect reduced-motion preferences. The site should remain usable without JavaScript.

## Design And Copy

- Use the light Modern theme. Preserve the application's colors, typography, and 6px corners without importing its code.
- Keep styles responsive and controls accessible. Preserve the supplied logo unless its owner requests a change.
- Describe the current inference control plane, not retired product directions. Verify claims against the current specs and component documentation.
- Distinguish implemented, planned, and released capabilities. Do not invent a download, benchmark, testimonial, or release.
- Preserve local font hosting and the generated third-party license notices when changing assets.
- Add new public pages to the sitemap and use the shared layout for metadata and navigation.

## Pull Requests

Keep changes focused, explain the user-facing result, and include relevant verification. The GitHub Actions workflow runs type checks and browser tests; deployment is manual and restricted to `main`.

Contributions use the [Developer Certificate of Origin](https://developercertificate.org/), not a CLA. Sign off each commit with `git commit -s`, using your own name and email. The sign-off certifies your right to contribute the work under this repository's license.