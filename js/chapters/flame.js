// Chapter 3: the flame takes hold (the match is drawn at 0.105 units per mm; time runs 3× faster).
// The head burns for about a second. In that second it must light the splint.
//   Time for the flare to bring the surface to its lighting point: ρ c (d ÷ 4) ΔT ÷ q″. Bare wood
//   must reach about 350 °C (1.6 s at 60 kW/m²: too slow). Waxed wood needs only about 220 °C, where
//   wax vapour lights (about 1 s). Held head-down the flare also bathes the stick, so it is quicker.
// Then the flame travels along the stick: speed = 4 q″ δ ÷ (ρ c d ΔT) (see match.js).
//   head up (flame above the unburnt wood): about 0.9 mm/s, a 20 W flame, and in this model it dies
//   once past the wax when the head is raised more than 60°;
//   level: about 1.9 mm/s, 40 W;  head down (flame lies along the wood): about 4.8 mm/s, 100 W.
// These are teaching numbers from textbook orders of magnitude, not measurements on a match.
// Flame: a diffusion flame of wood gas and wax vapour, as in DiyaClear (yellow zone about 1,200 °C);
// CombustionClear has the chemistry. Char is the carbon left when the gas has gone.
// Afterglow: untreated char smoulders (AgarbattiClear: embers at 610 to 640 °C). Splints are soaked in
// a fire-retardant salt (ammonium phosphate) so the ember dies at once.
import { THREE } from '../kit.js';
import {
  makeMatch, makeFlame, sparks, spread, SPREAD, MATCH, WOOD, WAX, COL, VIEW, TALL, BW, BH, B1, B2,
  board, panelBg, title, axes, line, dot, bars, flowArrow, fitNarrow, reelBoards, rng, link, ro, fmtW, fmtS, hex, clamp, lerp, smooth,
} from '../match.js';

const SC = 0.105, PIV = [-0.6, 2.35], FAST = 3, GRIP = 12;
const tiltName = (t) => (t <= -60 ? 'head down' : t < -15 ? 'head tilted down' : t <= 15 ? 'level' : t < 60 ? 'head tilted up' : 'head up');

export default {
  id: 'flame',
  short: 'The flame takes hold',
  title: 'The flame takes hold',
  subtitle: 'A one-second flare, a film of wax, and a flame that climbs but will not creep down.',
  view: VIEW,
  learn: `<p>The head burns out in about <b>one second</b>. A match is only useful if, in that second, the flame moves onto the stick.</p>
    <p><b>Why the wax.</b> Wood does not burn as a solid. Heat must first break it down into gas, and the surface has to reach about 350 °C before it gives off enough. This breaking-down by heat is called <b>pyrolysis</b>. The head's flare is too short to do that to bare wood: our sum says about 1.6 seconds. So the first centimetre is soaked in <b>paraffin wax</b>. Wax melts at about 55 °C and its vapour lights near 200 °C, in about a second. The little wax flame then heats the wood behind it, exactly like a candle with a wooden wick.</p>
    <p><b>What burns.</b> Hot wood gives off gas, the gas burns in a yellow flame, and black <b>char</b>, mostly carbon, is left behind. The flame is the same kind as a candle's or a diya's: see ${link('diyaclear', 'DiyaClear', 'flame')} for its zones and ${link('combustionclear', 'CombustionClear')} for the chemistry. One splint holds about 1.1 kJ.</p>
    <p><b>Head down, it races.</b> Hot gas rises (<b>buoyancy</b>). Hold the match head-down and the flame lies along the unburnt wood above it, bathing about 15 mm of it. In our model the flame travels at nearly 5 mm a second and reaches your fingers in about 6 seconds. That is why a match held that way burns you.</p>
    <p><b>Head up, it creeps.</b> Now the flame stands above the wood and its heat rises away. Only a millimetre or two of wood at the base is heated. The flame crawls down at under 1 mm a second, shrinks, and often goes out. Level is in between. These speeds are a simple model: heat reaching the wood, divided by the heat a slice of wood needs.</p>
    <p><b>The afterglow.</b> Blow out an untreated stick and the char keeps glowing: a slow, flameless <b>smoulder</b> (see ${link('agarbatticlear', 'AgarbattiClear', 'smoulder')}) at over 600 °C. Dropped in a bin, that ember can start a fire. So match splints are soaked in a fire-retardant salt that makes the ember die at once. Even so: a used match goes in the bin only when it is cold.</p>
    <p class="tip"><b>Try it:</b> light a match level, then tilt it head-down and watch the flame run. Tilt it head-up and it creeps and dies. Switch the wax off, and try the afterglow with and without the treatment.</p>`,
  terms: [
    { t: 'Pyrolysis', d: 'Heat breaking a solid such as wood into gases and char, with no burning yet. The gases are what burn.' },
    { t: 'Char', d: 'The black, carbon-rich solid left when wood has given off its gases.' },
    { t: 'Buoyancy', d: 'The upward push on hot, light gas. It makes flames point up and carries their heat upward.' },
    { t: 'Flame spread', d: 'How fast a flame travels along a fuel. It depends on how much heat reaches the unburnt part.' },
    { t: 'Afterglow', d: 'Char that keeps glowing and smouldering after the flame is out.' },
    { t: 'Fire retardant', d: 'A chemical that makes a material harder to burn. In a splint it stops the ember glowing.' },
  ],
  defaults: { tilt: 0, wax: true, treated: true },
  controls: [
    { key: 'tilt', type: 'range', label: 'Tilt the match', min: -90, max: 90, step: 5, ends: ['head down', 'head up'], fmt: (v) => `${tiltName(v)} (${v > 0 ? '+' : ''}${v}°)`, hint: 'In this model a match raised more than 60° goes out once the flame is past the wax. A real one often does.' },
    { key: 'wax', type: 'toggle', label: 'Splint dipped in wax' },
    { key: 'treated', type: 'toggle', label: 'Splint treated against afterglow' },
    { key: 'act', type: 'buttons', label: 'The match', items: [{ label: 'Light a new one', act: (s, inst) => inst.light?.() }, { label: 'Blow it out', act: (s, inst) => inst.blow?.() }] },
  ],
  quiz: [
    { q: 'Why does a match held head-down burn your fingers so quickly?', options: ['The head is heavier', 'Hot gas rises, so the flame lies along the unburnt wood above it and heats a long stretch', 'Gravity pulls the flame down', 'The wax runs down'], answer: 1, why: 'Buoyancy carries the flame up along the stick. A long stretch of wood is preheated, so the flame travels several times faster.' },
    { q: 'What is the paraffin wax on a match for?', options: ['To make the stick waterproof only', 'To carry the flame from the one-second head flare onto the wood', 'To colour the wood', 'To stop the afterglow'], answer: 1, why: 'Wax vapour lights at a much lower temperature than wood. It catches within the short flare and then heats the wood.' },
    { q: 'Why are match splints treated so that they do not glow after the flame is out?', options: ['So a thrown-away match cannot start a fire from a hidden ember', 'To make them burn brighter', 'To make them cheaper', 'To help them light when wet'], answer: 0, why: 'Untreated char smoulders at over 600 °C with no flame. The treatment makes the ember die at once.' },
  ],
  reel: [
    { ms: 5600, caption: 'The head burns for one second. A film of wax catches in that time and hands the flame to the wood.', set: { tilt: 0, wax: true, treated: true }, act: (s, inst) => inst.light?.(), view: TALL, spin: 0 },
    { ms: 6000, caption: 'Tilt it head-down and the flame climbs the stick about five times faster: hot gas rises.', set: { wax: true, treated: true }, act: (s, inst) => inst.light?.(), anim: { tilt: [60, -90] }, view: TALL, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const rnd = rng(17);
    const G = new THREE.Group(); G.position.set(PIV[0], PIV[1], 0); root.add(G);
    const match = makeMatch(G, { scale: SC }); match.g.position.x = (-MATCH.L * SC) / 2;
    const flame = makeFlame(root), smoke = sparks(root, 40, 0.09, rnd, 0x8a8f99), gas = sparks(root, 40, 0.035, rnd, 0xffd27a);
    smoke.mesh.material.blending = THREE.NormalBlending; smoke.mesh.material.opacity = 0.45;
    const up = flowArrow(hex(COL.hot), 0.045, 0.24); root.add(up);
    const grip = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.5, 8, 24), new THREE.MeshBasicMaterial({ color: 0x6fb6ff, toneMapped: false })); grip.rotation.y = Math.PI / 2; grip.position.x = GRIP / 2; match.g.add(grip);
    const lGrip = stage.label('fingers hold here', [GRIP / 2, -7, 0], match.g), lState = stage.label('', [PIV[0], -0.4, 1], root, 'hot'), lUp = stage.label('hot gas rises', [0, 0, 0], root);
    let S = { tilt: 0, wax: true, treated: true }, key = '', ph = 'flare', t = 0, burnt = 0, glow = 0, why = '', hold = 0, hist = [];
    const light = () => { ph = 'flare'; t = 0; burnt = 0; glow = 0; why = ''; hold = 0; hist = []; smoke.clear(); };
    const out = (w) => { if (ph === 'out') return; ph = 'out'; why = w; hold = 0; glow = burnt > 1 ? 1 : 0; };
    const front = (b) => { const a = (S.tilt * Math.PI) / 180, x = (MATCH.L / 2 - MATCH.headL * 0.5 - b) * SC; return [PIV[0] + x * Math.cos(a), PIV[1] + x * Math.sin(a)]; };

    const bA = board(root, BW, BH, 632, 364, (g, w, h) => {
      const r = spread(S.tilt, S);
      panelBg(g, w, h); title(g, 'How fast the flame travels', 'model: heat in ÷ heat needed');
      const a = axes(g, w, h, { xMin: -90, xMax: 90, yMax: 5, xTicks: [-90, -45, 0, 45, 90], yTicks: [0, 1, 2, 3, 4, 5], xFmt: (v) => (v === -90 ? 'head down' : v === 90 ? 'up' : v === 0 ? 'level' : v + '°'), yFmt: (v) => v + ' mm/s', y1: 62 });
      g.fillStyle = 'rgba(255,93,93,.13)'; g.fillRect(a.X(60), a.y1, a.x1 - a.X(60), a.y0 - a.y1);
      g.font = '15px sans-serif'; g.fillStyle = COL.bad; g.fillText('creeps, then dies', a.X(60) - 16, a.y1 + 20);
      const pts = []; for (let d = -90; d <= 90; d += 5) pts.push([d, spread(d).mmps]);
      line(g, pts, a.X, a.Y, COL.heat, 5);
      dot(g, a.X(S.tilt), a.Y(r.mmps), COL.hot, 10);
      g.font = 'bold 19px sans-serif'; g.fillStyle = COL.text; g.fillText(`${r.mmps.toFixed(1)} mm/s · a ${fmtW(r.W)} flame`, a.X(-20), a.y1 + 50);
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h); title(g, 'Does the one-second flare light the stick?', '');
      const rw = spread(S.tilt, { wax: true }), rb = spread(S.tilt, { wax: false });
      bars(g, [
        { label: 'The head burns for', value: SPREAD.flare, color: COL.heat, text: SPREAD.flare.toFixed(1) + ' s' },
        { label: `Waxed wood (${WAX.Tig} °C)`, value: rw.tCatch, color: rw.catches ? COL.ok : COL.bad, text: rw.tCatch.toFixed(2) + ' s: ' + (rw.catches ? 'catches' : 'too slow') },
        { label: `Bare wood (${WOOD.Tig} °C)`, value: rb.tCatch, color: rb.catches ? COL.ok : COL.bad, text: rb.tCatch.toFixed(2) + ' s: ' + (rb.catches ? 'catches' : 'too slow') },
      ], { y: 70, w, rowH: 62, labelW: 250, max: 2.4 });
      g.font = '17px sans-serif'; g.fillStyle = 'rgba(255,255,255,.75)';
      g.fillText('Time for the flare to bring the surface to its lighting point,', 20, 290); g.fillText(`with the match ${tiltName(S.tilt)}. Shorter than the flare: the stick catches.`, 20, 314);
      g.fillStyle = S.wax ? COL.ok : COL.smoke; g.font = 'bold 17px sans-serif'; g.fillText(S.wax ? 'This match is waxed.' : 'This match has no wax.', 20, 344);
    }, B2);

    return {
      light, blow() { out('blown out'); },
      update(dt, s) {
        dt = Math.max(0, Math.min(dt, 0.05)); S = s;
        const narrow = fitNarrow(stage, [lUp, lGrip]); reelBoards([bA, bB], -0.4, stage, VIEW);
        const k = `${s.tilt}|${s.wax}`; if (k !== key) { key = k; bA.redraw(); bB.redraw(); }
        const r = spread(s.tilt, s), sd = dt * FAST, a = (s.tilt * Math.PI) / 180;
        G.rotation.z = a; match.wax.visible = s.wax && burnt < 1; match.waxMat.opacity = 0.5;
        t += sd;
        const maxB = MATCH.L - MATCH.headL - GRIP;
        if (ph === 'flare' && t >= SPREAD.flare) { if (r.catches) ph = 'burn'; else out(s.wax ? 'the flare missed the stick' : 'no wax: the flare ended before the wood caught'); }
        else if (ph === 'burn') {
          burnt += r.mmps * sd;
          if (r.dies && burnt > MATCH.wax) out('head up: the flame crept down, shrank and died');
          else if (burnt >= maxB) out('the flame reached your fingers');
        } else if (ph === 'out') { hold += dt; glow = s.treated ? Math.max(0, glow - dt * 4) : Math.max(0, glow - dt / 9); if (hold > (s.treated ? 3.2 : 7)) light(); }
        const on = ph === 'flare' || ph === 'burn', flareK = ph === 'flare' ? clamp(1 - Math.abs(t - 0.5) / 0.5, 0, 1) : 0;
        match.setBurn(burnt, glow, ph === 'flare' ? t : 1);
        match.headMat.emissiveIntensity = flareK * 2;
        const [fx, fy] = front(ph === 'flare' ? -MATCH.headL * 0.4 : burnt);
        const hT = ph === 'flare' ? 1.5 + flareK : 0.45 + r.W / 48, wT = ph === 'flare' ? 0.42 + 0.3 * flareK : 0.26 + r.W / 400;
        flame.g.position.set(fx, fy - 0.08, 0);
        flame.set({ h: on ? hT * (1 + 0.05 * Math.sin(t * 9) + 0.03 * Math.sin(t * 23)) : 0, w: wT, on: on ? 1 : 0, flare: flareK, lean: 0.04 * Math.sin(t * 2.3) });
        gas.step(dt, on ? 30 : 0, () => [fx + (rnd() - 0.5) * 0.15, fy + rnd() * 0.3, (rnd() - 0.5) * 0.15], () => [(rnd() - 0.5) * 0.3, 1.6 + rnd(), (rnd() - 0.5) * 0.3], 0.4);
        smoke.step(dt, ph === 'out' && (glow > 0.05 || hold < 1.2) ? 9 : 0, () => [fx + (rnd() - 0.5) * 0.1, fy + 0.1, 0], () => [(rnd() - 0.5) * 0.25, 0.7 + rnd() * 0.4, (rnd() - 0.5) * 0.2], 2.2);
        up.aim([fx + 0.55, fy + hT + 0.2, 0], [0, 1, 0], on ? 0.9 : 0); lUp.position.set(fx + 1.45, fy + hT + 0.7, 0); lUp.visible = on && !narrow;
        const st = ph === 'flare' ? ['The head flares: about one second', COL.heat] : ph === 'burn' ? [`Burning ${tiltName(s.tilt)}: ${r.mmps.toFixed(1)} mm/s`, COL.hot] : glow > 0.05 ? ['Out, but the char still glows', COL.bad] : [`Out: ${why}`, COL.smoke];
        lState.element.innerHTML = `<b>${st[0]}</b>`; lState.element.style.setProperty('--c', st[1]);
      },
      readout: (s) => {
        const r = spread(s.tilt, s);
        return ro(`<div class="big" style="color:${ph === 'out' ? (glow > 0.05 ? COL.bad : COL.smoke) : COL.heat}">${ph === 'flare' ? 'The head flares' : ph === 'burn' ? 'The stick is burning' : glow > 0.05 ? 'Afterglow: an ember' : 'Out'}</div>
          <div class="row"><span>Match held</span><b>${tiltName(s.tilt)}</b></div>
          <div class="row"><span>Flame travels at</span><b style="color:${COL.heat}">${r.mmps.toFixed(1)} mm/s</b></div>
          <div class="row"><span>Flame power</span><b>about ${fmtW(r.W)}</b></div>
          <div class="row"><span>Reaches your fingers in</span><b>${r.dies ? 'it dies first' : 'about ' + fmtS(r.toFingers)}</b></div>
          <div class="row"><span>Flare lights the stick?</span><b style="color:${r.catches ? COL.ok : COL.bad}">${r.catches ? 'yes' : 'no'}: needs ${r.tCatch.toFixed(2)} s of the 1 s flare</b></div>
          <div class="row"><span>Ember after the flame</span><b>${s.treated ? 'dies at once (treated)' : 'glows on, over 600 °C'}</b></div>
          <small>${ph === 'out' ? why.charAt(0).toUpperCase() + why.slice(1) + '. ' : ''}A simple model with stated constants, not a measurement. Time is shown 3× faster.</small>`);
      },
    };
  },
};
