import { expect, test } from '@playwright/test';
import { pageMarkdown } from '../integrations/markdown-guides.mjs';
import release from '../src/data/alpha-release.json' with { type: 'json' };

// These are content/HTTP checks; the existing suite checks layout at every width.
test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Content is independent of viewport size');
});

test('the AI index leads to readable, current guides for every public page', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.ok()).toBe(true);
    const index = await response.text();
    expect(index).toMatch(/^# Eugene Plexus\n/);
    expect(index).toContain(`Published release: ${release.version}`);
    expect(index).toContain('the first release: early software, with known limits.');
    expect(index).toContain(`${release.specsCommit}/docs/support-matrix.md`);
    expect(index).toContain(`${release.specsCommit}/openapi/gateway.yaml`);
    expect(index).toContain('roadmap describes development plans');

    const sitemap = await (await request.get('/sitemap.xml')).text();
    const urls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), match => new URL(match[1]));
    for (const url of urls) {
        const markdownUrl = `${url.pathname.replace(/\/$/, '')}/index.md`;
        expect(index).toContain(`https://eugeneplexus.com${markdownUrl}`);
        const markdown = await request.get(markdownUrl);
        expect(markdown.ok(), markdownUrl).toBe(true);
        const text = await markdown.text();
        expect(text).toContain(`Source: ${url.href}`);
        expect(text).toMatch(/^# .+/m);
        expect(text).not.toMatch(/<\/?(?:html|script|style|svg)\b|Skip to content|This page as Markdown/);
    }
});

test('installation and recovery Markdown retain exact executable examples and caveats', async ({ page, request }) => {
    for (const path of ['/install', '/recovery']) {
        await page.goto(path);
        const markdown = await (await request.get(`${path}/index.md`)).text();
        const commands = await page.locator('main pre').allTextContents();
        expect(commands.length).toBeGreaterThan(0);
        for (const command of commands) {
            expect(markdown, `${path} command must survive conversion`).toContain(command);
        }
    }
    const install = await (await request.get('/install/index.md')).text();
    expect(install).toContain(`image: ${release.container}`);
    expect(install).toContain('physical Mac verification remains outstanding');
    const recovery = await (await request.get('/recovery/index.md')).text();
    expect(recovery).toContain('does not make a checkpoint for you');
    const architecture = await (await request.get('/architecture/index.md')).text();
    expect(architecture).toContain('This is not full vendor API parity.');
    const overview = await (await request.get('/index.md')).text();
    expect(overview).toContain('Can I download it yet?');
    expect(overview).toContain('Is this a chatbot or an inference engine?');
    expect(overview).toContain('Core license: [Apache 2.0]');
    const principles = await (await request.get('/principles/index.md')).text();
    expect(principles).toContain('## Five principles. One purpose.');
});

test('HTML advertises Markdown and includes factual project metadata', async ({ page }) => {
    for (const path of ['/', '/install', '/architecture', '/recovery', '/principles']) {
        await page.goto(path);
        await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', '/llms.txt');
        await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute('href', `${path.replace(/\/$/, '')}/index.md`);
        const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
        const project = data['@graph'].find((entity: { '@type': string }) => entity['@type'] === 'SoftwareSourceCode');
        expect(project.name).toBe('Eugene Plexus');
        expect(project.version).toBe(release.version);
        expect(project.license).toBe('https://github.com/eugene-plexus/specs/blob/main/LICENSE');
        expect(project.codeRepository).toContain('https://github.com/eugene-plexus/gateway');
        expect(project.creativeWorkStatus).toContain('early software, with known limits');
        expect(project).not.toHaveProperty('aggregateRating');
    }
    await page.goto('/404.html');
    await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});

test('conversion retains code whitespace, tables, definitions, closed FAQs, and resolved links', () => {
    const code = 'services:\n  app:\n    image: example:alpha\n\n    # literal `backtick` & <value>\n';
    const html = `<html><body><nav>Site navigation</nav><main>
      <h1>Guide</h1><nav>Section links</nav>
      <details><summary>A closed question</summary><p>The complete answer.</p></details>
      <dl><dt>Platform</dt><dd>Not yet verified.</dd></dl>
      <table><thead><tr><th>Version</th><th>Action</th></tr></thead><tbody><tr><td>Alpha</td><td>Back up first</td></tr></tbody></table>
      <pre><code>services:\n  app:\n    <span>image: example:alpha</span>\n\n    # literal &#96;backtick&#96; &amp; &lt;value&gt;\n</code></pre>
      <a href="/recovery#limits">Recovery</a><img src="/example.webp" alt="Example diagram">
      <button>Copy</button><svg><title>Decoration</title></svg><span aria-hidden="true">Decoration</span>
      <script>unwanted()</script>
    </main><footer>Site footer</footer></body></html>`;
    const markdown = pageMarkdown(html, 'https://eugeneplexus.com/install');
    expect(markdown).toContain(code);
    expect(markdown).toContain('**A closed question**');
    expect(markdown).toContain('The complete answer.');
    expect(markdown).toContain('**Platform**');
    expect(markdown).toContain('Not yet verified.');
    expect(markdown).toMatch(/\| Version \| Action \|/);
    expect(markdown).toMatch(/\| Alpha \| Back up first \|/);
    expect(markdown).toContain('[Recovery](https://eugeneplexus.com/recovery#limits)');
    expect(markdown).toContain('![Example diagram](https://eugeneplexus.com/example.webp)');
    expect(markdown).not.toMatch(/Site navigation|Section links|Site footer|Copy|Decoration|unwanted/);
    expect(() => pageMarkdown('<main></main>', 'https://eugeneplexus.com/')).toThrow('Missing main content');
});
