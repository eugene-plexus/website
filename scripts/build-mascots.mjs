import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Keep the approved face as the single source of truth. Each output is a
// standalone vector: no external images, fonts, scripts, or runtime requests.
const root = new URL('../', import.meta.url);
const face = readFileSync(new URL('public/eugene-face.svg', root), 'utf8');
const defs = face.match(/<defs>([\s\S]*?)<\/defs>/)[1];
const head = face.slice(face.indexOf('<g id="eugene-face">'), face.lastIndexOf('</svg>'));
const ink = '#061a2e';
const rim = '#9fb3c8';
const skin = '#f7f7f9';
const shirt = '#cf9a72';
const shirtRim = '#e7bf9e';
const shirtSeam = '#85573b';

const body = `
  <g stroke="${ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M120 259 L118 292 Q131 298 147 291 L154 261 M166 261 L172 291 Q187 298 201 290 L199 259" fill="#46668b" stroke="${rim}" stroke-width="3"/>
    <path d="M118 286 Q106 288 104 298 Q104 302 114 302 H144 Q151 301 148 289 M174 289 Q170 301 177 302 H210 Q218 300 213 295 Q209 289 200 286" fill="${ink}" stroke="${rim}" stroke-width="3"/>
    <path d="M136 160 Q118 165 109 190 L106 261 Q158 280 215 260 L210 188 Q204 169 181 160 Z" fill="${shirt}" stroke="${shirtRim}" stroke-width="3"/>
    <path d="M147 165 L160 184 L174 165" fill="${skin}"/>
    <path d="M160 185 V268" fill="none" stroke="${shirtSeam}" stroke-width="2"/>
    <path d="M180 210 H199 V229 Q189 237 180 229 Z" fill="#b9825b" stroke="${shirtSeam}" stroke-width="2"/>
    <path d="M185 218 H194" stroke="#f4dfcf" stroke-width="3"/>
  </g>`;

const headAt = (angle = 0) => `<g transform="rotate(${angle} 160 105)"><g transform="translate(77 9) scale(.24) translate(-278 -263)">${head}</g></g>`;
const hand = (path) => `<path d="${path}" fill="${skin}" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const sleeve = (path) => `<path d="${path}" fill="${shirt}" stroke="${shirtRim}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

const poses = {
  welcome: {
    title: 'Eugene waves hello',
    description: 'The familiar glasses, swept hair and smile, with an apricot overshirt, blue trousers and an open hand raised in welcome.',
    artwork: `${body}
      ${sleeve('M118 174 Q100 175 92 203 L84 233 L105 241 L126 198')}
      ${hand('M84 230 Q75 235 79 245 L88 256 Q94 262 99 256 L107 244 L105 235')}
      ${sleeve('M199 174 Q218 171 230 156 L243 128 L263 138 L249 176 Q233 198 211 205')}
      ${hand('M244 137 L239 120 L231 109 Q227 103 232 100 Q236 98 241 105 L246 112 L240 88 Q239 82 244 81 Q249 80 251 87 L257 106 L255 78 Q255 72 260 72 Q265 72 265 79 L266 104 L270 84 Q272 78 277 80 Q281 81 279 88 L276 111 L282 100 Q285 95 289 99 Q292 102 288 110 L277 133 Q273 142 261 143 Z')}
      <g fill="none" stroke="#7fb0cf" stroke-width="3" stroke-linecap="round"><path d="M283 62 L290 54 M299 82 L309 78"/></g>
      ${headAt(-4)}`,
  },
  guide: {
    title: 'Eugene shows the next step',
    description: 'Eugene holds an open guide and gestures toward the next step with a relaxed, open palm.',
    artwork: `${body}
      ${sleeve('M113 174 Q98 178 86 207 L105 222 L127 194')}
      ${sleeve('M201 175 Q219 172 234 188 L255 183 L264 204 L232 213 Q216 211 204 203')}
      ${hand('M253 185 Q259 180 263 174 Q266 168 270 171 Q274 174 268 182 L288 180 Q295 180 295 185 Q295 189 289 190 L275 192 L289 192 Q295 192 295 197 Q295 202 288 202 L267 207 Q259 206 255 201 Z')}
      ${headAt(2)}
      <g stroke="${ink}" stroke-width="4" stroke-linejoin="round">
        <path d="M62 212 Q85 205 112 218 Q136 205 157 212 L162 264 Q140 257 114 270 Q89 259 68 265 Z" fill="#f7f7f9"/>
        <path d="M112 218 L114 270" fill="none"/>
        <path d="M76 224 L99 228 M77 235 L99 239 M126 227 L145 222 M127 238 L145 233" fill="none" stroke="#758695" stroke-width="3" stroke-linecap="round"/>
        <path d="M136 210 V232 L142 227 L148 230 V211" fill="#cf9a72" stroke-width="2"/>
      </g>
      ${hand('M64 228 Q58 228 60 239 L64 250 Q67 256 74 253 L79 250 L75 235 Q73 228 69 231 L69 238')}`,
  },
  working: {
    title: 'Eugene at his laptop',
    description: 'Eugene smiles over a laptop, ready to work alongside you. A small network mark connects three points on its lid.',
    artwork: `${body}
      ${sleeve('M115 174 Q94 177 86 215 L104 230 L129 194')}
      ${sleeve('M202 174 Q224 180 232 218 L212 230 L191 194')}
      ${headAt()}
      ${hand('M87 211 Q82 219 92 229 L112 237 Q121 237 119 230 L109 218 Q99 210 94 216')}
      ${hand('M231 213 Q237 220 227 230 L207 237 Q198 237 201 230 L211 218 Q221 210 225 217')}
      <g stroke="${rim}" stroke-width="3" stroke-linejoin="round">
        <path d="M78 213 Q77 207 84 207 H236 Q243 207 242 213 L232 274 H88 Z" fill="#29343d"/>
        <path d="M73 274 H247 L257 283 Q258 287 250 287 H70 Q62 287 63 283 Z" fill="#46668b"/>
        <path d="M141 276 H179" stroke="#7fb0cf" stroke-linecap="round"/>
      </g>
      <g stroke="#7fb0cf" stroke-width="3" fill="#7fb0cf"><path d="M145 247 L160 234 L175 247" fill="none"/><circle cx="145" cy="247" r="4"/><circle cx="160" cy="234" r="4"/><circle cx="175" cy="247" r="4"/></g>`,
  },
  curious: {
    title: 'Eugene looks for the way',
    description: 'Eugene tilts his head and holds a magnifying glass, a friendly companion when a page cannot be found.',
    artwork: `${body}
      ${sleeve('M116 174 Q100 179 94 204 L93 231 L113 235 L130 195')}
      ${hand('M93 229 Q85 234 90 245 L98 253 Q104 258 110 250 L114 236')}
      ${sleeve('M201 176 Q222 179 227 210 L242 223 L227 244 L209 229 L190 197')}
      ${headAt(-8)}
      <g stroke-linecap="round" stroke-linejoin="round">
        <path d="M246 211 L275 249" stroke="${ink}" stroke-width="17"/>
        <path d="M246 211 L275 249" stroke="#cf9a72" stroke-width="10"/>
        <circle cx="231" cy="186" r="33" fill="#29343d" stroke="${ink}" stroke-width="12"/>
        <circle cx="231" cy="186" r="33" fill="none" stroke="${rim}" stroke-width="4"/>
        <path d="M211 185 Q211 167 229 166" fill="none" stroke="#7fb0cf" stroke-width="4"/>
      </g>
      ${hand('M235 227 Q229 229 232 236 L243 246 Q251 252 256 245 L260 239 Q262 234 258 231 L249 221 Q245 217 240 221 L246 229')}`,
  },
};

mkdirSync(new URL('public/mascots/', root), { recursive: true });
for (const [pose, { title, description, artwork }] of Object.entries(poses)) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">${description}</desc>
  <defs>${defs}</defs>
  ${artwork}
</svg>
`;
  writeFileSync(new URL(`public/mascots/eugene-${pose}.svg`, root), svg.replace(/[ \t]+$/gm, ''));
  console.log(fileURLToPath(new URL(`public/mascots/eugene-${pose}.svg`, root)));
}
