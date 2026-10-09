// Chapter 6: fire before and after the match. Five ways to get the first hot spot.
// Sources
//  - Fire by friction (bow drill): the charred dust must reach roughly 340 to 430 °C to become an
//    ember (experiments summarised by a University of Dayton fire-by-friction researcher; read in a
//    summary). The power sum is ours: μ N v with μ ≈ 0.4 for wood on wood (FrictionClear), a 12 mm
//    spindle at about 1,200 turns a minute (v = π D n ÷ 60 ≈ 0.75 m/s) and the push you choose.
//  - Flint and steel: the flint shaves off tiny curls of steel; the work of cutting heats them and
//    they burn in air (Robert Hooke saw the cooled sparks as melted globules of steel, Micrographia,
//    1665; Wikipedia, "Spark (fire)"). Iron melts at 1,538 °C, so the sparks are taken as "over
//    1,000 °C" with no closer figure.
//  - Ferrocerium ("lighter flint"), Carl Auer von Welsbach, 1903: an alloy of cerium-rich mischmetal
//    and iron whose shavings ignite at about 150 to 180 °C and burn at about 3,000 °C (Wikipedia,
//    "Ferrocerium").
//  - Piezo lighter: a spring-loaded hammer hits a piezoelectric crystal, which gives a pulse of high
//    voltage across a gap. Dry air breaks down at about 3 kV per millimetre (a standard physics
//    value), so the voltage needed ≈ 3 kV × gap in mm.
//  - Butane lighters: Henri Pingeot's patent, France, 1936; Döbereiner's lamp, 1823 (Wikipedia,
//    "Lighter"). Matchbook: Joshua Pusey's US patent 483,166 of 27 September 1892 (Wikipedia,
//    "Matchbook"). Earliest evidence of people making fire: Barnham, Suffolk, about 400,000 years ago
//    (Wikipedia, "Control of fire by early humans", reporting a 2025 study).
//  - Air travel: ICAO's rules allow one small packet of safety matches or one small lighter carried
//    on the person, none in bags, and forbid strike-anywhere matches (ICAO Dangerous Goods Panel
//    papers; read in summaries). Indian airport security lists matchboxes and lighters among items
//    not allowed (airport pages citing BCAS; read in summaries). The text says "check before you fly".
import { THREE, M, box, beam, sphere } from '../kit.js';
import {
  makeMatch, makeFlame, sparks, MATCH, T_RED, COL, VIEW, TALL, BW, BH, B1, B2, board, panelBg, title, bars, fitNarrow, reelBoards, rng, link, ro, fmtW, hex, clamp, lerp, smooth,
} from '../match.js';

const DEV = {
  drill: { n: 'Fire drill', when: 'since prehistory', hot: 400, what: 'wood dust rubbed until it chars and glows' },
  flint: { n: 'Flint and steel', when: 'from the Iron Age', hot: 1200, what: 'curls of steel shaved off so fast that they burn' },
  match: { n: 'Match', when: '1827, safe from 1844 to 1855', hot: 300, what: 'a friction hot spot that sets off stored chemicals' },
  wheel: { n: 'Flint-wheel lighter', when: '1903', hot: 3000, what: 'shavings of ferrocerium that catch at 150 to 180 °C' },
  piezo: { n: 'Piezo lighter', when: 'after the butane lighter of 1936', hot: 0, what: 'a crystal squeezed by a hammer makes a spark' },
};
const ORDER = ['drill', 'flint', 'match', 'wheel', 'piezo'];
const TIME = [['400,000 yr ago', 'Barnham, England: earliest signs of fire-making'], ['577 CE', 'China: sulphur-tipped sticks to pick up a flame'], ['1669', 'Hennig Brand, Hamburg, finds phosphorus'], ['1823', 'Döbereiner\'s lamp: hydrogen lit by platinum'], ['1827', 'John Walker sells the first friction matches'], ['1844 to 1855', 'Pasch and the Lundströms: the safety match'], ['1892', 'Joshua Pusey patents the matchbook'], ['1903', 'Auer von Welsbach: ferrocerium'], ['1936', 'Pingeot patents the butane lighter']];
const drillW = (push) => 0.4 * push * ((Math.PI * 0.012 * 1200) / 60);
const P0 = [-0.6, 1.4];

export default {
  id: 'fire',
  short: 'Before and after',
  title: 'Fire before and after the match',
  subtitle: 'A drill, a flint, a match, a wheel, a crystal: five ways to make one small hot spot.',
  view: VIEW,
  learn: `<p>Every way of making fire does the same thing: it puts enough energy into a small enough spot, fast enough, to start something burning. The match was just the first one that fitted in a pocket.</p>
    <p><b>The fire drill.</b> Spin a wooden spindle on a wooden board and friction grinds off brown dust and heats it (see ${link('frictionclear', 'FrictionClear')}). At about 400 °C the dust becomes a glowing <b>ember</b>, which is tipped into dry grass and blown into flame. It takes a dozen watts of hard work for half a minute or more. People have made fire for a very long time: the oldest known signs, in England, are about 400,000 years old.</p>
    <p><b>Flint and steel.</b> Strike hard flint down a piece of steel and it shaves off tiny curls of metal. The work of cutting makes them so hot that they burn as they fly: those are the sparks. Catch one on charred cloth and you have an ember. For centuries this, and a tinderbox, was how a kitchen fire was lit.</p>
    <p><b>The match.</b> In 1827 John Walker, a chemist in Stockton-on-Tees, sold the first matches that lit by friction. They put the chemistry on the stick, so one stroke replaced the tinderbox. The safety match followed between 1844 and 1855.</p>
    <p><b>The flint-wheel lighter.</b> Its "flint" is no stone. It is <b>ferrocerium</b>, a metal alloy invented in 1903 whose shavings catch fire at only 150 to 180 °C and burn at about 3,000 °C. A steel wheel scrapes a shower of them into a stream of <b>butane</b> gas, which is a liquid under pressure in the tank and a gas at the nozzle.</p>
    <p><b>The piezo lighter.</b> Press the button and a spring fires a tiny hammer at a <b>piezoelectric crystal</b>. Squeezed suddenly, the crystal makes a pulse of several thousand volts, enough to jump a gap of a few millimetres as a spark. A kitchen gas lighter works the same way. No flint, no battery.</p>
    <p><b>Matchbooks and aircraft.</b> Paper matches stapled into a folded card, the matchbook, date from 1892 and carried advertising round the world. On aircraft the international rule allows one small box of safety matches or one small lighter in your pocket, none in your bags, and no strike-anywhere matches at all. Airports in India are stricter and commonly take away matchboxes and lighters at security, so check before you fly.</p>
    <p>And wherever there are matches or lighters: <b>keep them away from children</b>, and make sure a used match is cold before it goes in the bin.</p>
    <p class="tip"><b>Try it:</b> step through the five. Push harder on the fire drill and watch the watts, then widen the piezo lighter's gap and see the voltage it needs.</p>`,
  terms: [
    { t: 'Ember', d: 'A glowing piece of char that burns without a flame. Blown on, it can light tinder.' },
    { t: 'Tinder', d: 'Fine, dry material that catches from a spark or ember: charred cloth, dry grass, fungus.' },
    { t: 'Ferrocerium', d: 'The "flint" of a lighter: a cerium and iron alloy whose shavings ignite at about 150 to 180 °C.' },
    { t: 'Piezoelectric', d: 'Describes a crystal that makes a voltage when squeezed. A sharp blow gives thousands of volts.' },
    { t: 'Butane', d: 'The fuel of most lighters: a gas that turns liquid under modest pressure, C₄H₁₀.' },
    { t: 'Matchbook', d: 'Paper matches fixed in a folded card cover with a striking strip.' },
  ],
  defaults: { dev: 'drill', push: 40, gap: 4 },
  controls: [
    { key: 'dev', type: 'seg', label: 'Fire-maker', options: [{ v: 'drill', label: 'Drill' }, { v: 'flint', label: 'Flint' }, { v: 'match', label: 'Match' }, { v: 'wheel', label: 'Wheel' }, { v: 'piezo', label: 'Piezo' }] },
    { key: 'push', type: 'range', label: 'Fire drill: how hard you push down', min: 10, max: 80, step: 5, ends: ['10 N', '80 N'], fmt: (v) => v + ' N' },
    { key: 'gap', type: 'range', label: 'Piezo lighter: spark gap', min: 1, max: 8, step: 0.5, ends: ['1 mm', '8 mm'], fmt: (v) => v.toFixed(1) + ' mm' },
  ],
  onChange(s, key) { if (key === 'push') s.dev = 'drill'; if (key === 'gap') s.dev = 'piezo'; },
  quiz: [
    { q: 'What are the sparks from flint and steel?', options: ['Bits of burning flint', 'Tiny curls of steel, shaved off and hot enough to burn in air', 'Static electricity', 'Burning air'], answer: 1, why: 'The hard flint cuts the steel. The work of cutting heats the tiny shavings so much that they burn as they fly.' },
    { q: 'How does a piezo lighter make its spark?', options: ['A battery charges a coil', 'A wheel scrapes a flint', 'A hammer hits a crystal, which gives a pulse of high voltage', 'The gas rubs on the nozzle'], answer: 2, why: 'A piezoelectric crystal makes a voltage when it is squeezed. A sharp blow gives thousands of volts across a small gap.' },
    { q: 'What do all five fire-makers have in common?', options: ['They all use phosphorus', 'They all need electricity', 'They all concentrate energy into a small spot quickly enough to start burning', 'They all need wood'], answer: 2, why: 'A drill, a flint, a match, a lighter wheel and a crystal are five ways of making one small, very hot spot.' },
  ],
  reel: [
    { ms: 6000, caption: 'Before matches: a drill, or flint and steel. After: a wheel of ferrocerium, or a crystal that sparks.', set: { push: 40, gap: 4, dev: 'drill' }, anim: { step: [0, 4.99] }, view: TALL, spin: 0 },
  ],
  // the reel steps through the five devices
  // (step is only set by the reel; the control uses dev)

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const rnd = rng(23), G = {};
    const mdl = new THREE.Group(); root.add(mdl);
    const grp = (k) => { const g = new THREE.Group(); g.position.set(P0[0], 0, 0); mdl.add(g); G[k] = g; return g; };
    const wood = M.matte(0xb98a5a), dark = M.matte(0x2b3039), steel = M.metal(0xc9ced8);
    // ---- drill: hearth board, spindle, bow, handhold
    let g = grp('drill');
    const hearth = box(3.4, 0.3, 1.2, wood); hearth.position.set(0, 0.5, 0); g.add(hearth);
    const spin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 2.6, 12), M.matte(0xd9b98a)); spin.position.set(0.5, 1.95, 0); g.add(spin);
    const hold = box(0.9, 0.22, 0.5, M.matte(0x6a4a2a)); hold.position.set(0.5, 3.35, 0); g.add(hold);
    const bow = new THREE.Group(); g.add(bow);
    bow.add(beam([-1.7, 2.05, 0.35], [1.7, 2.05, 0.35], 0.04, M.matte(0x6a4a2a), 8), beam([-1.7, 2.05, 0.35], [-1.7, 2.0, 0.1], 0.015, dark, 6), beam([1.7, 2.05, 0.35], [1.7, 2.0, 0.1], 0.015, dark, 6), beam([-1.7, 2.0, 0.12], [1.7, 2.0, 0.12], 0.015, M.matte(0xe8e2d0), 6));
    const ember = sphere(0.1, new THREE.MeshBasicMaterial({ color: 0xff5a1a, toneMapped: false }), 12); ember.position.set(0.5, 0.68, 0.25); g.add(ember);
    // ---- flint and steel
    g = grp('flint');
    const flint = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), new THREE.MeshStandardMaterial({ color: 0x5a5f6a, roughness: 0.35, flatShading: true })); flint.scale.set(1.3, 0.7, 0.8); flint.position.set(-0.2, 1.9, 0); g.add(flint);
    const fs = new THREE.Group(); g.add(fs); const bar = box(0.22, 1.5, 0.5, steel); fs.add(bar);
    const cloth = box(1.3, 0.05, 1.0, M.matte(0x18181a)); cloth.position.set(0.35, 0.42, 0); g.add(cloth);
    const emb2 = sphere(0.07, new THREE.MeshBasicMaterial({ color: 0xff5a1a, toneMapped: false }), 10); emb2.position.set(0.4, 0.47, 0.1); g.add(emb2);
    // ---- match
    g = grp('match');
    const mt = makeMatch(g, { scale: 0.11 }); mt.g.position.set(-2.0, 1.2, 0); mt.g.rotation.z = 0.5;
    // ---- wheel lighter (a plain body, cut away)
    const lighter = (k) => {
      const q = grp(k);
      const body = box(1.3, 2.3, 0.7, M.clear(0x6fb6ff, 0.28)); body.position.set(0, 1.55, 0); q.add(body);
      const fuel = box(1.2, 1.2, 0.6, M.clear(0xcfe8ff, 0.4)); fuel.position.set(0, 1.05, 0); q.add(fuel);
      const top = box(1.34, 0.3, 0.74, steel); top.position.set(0, 2.85, 0); q.add(top);
      const tube = beam([0.3, 0.6, 0], [0.3, 3.05, 0], 0.035, M.matte(0xe8e2d0), 8); q.add(tube);
      return q;
    };
    g = lighter('wheel');
    const wheel = new THREE.Group(); wheel.position.set(-0.3, 3.15, 0); g.add(wheel);
    const wc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.32, 20), M.metal(0x8a909c, { roughness: 0.7 })); wc.rotation.x = Math.PI / 2; wheel.add(wc);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, t = box(0.07, 0.05, 0.34, dark); t.position.set(0.27 * Math.cos(a), 0.27 * Math.sin(a), 0); t.rotation.z = a; wheel.add(t); }
    const ferro = beam([-0.3, 2.2, 0], [-0.3, 2.9, 0], 0.07, M.metal(0x4a4d55, { roughness: 0.6 }), 10); g.add(ferro);
    const spr = beam([-0.3, 1.5, 0], [-0.3, 2.2, 0], 0.05, M.metal(0xb9bec8), 6); g.add(spr);
    // ---- piezo lighter
    g = lighter('piezo');
    const btn = box(0.45, 0.5, 0.6, M.plastic(0xff7a59)); g.add(btn);
    const hammer = box(0.2, 0.28, 0.2, steel); g.add(hammer);
    const cryst = box(0.24, 0.3, 0.24, M.plastic(0xc49bff)); cryst.position.set(-0.3, 1.9, 0); g.add(cryst);
    const wire = beam([-0.3, 2.05, 0.2], [0.1, 3.12, 0.2], 0.02, M.metal(0xe0a060), 6); g.add(wire);
    const arc = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, toneMapped: false })); arc.rotation.z = Math.PI / 2; g.add(arc);
    // shared effects
    const flame = makeFlame(mdl), sp = sparks(mdl, 80, 0.04, rnd, 0xffd9a0), smoke = sparks(mdl, 30, 0.1, rnd, 0x9aa0ad);
    smoke.mesh.material.blending = THREE.NormalBlending; smoke.mesh.material.opacity = 0.4;
    const lName = stage.label('', [P0[0], 0.02, 1.3], root, 'hot'), lA = stage.label('', [0, 0, 0], root), lB = stage.label('', [0, 0, 0], root);
    let S = { dev: 'drill', push: 40, gap: 4 }, key = '', tt = 0, cyc = 0;

    const bA = board(root, BW, BH, 632, 364, (gx, w, h) => {
      panelBg(gx, w, h); title(gx, 'How hot is the first hot spot?', '');
      bars(gx, ORDER.filter((k) => k !== 'piezo').map((k) => ({ label: DEV[k].n, value: DEV[k].hot, color: k === S.dev ? COL.heat : 'rgba(255,181,71,.4)', lcol: k === S.dev ? COL.text : 'rgba(255,255,255,.6)', text: k === 'flint' ? 'over 1,000 °C: burning steel' : k === 'wheel' ? 'about 3,000 °C' : k === 'drill' ? 'about 400 °C: an ember' : 'about 300 °C, then chemistry' })), { y: 58, w, rowH: 52, labelW: 200, max: 3300 });
      gx.font = 'bold 19px sans-serif'; gx.fillStyle = S.dev === 'piezo' ? COL.text : 'rgba(255,255,255,.6)'; gx.fillText('Piezo lighter', 20, 58 + 4 * 52 + 24);
      gx.font = '18px sans-serif'; gx.fillStyle = S.dev === 'piezo' ? COL.violet : 'rgba(196,155,255,.6)'; gx.fillText(`a spark: about ${(3 * S.gap).toFixed(0)} kV across ${S.gap.toFixed(1)} mm of air`, 220, 58 + 4 * 52 + 24);
      gx.font = '15px sans-serif'; gx.fillStyle = 'rgba(255,255,255,.55)'; gx.fillText('A small spot, heated quickly: the rest is fuel and air.', 20, 348);
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (gx, w, h) => {
      panelBg(gx, w, h); title(gx, 'Making fire: a short timeline', '');
      TIME.forEach(([y, t], i) => {
        const yy = 66 + i * 33;
        gx.font = 'bold 17px sans-serif'; gx.fillStyle = COL.heat; gx.fillText(y, 20, yy);
        gx.font = '17px sans-serif'; gx.fillStyle = 'rgba(255,255,255,.85)'; gx.fillText(t, 160, yy);
      });
    }, B2);

    return {
      update(dt, s) {
        dt = Math.max(0, Math.min(dt, 0.05)); tt += dt; cyc = (cyc + dt / 3.2) % 1;
        if (s.step !== undefined && document.body.classList.contains('gb-reel')) s.dev = ORDER[clamp(Math.floor(s.step), 0, 4)];
        S = s;
        const narrow = fitNarrow(stage, [lA, lB]); reelBoards([bA, bB], -0.4, stage, VIEW);
        const inR = document.body.classList.contains('gb-reel'), rl = inR && stage.camera.aspect < 0.8, K = rl ? 1.5 : inR && stage.camera.aspect < 1.3 ? 0.95 : 1.2, mx = (rl ? -0.4 : P0[0]) - K * P0[0]; mdl.scale.setScalar(K); mdl.position.x = mx;
        const k = `${s.dev}|${s.gap}`; if (k !== key) { key = k; bA.redraw(); cyc = 0; sp.clear(); smoke.clear(); }
        ORDER.forEach((d) => { G[d].visible = d === s.dev; });
        const D = DEV[s.dev], X = P0[0];
        lName.element.innerHTML = `<b>${D.n}</b> · ${D.when}`; lName.element.style.setProperty('--c', COL.heat);
        let fOn = 0, fPos = [X, 3.2], rate = 0, src = [X, 1, 0], dir = [0, 1, 0], sm = 0, a = '', b = '', pa = [X - 2, 3, 0], pb = [X + 2, 1, 0];
        if (s.dev === 'drill') {
          const W = drillW(s.push), osc = Math.sin(tt * (5 + W / 4));
          spin.rotation.y = osc * 6; bow.position.x = osc * 0.7; hold.position.y = 3.35 - (s.push - 10) * 0.0008;
          const hot = clamp((W - 5) / 12, 0, 1); ember.scale.setScalar(0.3 + 1.5 * hot * (0.8 + 0.2 * Math.sin(tt * 7))); ember.visible = hot > 0.15;
          sm = 3 + 16 * hot; src = [X + 0.5, 0.75, 0.2];
          a = 'the bow spins the spindle back and forth'; pa = [X - 1.2, 2.75, 0.5]; b = hot > 0.15 ? 'brown dust chars into an ember' : 'push harder: the dust is only warm'; pb = [X + 1.9, 0.95, 0.5];
        } else if (s.dev === 'flint') {
          const sw = smooth(clamp(cyc / 0.25, 0, 1)); fs.position.set(0.42, 3.3 - sw * 2.0, 0); fs.rotation.z = -0.15;
          rate = cyc > 0.12 && cyc < 0.3 ? 160 : 0; src = [X + 0.3, 1.9, 0]; dir = [0.5, -1.6, 0]; emb2.visible = cyc > 0.3; emb2.scale.setScalar(1 + 0.3 * Math.sin(tt * 8));
          a = 'steel struck down the flint\'s edge'; pa = [X + 1.7, 2.9, 0.4]; b = 'sparks land on charred cloth'; pb = [X + 1.7, 0.75, 0.6];
        } else if (s.dev === 'match') {
          const lit = cyc > 0.25; mt.setBurn(lit ? (cyc - 0.25) * 14 : 0, 0, lit ? 1 : 0);
          const hx = X - 2.0 + Math.cos(0.5) * (MATCH.L - 2 - (lit ? (cyc - 0.25) * 14 : 0)) * 0.11, hy = 1.2 + Math.sin(0.5) * (MATCH.L - 2 - (lit ? (cyc - 0.25) * 14 : 0)) * 0.11;
          fOn = lit ? 1 : 0; fPos = [hx, hy]; rate = cyc > 0.2 && cyc < 0.3 ? 120 : 0; src = [hx, hy, 0]; dir = [0, 1, 0];
          a = 'the chemistry rides on the stick'; pa = [X - 0.9, 0.85, 0.5]; b = `hot spot of about ${T_RED} °C or more`; pb = [X + 1.7, 3.6, 0.3];
        } else if (s.dev === 'wheel') {
          const on = cyc < 0.7, flick = cyc < 0.15; wheel.rotation.z = flick ? -cyc * 40 : -6;
          rate = flick ? 220 : 0; src = [X - 0.25, 3.3, 0]; dir = [1.6, 1.2, 0]; fOn = cyc > 0.1 && on ? 1 : 0; fPos = [X + 0.3, 3.08];
          a = 'steel wheel scrapes the ferrocerium'; pa = [X - 1.9, 3.35, 0.4]; b = 'butane gas from the tank'; pb = [X + 1.9, 1.4, 0.4];
        } else {
          const press = smooth(clamp(cyc / 0.12, 0, 1)) * (cyc < 0.7 ? 1 : 0), hit = cyc > 0.1 && cyc < 0.2;
          btn.position.set(-0.35, 3.2 - press * 0.22, 0); hammer.position.set(-0.3, hit ? 2.2 : 2.75 - press * 0.3, 0);
          const gapU = 0.12 + s.gap * 0.03; arc.visible = hit && Math.sin(tt * 90) > -0.3; arc.scale.y = gapU; arc.position.set(0.1 + gapU / 2, 3.12 + (rnd() - 0.5) * 0.03, 0.2);
          fOn = cyc > 0.16 && cyc < 0.7 ? 1 : 0; fPos = [X + 0.3, 3.08];
          a = 'a hammer hits the crystal'; pa = [X - 1.5, 2.1, 0.4]; b = `spark: about ${(3 * s.gap).toFixed(0)} kV`; pb = [X + 1.7, 3.3, 0.4];
        }
        flame.g.position.set(fPos[0], fPos[1], 0);
        flame.set({ h: fOn * (1.1 + 0.06 * Math.sin(tt * 21)), w: 0.3, on: fOn, flare: 0 });
        sp.step(dt, rate, () => [src[0] + (rnd() - 0.5) * 0.1, src[1], src[2] + (rnd() - 0.5) * 0.2], () => [dir[0] * (0.5 + rnd()) + (rnd() - 0.5) * 0.8, dir[1] * (0.5 + rnd()), (rnd() - 0.5) * 1.2], 0.5);
        smoke.step(dt, sm, () => [src[0], src[1], src[2]], () => [(rnd() - 0.5) * 0.3, 0.6 + rnd() * 0.4, (rnd() - 0.5) * 0.2], 1.8);
        lA.element.innerHTML = a; lA.position.set(mx + K * pa[0], K * pa[1], pa[2]); lB.element.innerHTML = b; lB.position.set(mx + K * pb[0], K * pb[1], pb[2]);
      },
      readout: (s) => {
        const D = DEV[s.dev];
        const rows = s.dev === 'drill' ? `<div class="row"><span>Friction power, μ N v</span><b>0.4 × ${s.push} N × 0.75 m/s = ${fmtW(drillW(s.push))}</b></div><div class="row"><span>The dust must reach about</span><b>400 °C</b></div><div class="row"><span>Verdict</span><b style="color:${drillW(s.push) > 8 ? COL.ok : COL.bad}">${drillW(s.push) > 8 ? 'an ember, after half a minute or so' : 'too gentle: warm dust only'}</b></div>`
          : s.dev === 'flint' ? `<div class="row"><span>The sparks are</span><b>burning curls of steel</b></div><div class="row"><span>How hot</span><b>over 1,000 °C</b></div><div class="row"><span>They light</span><b>charred cloth, not wood</b></div>`
          : s.dev === 'match' ? `<div class="row"><span>Hot spot from one stroke</span><b>about 300 °C</b></div><div class="row"><span>Work of the stroke</span><b>about 0.03 J</b></div><div class="row"><span>Then</span><b>the chemicals pay: about 1,100 J</b></div>`
          : s.dev === 'wheel' ? `<div class="row"><span>The "flint" is</span><b>ferrocerium, a metal alloy</b></div><div class="row"><span>Its shavings catch at</span><b>150 to 180 °C</b></div><div class="row"><span>and burn at about</span><b>3,000 °C</b></div>`
          : `<div class="row"><span>Spark gap</span><b>${s.gap.toFixed(1)} mm</b></div><div class="row"><span>Air breaks down at about</span><b>3 kV per mm</b></div><div class="row"><span>Voltage needed</span><b style="color:${COL.violet}">about ${(3 * s.gap).toFixed(0)} kV (${(3000 * s.gap).toLocaleString('en-IN')} V)</b></div>`;
        return ro(`<div class="big">${D.n}</div>
          <div class="row"><span>In use</span><b>${D.when}</b></div>
          <div class="row"><span>The hot spot</span><b>${D.what}</b></div>${rows}
          <small>Matches and lighters are kept away from children.</small>`);
      },
    };
  },
};
