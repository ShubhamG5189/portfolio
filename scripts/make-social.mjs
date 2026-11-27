// Builds the link-preview image and the browser icons in the site's style.
//   npm run social
// Writes:
//   public/og-image.png        1200x630, shown when the site is shared (WhatsApp, LinkedIn, X…)
//   public/favicon-32.png      browser tab icon
//   public/apple-touch-icon.png  180x180, phone home-screen icon
// Re-run it after changing your name, tagline or portrait.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const F = (f) => new URL(`./fonts/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DISPLAY = F('BigShoulders-Black.ttf'); // static Black weight (variable fonts render thin here)
const BODY = F('Barlow-SemiBold.ttf');
const BODY_MED = F('Barlow-Medium.ttf');

const C = { paper: '#ece6db', paperDeep: '#ddd4c4', ink: '#17121f', inkSoft: '#4a4256', night: '#0f0b18', mist: '#e4def0', gold: '#f0b54a' };

// read name + tagline from the site's content file so the image always matches the site
const content = readFileSync('src/data/content.ts', 'utf8');
const name = (content.match(/name:\s*'([^']+)'/) || [, 'Shubham'])[1];
const tagline = (content.match(/tagline:\s*'([^']+)'/) || [, ''])[1];
const NAME = name.toUpperCase();

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// render a line of text; if it comes out larger than maxW x maxH it is scaled down to fit
async function text(markup, fontfile, font, width, maxW = 1200, maxH = 630) {
  let { data, info } = await sharp({ text: { text: markup, fontfile, font, rgba: true, dpi: 72, width, wrap: 'word' } })
    .png().toBuffer({ resolveWithObject: true });
  if (info.width > maxW || info.height > maxH) {
    ({ data, info } = await sharp(data).resize({ width: maxW, height: maxH, fit: 'inside' }).png().toBuffer({ resolveWithObject: true }));
  }
  return { input: data, w: info.width, h: info.height };
}

// ---------- link-preview image ----------
const W = 1200, H = 630;
const base = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${C.paper}"/></svg>`);
const band = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">` +
  `<polygon points="0,566 ${W},476 ${W},${H} 0,${H}" fill="${C.night}"/>` +
  `<polygon points="0,566 ${W},476 ${W},480 0,570" fill="${C.gold}"/></svg>`,
);

const giant = await text(`<span foreground="${C.paperDeep}" letter_spacing="-2000">${esc(NAME)}</span>`, DISPLAY, 'Big Shoulders Black 330');
const title = await text(`<span foreground="${C.ink}">${esc(NAME)},\n3D CREATOR</span>`, DISPLAY, 'Big Shoulders Black 104');
const line = tagline ? tagline[0].toUpperCase() + tagline.slice(1) + '.' : '';
const sub = await text(`<span foreground="${C.inkSoft}">${esc(line)}</span>`, BODY_MED, 'Barlow 27', 430);
const strip = await text(`<span foreground="${C.mist}" letter_spacing="3000">3D MODELING  ·  RENDERING  ·  MOTION  ·  BRANDING</span>`, BODY, 'Barlow 21');

const face = await sharp('public/portrait/rest.webp').resize({ height: 600 }).png().toBuffer();
const faceMeta = await sharp(face).metadata();

await sharp(base)
  .composite([
    { input: giant.input, left: Math.round((W - giant.w) / 2), top: 6 },
    { input: face, left: W - faceMeta.width - 20, top: 40 },
    { input: band },
    { input: title.input, left: 64, top: 150 },
    { input: sub.input, left: 66, top: 150 + title.h + 16 },
    { input: strip.input, left: 66, top: H - 52 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');
console.log('public/og-image.png', `${W}x${H}`);

// ---------- icons: the initial in gold on night ----------
for (const [file, size] of [['public/favicon-32.png', 32], ['public/apple-touch-icon.png', 180]]) {
  const S = 512;
  const bg = Buffer.from(`<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg"><rect width="${S}" height="${S}" rx="${S * 0.22}" fill="${C.night}"/></svg>`);
  const glyph = await text(`<span foreground="${C.gold}">${esc(NAME[0])}</span>`, DISPLAY, 'Big Shoulders Black 420', undefined, 400, 400);
  const icon = await sharp(bg)
    .composite([{ input: glyph.input, left: Math.round((S - glyph.w) / 2), top: Math.round((S - glyph.h) / 2) }])
    .png().toBuffer();
  await sharp(icon).resize(size, size).png({ compressionLevel: 9 }).toFile(file);
  console.log(file, `${size}x${size}`);
}
