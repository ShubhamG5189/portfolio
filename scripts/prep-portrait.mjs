// Prepares Living Portrait pictures.
//   Put your original pictures in  portrait-src/  named after the picture (rest.png, half.png, kiss.jpg …)
//   then run:  npm run portrait
// For every picture it:
//   1. squares and resizes it to 1024 x 1024
//   2. removes a sky / plain background (anything sky-blue or white connected to the edges)
//   3. saves it as  public/portrait/<name>.webp  (small, keeps transparency)
//   4. checks that the head sits in the same place as in rest.png, so swaps don't jump
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'portrait-src', OUT = 'public/portrait', SIZE = 1024;
const PREVIEW = process.env.PREVIEW_DIR; // optional: also save a copy on the site's dark background
const DRIFT = 0.015; // warn when the head outline moves more than 1.5% from rest.png

// Is this colour part of the background? Sky blue, or a white / light-grey cloud.
// Skin is warm (red above blue) and hair is dark, so neither matches.
const isSky = (r, g, b) => (b > r + 30 && b > g - 10 && b > 120) || (Math.min(r, g, b) > 170 && b >= r - 5);
const isDeepSky = (r, g, b) => b > r + 60 && b > 150; // clearly blue even when enclosed, e.g. between hair strands

async function cutOut(file) {
  const { data, info } = await sharp(join(SRC, file))
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, n = W * H, px = data;

  // already transparent (e.g. made with remove.bg)? keep its own alpha
  const corners = [0, W - 1, (H - 1) * W, n - 1].map((i) => px[i * 4 + 3]);
  if (corners.every((a) => a < 20)) return { W, H, px, keyed: false };

  const bg = new Uint8Array(n), stack = [];
  const seed = (i) => { if (!bg[i] && isSky(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (stack.length) {
    const i = stack.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) seed(i - 1); if (x < W - 1) seed(i + 1); if (y > 0) seed(i - W); if (y < H - 1) seed(i + W);
  }
  for (let i = 0; i < n; i++) if (!bg[i] && isDeepSky(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) bg[i] = 1;

  // soft edge: each kept pixel gets the share of kept neighbours as its opacity, and loses the blue tint
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, o = i * 4;
    if (bg[i]) { px[o + 3] = 0; continue; }
    let kept = 0, near = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      near++; if (!bg[yy * W + xx]) kept++;
    }
    if (kept < near) {
      px[o + 3] = Math.round(255 * kept / near);
      px[o + 2] = Math.min(px[o + 2], Math.max(px[o], px[o + 1])); // despill sky blue
    }
  }
  return { W, H, px, keyed: true };
}

function outline({ W, H, px }) {
  let l = W, r = 0, t = H, b = 0, sx = 0, sy = 0, c = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3] > 128) {
    if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; sx += x; sy += y; c++;
  }
  return { left: l / W, right: r / W, top: t / H, bottom: b / H, cx: sx / c / W, cy: sy / c / H };
}

if (!existsSync(SRC)) { console.error(`No ${SRC}/ folder found.`); process.exit(1); }
mkdirSync(OUT, { recursive: true });
if (PREVIEW) mkdirSync(PREVIEW, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const order = files.sort((a, b) => (parse(a).name.toLowerCase() === 'rest' ? -1 : parse(b).name.toLowerCase() === 'rest' ? 1 : a.localeCompare(b)));
let ref = null;

for (const file of order) {
  const name = parse(file).name.toLowerCase();
  const img = await cutOut(file);
  const raw = { raw: { width: img.W, height: img.H, channels: 4 } };
  await sharp(img.px, raw).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(join(OUT, name + '.webp'));
  if (PREVIEW) await sharp(img.px, raw).flatten({ background: '#0C0C0C' }).png().toFile(join(PREVIEW, name + '.png'));

  const o = outline(img);
  if (name === 'rest') ref = o;
  let note = '';
  if (ref && name !== 'rest') {
    const worst = Math.max(...['left', 'right', 'top', 'bottom', 'cx', 'cy'].map((k) => Math.abs(o[k] - ref[k])));
    note = worst > DRIFT ? `  ⚠ head moved ${(worst * 100).toFixed(1)}% from rest.png — line it up` : '  ✓ lines up with rest.png';
  }
  const pct = (v) => (v * 100).toFixed(1) + '%';
  console.log(`${name.padEnd(10)} ${img.keyed ? 'background removed' : 'already transparent'}  head: x ${pct(o.left)}–${pct(o.right)}, y ${pct(o.top)}–${pct(o.bottom)}${note}`);
}
console.log(`\n${order.length} picture(s) written to ${OUT}/`);
