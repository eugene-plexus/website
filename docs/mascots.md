# Eugene's mascot poses

Four standalone, transparent SVGs extend the approved face in
`public/eugene-face.svg`. His glasses, hair, smile, and original face paths
remain intact. A muted apricot overshirt (`#cf9a72`, the Plexus warm accent),
blue trousers, small pocket and simple limbs give the face a body that works
with the website's graphite palette. Warm seams and pocket shading keep the
shirt distinct from the cool blue trousers and hair.

| Pose | Asset | Website placement |
| --- | --- | --- |
| Welcome | `public/mascots/eugene-welcome.svg` | Homepage's open invitation |
| Guide | `public/mascots/eugene-guide.svg` | Installation introduction |
| Working | `public/mascots/eugene-working.svg` | Homepage's workflow introduction |
| Curious | `public/mascots/eugene-curious.svg` | Page-not-found recovery |

Use `Mascot.astro` beside welcoming or explanatory copy:

```astro
<Mascot pose="guide" size={176} />
```

The component is decorative (`alt=""`) because the adjacent words carry the
meaning. It reserves image dimensions and lazy-loads by default; use `eager`
for the first visible section of a page. The SVG files also have titles and
descriptions for standalone use, and require no fonts, scripts, animation,
external images or network dependencies.

Use the full poses at 96–240 CSS pixels. Below that, use `Face.astro` so the
expression stays readable. Keep the network-ring logo for brand identification.
Give each pose space; one or two appearances per page is enough. Keep release
qualifications and practical help in the text. Avoid using the character as a
certification badge, a substitute for an error explanation, or a pretend live
support agent.

To edit a pose, change its geometry in `scripts/build-mascots.mjs` and run:

```sh
npm run mascots:build
```

Commit the generated SVGs with the source change. The generator embeds the
approved face in each file, so the assets remain portable and a face update
can be propagated without redrawing each pose.
