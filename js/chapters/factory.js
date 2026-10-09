// Chapter 4: the factory. A schematic of how matches are made, at textbook level: the steps and the
// machines, with no compositions (see the safety rule at the top of match.js).
// Sources
//  - FAO case study of the safety match industry in India (J.C. Tandon): logs are peeled into veneer
//    and chopped into splints; in the handmade sector splints are fitted by hand into wooden frames of
//    50 laths with 50 grooves each (2,500 splints: 50 boxes of 50); frames are dipped in wax, then in
//    the head mixture, and air-dried on racks, which is why the dry climate of southern Tamil Nadu
//    matters; boxes are filled 50 to a box and the striking mixture is painted on the side; a case is
//    7,200 boxes. Shares of India's production in the study (mid-1980s): the one fully mechanised
//    company about 18 %, small handmade factories about 67 %, cottage units about 15 %; workers about
//    6,000, 195,000 and 50,000. The study also records low wages and child labour (see chapter 5).
//  - Continuous match machines carry the splints in an endless belt of perforated plates through the
//    wax, the head dip and a long drying loop, then push them out into boxes. Makers quote of the
//    order of one to two and a half million matches an hour for a modern line (maker's figures, read
//    in summaries only: treated here as "about 2 million").
//  - WIMCO (Western India Match Company, part of Swedish Match) was incorporated in 1923 and began
//    work in 1924 (Science History Institute; FAO). Sivakasi's first matchworks: 1923, by the cousins
//    P. Ayya Nadar and A. Shanmuga Nadar after training in Calcutta (Science History Institute).
import { THREE, M, box, beam, swarm } from '../kit.js';
import {
  MATCH, COL, VIEW, TALL, BW, BH, B1, B2, board, panelBg, title, bars, wrap, sparks, fitNarrow, reelBoards, rng, ro, inReel, fmt0, hex, clamp, lerp, smooth, TAU,
} from '../match.js';

const FRAME = 50 * 50, CASE = 7200;
const STEPS = [
  ['Peel', 'a log turns against a long knife and unrolls into veneer as thick as a match'],
  ['Chop', 'the veneer is cut into splints, then soaked against afterglow and dried'],
  ['Hold', 'splints are gripped in rows: by an endless belt of plates, or by hand in a frame'],
  ['Wax', 'the tips pass through a bath of melted paraffin'],
  ['Head', 'the tips are dipped in the head mixture: one dip, a bulb on every stick'],
  ['Dry', 'a long slow loop in warm air, or racks in the dry open air'],
  ['Box', 'matches are pushed out into trays; the striking strip is painted on the box'],
];
// The belt's path (x, y), a closed loop.
const PATH = [[-1.0, 2.15], [-0.25, 2.15], [0.15, 1.85], [0.55, 2.15], [1.05, 2.15], [1.45, 1.85], [1.85, 2.15], [2.9, 2.15], [2.9, 3.0], [-1.0, 3.0], [-1.0, 3.8], [2.9, 3.8], [2.9, 4.6], [-0.2, 4.6], [-0.2, 5.25], [3.45, 5.25], [3.45, 1.15], [3.2, 0.95], [-1.0, 0.95]];
const SEG = PATH.map((p, i) => { const q = PATH[(i + 1) % PATH.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
const TOTAL = SEG.reduce((a, b) => a + b, 0);
function at(u) {
  let d = (((u % 1) + 1) % 1) * TOTAL;
  for (let i = 0; i < PATH.length; i++) { if (d <= SEG[i]) { const p = PATH[i], q = PATH[(i + 1) % PATH.length], k = d / SEG[i]; return [lerp(p[0], q[0], k), lerp(p[1], q[1], k), i]; } d -= SEG[i]; }
  return [...PATH[0], 0];
}
const uOf = (i) => SEG.slice(0, i).reduce((a, b) => a + b, 0) / TOTAL;
const U_WAX = uOf(2), U_HEAD = uOf(5), U_OUT = uOf(16) + 0.6 * (SEG[16] / TOTAL);

export default {
  id: 'factory',
  short: 'The factory',
  title: 'From a log to a box of fifty',
  subtitle: 'Peel, chop, dip, dry, box: by an endless machine, or frame by frame by hand.',
  view: VIEW,
  learn: `<p>A match costs a few paise. Making it that cheaply is a feat of its own.</p>
    <p><b>Peel and chop.</b> A log is spun against a long knife and unrolls like a ribbon of paper into <b>veneer</b>, exactly as thick as a match. A chopper slices the ribbon into <b>splints</b>, hundreds a second in a big plant. The splints are soaked in the salt that stops afterglow, dried and tumbled smooth. The thin card or veneer of the box is made the same way.</p>
    <p><b>The continuous machine.</b> In a mechanised factory the splints are punched into holes in an <b>endless belt of steel plates</b>, standing out like bristles. The belt carries them tips-down through a bath of <b>melted wax</b>, then through the <b>head dip</b>, where each tip picks up a bulb of the head mixture. Then comes a long, slow loop through warm air to <b>dry</b>. At the end the matches are pushed out straight into boxes, and the strip is printed on the box sides. A modern line makes of the order of two million matches an hour.</p>
    <p><b>By hand, in frames.</b> In India most matches have been made another way. Workers fit splints into a wooden <b>frame</b>: 50 slats with 50 grooves each, so 2,500 sticks, enough for 50 boxes. The whole frame is dipped in wax, then in the head mixture, and set on racks to dry in the open air. That is one reason the industry grew at <b>Sivakasi</b>, Kovilpatti and Sattur in southern Tamil Nadu: the air is dry for most of the year.</p>
    <p><b>Sivakasi.</b> In 1922 two cousins from the town, <b>P. Ayya Nadar</b> and <b>A. Shanmuga Nadar</b>, went to Calcutta to learn match-making. They opened Sivakasi's first matchworks in 1923. In the same years the Swedish-owned <b>WIMCO</b> built India's mechanised factories. An FAO study of the mid-1980s found the single mechanised company made about 18% of India's matches with about 6,000 workers, while handmade units made the rest with about 245,000. Since then many units have added machines. The price of a box stayed at one rupee from 2007 until December 2021, when it went to two rupees, with 50 sticks in place of 36.</p>
    <p>Cheap matches have had a human price. That is the next chapter.</p>
    <p class="tip"><b>Try it:</b> follow one splint round the belt: bare, waxed, headed, dried, boxed. Then switch to "By hand" and see how many frames it takes to match one hour of the machine.</p>`,
  terms: [
    { t: 'Veneer', d: 'A thin continuous sheet of wood peeled from a turning log.' },
    { t: 'Splint', d: 'One match stick, chopped from veneer.' },
    { t: 'Continuous match machine', d: 'A machine that carries splints on an endless belt through waxing, dipping and drying, then boxes them.' },
    { t: 'Frame', d: 'A wooden rack of 50 slats with 50 grooves each, holding 2,500 splints for dipping by hand.' },
    { t: 'Dipping', d: 'Lowering the splint tips into the head mixture so that each picks up a bulb.' },
    { t: 'Gross and case', d: 'A gross is 144 boxes. A case in the Indian trade is 7,200 boxes: 50 gross.' },
  ],
  defaults: { how: 'machine', mph: 2, frames: 8 },
  controls: [
    { key: 'how', type: 'seg', label: 'How they are made', options: [{ v: 'machine', label: 'Continuous machine' }, { v: 'hand', label: 'By hand, in frames' }] },
    { key: 'mph', type: 'range', label: 'Machine: matches an hour', min: 0.2, max: 2.5, step: 0.1, ends: ['0.2 million', '2.5 million'], fmt: (v) => v.toFixed(1) + ' million' },
    { key: 'frames', type: 'range', label: 'By hand: frames dipped', min: 1, max: 144, step: 1, ends: ['1 frame', '144: one case'], fmt: (v) => v + (v === 1 ? ' frame' : ' frames') },
  ],
  onChange(s, key) { if (key === 'mph') s.how = 'machine'; if (key === 'frames') s.how = 'hand'; },
  quiz: [
    { q: 'How does a factory get thousands of identical sticks from a log?', options: ['It saws each one separately', 'It peels the log into a thin ribbon of veneer and chops the ribbon', 'It grinds the log and presses the dust', 'It splits the log with wedges'], answer: 1, why: 'A turning log unrolls into veneer as thick as a match, and a chopper slices it into splints.' },
    { q: 'A hand-dipping frame has 50 slats with 50 grooves each. How many boxes of 50 does one frame fill?', options: ['5', '25', '50', '2,500'], answer: 2, why: '50 × 50 = 2,500 splints, and 2,500 ÷ 50 = 50 boxes.' },
    { q: 'Why did hand match-making settle around Sivakasi?', options: ['It has the tallest trees', 'Its dry air lets dipped matches dry on open racks for most of the year', 'It is beside the sea', 'It is the coldest part of India'], answer: 1, why: 'Hand-dipped frames are air-dried, so a long dry season matters. Low wages mattered too, as the next chapter says.' },
  ],
  reel: [
    { ms: 5600, caption: 'A log is peeled like a ribbon and chopped. A belt dips each tip in wax, then in the head mixture.', set: { how: 'machine' }, anim: { mph: [0.6, 2.5] }, view: TALL, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root); const mdl = new THREE.Group(); root.add(mdl);
    const rnd = rng(31);
    // ---- peel and chop
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.6, 28), M.matte(0xb98a5a)); log.rotation.x = Math.PI / 2; log.position.set(-2.9, 1.2, 0); mdl.add(log);
    const rings = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 6, 24), M.matte(0x8a6238)); rings.position.set(-2.9, 1.2, 0.81); mdl.add(rings);
    const knife = box(0.08, 0.5, 1.7, M.metal(0xc9ced8)); knife.position.set(-2.38, 0.95, 0); knife.rotation.z = 0.5; mdl.add(knife);
    const ven = box(1.0, 0.03, 1.5, M.matte(0xe6cfa3)); ven.position.set(-1.9, 0.68, 0); mdl.add(ven);
    const chop = box(0.07, 0.6, 1.6, M.metal(0xdfe3ea)); mdl.add(chop);
    const stand = box(1.9, 0.5, 1.9, M.matte(0x2b3039)); stand.position.set(-2.3, 0.25, 0); mdl.add(stand);
    const loose = swarm(26, new THREE.BoxGeometry(0.035, 0.035, 0.36), M.matte(0xe6cfa3)); mdl.add(loose);
    // ---- baths
    const tray = (x, col, name, c) => { const t = box(0.62, 0.22, 1.2, M.matte(0x3a3f4b)); t.position.set(x, 1.5, 0); mdl.add(t); const l = box(0.54, 0.04, 1.1, new THREE.MeshStandardMaterial({ color: col, roughness: 0.2 })); l.position.set(x, 1.61, 0); mdl.add(l); const lb = stage.label(name, [x, 1.2, 0.9], root, 'hot'); lb.element.style.setProperty('--c', c); return lb; };
    const lWax = tray(0.15, 0xf6e7b0, 'wax bath', COL.oil), lHead = tray(1.45, 0x9c2f28, 'head dip', COL.hot);
    // ---- the belt and its splints
    const beltG = new THREE.Group(); mdl.add(beltG);
    PATH.forEach((p, i) => { const q = PATH[(i + 1) % PATH.length]; beltG.add(beam([p[0], p[1], -0.62], [q[0], q[1], -0.62], 0.03, M.metal(0x6a707c), 6)); });
    const N = 150, rods = swarm(N, new THREE.BoxGeometry(0.035, 0.34, 0.035), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })), heads = swarm(N, new THREE.SphereGeometry(0.045, 8, 6), M.matte(0xa8322a));
    beltG.add(rods, heads); rods.castShadow = heads.castShadow = false;
    const cWood = new THREE.Color(0xe6cfa3), cWaxed = new THREE.Color(0xfff0c0);
    // ---- boxes on a conveyor (plain, no labels)
    const conv = box(0.7, 0.08, 3.0, M.matte(0x2b3039)); conv.position.set(3.45, 0.42, 0.6); mdl.add(conv);
    const bx = swarm(6, new THREE.BoxGeometry(0.55, 0.16, 0.38), M.matte(0x5b6f8f)); mdl.add(bx);
    // ---- by hand: a frame
    const frameG = new THREE.Group(); mdl.add(frameG);
    const fr = box(1.5, 0.08, 1.2, M.matte(0x8a6238)); frameG.add(fr);
    const fRods = swarm(120, new THREE.BoxGeometry(0.03, 0.34, 0.03), M.matte(0xe6cfa3)), fHeads = swarm(120, new THREE.SphereGeometry(0.04, 8, 6), M.matte(0xa8322a)); frameG.add(fRods, fHeads);
    const rack = new THREE.Group(); mdl.add(rack);
    for (let i = 0; i < 4; i++) { const sh = box(1.7, 0.05, 1.3, M.matte(0x4a3a2a)); sh.position.set(2.6, 2.6 + i * 0.75, 0); rack.add(sh); }
    rack.add(beam([1.8, 0, -0.6], [1.8, 5.3, -0.6], 0.04, M.matte(0x4a3a2a), 6), beam([3.4, 0, -0.6], [3.4, 5.3, -0.6], 0.04, M.matte(0x4a3a2a), 6));
    const dried = swarm(4 * 60, new THREE.BoxGeometry(0.03, 0.3, 0.03), M.matte(0xe6cfa3)); rack.add(dried);
    const driedH = swarm(4 * 60, new THREE.SphereGeometry(0.04, 6, 4), M.matte(0xa8322a)); rack.add(driedH);
    for (let i = 0; i < 240; i++) { const sh = Math.floor(i / 60), j = i % 60, x = 1.95 + (j % 12) * 0.12, z = -0.45 + Math.floor(j / 12) * 0.22, y = 2.62 + sh * 0.75; dried.place(i, [x, y - 0.17, z]); driedH.place(i, [x, y - 0.34, z]); }
    dried.done(); driedH.done();
    const lPeel = stage.label('peel: log → veneer', [-2.9, 2.0, 0], root), lChop = stage.label('chop → splints', [-1.5, 0.25, 0.9], root);
    const lDry = stage.label('', [1.0, 5.6, 0], root), lBox = stage.label('pushed out into boxes', [3.3, 0.05, 1.6], root), lHow = stage.label('', [-1.3, 2.75, 0.8], root, 'hot');
    lHow.element.style.setProperty('--c', COL.cold);
    let S = { how: 'machine', mph: 2, frames: 8 }, key = '', u0 = 0, tt = 0, ft = 0;

    const bA = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h); title(g, 'Seven steps', S.how === 'machine' ? 'on one endless machine' : 'the same steps, by hand');
      STEPS.forEach(([n, d], i) => {
        const y = 60 + i * 43;
        g.fillStyle = COL.heat; g.font = 'bold 18px sans-serif'; g.fillText(`${i + 1}. ${n}`, 20, y + 16);
        g.fillStyle = 'rgba(255,255,255,.78)'; g.font = '15px sans-serif'; wrap(g, d, 120, y + 8, w - 140, 17);
      });
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h); title(g, 'Who made India\'s matches', 'FAO study, mid-1980s');
      g.font = '16px sans-serif'; g.fillStyle = 'rgba(255,255,255,.65)'; g.fillText('share of production', 20, 62);
      bars(g, [{ label: 'Mechanised (one company)', value: 18, color: COL.cold, text: '18 %' }, { label: 'Small handmade factories', value: 67, color: COL.heat, text: '67 %' }, { label: 'Cottage units', value: 15, color: COL.violet, text: '15 %' }], { y: 68, w, rowH: 40, labelW: 262, max: 80, font: 17 });
      g.font = '16px sans-serif'; g.fillStyle = 'rgba(255,255,255,.65)'; g.fillText('workers', 20, 212);
      bars(g, [{ label: 'Mechanised', value: 6000, color: COL.cold, text: 'about 6,000' }, { label: 'Small handmade factories', value: 195000, color: COL.heat, text: 'about 1,95,000' }, { label: 'Cottage units', value: 50000, color: COL.violet, text: 'about 50,000' }], { y: 218, w, rowH: 40, labelW: 262, max: 240000, font: 17 });
      g.font = '14px sans-serif'; g.fillStyle = 'rgba(255,255,255,.55)'; g.fillText('18 % of the matches from 2 % of the workers: that is what a machine does.', 20, 352);
    }, B2);

    return {
      update(dt, s, time) {
        dt = Math.max(0, Math.min(dt, 0.05)); S = s; tt += dt;
        fitNarrow(stage, [lPeel, lChop, lBox, lDry, lHow]); reelBoards([bA, bB], -0.4, stage, VIEW);
        const rl = inReel() && stage.camera.aspect < 0.8; mdl.position.x = rl ? -0.65 : 0; mdl.scale.setScalar(rl ? 0.9 : 1);
        if (s.how !== key) { key = s.how; bA.redraw(); }
        const mach = s.how === 'machine', sp = mach ? 0.25 + s.mph / 2.5 : 0.5;
        log.rotation.y += dt * 2.2 * sp; chop.position.set(-1.38, 0.95 + 0.22 * Math.abs(Math.sin(tt * 9 * sp)), 0);
        for (let i = 0; i < 26; i++) { const k = (i / 26 + tt * 0.35 * sp) % 1; loose.place(i, [-1.3 + k * 0.5, 0.85 - k * k * 0.5 + (mach ? k * 1.3 : 0), -0.6 + ((i * 7) % 13) * 0.1], [0, 0, k * 6]); }
        loose.done();
        beltG.visible = mach; conv.visible = mach; bx.visible = mach; lBox.visible = lBox.visible && mach; frameG.visible = !mach; rack.visible = !mach;
        lDry.element.innerHTML = mach ? 'the long drying loop' : 'drying racks in the open air'; lDry.position.set(mach ? 1.0 : 2.6, 5.6, 0);
        lHow.element.innerHTML = mach ? 'an endless belt of plates grips the splints' : 'a frame: 50 slats × 50 grooves = 2,500 splints';
        if (mach) {
          u0 = (u0 + dt * 0.035 * sp) % 1;
          for (let i = 0; i < N; i++) {
            const u = (i / N + u0) % 1, [x, y] = at(u), gone = u > U_OUT;
            rods.place(i, [x, gone ? -99 : y - 0.17, -0.5 + (i % 5) * 0.25]); rods.setColorAt(i, u > U_WAX ? cWaxed : cWood);
            heads.place(i, [x, gone || u < U_HEAD ? -99 : y - 0.34, -0.5 + (i % 5) * 0.25]);
          }
          rods.done(); heads.done(); if (rods.instanceColor) rods.instanceColor.needsUpdate = true;
          for (let i = 0; i < 6; i++) { const k = (i / 6 + tt * 0.12 * sp) % 1; bx.place(i, [3.45, 0.55, -0.7 + k * 2.7]); }
          bx.done();
        } else {
          // one frame: filled, waxed, headed, racked (an 8 s loop)
          ft = (ft + dt / 8) % 1;
          const K = [[0, -1.0, 2.6], [0.18, 0.15, 2.6], [0.26, 0.15, 2.0], [0.34, 0.15, 2.6], [0.46, 1.45, 2.6], [0.54, 1.45, 2.0], [0.62, 1.45, 2.6], [0.85, 2.6, 2.05], [1, 2.6, 2.05]];
          let j = 0; while (j < K.length - 2 && ft > K[j + 1][0]) j++;
          const k = smooth((ft - K[j][0]) / (K[j + 1][0] - K[j][0]));
          frameG.position.set(lerp(K[j][1], K[j + 1][1], k), lerp(K[j][2], K[j + 1][2], k), 0);
          const fill = clamp(ft / 0.16, 0, 1), headed = ft > 0.54, waxed = ft > 0.26;
          fRods.material.color.set(waxed ? 0xfff0c0 : 0xe6cfa3);
          for (let i = 0; i < 120; i++) { const on = i / 120 < fill, x = -0.66 + (i % 12) * 0.12, z = -0.5 + Math.floor(i / 12) * 0.11; fRods.place(i, [x, on ? -0.2 : -99, z]); fHeads.place(i, [x, on && headed ? -0.37 : -99, z]); }
          fRods.done(); fHeads.done();
        }
      },
      readout: (s) => {
        if (s.how === 'machine') {
          const n = s.mph * 1e6;
          return ro(`<div class="big">Continuous machine</div>
            <div class="row"><span>Matches an hour</span><b>${s.mph.toFixed(1)} million</b></div>
            <div class="row"><span>Every second</span><b>${fmt0(n / 3600)} matches</b></div>
            <div class="row"><span>Boxes of ${MATCH.perBox} an hour</span><b>${fmt0(n / MATCH.perBox)}</b></div>
            <div class="row"><span>The same by hand</span><b>${fmt0(n / FRAME)} frames an hour</b></div>
            <div class="row"><span>A case of ${fmt0(CASE)} boxes takes</span><b>${Math.round((CASE * MATCH.perBox) / n * 60)} minutes</b></div>
            <small>Makers quote one to two and a half million matches an hour for a modern line.</small>`);
        }
        const n = s.frames * FRAME;
        return ro(`<div class="big">By hand, in frames</div>
          <div class="row"><span>One frame</span><b>50 slats × 50 grooves = ${fmt0(FRAME)} splints</b></div>
          <div class="row"><span>${s.frames} ${s.frames === 1 ? 'frame' : 'frames'}</span><b>${fmt0(n)} matches</b></div>
          <div class="row"><span>Boxes of ${MATCH.perBox}</span><b>${fmt0(n / MATCH.perBox)} (${(n / MATCH.perBox / 144).toFixed(1)} gross)</b></div>
          <div class="row"><span>Share of one case (${fmt0(CASE)} boxes)</span><b>${((n / MATCH.perBox / CASE) * 100).toFixed(1)} %</b></div>
          <div class="row"><span>A 2-million-an-hour machine does this in</span><b>${(n / 2e6 * 3600).toFixed(0)} s</b></div>
          <small>Every one of those splints is set in its groove by a person. Dipped frames dry on racks in the open air.</small>`);
      },
    };
  },
};
