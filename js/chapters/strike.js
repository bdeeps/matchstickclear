// Chapter 2: lock and key. Striking a match, as an order-of-magnitude sum (models in match.js).
// The head is drawn rubbing along a strip in slow motion (a real stroke of 3 cm takes about 30 ms).
//   friction power = μ N v;  work of one stroke = μ N s (s = 30 mm);
//   hot spot ≈ room + 2 q √(t ÷ π) ÷ e, with q = half the power over a 0.5 mm² patch, t = s ÷ v.
// What the spot must reach: about 240 °C with red phosphorus on the strip (safety match on its box),
// about 100 °C with the phosphorus compound in the tip (strike-anywhere), and about 400 °C with no
// phosphorus at all (a safety head on a plain rough surface: the oxidiser's own breakdown point).
// A wet head: the stroke's 20 to 30 mJ could boil about a hundredth of a milligram of water (2.55 J
// per mg to warm and boil it), so the spot cannot pass 100 °C. Water also soaks into the glue and
// carries off some of the oxidiser, so a match once soaked may be spoilt even when dry again.
// The energy staircase is drawn schematically: each step needs a small kick and gives out more than
// the next step needs (RateClear's activation-energy hill, five times in a row). No amounts.
import { THREE, M, box } from '../kit.js';
import {
  makeMatch, makeFlame, sparks, strike, SURF, CHAIN, HEAD_J, STROKE, MATCH, splintJ, T_RED, T_SESQUI, T_HEAD_ALONE, T_HEAD_TEST, WAX, WOOD,
  COL, VIEW, TALL, BW, BH, B1, B2, board, panelBg, title, axes, line, dot, dashH, fitNarrow, reelBoards, rng, link, ro, inReel, fmtJ, fmtW, fmtC, hex, clamp, lerp, smooth,
} from '../match.js';

const SC = 0.1, X0 = -1.1, X1 = 2.7, TOP = 1.3, LEAN = (50 * Math.PI) / 180;
const why = (r, s) => (r.wet ? 'the head is wet' : r.lit ? '' : !r.hasP ? 'no phosphorus: the key is missing' : 'the hot spot is too cool: press harder or strike faster');

export default {
  id: 'strike',
  short: 'Lock and key',
  title: 'Lock and key: striking a match',
  subtitle: 'The head and the strip are each hard to light alone. Rub them together and a chain of steps runs.',
  view: VIEW,
  learn: `<p>Leave a matchbox in a hot car and nothing happens. Scrape a safety match on a brick and, nearly always, nothing happens. But draw the head along the box's own strip and it bursts into flame. Why?</p>
    <p><b>The lock.</b> The head is an oxidiser packed tightly with a little fuel. It would burn fiercely, but it needs a strong kick to start. India's standard for safety matches even tests that a head does <b>not</b> light when it is simply warmed to 170 °C.</p>
    <p><b>The key.</b> The strip holds <b>red phosphorus</b>. Where a grain of it is ground against the head's oxidiser and heated, the two react at once. Older textbooks describe it a little differently: friction heat turns a trace of red phosphorus into white phosphorus, which catches fire in air. Either way, <b>the phosphorus is the key</b>, and it is not on the stick.</p>
    <p><b>The kick: friction.</b> Rubbing turns work into heat (see ${link('frictionclear', 'FrictionClear')}). The whole stroke is tiny, about 0.03 joule, less than lifting this matchbox onto a table. But it goes into a patch smaller than a pinhead in a few hundredths of a second. Our sum gives a hot spot of roughly 300 °C. Treat that as an order of magnitude, not a measurement.</p>
    <p><b>The staircase.</b> Each step needs a small kick, its <b>activation energy</b> (see ${link('rateclear', 'RateClear')}), and gives out far more than the next step needs. Friction lights the phosphorus. The phosphorus lights the head. The head flares for about a second, with tens of joules. That melts and lights the <b>wax</b>, and the wax flame heats the <b>wood</b> until it burns: about 1,100 joules. From finger to flame, the energy has grown about forty thousand times. Every step is oxidation and reduction (${link('redoxclear', 'RedoxClear')}): the oxidiser hands its oxygen to the fuel. In general form: fuel + oxidiser → oxides + heat.</p>
    <p><b>Strike-anywhere.</b> These heads carry their own phosphorus compound, which reacts at about 100 °C. Any rough, dry surface gives that. The key is always in the lock, which is why they are banned from aircraft.</p>
    <p><b>A wet match.</b> Water takes the heat. One stroke could boil off only about a hundredth of a milligram of it, so the spot never gets past 100 °C. Water also softens the glue and carries off some of the oxidiser, so a soaked match may never work again. Waterproof and storm matches keep water out with a coating.</p>
    <p class="tip"><b>Try it:</b> strike the safety match on a rough wall: plenty of heat, no flame. Put it back on the strip. Then press lightly and strike slowly until it fails, and try a wet head.</p>`,
  terms: [
    { t: 'Friction', d: 'The force that resists rubbing. The work done against it turns into heat.' },
    { t: 'Hot spot', d: 'A tiny patch that gets far hotter than its surroundings because heat arrives faster than it can soak away.' },
    { t: 'Red phosphorus', d: 'A stable, dark red form of the element phosphorus. It does not catch fire in air below about 240 °C.' },
    { t: 'Activation energy', d: 'The kick a reaction needs before it can start giving out energy of its own.' },
    { t: 'Chain of steps', d: 'A row of reactions in which each one gives more than enough energy to start the next.' },
    { t: 'Oxidiser', d: 'The ingredient that supplies oxygen. In the head it lets the fuel burn in a flash.' },
  ],
  defaults: { type: 'safety', surf: 'striker', N: 1.5, v: 1, wet: false },
  controls: [
    { key: 'type', type: 'seg', label: 'Kind of match', options: [{ v: 'safety', label: 'Safety' }, { v: 'anywhere', label: 'Strike-anywhere' }] },
    { key: 'surf', type: 'seg', label: 'Strike it on', options: [{ v: 'striker', label: 'The box strip' }, { v: 'wall', label: 'Rough wall' }, { v: 'glass', label: 'Glass' }] },
    { key: 'N', type: 'range', label: 'How hard you press', min: 0.2, max: 2, step: 0.05, ends: ['a feather', 'firm'], fmt: (v) => v.toFixed(2) + ' N' },
    { key: 'v', type: 'range', label: 'How fast you strike', min: 0.2, max: 1.5, step: 0.05, ends: ['slow', 'fast'], fmt: (v) => v.toFixed(2) + ' m/s' },
    { key: 'wet', type: 'toggle', label: 'Wet head' },
    { key: 'go', type: 'buttons', label: 'The model strikes again and again', items: [{ label: 'Strike now', act: (s, inst) => inst.go?.() }] },
  ],
  quiz: [
    { q: 'You scrape a safety match hard on a rough wall. There is plenty of friction heat, but usually no flame. Why?', options: ['The wall is too cold', 'The red phosphorus is on the box strip, not on the wall or the stick', 'Walls contain water', 'The head has no fuel'], answer: 1, why: 'Without phosphorus the head needs a far hotter spot, about 400 °C in our model. With phosphorus, about 240 °C is enough.' },
    { q: 'One stroke does only about 0.03 joule of work. How can that start a fire?', options: ['It cannot: the heat comes from your hand', 'The work goes into a tiny patch in a very short time, and each step of the chain gives out more than the next needs', 'The box has a battery', 'Air makes the heat'], answer: 1, why: 'Heat that arrives faster than it can soak away makes a hot spot. After that the chemicals supply the energy, step by step.' },
    { q: 'Why does a wet match fail to light?', options: ['Water is an oxidiser', 'Water makes the strip smoother only', 'Water soaks up the heat, so the spot cannot pass 100 °C, and it spoils the head', 'Wet wood is heavier'], answer: 2, why: 'A stroke could boil only about a hundredth of a milligram of water. Water also softens the glue and carries off some of the oxidiser.' },
  ],
  reel: [
    { ms: 5600, caption: 'The head is the lock. The key, red phosphorus, is on the box. Scrape a wall: heat, but no flame.', set: { type: 'safety', surf: 'wall', N: 1.5, v: 1, wet: false }, act: (s, inst) => inst.go?.(), view: TALL, spin: 0 },
    { ms: 6000, caption: 'On the strip, a 0.03 joule stroke makes a hot spot near 300 °C. Each step then lights the next.', set: { type: 'safety', surf: 'striker', N: 1.5, v: 1, wet: false }, act: (s, inst) => inst.go?.(), view: TALL, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const rnd = rng(3);
    // the surface: a strip seen from the side and a little above
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x55241f, roughness: 1 });
    const slab = box(5.2, 0.5, 2.2, slabMat); slab.position.set(0.9, TOP - 0.25, 0); root.add(slab);
    const cardM = M.matte(0x5b6f8f); const card = box(5.6, 0.9, 2.6, cardM); card.position.set(0.9, TOP - 0.96, 0); root.add(card);
    const grit = sparks(root, 90, 0.035, rnd, 0xff5d8f);                 // specks on the strip (static)
    const gp = []; for (let i = 0; i < 90; i++) gp.push([-1.6 + rnd() * 5.0, TOP + 0.01, -1.0 + rnd() * 2.0]);
    const drawGrit = (c, on) => { const col = new THREE.Color(c); gp.forEach((p, i) => { grit.mesh.tint(i, col); grit.mesh.place(i, p[0], on ? p[1] : -99, p[2], 1); }); grit.mesh.done(); };
    // the match, head down on the strip, stick trailing up to the right
    const G = new THREE.Group(); root.add(G); G.rotation.z = -LEAN;
    const match = makeMatch(G, { scale: SC }); match.g.position.x = -MATCH.L * SC;
    const flame = makeFlame(root), sp = sparks(root, 60, 0.035, rnd, 0xffe0a8), steam = sparks(root, 30, 0.07, rnd, 0xcfd8e6);
    const spot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false })); root.add(spot);
    const lSurf = stage.label('', [-0.4, TOP - 1.75, 1.3], root, 'hot');
    const lSpot = stage.label('', [0, 0, 0], root, 'hot'), lRes = stage.label('', [-0.4, 0.2, 1.4], root, 'hot');
    let S = { type: 'safety', surf: 'striker', N: 1.5, v: 1, wet: false }, key = '', ph = 0, t = 0, R = strike(S), step = 0, burnt = 0;
    const go = () => { ph = 1; t = 0; step = 0; burnt = 0; sp.clear(); steam.clear(); R = strike(S); };

    const bA = board(root, BW, BH, 632, 364, (g, w, h) => {
      const r = strike(S);
      panelBg(g, w, h); title(g, 'The hot spot', 'room + 2 q √(t ÷ π) ÷ e');
      const a = axes(g, w, h, { xMax: 2, yMax: 700, xTicks: [0, 0.5, 1, 1.5, 2], yTicks: [0, 100, 200, 300, 400, 500, 600, 700], xFmt: (v) => v + ' N', yFmt: (v) => v + '°', xLabel: 'how hard you press', y1: 60 });
      const pts = []; for (let N = 0; N <= 2.001; N += 0.1) pts.push([N, Math.min(700, strike({ ...S, N }).T)]);
      dashH(g, a.x0, a.x1, a.Y(T_HEAD_ALONE), 'no phosphorus: about 400 °C', 'rgba(154,160,173,.8)');
      dashH(g, a.x0, a.x1, a.Y(T_RED), 'red phosphorus on the strip: about 240 °C', COL.pink);
      dashH(g, a.x0, a.x1, a.Y(T_SESQUI), 'phosphorus compound in the tip: about 100 °C', COL.violet);
      line(g, pts, a.X, a.Y, COL.heat, 5);
      g.strokeStyle = r.lit ? COL.ok : COL.bad; g.lineWidth = 3; g.setLineDash([4, 5]); g.beginPath(); g.moveTo(a.x0, a.Y(Math.min(700, r.need))); g.lineTo(a.x1, a.Y(Math.min(700, r.need))); g.stroke(); g.setLineDash([]);
      dot(g, a.X(S.N), a.Y(Math.min(700, r.T)), r.lit ? COL.ok : COL.bad, 10);
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h); title(g, 'The energy staircase', 'each step gives more than the next needs');
      const r = R, n = CHAIN.length, x0 = 30, sw = (w - 60) / n, yTop = 92, unit = 62;
      const needs = [null, fmtC(r.need), 'heat from the key', `${WAX.flash} °C`, `${WOOD.Tig} °C`];
      const gives = [fmtJ(r.work), 'a flash', `≈ ${HEAD_J} J`, 'a flame', `≈ ${fmtJ(splintJ())}`];
      let y = yTop;
      g.lineJoin = 'round';
      CHAIN.forEach((c, i) => {
        const x = x0 + i * sw, on = step > i, dead = ph >= 2 && !r.lit && i >= 1, y2 = yTop + c.drop * unit;
        g.globalAlpha = dead ? 0.28 : on ? 1 : 0.6;
        // the small hill (the kick this step needs), then the drop (what it gives)
        g.strokeStyle = c.col; g.lineWidth = on ? 6 : 4; g.beginPath(); g.moveTo(x, y);
        g.quadraticCurveTo(x + sw * 0.22, y - (i ? 30 : 0) * 2, x + sw * 0.44, y); g.lineTo(x + sw * 0.5, y2); g.lineTo(x + sw, y2); g.stroke();
        g.fillStyle = c.col; g.font = 'bold 18px sans-serif'; g.fillText(c.n, x + 2, 300); g.font = '14px sans-serif'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText(c.sub, x + 2, 318);
        if (needs[i]) { g.font = '13px sans-serif'; g.fillStyle = 'rgba(255,255,255,.7)'; g.fillText('needs', x + 2, 336); g.fillText(needs[i], x + 2, 352); }
        g.font = 'bold 15px sans-serif'; g.fillStyle = '#fff'; g.fillText(gives[i], x + sw * 0.52, y2 - 8);
        y = y2; g.globalAlpha = 1;
      });
      if (ph >= 2 && !r.lit) { g.font = 'bold 17px sans-serif'; g.fillStyle = COL.bad; g.fillText('The chain stops at step 2: ' + why(r, S), 30, 66); }
      else { g.font = '15px sans-serif'; g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText('energy stored in the match, stepping down as each stage lets go', 30, 66); }
    }, B2);

    return {
      go,
      update(dt, s) {
        dt = Math.max(0, Math.min(dt, 0.05)); S = s;
        const narrow = fitNarrow(stage, [lSurf]), rl = inReel() && stage.camera.aspect < 0.8; root.position.x = rl ? -1.3 : 0; reelBoards([bA, bB], rl ? 0.9 : -0.4, stage, VIEW);
        const k = `${s.type}|${s.surf}|${s.N}|${s.v}|${s.wet}`;
        if (k !== key) {
          key = k; R = strike(s); bA.redraw(); if (ph === 0 || ph === 3) go();
          const sf = SURF[s.surf];
          slabMat.color.setHex(s.surf === 'striker' ? 0x55241f : s.surf === 'wall' ? 0x7d7468 : 0x9fc4d6); slabMat.roughness = s.surf === 'glass' ? 0.08 : 1;
          slabMat.transparent = s.surf === 'glass'; slabMat.opacity = s.surf === 'glass' ? 0.55 : 1; card.visible = s.surf === 'striker';
          drawGrit(s.surf === 'striker' ? 0xff5d8f : 0xb9b1a4, s.surf !== 'glass');
          lSurf.element.innerHTML = s.surf === 'striker' ? 'striking strip: red phosphorus + grit' : sf.n.toLowerCase() + ': no phosphorus';
          lSurf.element.style.setProperty('--c', s.surf === 'striker' ? COL.pink : COL.smoke);
          match.setType(s.type === 'anywhere'); match.headMat.roughness = s.wet ? 0.15 : 0.7;
        }
        // phases: 0 wait, 1 stroke (slow motion), 2 result, 3 hold
        t += dt; let x = X0, prog = 0;
        const dur = lerp(1.9, 0.9, clamp((s.v - 0.2) / 1.3, 0, 1));
        if (ph === 0) { if (t > 0.5) { ph = 1; t = 0; } }
        else if (ph === 1) { prog = clamp(t / dur, 0, 1); x = lerp(X0, X1, smooth(prog)); step = 1; if (prog >= 1) { ph = 2; t = 0; } }
        else if (ph === 2) { x = X1; if (R.lit) { step = t < 0.25 ? 2 : t < 1.3 ? 3 : t < 2.3 ? 4 : 5; burnt = Math.max(0, (t - 1.6) * 3.2); } if (t > (R.lit ? 4.6 : 2.2)) { ph = 3; t = 0; } }
        else { x = X1; if (t > 0.8) go(); if (R.lit) burnt += dt * 3.2; }
        const lift = ph === 2 || ph === 3 ? smooth(clamp(t / 0.4 + (ph === 3 ? 1 : 0), 0, 1)) * 0.9 : 0;
        G.position.set(x, TOP + 0.24 + lift, 0);
        const lit = (ph === 2 || ph === 3) && R.lit, flareK = lit && ph === 2 ? clamp(1 - Math.abs(t - 0.7) / 0.7, 0, 1) : 0;
        match.setBurn(lit ? burnt : 0, 0, lit ? clamp((ph === 2 ? t : 2) / 1.2, 0, 1) : 0);
        match.headMat.emissiveIntensity = lit && ph === 2 ? flareK * 2 : 0;
        const hot = ph === 1 ? clamp((R.T - 30) / 400, 0, 1) * prog : 0;
        spot.position.set(x, TOP + 0.08, 0); spot.material.opacity = hot * 0.9; spot.material.color.setHSL(0.08 - 0.06 * hot, 1, 0.5 + 0.3 * hot); spot.scale.setScalar(0.6 + hot);
        const fx = x - Math.cos(LEAN) * burnt * SC, fy = TOP + 0.24 + lift + Math.sin(LEAN) * burnt * SC;
        flame.g.position.set(fx, fy, 0);
        flame.set({ h: lit ? (ph === 2 && t < 1.3 ? 1.7 + 0.9 * flareK : 1.5) * (1 + 0.04 * Math.sin(t * 31)) : 0, w: lit ? 0.42 + 0.35 * flareK : 0, on: lit ? 1 : 0, flare: flareK });
        sp.step(dt, ph === 1 ? 20 + 90 * hot : flareK > 0.3 ? 60 : 0, () => [x + (rnd() - 0.5) * 0.2, TOP + 0.1 + (ph === 2 ? lift : 0), (rnd() - 0.5) * 0.3], () => [(1.5 + rnd() * 2.5) * (ph === 1 ? -1 : rnd() - 0.5), 0.6 + rnd() * 1.8, (rnd() - 0.5) * 1.6], 0.35);
        steam.step(dt, s.wet && ph === 1 ? 14 : 0, () => [x, TOP + 0.2, (rnd() - 0.5) * 0.3], () => [-0.4, 0.8 + rnd() * 0.5, (rnd() - 0.5) * 0.4], 1.1);
        lSpot.visible = ph === 1 && prog > 0.25; lSpot.position.set(x - 0.2, TOP - 0.55, 1.3);
        lSpot.element.innerHTML = s.wet ? 'wet: stuck near 100 °C' : `hot spot ≈ ${fmtC(R.T)}`; lSpot.element.style.setProperty('--c', COL.heat);
        lRes.visible = ph >= 2; lRes.position.set(narrow ? 0.9 : 2.5, narrow ? 0.0 : TOP - 1.75, 1.3);
        lRes.element.innerHTML = R.lit ? '<b>It lights</b>' : `<b>No flame</b>: ${why(R, s)}`; lRes.element.style.setProperty('--c', R.lit ? COL.ok : COL.bad);
        if (step !== bB._s || ph !== bB._p) { bB._s = step; bB._p = ph; bB.redraw(); }
      },
      readout: (s) => {
        const r = strike(s);
        return ro(`<div class="big" style="color:${r.lit ? COL.ok : COL.bad}">${r.lit ? 'It lights' : 'No flame'}</div>
          <div class="row"><span>Hot spot (order of magnitude)</span><b style="color:${COL.heat}">${s.wet ? 'held near 100 °C' : 'about ' + fmtC(r.T)}</b></div>
          <div class="row"><span>The key needs about</span><b>${fmtC(r.need)}</b></div>
          <div class="row"><span>Phosphorus (the key)</span><b style="color:${r.hasP ? COL.pink : COL.smoke}">${r.key}</b></div>
          <div class="row"><span>Friction power, μ N v</span><b>${r.mu} × ${s.N.toFixed(2)} × ${s.v.toFixed(2)} = ${r.P.toFixed(2)} W</b></div>
          <div class="row"><span>Work of one 3 cm stroke</span><b>${fmtJ(r.work)}, in ${Math.round(r.t * 1000)} ms</b></div>
          <small>${s.wet ? `That work could boil only ${r.boilMg.toFixed(3)} mg of water. The water wins.` : r.lit ? `After that the match pays its own way: the head gives roughly ${HEAD_J} J, the wood about ${fmtJ(splintJ())}.` : 'Reason: ' + why(r, s) + '.'}</small>`);
      },
    };
  },
};
