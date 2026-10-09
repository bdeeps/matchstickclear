// Shared parts for MatchstickClear: the numbers and small physics models (friction hot spot, the
// chain of steps, flame spread along a splint), the 3D match and plain matchbox (generic: no brand,
// no label art), a flame, chart boards, puffs and layout helpers. +x right, +y up.
//
// SAFETY RULE for this box. It explains how a match works at textbook level. Ingredients are named
// only by their job (oxidiser, fuel, abrasive, binder), as encyclopaedias do. There are no recipes,
// proportions, quantities, particle sizes, substitutes, preparation steps or sourcing for any head or
// striker composition, and no control mixes one. Do not add any.
//
// Sources for the numbers
//  - What is in a safety match, by job, and how it lights (Wikipedia, "Match"): the head carries an
//    oxidiser (potassium chlorate), a little fuel (sulphur, starch), filler, glue and dye; the striking
//    surface carries red phosphorus, an abrasive (powdered glass) and a binder. On striking, a trace of
//    phosphorus and oxidiser meet under friction and react; that lights the head. (Older textbooks say
//    the friction heat first turns a trace of red phosphorus into white phosphorus, which lights in
//    air. Both accounts agree on the point that matters here: the phosphorus is the key.)
//  - Red phosphorus does not ignite in air below about 240 °C; white phosphorus ignites at about 30 °C
//    (Wikipedia, "Allotropes of phosphorus"). Phosphorus sesquisulphide, P₄S₃, the phosphorus compound
//    of strike-anywhere heads: flash point about 100 °C (Wikipedia, "Phosphorus sesquisulfide").
//  - IS 2653:2004, "Safety matches in boxes" (Bureau of Indian Standards): its tests include striking
//    performance, "ignition below 170 °C", ignition under impact and damp proofness. Used here only as
//    "a safety head alone must not light at 170 °C".
//  - Potassium chlorate breaks down from about 400 °C (handbook value, from memory): used as the point
//    where a safety head could light with no phosphorus at all.
//  - Splints: aspen in Europe; in India white mutty (Ailanthus), Indian aspen (Evodia), semul (Bombax
//    ceiba) and rubber wood (FAO case study of the Indian safety match industry, J.C. Tandon). Splints
//    are dipped in paraffin wax, and treated so they do not glow after the flame is out (ammonium
//    phosphate is the usual agent: University of Bristol chemistry pages; maker's descriptions).
//  - Size of a match: about 43 mm long and 2 mm square, head about 3 mm across: typical kitchen
//    matches, measured, not from a standard. Boxes of 50 (FAO; Indian boxes went to 50 in 2021).
//  - Wood: light matchwood about 400 kg/m³, specific heat about 1,500 J/(kg·K), heat of burning 17.5
//    MJ/kg (CombustionClear's figure for dry wood). Wood surface must reach about 350 °C to give off
//    enough gas to burn with a pilot flame (fire-science reviews give 300 to 365 °C). Paraffin wax
//    melts at 46 to 68 °C, its vapour flashes at about 200 °C and it gives 46 MJ/kg (DiyaClear).
//    One whole splint: 0.4 g/cm³ × 0.16 cm³ × 17.5 kJ/g ≈ 1.1 kJ, the "one match ≈ one BTU" rule of
//    thumb (1 BTU = 1.055 kJ).
//  - The friction hot spot (an order-of-magnitude sum, not a measurement): friction power μ N v goes
//    into a rubbing patch of area A for the time of the stroke, t = s ÷ v; about half soaks into the
//    head. A surface heated by a steady flux q warms by ΔT = 2 q √(t ÷ π) ÷ e, where e = √(kρc) is
//    its thermal effusivity (Carslaw and Jaeger, Conduction of Heat in Solids). Here A = 0.5 mm² and
//    e = 600 W·s^½/(m²·K) (between wood, about 400, and glass, about 1,500): assumptions, stated.
//    FrictionClear has friction itself; RateClear has activation energy.
//  - Flame spread along the splint (a teaching model after the standard thin-fuel formula of fire
//    science, e.g. Quintiere, Principles of Fire Behavior): speed = heat reaching the unburnt wood ÷
//    heat needed to bring a slice to its ignition temperature = 4 q″ δ ÷ (ρ c d ΔT) for a square
//    stick of side d heated on four sides. Burning downward (flame above the wood), only a short
//    length δ ≈ 1.5 mm is heated hard, q″ ≈ 60 kW/m²: 90 W per metre of edge. Burning upward the
//    flame lies along the stick and bathes about 15 mm at about 25 kW/m²: 375 W/m more. In between,
//    the bathed share is taken as ((1 − sin θ) ÷ 2)². These fluxes and lengths are textbook orders of
//    magnitude quoted from memory, not measurements on a match; the learn text says it is a model.
//  - The head burns for about a second. A bare wood surface under about 60 kW/m² needs
//    ρ c (d ÷ 4) ΔT ÷ q″ ≈ 1.6 s to reach 350 °C; a waxed one needs to reach only about 220 °C
//    (wax vapour lights first): about 1 s. That is the job of the wax.
import { THREE, M, arrow, clamp, lerp, smooth, exploder } from './kit.js';

export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- the match, in numbers
export const MATCH = { L: 43, d: 2, headL: 4.6, headD: 3.0, wax: 10, perBox: 50 };      // mm
export const WOOD = { rho: 400, c: 1500, Tig: 350, hc: 17.5 };                             // kg/m³, J/kgK, °C, MJ/kg
export const WAX = { melt: 55, flash: 200, Tig: 220, hc: 46 };
export const T_ROOM = 30;
export const T_RED = 240, T_WHITE = 30, T_SESQUI = 100, T_HEAD_TEST = 170, T_HEAD_ALONE = 400;
// One splint's wood and its heat.
export const splintG = () => WOOD.rho * 1e-6 * (MATCH.d * MATCH.d * (MATCH.L - 3)) / 1000 * 1000;   // grams
export const splintJ = () => splintG() * WOOD.hc * 1000;                                             // joules

// ---- striking: the friction hot spot
export const SURF = {
  striker: { n: 'The box\'s striking strip', mu: 0.6, p: true },
  wall: { n: 'A rough wall or sandpaper', mu: 0.7, p: false },
  glass: { n: 'Smooth glass or tile', mu: 0.3, p: false },
};
export const PATCH = 0.5e-6, EFFUS = 600, SHARE = 0.5, STROKE = 0.03;
export function strike({ type = 'safety', surf = 'striker', N = 1.5, v = 1, wet = false }) {
  const S = SURF[surf], P = S.mu * N * v, work = S.mu * N * STROKE, t = STROKE / v;
  const q = (SHARE * P) / PATCH, dT = (2 * q * Math.sqrt(t / Math.PI)) / EFFUS;
  let T = T_ROOM + dT;
  // water: the strike's work can boil almost none of it, so the spot stays near 100 °C
  const boilMg = work / 2.55;                                   // 2.55 J per mg to warm and boil water
  if (wet) T = Math.min(T, 100);
  const need = type === 'anywhere' ? T_SESQUI : S.p ? T_RED : T_HEAD_ALONE;
  const key = type === 'anywhere' ? 'in the head' : S.p ? 'on the strip' : 'missing';
  const lit = !wet && T >= need;
  return { P, work, t, dT, T, need, key, lit, wet, boilMg, mu: S.mu, hasP: S.p || type === 'anywhere' };
}
// The chain of steps: what each needs at the spot (°C) and what it gives. Only three energies are
// numbers: the stroke's work (computed), the head (a rough estimate: a head of a few tens of
// milligrams at the 1 to 3 kJ/g that fast-burning mixtures release, so tens of joules) and the wood
// (computed, about 1.1 kJ). `drop` is only how tall to draw each step.
export const HEAD_J = 40;
export const CHAIN = [
  { n: 'Friction', sub: 'hot spot', col: '#6fb6ff', drop: 0.5 },
  { n: 'Phosphorus', sub: '+ oxidiser', col: '#ff5d8f', drop: 1.0 },
  { n: 'Head', sub: 'flares', col: '#ffb547', drop: 1.6 },
  { n: 'Wax', sub: 'vapour lights', col: '#f2c14e', drop: 1.9 },
  { n: 'Wood', sub: 'burns', col: '#ff7a59', drop: 2.6 },
];

// ---- the flame taking hold: spread along the splint
export const SPREAD = { qDown: 60e3, dDown: 1.5e-3, qUp: 25e3, lUp: 15e-3, flare: 1.0, qFlare: 60e3, chi: 0.75 };
// tilt: degrees the head end is raised above level. +90 = head up, −90 = head down.
export function spread(tilt, { wax = true } = {}) {
  const s = Math.sin((tilt * Math.PI) / 180), d = MATCH.d / 1000;
  const bathe = ((1 - s) / 2) ** 2;
  const perM = SPREAD.qDown * SPREAD.dDown + SPREAD.qUp * SPREAD.lUp * bathe;        // W per metre of edge
  const need = WOOD.rho * WOOD.c * d * (WOOD.Tig - T_ROOM);                          // J/m²
  const v = (4 * perM) / need;                                                       // m/s
  const W = v * WOOD.rho * d * d * WOOD.hc * 1e6 * SPREAD.chi;                       // flame power, W
  // does the one-second head flare light the stick?
  const Tneed = wax ? WAX.Tig : WOOD.Tig;
  const tCatch = (WOOD.rho * WOOD.c * (d / 4) * (Tneed - T_ROOM)) / (SPREAD.qFlare * (1 + (1 - s) / 2));
  const catches = tCatch <= SPREAD.flare;
  const dies = tilt > 60;                    // model threshold: nearly head-up, the small flame gives out past the wax
  return { s, bathe, perM, v, mmps: v * 1000, W, tCatch, catches, dies, toFingers: (MATCH.L - 12) / (v * 1000) };
}

// ---- phosphorus, bans and people (chapter 5). Years as in the sources listed in history.json.
export const BANS = [
  [1872, 'Finland'], [1874, 'Denmark'], [1897, 'France'], [1898, 'Switzerland'], [1901, 'Netherlands'],
  [1906, 'Berne Convention signed'], [1910, 'United Kingdom (in force)'], [1912, 'USA (tax law)'], [1913, 'India'], [1914, 'Canada'], [1919, 'Japan'], [1925, 'China'],
];

// ---------------------------------------------------------------- colours and numbers
export const COL = { hot: '#ff7a59', cold: '#6fb6ff', heat: '#ffb547', oil: '#f2c14e', ok: '#5ce1a9', violet: '#c49bff', text: '#e8eef8', bad: '#ff5d5d', smoke: '#9aa0ad', blue: '#6f9dff', wood: '#d9b98a', head: '#b5382e', strip: '#6a2f2a', pink: '#ff5d8f' };
export const hex = (c) => new THREE.Color(c).getHex();
export const fmt0 = (v) => Math.round(v).toLocaleString('en-IN');
export const fmtJ = (J) => (J >= 1000 ? (J / 1000).toFixed(1) + ' kJ' : J >= 10 ? Math.round(J) + ' J' : J >= 1 ? J.toFixed(1) + ' J' : Math.round(J * 1000) + ' mJ');
export const fmtW = (W) => (W >= 10 ? Math.round(W) + ' W' : W.toFixed(1) + ' W');
export const fmtS = (t) => (t >= 90 ? (t / 60).toFixed(1) + ' min' : t >= 10 ? Math.round(t) + ' s' : t.toFixed(1) + ' s');
export const fmtC = (T) => fmt0(Math.round(T / 10) * 10) + ' °C';
export const link = (slug, name, hash = '') => `<a href="https://glassbox.how/${slug}/${hash ? '#' + hash : ''}">${name}</a>`;
export const inReel = () => document.body.classList.contains('gb-reel');
// On a phone the readout sits over the stage, so it is cut to its heading and first four rows.
export const ro = (html) => (window.innerWidth < 560 ? html.replace(/<small>[\s\S]*<\/small>/, '').split('<div class="row">').slice(0, 5).join('<div class="row">') : html);

// ---------------------------------------------------------------- boards (live charts in 3D)
export function panelBg(g, w, h) { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(10,12,18,.9)'; g.fillRect(0, 0, w, h); }
export function board(root, w, h, pxW, pxH, draw, pos) {
  const c = document.createElement('canvas'); c.width = pxW; c.height = pxH;
  const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const redraw = () => { draw(g, pxW, pxH); tex.needsUpdate = true; };
  redraw();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide }));
  m.position.set(...pos); root.add(m);
  return { tex, redraw, canvas: c, mesh: m };
}
export function axes(g, w, h, { x0 = 84, x1 = w - 28, y0 = h - 64, y1 = 70, xMax, yMax, xMin = 0, yMin = 0, xTicks, yTicks, xFmt = String, yFmt = String, xLabel = '', yLabel = '', logX = false, logY = false }) {
  const fx = (v) => (logX ? Math.log(v) : v), fy = (v) => (logY ? Math.log(v) : v);
  const X = (x) => x0 + ((fx(x) - fx(xMin)) / (fx(xMax) - fx(xMin))) * (x1 - x0);
  const Y = (y) => y0 - ((fy(Math.max(y, logY ? yMin : -1e99)) - fy(yMin)) / (fy(yMax) - fy(yMin))) * (y0 - y1);
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1; g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '19px sans-serif';
  for (const t of xTicks) { g.beginPath(); g.moveTo(X(t), y1); g.lineTo(X(t), y0); g.stroke(); const s = xFmt(t); g.fillText(s, X(t) - g.measureText(s).width / 2, y0 + 26); }
  for (const t of yTicks) { g.beginPath(); g.moveTo(x0, Y(t)); g.lineTo(x1, Y(t)); g.stroke(); const s = yFmt(t); g.fillText(s, x0 - 10 - g.measureText(s).width, Y(t) + 6); }
  g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '18px sans-serif';
  if (xLabel) g.fillText(xLabel, x1 - g.measureText(xLabel).width, y0 + 52);
  if (yLabel) g.fillText(yLabel, x0 + 8, y1 - 10);
  return { X, Y, x0, x1, y0, y1 };
}
export function title(g, text, sub = '') {
  g.fillStyle = COL.text; g.font = 'bold 24px sans-serif'; g.fillText(text, 20, 34);
  if (sub) { const x = 34 + g.measureText(text).width; g.font = '17px sans-serif'; g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText(sub, x, 34); }
}
export function line(g, pts, X, Y, col, wdt = 5, dash = null) {
  if (pts.length < 2) return;
  g.strokeStyle = col; g.lineWidth = wdt; g.setLineDash(dash || []); g.lineJoin = 'round'; g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))));
  g.stroke(); g.setLineDash([]);
}
export function dot(g, x, y, col, r = 10) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); }
export function dashH(g, X0, X1, y, text = '', col = 'rgba(255,255,255,.5)') {
  g.strokeStyle = col; g.setLineDash([8, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(X0, y); g.lineTo(X1, y); g.stroke(); g.setLineDash([]);
  if (text) { g.font = '17px sans-serif'; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillText(text, X1 - g.measureText(text).width - 4, y - 8); }
}
// Horizontal bars with labels: rows [{ label, value, color, text }]. log: bars on a log scale from lo.
export function bars(g, rows, { x = 20, y = 64, w = 600, rowH = 52, labelW = 230, unit = (v) => v, max = null, font = 19, log = false, lo = 1 } = {}) {
  const mx = max ?? Math.max(1e-9, ...rows.map((r) => Math.abs(r.value))) * 1.15, span = w - labelW - 20;
  rows.forEach((r, i) => {
    const yy = y + i * rowH, k = log ? Math.log(Math.max(lo, r.value) / lo) / Math.log(mx / lo) : Math.abs(r.value) / mx, L = clamp(k, 0, 1) * span;
    g.font = `bold ${font}px sans-serif`; g.fillStyle = r.lcol || r.color; g.fillText(r.label, x, yy + 24);
    g.globalAlpha = 0.9; g.fillStyle = r.color; g.fillRect(x + labelW, yy + 6, Math.max(2, L), rowH - 18); g.globalAlpha = 1;
    g.font = `${font - 1}px sans-serif`; g.fillStyle = '#fff'; const t = r.text ?? unit(r.value), tw = g.measureText(t).width;
    const inside = x + labelW + L + 8 + tw > w; if (inside) g.fillStyle = '#111';
    g.fillText(t, inside ? x + labelW + L - tw - 8 : x + labelW + L + 8, yy + 25);
  });
}
export function wrap(g, text, x, y, maxW, lh) {
  let ln = '';
  for (const wd of text.split(' ')) { if (g.measureText(ln + wd).width > maxW && ln) { g.fillText(ln.trim(), x, y); y += lh; ln = ''; } ln += wd + ' '; }
  if (ln.trim()) { g.fillText(ln.trim(), x, y); y += lh; }
  return y;
}
export function rng(seed = 1) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------------------------------------------------------------- particles
export function bits(n, geo, { lit = false, color = 0xffffff, opacity = 1, add = false } = {}) {
  const mat = lit ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }) : new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  if (opacity < 1 || add) { mat.transparent = true; mat.opacity = opacity; mat.depthWrite = false; if (add) mat.blending = THREE.AdditiveBlending; }
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false;
  const o = new THREE.Object3D(), col = new THREE.Color(color);
  for (let i = 0; i < n; i++) { mesh.setColorAt(i, col); o.position.set(0, -99, 0); o.scale.setScalar(0.0001); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); }
  mesh.place = (i, x, y, z, s = 1) => { o.position.set(x, y, z); o.scale.setScalar(Math.max(0.0001, s)); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); };
  mesh.tint = (i, c) => mesh.setColorAt(i, c);
  mesh.done = () => { mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; };
  return mesh;
}
export const dots = (n, r, color = 0xffffff, o = {}) => bits(n, new THREE.SphereGeometry(r, 8, 6), { color, ...o });
// Little puffs that drift from a source: step(dt, rate, at, vel, life).
export function puffs(parent, n, r, color, rnd, o = {}) {
  const d = dots(n, r, color, o); parent.add(d);
  const P = Array.from({ length: n }, () => ({ life: 0, max: 1, p: [0, -99, 0], v: [0, 0, 0] }));
  let acc = 0;
  return {
    mesh: d, P,
    step(dt, rate, at, vel, life = 1.2, force = null) {
      acc += rate * dt;
      for (let i = 0; i < n; i++) {
        const q = P[i];
        if (q.life <= 0 && acc >= 1) { acc -= 1; q.life = q.max = life * (0.75 + 0.5 * rnd()); q.p = at(); q.v = vel(q.p); }
        if (q.life > 0) { q.life -= dt; if (force) force(q, dt); q.p[0] += q.v[0] * dt; q.p[1] += q.v[1] * dt; q.p[2] += q.v[2] * dt; }
        const k = q.life / q.max;
        d.place(i, q.p[0], q.p[1], q.p[2], q.life > 0 ? 0.35 + 0.65 * Math.sin(Math.PI * clamp(k, 0, 1)) : 0.0001);
      }
      if (acc > 20) acc = 20;
      d.done();
    },
    clear() { P.forEach((q) => { q.life = 0; }); acc = 0; },
  };
}
const UP = new THREE.Vector3(0, 1, 0), tmpV = new THREE.Vector3();
export function flowArrow(color, r = 0.05, head = 0.28) {
  const a = arrow(color, 1, head, r);
  a.aim = (from, dir, len) => {
    a.position.set(...from);
    tmpV.set(...dir); if (tmpV.lengthSq() < 1e-9) tmpV.set(1, 0, 0);
    a.quaternion.setFromUnitVectors(UP, tmpV.normalize());
    a.set(Math.max(0.001, len));
    if (len < 0.05) a.visible = false;
  };
  return a;
}

// ---------------------------------------------------------------- layout
// The readout covers the upper left of the stage, so models stay low on the left and the two chart
// boards stack on the right.
export const VIEW = { pos: [2.45, 5.0, 12.0], target: [2.45, 4.2, 0] };
export const REEL_VIEW = { pos: [2.6, 3.8, 12.2], target: [2.6, 3.3, 0] };
export const REEL_SQ = { pos: [-0.4, 5.4, 10.8], target: [-0.4, 5.0, 0] };
export const TALL = { pos: [-0.4, 6.3, 8.4], target: [-0.4, 5.9, 0] };
export const BW = 5.2, BH = 3.0, B1 = [6.4, 6.1, 0], B2 = [6.4, 2.85, 0];
export function fitNarrow(stage, minor = []) {
  const narrow = stage.host.clientWidth < 560;
  minor.forEach((l) => { if (l) l.visible = !narrow; });
  const y = narrow && !inReel() ? -0.2 : 0;
  if (!stage.shift || stage.shift[1] !== y) stage.setShift(0, y);
  return narrow;
}
// Chart boards sit to the right of the model. In a tall (portrait) reel they stack above the model.
// Square and 16:9 recordings get their own views.
export function reelBoards(boards, x = -0.4, stage = null, view = null) {
  const r = inReel(), asp = stage ? stage.camera.aspect : 1, wide = r && asp > 1.3, sq = r && !wide && asp > 0.8, narrow = !r && stage && stage.host.clientWidth < 560;
  boards.forEach((b, i) => {
    if (!b.home) b.home = b.mesh.position.clone();
    if (sq) { b.mesh.position.set(x, 9.2 - i * 3.5, 0); b.mesh.scale.setScalar(1.12); }
    else if (r && !wide) { b.mesh.position.set(x, 11.6 - i * 4.4, 0); b.mesh.scale.setScalar(1.42); }
    else if (narrow) { b.mesh.position.set(5.9, 4.75 - i * 2.55, 0); b.mesh.scale.setScalar(0.82); }
    else { b.mesh.position.copy(b.home); b.mesh.scale.setScalar(1); }
  });
  const v = wide ? REEL_VIEW : sq ? REEL_SQ : null;
  if (v && view) { stage.controls.autoRotate = false; if (stage.home?.pos !== v.pos) stage.setView(v.pos, v.target, 0.01); }
}


// ---------------------------------------------------------------- the match (built in millimetres)
// Lies along +x: tail at x = 0, head end at x = MATCH.L. Scale the group to place it.
const WOODC = 0xdcbd8e, CHARC = 0x1c1917, HEADC = 0xa8322a;
export function makeMatch(parent, { scale = 0.14, anywhere = false } = {}) {
  const g = new THREE.Group(); g.scale.setScalar(scale); parent.add(g);
  const { L, d, headL, headD, wax } = MATCH;
  const body = new THREE.Group(); g.add(body);
  const woodMat = new THREE.MeshStandardMaterial({ color: WOODC, roughness: 0.8 });
  const wood = new THREE.Mesh(new THREE.BoxGeometry(1, d, d), woodMat); wood.castShadow = true; body.add(wood);
  const charMat = new THREE.MeshStandardMaterial({ color: CHARC, roughness: 0.95, emissive: 0xff4a10, emissiveIntensity: 0 });
  const char = new THREE.Mesh(new THREE.BoxGeometry(1, d * 0.8, d * 0.8), charMat); char.castShadow = true; body.add(char);
  // the wax soaks the wood near the head: drawn as a glossy sleeve
  const waxMat = new THREE.MeshStandardMaterial({ color: 0xffd35c, roughness: 0.2, emissive: 0x6a4a00, transparent: true, opacity: 0.62, depthWrite: false });
  const waxS = new THREE.Mesh(new THREE.BoxGeometry(wax, d * 1.12, d * 1.12), waxMat); waxS.position.x = L - headL * 0.6 - wax / 2; g.add(waxS);
  // the head: a bulb lathed round the x axis
  const prof = []; for (let i = 0; i <= 16; i++) { const t = i / 16; prof.push(new THREE.Vector2(Math.max(0.001, (headD / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.6)), t * headL)); }
  const hg = new THREE.LatheGeometry(prof, 28); hg.rotateZ(-Math.PI / 2);
  const headMat = new THREE.MeshStandardMaterial({ color: HEADC, roughness: 0.7, emissive: 0xff5a1a, emissiveIntensity: 0 });
  const head = new THREE.Mesh(hg, headMat); head.castShadow = true; head.position.x = L - headL; g.add(head);
  // a strike-anywhere head has a second, paler tip that holds the phosphorus compound
  const tip = new THREE.Mesh(new THREE.SphereGeometry(headD * 0.36, 20, 14), new THREE.MeshStandardMaterial({ color: 0xf1ede2, roughness: 0.7 }));
  tip.position.x = L - headD * 0.3; tip.scale.set(1, 0.95, 0.95); g.add(tip); tip.visible = anywhere;
  const api = {
    g, body, wood, char, wax: waxS, head, tip, headMat, charMat, woodMat, waxMat,
    // burnt: mm of splint burnt back from the head end; glow 0…1 an ember on the char
    setBurn(burnt = 0, glow = 0, headBurnt = 0) {
      const b = clamp(burnt, 0, L - headL - 2), end = L - headL * 0.5, woodLen = Math.max(0.5, end - b);
      wood.scale.x = woodLen; wood.position.x = woodLen / 2;
      char.visible = b > 0.2; char.scale.x = Math.max(0.2, b); char.position.x = woodLen + b / 2; char.position.y = -0.02 * b;
      charMat.emissiveIntensity = glow * 1.6;
      headMat.color.setHex(HEADC).lerp(new THREE.Color(0x24201e), clamp(headBurnt, 0, 1));
      head.scale.setScalar(1 - 0.22 * clamp(headBurnt, 0, 1));
      head.position.y = -0.02 * b; if (tip.visible) tip.position.y = -0.02 * b;
      waxS.visible = b < 1;
      return woodLen;
    },
    setType(any) { tip.visible = !!any; },
  };
  api.setBurn(0);
  return api;
}

// A plain matchbox (generic: no label, no brand): a card sleeve with a striking strip on each long
// narrow side, and a tray of matches. Built in millimetres, lying flat, long side along x.
export const BOXMM = { w: 52, h: 15, d: 36 };
export function makeBox(parent, { scale = 0.14, sticks = 14 } = {}) {
  const g = new THREE.Group(); g.scale.setScalar(scale); parent.add(g);
  const { w, h, d } = BOXMM, t = 0.6;
  const card = new THREE.MeshStandardMaterial({ color: 0x5b6f8f, roughness: 0.85, side: THREE.DoubleSide });
  const sleeve = new THREE.Group(); g.add(sleeve);
  const face = (ww, hh, dd, x, y, z, m = card) => { const b = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), m); b.position.set(x, y, z); b.castShadow = true; sleeve.add(b); return b; };
  face(w, t, d, 0, h / 2, 0); face(w, t, d, 0, -h / 2, 0); face(w, h, t, 0, 0, d / 2); face(w, h, t, 0, 0, -d / 2);
  const stripMat = new THREE.MeshStandardMaterial({ color: 0x55241f, roughness: 1 });
  const strips = new THREE.Group(); g.add(strips);
  const s1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, h * 0.8, 0.3), stripMat); s1.position.set(0, 0, d / 2 + t / 2 + 0.1); strips.add(s1);
  const s2 = s1.clone(); s2.position.z = -(d / 2 + t / 2 + 0.1); strips.add(s2);
  const tray = new THREE.Group(); g.add(tray);
  const tm = new THREE.MeshStandardMaterial({ color: 0xcbb994, roughness: 0.9, side: THREE.DoubleSide });
  const tw = w - 2, th = h - 2.2, td = d - 2;
  const tf = (ww, hh, dd, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), tm); b.position.set(x, y, z); tray.add(b); };
  tf(tw, t, td, 0, -th / 2, 0); tf(tw, th, t, 0, 0, td / 2); tf(tw, th, t, 0, 0, -td / 2); tf(t, th, td, tw / 2, 0, 0); tf(t, th, td, -tw / 2, 0, 0);
  const inside = new THREE.Group(); tray.add(inside);
  for (let i = 0; i < sticks; i++) {
    const m = makeMatch(inside, { scale: 1 }); m.wax.visible = false;
    m.g.position.set(-MATCH.L / 2 - 0.5, -th / 2 + 1.8 + (i % 2) * 2.1, -td / 2 + 2.6 + (i * (td - 5.2)) / (sticks - 1));
    m.g.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  }
  return { g, sleeve, strips, tray, strip: s1, stripMat, card };
}

// ---------------------------------------------------------------- a flame
// A buoyant teardrop: always points up. set({ h, w, on, flare }): flare 0…1 turns it white-hot and wide.
export function makeFlame(parent) {
  const g = new THREE.Group(); parent.add(g);
  const add = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide };
  const prof = []; for (let i = 0; i <= 20; i++) { const t = i / 20; prof.push(new THREE.Vector2(Math.pow(Math.sin(Math.PI * Math.pow(t, 0.55)), 0.9) + 0.0001, t)); }
  const geo = new THREE.LatheGeometry(prof, 22);
  const outer = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff8a2a, opacity: 0.55, ...add }));
  const body = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffc65a, opacity: 0.7, ...add }));
  const core = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x3f7bff, opacity: 0.55, ...add }));
  g.add(outer, body, core);
  const light = new THREE.PointLight(0xffa24a, 0, 30, 1.6); g.add(light);
  const cA = new THREE.Color(0xffc65a), cW = new THREE.Color(0xfff6e0);
  return {
    g, light,
    set({ h = 1, w = 0.3, on = 1, flare = 0, lean = 0 }) {
      g.visible = on > 0.02 && h > 0.01;
      outer.scale.set(w * 1.15, h, w * 1.15); body.scale.set(w * 0.8, h * 0.82, w * 0.8); core.scale.set(w * 0.75, h * 0.2, w * 0.75);
      outer.material.opacity = 0.55 * on; body.material.opacity = (0.7 + 0.25 * flare) * on; core.material.opacity = 0.55 * on * (1 - flare);
      body.material.color.copy(cA).lerp(cW, flare);
      g.rotation.z = lean;
      light.intensity = on * (3 + 14 * Math.min(1.5, h) + 30 * flare); light.position.set(0, h * 0.4, 0);
    },
  };
}
export const sparks = (parent, n, r, rnd, color = 0xffd9a0) => puffs(parent, n, r, color, rnd, { add: true, opacity: 0.95 });
export { clamp, lerp, smooth, arrow, exploder };
