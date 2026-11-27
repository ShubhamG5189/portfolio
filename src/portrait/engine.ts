// @ts-nocheck
// ===== LIVING PORTRAIT =====
// Ported from Shubham's own living_portrait_final.html. One photo of the face is warped live in a
// shader: nine springy zones (hair, cheeks, chin, nose, forehead, eyes, lips) can be poked and pulled,
// the eyes follow the cursor, and whole-face expressions (blink, wink, smile, laugh, surprise, annoyed,
// angry, pain, cry, kiss) are separate pictures of the same face that cross-fade in.
//
// Site plumbing on top of the original: it draws into #faceGl (a canvas 1.7x the photo so pulls can
// stretch past its edge), listens on #magnetWrap, reports each picture to the intro loader through the
// `portrait:progress` event, pauses off-screen, and returns a cleanup for React.
// `folder` is where the pictures live, e.g. '/portrait/' → rest.webp, blink.webp, wink.webp …
export const EXPRESSIONS = ['blink', 'wink', 'smile', 'laugh', 'surprise', 'annoyed', 'angry', 'pain', 'cry', 'kiss'];

export function startPortrait(folder = '/portrait/'): () => void {
  const ac = new AbortController(), signal = ac.signal;
  let stopped = false, raf = 0;
  const observers: { disconnect(): void }[] = [];
  const cleanup = () => { stopped = true; ac.abort(); cancelAnimationFrame(raf); observers.forEach(o => o.disconnect()); };

  const wrap = document.getElementById('magnetWrap'), c = document.getElementById('faceGl');
  const photo = document.getElementById('faceFallback'); // the plain photo; also marks where the face sits
  if (!wrap || !c || !photo) return cleanup;
  const gl = c.getContext('webgl', {alpha: true, premultipliedAlpha: false, antialias: true});
  if (!gl) return cleanup; // no WebGL: the plain photo stays
  window.__faceEngine = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OVER = 1.7; // the canvas is 170% of the photo, centred on it (see #faceGl in index.css)

  const vs = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}`;
  const fs = `precision highp float;varying vec2 uv;uniform sampler2D tex;uniform vec2 centers[9],delta[9];uniform float radii[9];uniform vec2 look,head;uniform float blink,tint,expression,poke,photoReaction,over;uniform vec2 contact;
float bell(vec2 p,vec2 c,vec2 r){vec2 d=(p-c)/r;float t=max(0.,1.-dot(d,d));return t*t;}
vec2 displacement(vec2 q){vec2 v=vec2(0.);for(int j=0;j<9;j++){vec2 r=vec2(radii[j]);if(j==0)r*=vec2(1.15,.68);if(j==3)r*=vec2(1.,.77);v+=delta[j]*bell(q,centers[j],r);}v+=(contact-q)*poke*bell(q,contact,vec2(.12));float eyeLock=max(bell(q,vec2(409.,446.)/1024.,vec2(.085,.048)),bell(q,vec2(645.,447.)/1024.,vec2(.085,.048)));float lock=1.-smoothstep(.72,1.35,min(length((q-vec2(409.,443.)/1024.)/vec2(.085,.052)),length((q-vec2(644.,444.)/1024.)/vec2(.085,.052))));return v*(1.-max(lock,.92*eyeLock));}
void main(){vec2 q=(uv-.5)*over+.5-head;float angle=look.x*.028;vec2 p=q-vec2(.515,.47);q=vec2(p.x+angle*p.y,p.y-angle*p.x)+vec2(.515,.47);vec2 a=q;for(int k=0;k<4;k++){a=mix(a,q-displacement(a),.7);}
if(a.x<0.||a.x>1.||a.y<0.||a.y>1.){gl_FragColor=vec4(0.);return;}
float mouth=bell(a,vec2(.518,.668),vec2(.16,.084));a.y-=expression*.014*mouth*(1.-min(1.,abs(a.x-.518)/.11));a.y+=expression*.012*bell(a,vec2(.445,.665),vec2(.065,.05));a.y+=expression*.012*bell(a,vec2(.59,.665),vec2(.065,.05));vec4 col=texture2D(tex,a);
float strength=(1.-smoothstep(.02,.28,photoReaction))*(1.-blink);
vec2 pix=a*1024.;
for(int j=0;j<2;j++){
 float cx=j==0?409.:644.;float cy=j==0?445.:447.;
 float xx=pix.x-cx,yy=pix.y-cy;
 float left=j==0?48.:54.;float right=j==0?51.:49.;
 float span=xx<0.?left:right;
 float arch=sqrt(max(0.,1.-pow(abs(xx)/span,2.)));
 float top=cy-15.*arch;float bottom=cy+17.*arch;
 float lid=smoothstep(0.,5.,pix.y-top)*smoothstep(0.,5.,bottom-pix.y);
 float side=1.-smoothstep(23.,span-2.,abs(xx));
 float dx=look.x*7.*strength*side*lid;float dy=look.y*2.2*strength*side*lid;
 if(abs(xx)<span&&pix.y>top&&pix.y<bottom){col=texture2D(tex,a-vec2(dx,dy)/1024.);}
}
float hair=(1.-smoothstep(.19,.31,a.y))*smoothstep(.10,.45,1.-max(col.r,max(col.g,col.b)));vec3 hue=mix(vec3(1.55,.76,.54),vec3(.70,.85,1.65),step(1.5,tint));col.rgb=mix(col.rgb,col.rgb*hue+vec3(.06,.025,.035),hair*min(1.,tint));
gl_FragColor=col;}`;

  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, shader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(pr)); return cleanup; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  gl.uniform1f(U('over'), OVER);
  gl.clearColor(0, 0, 0, 0);

  // the springy parts of the face: [name, x, y, radius] in photo coordinates (0–1)
  const zones = [['Hair', .50, .15, .39], ['Left cheek', .345, .555, .22], ['Right cheek', .68, .555, .22], ['Chin', .515, .79, .29], ['Nose', .52, .535, .13], ['Forehead', .51, .30, .20], ['Left eye', .40, .438, .10], ['Right eye', .63, .438, .10], ['Lips', .515, .665, .15]]
    .map(([name, x, y, r]) => ({name, x, y, r, dx: 0, dy: 0, vx: 0, vy: 0, tx: 0, ty: 0}));
  gl.uniform2fv(U('centers[0]'), new Float32Array(zones.flatMap(z => [z.x, z.y])));
  gl.uniform1fv(U('radii[0]'), new Float32Array(zones.map(z => z.r)));

  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  gl.uniform1i(U('tex'), 0);

  // ---- pictures: the resting face plus one per expression, blended on a 2D canvas then uploaded ----
  const names = ['rest', ...EXPRESSIONS];
  const total = names.length;
  const settled = name => dispatchEvent(new CustomEvent('portrait:progress', {detail: {name, total}}));
  const imgs = {}, weights = {};
  const ok = name => imgs[name] && imgs[name].complete && imgs[name].naturalWidth;
  let ready = false, dirty = true;
  for (const name of names) {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { settled(name); dirty = true; if (name === 'rest' && !stopped) { ready = true; photo.style.visibility = 'hidden'; } };
    im.onerror = () => settled(name);
    imgs[name] = im; weights[name] = name === 'rest' ? 1 : 0;
  }
  // the resting face first, then the expressions
  imgs.rest.src = folder + 'rest.webp';
  imgs.rest.addEventListener('load', () => { for (const n of EXPRESSIONS) imgs[n].src = folder + n + '.webp'; }, {once: true});
  imgs.rest.addEventListener('error', () => { for (const n of EXPRESSIONS) imgs[n].src = folder + n + '.webp'; }, {once: true});

  const blend = document.createElement('canvas'); blend.width = blend.height = 1024;
  const ctx = blend.getContext('2d');
  let current = 'neutral', holdUntil = 0, lastUpload = 0, hover = '', hoverSince = 0, lastHover = '', lastInteraction = performance.now(), abuse = 0;
  function react(name, ms) { current = name; holdUntil = performance.now() + ms; lastInteraction = performance.now(); }
  function upload(now, target, dt) {
    let changed = dirty;
    for (const name in weights) {
      const before = weights[name];
      weights[name] += (Number(name === target) - before) * (1 - Math.exp(-dt * (target === 'blink' ? 35 : 16)));
      if (Math.abs(weights[name] - before) > .0004) changed = true;
    }
    if (!changed || now - lastUpload < 30) return;
    lastUpload = now; dirty = false;
    ctx.clearRect(0, 0, 1024, 1024); ctx.globalCompositeOperation = 'lighter';
    const sum = names.reduce((a, k) => a + (ok(k) ? weights[k] : 0), 0) || 1;
    for (const name of names) {
      if (weights[name] < .001 || !ok(name)) continue;
      ctx.globalAlpha = Math.min(1, weights[name] / sum); ctx.drawImage(imgs[name], 0, 0, 1024, 1024);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blend);
  }

  // ---- input ----
  let active = null, start, travel = 0, aim = [0, 0], look = [0, 0], head = [0, 0], last = performance.now(), nextBlink = last + 3000, blinkAt = -1000;
  let tint = 0, tintTarget = 0, expression = 0, reaction = 0, poke = 0, contact = [.5, .5], pointerId = null;
  // pointer → photo coordinates (the photo element keeps its box even while hidden)
  const pt = e => { const r = photo.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  const nearest = p => zones.map(z => [z, Math.hypot(p[0] - z.x, p[1] - z.y) / (z.r * .75)]).sort((a, b) => a[1] - b[1])[0];
  const strength = 1; // elasticity (the slider in the original; 1 is its default)

  addEventListener('pointermove', e => {
    const p = pt(e);
    aim = [Math.max(-1, Math.min(1, (p[0] - .515) * 3.8)), Math.max(-1, Math.min(1, (p[1] - .438) * 3.8))];
    const [hz, hd] = nearest(p), hn = hd < .65 ? hz.name : '';
    if (hn !== hover) { hover = hn; hoverSince = performance.now(); lastHover = ''; }
    lastInteraction = performance.now();
    if (!active) wrap.style.cursor = hd <= 1 ? 'grab' : '';
    if (active && e.pointerId === pointerId) {
      const x = p[0] - start[0], y = p[1] - start[1];
      travel = Math.max(travel, Math.hypot(x, y));
      const cap = active.r * .32, scale = Math.min(1, cap / (Math.hypot(x, y) || 1)) * Math.min(1.25, strength);
      active.tx = x * scale; active.ty = y * scale;
    }
  }, {signal});
  wrap.addEventListener('pointerdown', e => {
    const p = pt(e), [z, d] = nearest(p);
    if (d > 1 || active) return;
    active = z; pointerId = e.pointerId; contact = p; start = p; travel = 0;
    wrap.setPointerCapture(e.pointerId); wrap.style.cursor = 'grabbing'; e.preventDefault();
  }, {signal});
  function release() {
    if (!active) return;
    const z = active;
    if (travel < .012) { // a tap
      poke = .55; reaction = z.name === 'Chin' ? 1 : .35;
      z.vy += z.name === 'Chin' ? .018 : -.012; z.vx += z.x < .5 ? -.008 : .008;
      blinkAt = performance.now();
      react(z.name === 'Chin' ? 'laugh' : z.name === 'Nose' ? 'surprise' : z.name.includes('eye') ? 'wink' : z.name === 'Lips' ? 'kiss' : z.name === 'Hair' ? 'smile' : 'surprise', z.name === 'Chin' ? 1600 : 650);
      if (z.name === 'Hair') tintTarget = (tintTarget + 1) % 3;
    } else react(travel > .14 ? 'annoyed' : 'smile', 550);
    z.tx = z.ty = 0; active = null; pointerId = null; wrap.style.cursor = 'grab';
  }
  addEventListener('pointerup', release, {signal}); addEventListener('pointercancel', release, {signal});
  addEventListener('blur', () => { release(); aim = [0, 0]; }, {signal});
  // a smile while the visitor hovers any "contact" button
  document.querySelectorAll('.contact-btn').forEach(b => {
    b.addEventListener('pointerenter', () => react('smile', 1e7), {signal});
    b.addEventListener('pointerleave', () => react('smile', 400), {signal});
  });
  c.addEventListener('webglcontextlost', e => { e.preventDefault(); photo.style.visibility = ''; ready = false; }, {signal});

  let visible = true;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, {threshold: 0}); io.observe(c); observers.push(io);
  const ro = new ResizeObserver(() => { const r = Math.min(devicePixelRatio || 1, 2), b = c.getBoundingClientRect(); c.width = Math.max(1, b.width * r | 0); c.height = Math.max(1, b.height * r | 0); }); ro.observe(c); observers.push(ro);

  // ---- frame ----
  function frame(now) {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(40, now - last) / 1000; last = now;
    if (!ready || !visible) return;
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps;
    for (let k = 0; k < steps; k++) for (const z of zones) {
      const stiffness = active === z ? 260 : (z.name === 'Hair' ? 105 : z.name === 'Chin' ? 165 : 195), damping = z.name === 'Hair' ? 12 : 19;
      z.vx += (stiffness * (z.tx - z.dx) - damping * z.vx) * h; z.vy += (stiffness * (z.ty - z.dy) - damping * z.vy) * h;
      z.dx += z.vx * h; z.dy += z.vy * h;
    }
    for (let j = 0; j < 2; j++) { look[j] += (aim[j] - look[j]) * (1 - Math.exp(-dt * 14)); head[j] += (aim[j] * .012 - head[j]) * .06; }
    if (now > nextBlink) { blinkAt = now; nextBlink = now + 3000 + Math.random() * 2500; }
    const phase = (now - blinkAt) / 180, blink = phase >= 0 && phase <= 1 ? Math.sin(phase * Math.PI) : 0;
    tint += (tintTarget - tint) * .08; reaction *= Math.exp(-dt * 3); poke *= Math.exp(-dt * 12);
    const target = active ? Math.min(1, Math.hypot(active.dx, active.dy) * 10) : reaction;
    expression += (target - expression) * (1 - Math.exp(-dt * 12));
    let desired = now < holdUntil ? current : 'neutral';
    if (active) {
      const d = Math.hypot(active.dx, active.dy);
      if (d > .035) {
        abuse += dt * d;
        desired = active.name === 'Hair' ? (d > .085 ? 'angry' : 'annoyed') : active.name === 'Chin' ? 'surprise' : active.name.includes('cheek') ? (abuse > .4 ? 'cry' : d > .055 ? 'pain' : 'annoyed') : 'surprise';
      }
    } else if (now > holdUntil) {
      abuse = Math.max(0, abuse - dt * .08);
      if (hover === 'Lips' && hover !== lastHover && now - hoverSince > 500) { lastHover = hover; react('kiss', 800); desired = current; }
      if (!reduced && now - lastInteraction > 30000) desired = 'blink'; // left alone, he dozes off
      else if (phase >= 0 && phase < 1) desired = 'blink';
    }
    if (desired === 'neutral') desired = 'rest';
    upload(now, desired, dt);
    gl.viewport(0, 0, c.width, c.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U('photoReaction'), 1 - (weights.rest || 0));
    gl.uniform1f(U('expression'), expression * .18);
    gl.uniform1f(U('poke'), poke);
    gl.uniform2fv(U('contact'), contact);
    gl.uniform2fv(U('delta[0]'), new Float32Array(zones.flatMap(z => [z.dx, z.dy])));
    gl.uniform2fv(U('look'), look); gl.uniform2fv(U('head'), head);
    gl.uniform1f(U('blink'), blink); gl.uniform1f(U('tint'), tint);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  raf = requestAnimationFrame(frame);

  return cleanup;
}
