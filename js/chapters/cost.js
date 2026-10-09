// Chapter 5: the human cost and the fix. Three forms of phosphorus, and what they did to people.
// Molecules (Wikipedia, "Allotropes of phosphorus", "Phosphorus sesquisulfide"):
//   white phosphorus: P₄ tetrahedra; catches fire in air at about 30 °C; toxic; its fumes caused
//     "phossy jaw" (phosphorus necrosis of the jaw) in match workers;
//   red phosphorus: the same atoms joined into an amorphous network (drawn as linked, opened P₄
//     units); does not ignite in air below about 240 °C; presented by Anton von Schrötter in 1847;
//   phosphorus sesquisulphide, P₄S₃: a P₄ tetrahedron with sulphur in three of its edges; flash point
//     about 100 °C; shown fit for strike-anywhere matches by Sévène and Cahen, 1898.
// History and law, stated only from sources listed in history.json:
//   Lorinser, Vienna: first case 1839, 22 cases reported 1844 (Wikipedia, "Phossy jaw").
//   Matchgirls' strike, Bryant & May, Bow, London: about 1,400 women and girls out in early July
//     1888; terms agreed 16 July (Wikipedia, "Matchgirls' strike").
//   Bans on white phosphorus matches: Finland 1872, Denmark 1874, France 1897, Switzerland 1898,
//     Netherlands 1901; Berne Convention signed 26 September 1906, in force 1 January 1912; UK Act of
//     1908 in force 1 January 1910; USA: White Phosphorus Match Act signed 9 April 1912 (a tax);
//     India: White Phosphorus Matches Prohibition Act, 1913 (Act 5 of 1913: manufacture and import
//     from 1 July 1913, sale from 1 July 1914); Canada 1914; Japan 1919; China 1925 (Wikipedia, "Match").
//   Supreme Court of India, M.C. Mehta v. State of Tamil Nadu, 10 December 1996 (read in full): as
//     on 31 December 1985 Sivakasi had 221 registered match factories employing 27,338 workers, of
//     whom 2,941 were children (order of 31 October 1990); the Court called making matches and
//     fireworks hazardous; it took up the case again after a fireworks-factory accident in which
//     39 people died; it ordered employers to pay Rs 20,000 for each child employed against the
//     Child Labour (Prohibition and Regulation) Act, 1986, into a Child Labour Rehabilitation-cum-
//     Welfare Fund, and the cost of the child's education to be met.
import { THREE, M, beam, sphere } from '../kit.js';
import {
  makeFlame, BANS, T_WHITE, T_RED, T_SESQUI, COL, VIEW, TALL, BW, BH, B1, B2, board, panelBg, title, wrap, fitNarrow, reelBoards, rng, link, ro, hex, clamp, lerp, smooth,
} from '../match.js';

const KIND = {
  white: { n: 'White phosphorus', f: 'P₄', T: T_WHITE, x: -2.6, tox: 'a strong poison', use: 'heads, about 1831 to the bans', col: '#f4f1e6' },
  red: { n: 'Red phosphorus', f: 'Pₙ', T: T_RED, x: -0.2, tox: 'far less harmful', use: 'the strip of every safety match', col: '#ff5d8f' },
  sesqui: { n: 'Phosphorus sesquisulphide', f: 'P₄S₃', T: T_SESQUI, x: 2.2, tox: 'not a poison like white P', use: 'strike-anywhere tips, from 1898', col: '#f2c14e' },
};
const EVENTS = [[1831, 'White phosphorus goes into match heads (Sauria, France)'], [1839, 'Lorinser, Vienna: first case of phossy jaw'], [1844, 'Pasch, Sweden: phosphorus moved to the box'], [1847, 'Schrötter presents red phosphorus'], [1888, 'London: 1,400 matchgirls strike'], [1898, 'Sévène and Cahen: sesquisulphide']];
const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x * 0.34));

export default {
  id: 'cost',
  short: 'The human cost',
  title: 'The human cost, and the fix',
  subtitle: 'The first cheap matches poisoned the people who made them. The cure was a different form of the same element.',
  view: VIEW,
  learn: `<p>The first matches that lit easily, from about 1831, had <b>white phosphorus</b> in the head. It catches fire at about 30 °C, so a light scrape on anything was enough. It is also a strong poison.</p>
    <p><b>Phossy jaw.</b> Workers who dipped and boxed those matches breathed phosphorus fumes all day. Many developed <b>phosphorus necrosis of the jaw</b>: toothache and swollen gums, then abscesses, and finally the jawbone itself dying. Friedrich Lorinser, a doctor in Vienna, saw the first case in 1839 and reported 22 by 1844. The only treatment was to cut the dead bone away.</p>
    <p><b>The matchgirls.</b> In July 1888 about 1,400 women and girls at the Bryant & May factory in Bow, London, walked out. They were protesting against fourteen-hour days, low pay, fines taken from their wages, a workmate's dismissal, and the phosphorus. The journalist <b>Annie Besant</b> had described their conditions two weeks earlier. Within a fortnight the company gave way: the fines went, and meals were moved to a room away from the phosphorus. The workers formed a union.</p>
    <p><b>The fix was chemistry.</b> Heat white phosphorus without air and its atoms link into a network: <b>red phosphorus</b>. Same element, but it does not catch fire below about 240 °C and is far less harmful. Putting it on the box gave the safety match. For matches that strike anywhere, two French chemists showed in 1898 that <b>phosphorus sesquisulphide</b> could do the job. Countries then banned white phosphorus matches one by one: Finland first in 1872, the <b>Berne Convention</b> in 1906, Britain from 1910, and <b>India by an Act of 1913</b>.</p>
    <p><b>Sivakasi and the Supreme Court.</b> Poison is not the only cost. India's handmade match industry long depended on very low wages and on children. The Supreme Court recorded that at the end of 1985, Sivakasi's 221 registered match factories employed 27,338 workers, of whom <b>2,941 were children</b>, and called the work hazardous. On 10 December 1996, in <i>M.C. Mehta v. State of Tamil Nadu</i>, it ordered every employer to pay ₹20,000 for each child employed against the law into a welfare fund, and the children to be put in school. Children under 14 may not work in match factories at all. Official counts of working children in Tamil Nadu have fallen sharply since, but the law still has to be enforced.</p>
    <p class="tip"><b>Try it:</b> warm the three kinds of phosphorus and see which catches first. Then slide the year from 1830 to 1930 and watch the bans arrive, far too slowly.</p>`,
  terms: [
    { t: 'White phosphorus', d: 'A waxy form of phosphorus made of P₄ molecules. It catches fire near 30 °C and is very poisonous.' },
    { t: 'Red phosphorus', d: 'The same element with its atoms linked in a network. Stable, far less harmful, used on the striking strip.' },
    { t: 'Allotropes', d: 'Different forms of one element, with the same atoms joined in different ways. Diamond and graphite are another pair.' },
    { t: 'Phossy jaw', d: 'Phosphorus necrosis of the jaw: the death of the jawbone in workers who breathed white phosphorus fumes.' },
    { t: 'Berne Convention (1906)', d: 'The international treaty that banned white phosphorus in matches. It was one of the first labour treaties.' },
    { t: 'Child labour', d: 'Work that robs children of school and health. India\'s Constitution bars children under 14 from factories and hazardous work.' },
  ],
  defaults: { look: 'white', T: 20, year: 1900 },
  controls: [
    { key: 'look', type: 'seg', label: 'Look at', options: [{ v: 'white', label: 'White P' }, { v: 'red', label: 'Red P' }, { v: 'sesqui', label: 'Sesquisulphide' }] },
    { key: 'T', type: 'range', label: 'Warm them in air', min: 20, max: 300, step: 5, ends: ['20 °C', '300 °C'], fmt: (v) => v + ' °C' },
    { key: 'year', type: 'range', label: 'Year', min: 1830, max: 1930, step: 1, ends: ['1830', '1930'], fmt: (v) => String(v) },
  ],
  quiz: [
    { q: 'White and red phosphorus are made of the same atoms. Why do they behave so differently?', options: ['Red phosphorus has a dye in it', 'The atoms are joined differently: separate P₄ molecules against a linked network', 'Red phosphorus is a mixture with iron', 'They are different elements'], answer: 1, why: 'They are allotropes. White phosphorus is small, strained P₄ molecules that react easily. Red phosphorus is a network that is much more stable.' },
    { q: 'What was "phossy jaw"?', options: ['A nickname for a match brand', 'The death of the jawbone in workers who breathed white phosphorus fumes', 'A burn from a match flame', 'A tooth stain from sulphur'], answer: 1, why: 'It was an industrial disease of match workers. It ended only when white phosphorus matches were banned.' },
    { q: 'What did India\'s Supreme Court order in 1996 for each child found working against the law?', options: ['Nothing: it left the matter to factories', 'A warning letter', 'The employer to pay ₹20,000 into a welfare fund, and the child to be schooled', 'The factory to move'], answer: 2, why: 'In M.C. Mehta v. State of Tamil Nadu the Court set up a Child Labour Rehabilitation-cum-Welfare Fund, paid for by offending employers.' },
  ],
  reel: [
    { ms: 5600, caption: 'Early matches used white phosphorus. It lights at 30 °C, and its fumes destroyed workers\' jaws.', set: { look: 'white', year: 1888 }, anim: { T: [20, 120] }, view: TALL, spin: 0 },
    { ms: 5600, caption: 'The fix: red phosphorus, the same atoms in a stable network. India banned white phosphorus matches in 1913.', set: { look: 'red', T: 120 }, anim: { year: [1870, 1925] }, view: TALL, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const rnd = rng(5);
    const pM = () => new THREE.MeshStandardMaterial({ color: 0xff8a2a, roughness: 0.35 }), sM = new THREE.MeshStandardMaterial({ color: 0xf2d43a, roughness: 0.35 }), bM = M.matte(0xb9bec8);
    const mols = {};
    const mk = (key, atoms, bonds, y = 2.5) => {
      const g = new THREE.Group(); g.position.set(KIND[key].x, y, 0); root.add(g);
      atoms.forEach(([el, x, yy, z]) => { const a = sphere(el === 'S' ? 0.2 : 0.22, el === 'S' ? sM : pM(), 20); a.position.set(x, yy, z); g.add(a); });
      bonds.forEach(([i, j]) => g.add(beam(atoms[i].slice(1), atoms[j].slice(1), 0.045, bM, 8)));
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 40), M.matte(0x2b3039)); plate.position.y = -0.95; g.add(plate);
      const fl = makeFlame(root); fl.g.position.set(KIND[key].x, y - 0.5, 0);
      const lb = stage.label('', [0, key === 'red' ? -2.0 : -1.2, 0.6], g, 'hot'); lb.element.style.setProperty('--c', KIND[key].col);
      mols[key] = { g, fl, lb, on: 0 };
    };
    // white: one P₄ tetrahedron
    mk('white', TET.map((v) => ['P', ...v]), [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]);
    // red: three P₄ units, each with one edge opened, linked in a chain (a sketch of the network)
    const ra = [], rb = [];
    for (let u = 0; u < 3; u++) { const o = (u - 1) * 0.72, b = ra.length; TET.forEach((v, i) => ra.push(['P', v[0] * 0.75 + o, v[1] * 0.75 + (u % 2 ? 0.16 : -0.16), v[2] * 0.75])); [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3]].forEach(([i, j]) => rb.push([b + i, b + j])); if (u) rb.push([b - 4 + 1, b + 2]); }
    mk('red', ra, rb);
    // sesquisulphide: apex P, three S, a triangle of three P
    const sa = [['P', 0, 0.62, 0]], sb = [];
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; sa.push(['S', 0.46 * Math.cos(a), 0.18, 0.46 * Math.sin(a)]); }
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; sa.push(['P', 0.36 * Math.cos(a), -0.48, 0.36 * Math.sin(a)]); }
    for (let i = 0; i < 3; i++) { sb.push([0, 1 + i], [1 + i, 4 + i], [4 + i, 4 + ((i + 1) % 3)]); }
    mk('sesqui', sa, sb);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.03, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); ring.rotation.x = Math.PI / 2; root.add(ring);
    const lT = stage.label('', [-0.4, 0.45, 1.2], root);
    let S = { look: 'white', T: 20, year: 1900 }, key = '', tt = 0;

    const bA = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h); title(g, 'White phosphorus matches: banned', `by ${S.year}`);
      const X = (y) => 150 + ((y - 1830) / 100) * (w - 175), rowH = 23;
      g.strokeStyle = 'rgba(255,255,255,.12)'; g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '14px sans-serif';
      for (let y = 1840; y <= 1920; y += 20) { g.beginPath(); g.moveTo(X(y), 52); g.lineTo(X(y), 334); g.stroke(); g.fillText(y, X(y) - 15, 352); }
      BANS.forEach(([y, n], i) => {
        const yy = 58 + i * rowH, on = S.year >= y, berne = n.startsWith('Berne');
        g.fillStyle = on ? (berne ? COL.violet : n === 'India' ? COL.heat : COL.ok) : 'rgba(255,255,255,.12)';
        g.fillRect(X(y), yy, X(1930) - X(y), rowH - 8);
        g.font = (n === 'India' ? 'bold ' : '') + '17px sans-serif'; g.fillStyle = on ? COL.text : 'rgba(255,255,255,.4)'; g.fillText(n.replace(' signed', ''), 14, yy + 13);
        g.fillStyle = on ? '#0a0c12' : 'rgba(255,255,255,.4)'; g.font = 'bold 15px sans-serif'; g.fillText(y, X(y) + 5, yy + 14);
      });
      g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(S.year), 50); g.lineTo(X(S.year), 334); g.stroke();
    }, B1);
    const bB = board(root, BW, BH, 632, 364, (g, w, h) => {
      panelBg(g, w, h);
      const ev = EVENTS.filter(([y]) => y <= S.year).slice(-3);
      title(g, 'People', `to ${S.year}`);
      g.font = '16px sans-serif'; let y = 62;
      ev.forEach(([yr, tx]) => { g.fillStyle = COL.heat; g.font = 'bold 16px sans-serif'; g.fillText(yr, 20, y); g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '16px sans-serif'; g.fillText(tx, 70, y); y += 25; });
      g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(20, 146, w - 40, 2);
      g.font = 'bold 18px sans-serif'; g.fillStyle = COL.text; g.fillText('Sivakasi, as the Supreme Court recorded it', 20, 176);
      g.font = '16px sans-serif'; g.fillStyle = 'rgba(255,255,255,.82)';
      let yy = wrap(g, 'End of 1985: 221 registered match factories, 27,338 workers, 2,941 of them children.', 20, 202, w - 40, 22);
      yy = wrap(g, '10 December 1996, M.C. Mehta v. State of Tamil Nadu: ₹20,000 from the employer for every child employed against the law, paid into a welfare fund; the child to be in school.', 20, yy + 4, w - 40, 22);
      g.fillStyle = COL.ok; g.font = 'bold 16px sans-serif'; g.fillText('Children under 14 may not work in match factories.', 20, 348);
    }, B2);

    return {
      update(dt, s) {
        dt = Math.max(0, Math.min(dt, 0.05)); S = s; tt += dt;
        const narrow = fitNarrow(stage, []); reelBoards([bA, bB], -0.4, stage, VIEW);
        const k = `${s.year}`; if (k !== key) { key = k; bA.redraw(); bB.redraw(); }
        Object.entries(mols).forEach(([id, m]) => {
          const K = KIND[id], burning = s.T >= K.T;
          m.on += ((burning ? 1 : 0) - m.on) * (1 - Math.exp(-dt * 5));
          m.g.rotation.y += dt * 0.5; m.g.scale.setScalar((id === s.look ? 1.35 : 1.12) * (id === 'red' ? 0.8 : 1));
          m.fl.set({ h: (1.25 + 0.07 * Math.sin(tt * 19 + K.x)) * m.on, w: 0.42, on: m.on * 0.7, flare: id === 'white' ? 0.4 : 0 });
          m.lb.element.innerHTML = narrow ? K.f : `${K.n.replace('Phosphorus s', 'S')} · ${burning ? '<b>burning</b>' : K.T + ' °C'}`;
        });
        ring.position.set(KIND[s.look].x, 2.5 - 0.95 * 1.35 * (s.look === 'red' ? 0.8 : 1), 0); ring.scale.setScalar(1.35 * (s.look === 'red' ? 0.8 : 1));
        lT.element.innerHTML = `in air at ${s.T} °C`; lT.position.set(-0.2, 4.3, 0);
      },
      readout: (s) => {
        const K = KIND[s.look], n = BANS.filter(([y, nm]) => y <= s.year && !nm.startsWith('Berne')).length;
        return ro(`<div class="big" style="color:${K.col}">${K.n} <small>${K.f}</small></div>
          <div class="row"><span>Catches fire in air at about</span><b>${K.T} °C</b></div>
          <div class="row"><span>At ${s.T} °C it is</span><b style="color:${s.T >= K.T ? COL.hot : COL.ok}">${s.T >= K.T ? 'burning' : 'stable'}</b></div>
          <div class="row"><span>To people</span><b>${K.tox}</b></div>
          <div class="row"><span>In matches</span><b>${K.use}</b></div>
          <div class="row"><span>Bans by ${s.year}</span><b>${n} of the 11 countries listed</b></div>
          <small>${s.year >= 1913 ? 'India\'s White Phosphorus Matches Prohibition Act dates from 1913.' : s.year >= 1906 ? 'The Berne Convention was signed in 1906.' : s.year >= 1888 ? 'In 1888 the London matchgirls struck.' : 'The disease was described in 1839. The first ban came 33 years later.'}</small>`);
      },
    };
  },
};
