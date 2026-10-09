// Chapter 1: anatomy of a safety match and its box (built in millimetres, drawn at 0.12 units per mm).
// A typical kitchen match: about 43 mm long, a splint about 2 mm square, a head about 3 mm across,
// 50 to a box (see match.js for sources). The box is generic: plain card, no label, no brand.
// Ingredients are named by their job only (see the safety rule at the top of match.js).
import { THREE } from '../kit.js';
import {
  makeMatch, makeBox, MATCH, BOXMM, splintJ, splintG, T_RED, T_SESQUI, COL, VIEW, TALL, BW, BH, B1, B2,
  board, panelBg, title, wrap, fitNarrow, reelBoards, rng, link, ro, fmtJ, smooth, exploder, TAU,
} from '../match.js';

const SC = 0.14, SB = 0.09;
const JOBS = [
  ['Oxidiser', 'carries oxygen locked in a solid, so the head can burn fast (potassium chlorate)', '#f4f1e6'],
  ['Fuel', 'a little of something that burns easily (sulphur or a sulphide, starch)', '#f2c14e'],
  ['Abrasive', 'powdered glass: grit that makes friction and holds the heat in a spot', '#8ecbff'],
  ['Binder', 'glue that holds the grains together and burns too', '#c98d5c'],
  ['Colour', 'a dye. The red or brown tells you nothing about the chemistry', '#b5382e'],
];
const STRIP = [
  ['Red phosphorus', 'the key: the one ingredient the head is missing', '#ff5d8f'],
  ['Abrasive', 'powdered glass again, for grip and heat', '#8ecbff'],
  ['Binder', 'glue that holds it on the card', '#c98d5c'],
];

export default {
  id: 'anatomy',
  short: 'Anatomy',
  title: 'Anatomy of a safety match',
  subtitle: 'A waxed splint, a head, and a strip on the box. Fire, stored in two halves.',
  view: VIEW,
  learn: `<p>A match is <b>stored fire with a lock on it</b>. Everything needed to make a flame is there, but split between the stick and the box so that nothing happens until you bring them together.</p>
    <p><b>The splint.</b> A stick of light wood about 43 mm long and 2 mm square. Makers in Europe use <b>aspen</b>. Factories in India have used white mutty (<i>Ailanthus</i>), Indian aspen, semul and rubber wood, and many small boxes hold <b>wax matches</b>: a stem of waxed paper instead of wood. The first centimetre behind the head is soaked in <b>paraffin wax</b>, the same wax as a candle. The wood is also treated so that it does not keep glowing after the flame is out.</p>
    <p><b>The head.</b> It is a mix of powders in glue, and each one has a job. An <b>oxidiser</b> carries oxygen in solid form. A little <b>fuel</b> burns with it. <b>Powdered glass</b> gives grip. <b>Glue</b> holds it together. A dye gives the colour. On its own this head is hard to light.</p>
    <p><b>The strip on the box.</b> The rough brown strip holds the missing piece: <b>red phosphorus</b>, with more powdered glass and glue. This is why it is called a <b>safety match</b>. The head and the phosphorus live apart, and the match lights only on its own box.</p>
    <p>A <b>strike-anywhere match</b> puts a phosphorus compound into the tip of the head itself, so any rough, dry surface will do. It is handier and less safe.</p>
    <p>This box names what the ingredients <i>do</i>. It gives no recipe, on purpose. And one rule comes before all the science: <b>matches are kept out of the reach of children</b>.</p>
    <p class="tip"><b>Try it:</b> drag "Take it apart" to pull the head, the wax and the striking strips away. Then switch to a strike-anywhere match and see where the phosphorus has moved to.</p>`,
  terms: [
    { t: 'Splint', d: 'The stick of a match: light wood, or waxed paper in a wax match.' },
    { t: 'Head', d: 'The bulb at the tip: oxidiser, a little fuel, powdered glass and glue.' },
    { t: 'Oxidiser', d: 'A substance that supplies oxygen for burning, so a mixture can burn fast without waiting for air.' },
    { t: 'Striking surface', d: 'The rough strip on the side of the box. In a safety match it holds the red phosphorus.' },
    { t: 'Safety match', d: 'A match whose head will light only on the special strip, because the phosphorus is kept on the box.' },
    { t: 'Strike-anywhere match', d: 'A match with a phosphorus compound in its own tip, so it lights on any rough, dry surface.' },
  ],
  defaults: { explode: 0, type: 'safety' },
  controls: [
    { key: 'explode', type: 'range', label: 'Take it apart', min: 0, max: 1, step: 0.01, ends: ['together', 'apart'], fmt: (v) => Math.round(v * 100) + '%' },
    { key: 'type', type: 'seg', label: 'Kind of match', options: [{ v: 'safety', label: 'Safety match' }, { v: 'anywhere', label: 'Strike-anywhere' }] },
  ],
  quiz: [
    { q: 'Why is a safety match "safe"?', options: ['Its flame is cooler', 'The head and the phosphorus are kept apart: one on the stick, one on the box', 'It is made of wood that cannot burn', 'It contains no chemicals'], answer: 1, why: 'The head lacks one ingredient, red phosphorus, which sits on the striking strip. The match lights only when the two meet.' },
    { q: 'What is the powdered glass in a match head for?', options: ['To make it shine', 'To add weight', 'Grip: it makes friction and concentrates the heat', 'It is the fuel'], answer: 2, why: 'Hard grit raises friction and makes tiny hot spots when the head is rubbed along the strip.' },
    { q: 'What job does the oxidiser do?', options: ['It supplies oxygen from inside the head', 'It colours the head', 'It stops the wood from glowing', 'It makes the box rough'], answer: 0, why: 'An oxidiser carries oxygen locked in a solid, so the head can burn in a flash without waiting for air to reach it.' },
  ],
  reel: [
    { ms: 5200, caption: 'A match is fire stored in two halves: a head on the stick, and the missing key on the box.', set: { type: 'safety' }, anim: { explode: [0, 1] }, view: TALL, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const rnd = rng(7);
    const MX = -3.6, MY = 3.7;
    const match = makeMatch(root, { scale: SC }); match.g.position.set(MX, MY, 0.6);
    const box = makeBox(root, { scale: SB }); box.g.position.set(-1.2, 1.25, 0); box.g.rotation.x = 0.5;
    // labels ride on the parts
    const lSplint = stage.label('splint · light wood, about 2 mm square', [13, -5, 0], match.body);
    const lWax = stage.label('paraffin wax soaked in', [0, 5, 0], match.wax);
    const lHead = stage.label('head', [-3, 5.5, 0], match.head, 'hot'); lHead.element.style.setProperty('--c', COL.hot);
    const lTip = stage.label('', [0, -5, 0], match.tip, 'hot'); lTip.element.style.setProperty('--c', COL.pink);
    const lStrip = stage.label('', [-4, -13, 0], box.strip, 'hot'); lStrip.element.style.setProperty('--c', COL.pink);
    const lTray = stage.label('tray of 50', [20, 10, -6], box.tray);
    const lSleeve = stage.label('plain card sleeve', [-16, 4, 19], box.sleeve);
    const ex = exploder([
      { obj: match.head, off: [9, 0, 0] }, { obj: match.tip, off: [15, 0, 0] }, { obj: match.wax, off: [0, 7, 0] },
      { obj: box.tray, off: [22, 0, 0] }, { obj: box.strips.children[0], off: [0, -2, 9] }, { obj: box.strips.children[1], off: [0, 2, -9] },
    ]);
    let S = { type: 'safety' }, key = '';
    const speck = (g, cx, cy, R, n, cols, seed) => {
      const r = rng(seed);
      for (let i = 0; i < n; i++) { const a = r() * TAU, rr = R * Math.sqrt(r()), c = cols[Math.floor(r() * cols.length)]; g.fillStyle = c; g.beginPath(); g.arc(cx + rr * Math.cos(a), cy + rr * Math.sin(a) * 0.86, 3 + r() * 4, 0, TAU); g.fill(); }
    };
    const rows = (g, list, x, y, w, rh = 60) => {
      list.forEach(([n, d, c], i) => {
        const yy = y + i * rh;
        g.fillStyle = c; g.beginPath(); g.arc(x + 9, yy + 12, 9, 0, TAU); g.fill();
        g.font = 'bold 19px sans-serif'; g.fillStyle = COL.text; g.fillText(n, x + 28, yy + 18);
        g.font = '16px sans-serif'; g.fillStyle = 'rgba(255,255,255,.75)'; wrap(g, d, x + 28, yy + 38, w - 28, 17);
      });
    };
    const bA = board(root, BW, BH, 632, 364, (g, w, h) => {
      const any = S.type === 'anywhere';
      panelBg(g, w, h); title(g, 'Inside the head', 'each powder has a job');
      // a cut head, magnified
      g.fillStyle = '#7a4a34'; g.beginPath(); g.ellipse(100, 200, 78, 96, 0, 0, TAU); g.fill();
      g.save(); g.beginPath(); g.ellipse(100, 200, 74, 92, 0, 0, TAU); g.clip();
      speck(g, 100, 200, 88, 150, ['#f4f1e6', '#f4f1e6', '#f4f1e6', '#f2c14e', '#8ecbff'], 5);
      if (any) { g.fillStyle = 'rgba(20,12,10,.55)'; g.fillRect(0, 96, 200, 60); speck(g, 100, 128, 60, 40, ['#ff5d8f'], 9); }
      g.restore();
      g.strokeStyle = '#b5382e'; g.lineWidth = 7; g.beginPath(); g.ellipse(100, 200, 78, 96, 0, 0, TAU); g.stroke();
      g.fillStyle = '#dcbd8e'; g.fillRect(80, 292, 40, 72);
      if (any) { g.font = 'bold 15px sans-serif'; g.fillStyle = COL.pink; g.fillText('phosphorus compound', 20, 84); g.fillText('in the tip', 20, 100); }
      rows(g, any ? [['Phosphorus compound', 'in the tip: the key now rides on the stick (phosphorus sesquisulphide)', '#ff5d8f'], ...JOBS.slice(0, 4)] : JOBS, 210, 54, w - 230, 62);
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (g, w, h) => {
      const any = S.type === 'anywhere';
      panelBg(g, w, h); title(g, any ? 'On the box: only grit' : 'On the box: the striking strip', any ? 'any rough, dry surface works' : 'the key');
      g.fillStyle = '#3a1c18'; g.fillRect(20, 70, 170, 230);
      g.save(); g.beginPath(); g.rect(20, 70, 170, 230); g.clip();
      for (let i = 0; i < 2; i++) speck(g, 105, 185, 150, 110, any ? ['#8ecbff', '#c98d5c'] : ['#ff5d8f', '#ff5d8f', '#8ecbff', '#c98d5c'], 3 + i);
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.strokeRect(20, 70, 170, 230);
      g.font = '15px sans-serif'; g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText('magnified', 22, 322);
      if (any) {
        g.font = '18px sans-serif'; g.fillStyle = 'rgba(255,255,255,.85)';
        wrap(g, 'A strike-anywhere match carries its own phosphorus compound, so the box needs only a rough patch. The lock and the key travel together. That is why these matches may not be carried on aircraft at all.', 212, 96, w - 232, 26);
      } else {
        rows(g, STRIP, 210, 70, w - 230, 58);
        g.font = '17px sans-serif'; g.fillStyle = 'rgba(255,255,255,.8)';
        wrap(g, 'No phosphorus on the stick. No oxidiser on the box. Apart, each is hard to light.', 212, 262, w - 232, 24);
      }
    }, B2);

    return {
      update(dt, s) {
        dt = Math.max(0, dt); S = s;
        const narrow = fitNarrow(stage, [lSleeve, lTray, lWax]); reelBoards([bA, bB], -0.4, stage, VIEW);
        const any = s.type === 'anywhere';
        ex(s.explode); match.setType(any);
        lTip.visible = any; lTip.element.innerHTML = 'tip · phosphorus compound';
        lHead.element.innerHTML = any ? 'head · oxidiser, fuel, grit, glue' : 'head · oxidiser, fuel, grit, glue: no phosphorus';
        lStrip.element.innerHTML = any ? 'rough strip · grit only' : 'striking strip · red phosphorus + grit';
        box.stripMat.color.setHex(any ? 0x4a4038 : 0x55241f);
        lWax.visible = !narrow && s.explode > 0.3; lSplint.visible = !narrow || s.explode < 0.5;
        if (s.type !== key) { key = s.type; bA.redraw(); bB.redraw(); }
      },
      readout: (s) => {
        const any = s.type === 'anywhere';
        return ro(`<div class="big">${any ? 'Strike-anywhere match' : 'Safety match'}</div>
          <div class="row"><span>The key (phosphorus) is</span><b style="color:${COL.pink}">${any ? 'in the tip of the head' : 'on the box, not the stick'}</b></div>
          <div class="row"><span>Lights on</span><b>${any ? 'any rough, dry surface' : 'its own striking strip'}</b></div>
          <div class="row"><span>The key starts to react at about</span><b>${any ? T_SESQUI : T_RED} °C</b></div>
          <div class="row"><span>Splint</span><b>${MATCH.L} mm long, ${MATCH.d} mm square</b></div>
          <div class="row"><span>Heat in one splint</span><b>${splintG().toFixed(2)} g of wood ≈ ${fmtJ(splintJ())}</b></div>
          <small>The box is ${BOXMM.w} × ${BOXMM.d} × ${BOXMM.h} mm and holds ${MATCH.perBox}. Keep matches away from children.</small>`);
      },
    };
  },
};
