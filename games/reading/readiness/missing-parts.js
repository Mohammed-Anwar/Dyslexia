/**
 * Missing Parts  (Reading > Pre-reading Readiness)
 * Filename: games/reading/readiness/missing-parts.js
 *
 * LEVELS (15)
 *   1-5   "What is hiding in the cloud / wave / bush ...?"  Object peeks out of a natural cover.
 *         Choices = full pictures of clearly different things.
 *   6-10  "Which part belongs to this picture?"  The FULL object is shown.
 *         Choices = puzzle-piece shaped parts (crops) of different things.
 *  11-13  Hidden again, but covered more, and the choices are SIMILAR things (same category).
 *  14-15  Full picture + parts again, with parts of SIMILAR things.
 *
 * CORRECT ANSWER = the object reacts (rocket launches up with a whoosh, fish jumps out of
 * the wave with a splash, car drives off, ...). All sounds are synthesized (Web Audio),
 * no audio files needed.
 *
 * HOW TO EDIT
 *   - TARGETS: the 15 objects. Each one says which scene (bg), cover, reaction (fx) and sound (sfx).
 *   - EXTRA:   extra pictures used only as wrong answers (grouped by cat so "similar" levels work).
 *   - Pictures use the PNGs from Static/Icons via window.EmojiToImageMap, with the emoji as fallback.
 */
(function () {
  'use strict';

  const TOTAL = 15;
  const VB_W = 340, VB_H = 240;          // every scene is drawn in this coordinate space

  let stage = null;
  let levelIndex = 0;
  let order = [];
  let token = 0;                         // bumped on every render; stale timers check it
  let busy = false;

  // ===================================================================
  // DATA
  // ===================================================================
  const T = (icon, name, cat, o) => Object.assign({ icon, name, cat }, o);

  // dir: which way the object travels when it leaves (-1 = left, 1 = right)
  const TARGETS = [
    T('⭐', 'Star',      'sky',      { bg: 'night',  cover: 'cloudNight', fx: 'spin',    sfx: 'twinkle' }),
    T('🍎', 'Apple',     'fruit',    { bg: 'garden', cover: 'bush',       fx: 'bounce',  sfx: 'crunch' }),
    T('🏠', 'House',     'building', { bg: 'garden', cover: 'hill',       fx: 'grow',    sfx: 'doorbell' }),
    T('🚗', 'Car',       'vehicle',  { bg: 'desert', cover: 'dune',       fx: 'drive',   sfx: 'vroom', dir: -1 }),
    T('🦋', 'Butterfly', 'bug',      { bg: 'garden', cover: 'grass',      fx: 'flutter', sfx: 'flutter' }),
    T('🎈', 'Balloon',   'fly',      { bg: 'day',    cover: 'cloud',      fx: 'float',   sfx: 'whistle' }),
    T('🌻', 'Flower',    'plant',    { bg: 'garden', cover: 'bush',       fx: 'bloom',   sfx: 'sparkle' }),
    T('🐟', 'Fish',      'sea',      { bg: 'sea',    cover: 'wave',       fx: 'jump',    sfx: 'splash' }),
    T('🌙', 'Moon',      'sky',      { bg: 'night',  cover: 'cloudNight', fx: 'shine',   sfx: 'chime', crops: [[.36, .45], [.36, .55], [.42, .5]] }),
    T('☀️', 'Sun',       'sky',      { bg: 'day',    cover: 'cloud',      fx: 'shine',   sfx: 'sunrise', spin: true }),
    T('🐶', 'Dog',       'animal',   { bg: 'garden', cover: 'grass',      fx: 'bounce',  sfx: 'bark' }),
    T('🐱', 'Cat',       'animal',   { bg: 'garden', cover: 'bush',       fx: 'hop',     sfx: 'meow' }),
    T('🚀', 'Rocket',    'fly',      { bg: 'day',    cover: 'cloud',      fx: 'launch',  sfx: 'launch' }),
    T('✈️', 'Plane',     'fly',      { bg: 'day',    cover: 'cloud',      fx: 'fly',     sfx: 'jet' }),
    T('🍔', 'Burger',    'food',     { bg: 'picnic', cover: 'basket',     fx: 'chomp',   sfx: 'chomp' })
  ];

  const EXTRA = [
    ['☁️', 'Cloud', 'sky'], ['🌈', 'Rainbow', 'sky'], ['⚡', 'Lightning', 'sky'], ['❄️', 'Snowflake', 'sky'],
    ['🐭', 'Mouse', 'animal'], ['🐰', 'Rabbit', 'animal'], ['🦊', 'Fox', 'animal'], ['🐻', 'Bear', 'animal'],
    ['🐯', 'Tiger', 'animal'], ['🦁', 'Lion', 'animal'], ['🐷', 'Pig', 'animal'], ['🐸', 'Frog', 'animal'],
    ['🍏', 'Green Apple', 'fruit'], ['🍐', 'Pear', 'fruit'], ['🍓', 'Strawberry', 'fruit'], ['🍊', 'Orange', 'fruit'],
    ['🍋', 'Lemon', 'fruit'], ['🍌', 'Banana', 'fruit'], ['🍇', 'Grapes', 'fruit'], ['🍉', 'Watermelon', 'fruit'],
    ['🚕', 'Taxi', 'vehicle'], ['🚌', 'Bus', 'vehicle'], ['🚙', 'Jeep', 'vehicle'], ['🚐', 'Van', 'vehicle'],
    ['🚲', 'Bicycle', 'vehicle'], ['🚂', 'Train', 'vehicle'],
    ['🚁', 'Helicopter', 'fly'], ['🪁', 'Kite', 'fly'], ['🐦', 'Bird', 'fly'], ['🦅', 'Eagle', 'fly'],
    ['🍕', 'Pizza', 'food'], ['🍟', 'Fries', 'food'], ['🥪', 'Sandwich', 'food'], ['🍪', 'Cookie', 'food'], ['🍰', 'Cake', 'food'],
    ['🌹', 'Rose', 'plant'], ['🌸', 'Blossom', 'plant'], ['🌵', 'Cactus', 'plant'], ['🌳', 'Tree', 'plant'], ['🌿', 'Herb', 'plant'],
    ['🐝', 'Bee', 'bug'], ['🐞', 'Ladybug', 'bug'], ['🐛', 'Caterpillar', 'bug'], ['🐜', 'Ant', 'bug'],
    ['🏡', 'Cottage', 'building'], ['🏢', 'Office', 'building'], ['🏫', 'School', 'building'],
    ['🏥', 'Hospital', 'building'], ['🏰', 'Castle', 'building'],
    ['🐠', 'Tropical Fish', 'sea'], ['🐋', 'Whale', 'sea'], ['🐙', 'Octopus', 'sea'],
    ['🦈', 'Shark', 'sea'], ['🐳', 'Spouting Whale', 'sea']
  ].map(e => T(e[0], e[1], e[2]));

  const PICTURES = TARGETS.concat(EXTRA);

  // How much each hidden level is covered (negative = cover moves up = more hidden)
  const HIDE_SHIFT = [0, 0, -8, -8, -14, 0, 0, 0, 0, 0, -16, -22, -28, 0, 0];

  function levelInfo(i) {
    const hidden = i < 5 || (i >= 10 && i < 13);
    return { mode: hidden ? 'hidden' : 'parts', similar: i >= 10, shift: HIDE_SHIFT[i] || 0 };
  }

  // Where the crop is centred inside a picture (0..1) for "part" choices
  // (kept near the middle so a crop never lands on an empty corner of the picture)
  const CROPS = [[.42, .42], [.58, .42], [.42, .58], [.58, .58], [.5, .5], [.5, .4], [.5, .6]];
  const CROP_ZOOM = 1.9;

  const COVERS = {
    cloud: { label: 'cloud' }, cloudNight: { label: 'cloud' }, bush: { label: 'bush' }, grass: { label: 'grass' },
    hill: { label: 'hill' }, dune: { label: 'sand dune' }, wave: { label: 'wave' }, basket: { label: 'basket' }
  };

  // ===================================================================
  // SMALL HELPERS
  // ===================================================================
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function iconSrc(icon) {
    const map = window.EmojiToImageMap || {};
    const bare = icon.replace(/️/g, '');
    const cands = [icon, bare, bare + '️'];
    for (const c of cands) if (map[c]) return 'Static/Icons/' + encodeURIComponent(map[c]) + '.png';
    return null;
  }

  // Picture element: PNG icon, falls back to the emoji text if the PNG is missing
  function makeArt(icon) {
    const art = document.createElement('div');
    art.className = 'mp-art';
    const showEmoji = () => {
      art.innerHTML = '';
      const s = document.createElement('span');
      s.className = 'mp-emoji';
      s.textContent = icon;
      art.appendChild(s);
    };
    const src = iconSrc(icon);
    if (!src) { showEmoji(); return art; }
    const img = new Image();
    img.draggable = false;
    img.alt = '';
    img.onerror = showEmoji;
    img.src = src;
    art.appendChild(img);
    return art;
  }

  function pickDistractors(target, similar, n) {
    const others = PICTURES.filter(p => p.name !== target.name);
    const out = [];
    if (similar) {
      shuffle(others.filter(p => p.cat === target.cat)).forEach(p => { if (out.length < n) out.push(p); });
    } else {
      const used = new Set([target.cat]);
      shuffle(others.filter(p => p.cat !== target.cat)).forEach(p => {
        if (out.length < n && !used.has(p.cat)) { used.add(p.cat); out.push(p); }
      });
    }
    shuffle(others.slice()).forEach(p => { if (out.length < n && !out.includes(p)) out.push(p); });
    return out;
  }

  // ===================================================================
  // SCENES: backgrounds + covers (all inline SVG in a 340 x 240 space)
  // ===================================================================
  function starsSvg() {
    const pts = [[30, 30, 2], [80, 72, 1.5], [128, 24, 2.2], [205, 48, 1.6], [255, 22, 2], [305, 66, 1.8],
      [58, 118, 1.6], [300, 112, 2], [162, 86, 1.4], [112, 58, 1.4], [228, 98, 1.6], [20, 80, 1.4]];
    return pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#fff" opacity=".85"/>`).join('');
  }

  const BG = {
    day: {
      top: '#7dd3fc', bot: '#e0f2fe',
      deco: '<ellipse cx="60" cy="40" rx="30" ry="10" fill="#fff" opacity=".7"/><ellipse cx="85" cy="34" rx="20" ry="8" fill="#fff" opacity=".7"/><ellipse cx="275" cy="62" rx="34" ry="11" fill="#fff" opacity=".6"/>'
    },
    night: { top: '#1e1b4b', bot: '#4338ca', deco: starsSvg() },
    sea: {
      top: '#7dd3fc', bot: '#e0f2fe',
      deco: '<ellipse cx="70" cy="40" rx="30" ry="10" fill="#fff" opacity=".7"/><rect y="118" width="340" height="130" fill="#38bdf8" opacity=".5"/><path d="M0 118H340" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>'
    },
    garden: {
      top: '#bae6fd', bot: '#ecfccb',
      deco: '<ellipse cx="60" cy="195" rx="130" ry="60" fill="#bbf7d0"/><ellipse cx="275" cy="205" rx="150" ry="64" fill="#86efac"/><ellipse cx="70" cy="36" rx="28" ry="9" fill="#fff" opacity=".7"/>'
    },
    desert: {
      top: '#fde68a', bot: '#fef3c7',
      deco: '<circle cx="285" cy="48" r="24" fill="#fbbf24" opacity=".85"/><path d="M190 175 L235 118 L280 175 Z" fill="#fcd34d" opacity=".6"/>'
    },
    picnic: {
      top: '#bae6fd', bot: '#bbf7d0',
      deco: '<circle cx="58" cy="46" r="20" fill="#fde047"/><ellipse cx="170" cy="270" rx="260" ry="110" fill="#86efac"/>'
    }
  };

  function bgSvg(name) {
    const b = BG[name] || BG.day;
    return `<svg viewBox="0 0 ${VB_W} ${VB_H}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="mp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b.top}"/><stop offset="1" stop-color="${b.bot}"/></linearGradient></defs>
      <rect width="${VB_W}" height="${VB_H}" fill="url(#mp-bg)"/>${b.deco}</svg>`;
  }

  function circles(list) {
    return list.map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${c[3]}"/>`).join('');
  }

  // Cover top edge sits around y = 125 (the object spans about y 52..172). data-bob = gentle sway.
  function coverSvg(type) {
    switch (type) {
      case 'wave': {
        const w = y => `M-30 ${y} Q-2 ${y - 20} 26 ${y} T82 ${y} T138 ${y} T194 ${y} T250 ${y} T306 ${y} T362 ${y}`;
        return `<g data-bob="12"><path d="${w(128)} V320 H-30 Z" fill="#60a5fa"/><path d="${w(128)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/></g>
                <g data-bob="-14"><path d="${w(150)} V320 H-30 Z" fill="#2563eb"/><path d="${w(150)}" fill="none" stroke="#bfdbfe" stroke-opacity=".8" stroke-width="3"/></g>`;
      }
      case 'cloud':
      case 'cloudNight': {
        const night = type === 'cloudNight';
        const main = night ? '#c7d2fe' : '#ffffff', shade = night ? '#818cf8' : '#bfdbfe';
        const P = [[8, 168, 40], [56, 160, 46], [106, 168, 42], [152, 158, 48], [202, 168, 44], [250, 160, 46], [300, 166, 44], [346, 160, 40]];
        return `<g data-bob="7">
          ${circles(P.map(p => [p[0], p[1] + 9, p[2], shade]))}
          <rect x="-30" y="180" width="400" height="160" fill="${shade}"/>
          ${circles(P.map(p => [p[0], p[1], p[2], main]))}
          <rect x="-30" y="174" width="400" height="160" fill="${main}"/></g>`;
      }
      case 'bush': {
        const P = [[0, 162, 38, '#15803d'], [44, 154, 42, '#16a34a'], [96, 164, 40, '#15803d'], [146, 152, 44, '#16a34a'],
          [200, 162, 42, '#15803d'], [250, 154, 42, '#16a34a'], [300, 162, 40, '#15803d'], [342, 156, 42, '#16a34a']];
        const hi = [[30, 140, 9], [84, 148, 8], [140, 130, 10], [196, 146, 8], [246, 134, 9], [300, 146, 8]];
        return `<g data-bob="5">${circles(P)}<rect x="-30" y="170" width="400" height="160" fill="#15803d"/>
          ${hi.map(h => `<circle cx="${h[0]}" cy="${h[1]}" r="${h[2]}" fill="#4ade80" opacity=".6"/>`).join('')}</g>`;
      }
      case 'grass': {
        let back = '', front = '';
        for (let i = 0, x = -12; x < 360; i++, x += 13) {
          const h = 110 + ((i * 37) % 22);
          back += `M${x} 156 L${x + 9} ${h} L${x + 18} 156 Z `;
          const h2 = 124 + ((i * 53) % 18);
          front += `M${x + 7} 166 L${x + 16} ${h2} L${x + 25} 166 Z `;
        }
        return `<g data-bob="4"><rect x="-30" y="138" width="400" height="190" fill="#15803d"/>
          <path d="${back}" fill="#16a34a"/><path d="${front}" fill="#22c55e"/>
          <rect x="-30" y="152" width="400" height="180" fill="#22c55e"/></g>`;
      }
      case 'hill':
      case 'dune': {
        const sand = type === 'dune';
        const a = sand ? '#fcd34d' : '#4ade80', b = sand ? '#fbbf24' : '#22c55e';
        return `<g><path d="M-10 140 Q70 100 160 130 T350 122 V320 H-10 Z" fill="${a}"/>
          <path d="M-10 176 Q100 142 210 170 T350 160 V320 H-10 Z" fill="${b}"/></g>`;
      }
      case 'basket': {
        const lines = [154, 176, 198, 220, 242].map(y => {
          const xl = 62 + 18 * (y - 130) / 190, xr = 278 - 18 * (y - 130) / 190;
          return `<path d="M${xl.toFixed(1)} ${y} H${xr.toFixed(1)}" stroke="#92400e" stroke-width="3"/>`;
        }).join('');
        return `<g><path d="M62 130 H278 L260 320 H80 Z" fill="#b45309"/>${lines}
          <rect x="52" y="118" width="236" height="18" rx="9" fill="#92400e"/></g>`;
      }
      default:
        return '';
    }
  }

  // Jigsaw-piece outline in a 0..100 box (scaled to the element via objectBoundingBox)
  const PIECE_D = 'M20 20 H42 a10 10 0 1 1 16 0 H80 V42 a10 10 0 1 1 0 16 V80 H58 a10 10 0 1 1 -16 0 H20 V58 a10 10 0 1 1 0 -16 Z';

  // ===================================================================
  // SOUND (all synthesized with Web Audio, no files)
  // ===================================================================
  const Snd = (function () {
    let ctx = null, nbuf = null;
    function ac() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    // o: type, f0, f1, path[[time,freq],...], dur, vol, t (delay), attack, lp (lowpass Hz), trem (tremolo Hz)
    function tone(o) {
      const c = ac(); if (!c) return;
      const dur = o.dur || .2, vol = o.vol || .2, t0 = c.currentTime + (o.t || 0);
      const osc = c.createOscillator();
      osc.type = o.type || 'sine';
      const pts = o.path || [[0, o.f0], [dur, o.f1 || o.f0]];
      osc.frequency.setValueAtTime(pts[0][1], t0 + pts[0][0]);
      for (let i = 1; i < pts.length; i++) osc.frequency.linearRampToValueAtTime(pts[i][1], t0 + pts[i][0]);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + (o.attack || .012));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      if (o.lp) {
        const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp;
        osc.connect(f); f.connect(g);
      } else osc.connect(g);
      if (o.trem) {
        const lfo = c.createOscillator(); lfo.frequency.value = o.trem;
        const lg = c.createGain(); lg.gain.value = vol * .6;
        lfo.connect(lg); lg.connect(g.gain);
        lfo.start(t0); lfo.stop(t0 + dur + .05);
      }
      g.connect(c.destination);
      osc.start(t0); osc.stop(t0 + dur + .05);
    }
    // o: filter, f0, f1, q, dur, vol, t, attack
    function noise(o) {
      const c = ac(); if (!c) return;
      if (!nbuf) {
        nbuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const d = nbuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const dur = o.dur || .3, vol = o.vol || .2, t0 = c.currentTime + (o.t || 0);
      const src = c.createBufferSource(); src.buffer = nbuf; src.loop = true;
      const f = c.createBiquadFilter();
      f.type = o.filter || 'lowpass'; f.Q.value = o.q || 1;
      f.frequency.setValueAtTime(o.f0 || 1000, t0);
      if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t0 + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + (o.attack || .02));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(t0); src.stop(t0 + dur + .05);
    }
    return { tone, noise };
  })();

  const SFX = {
    launch() {
      Snd.noise({ filter: 'bandpass', f0: 250, f1: 2600, dur: 1.9, vol: .45, q: .7, attack: .3 });
      Snd.tone({ type: 'sawtooth', f0: 60, f1: 240, dur: 1.9, vol: .16, lp: 500, attack: .25 });
      Snd.tone({ type: 'sine', f0: 45, f1: 120, dur: 1.2, vol: .35, attack: .05 });
    },
    splash() {
      Snd.noise({ filter: 'highpass', f0: 900, dur: .45, vol: .35, attack: .01 });
      Snd.tone({ f0: 520, f1: 1100, dur: .16, vol: .16, t: .05 });
      Snd.tone({ f0: 700, f1: 1500, dur: .14, vol: .12, t: .16 });
    },
    vroom() {
      Snd.tone({ type: 'square', f0: 392, dur: .12, vol: .12 });
      Snd.tone({ type: 'square', f0: 392, dur: .12, vol: .12, t: .2 });
      Snd.tone({ type: 'sawtooth', f0: 80, f1: 320, dur: 1.0, vol: .13, t: .45, lp: 700 });
      Snd.noise({ filter: 'lowpass', f0: 400, dur: 1.0, vol: .1, t: .45 });
    },
    jet() {
      Snd.noise({ filter: 'bandpass', f0: 700, f1: 2400, dur: 1.6, vol: .3, q: .8, attack: .3, t: .2 });
      Snd.tone({ type: 'sawtooth', f0: 110, f1: 210, dur: 1.6, vol: .07, lp: 900, t: .2 });
    },
    twinkle() { [1047, 1319, 1568, 2093].forEach((f, i) => Snd.tone({ type: 'triangle', f0: f, dur: .22, vol: .18, t: i * .11 })); },
    flutter() {
      Snd.tone({ f0: 880, f1: 1100, dur: .9, vol: .14, trem: 16 });
      Snd.tone({ f0: 1320, f1: 1500, dur: .7, vol: .07, trem: 20, t: .3 });
    },
    whistle() {
      Snd.tone({ f0: 500, f1: 1300, dur: .6, vol: .16, attack: .05 });
      Snd.tone({ type: 'triangle', f0: 1000, f1: 1400, dur: .4, vol: .08, t: .4 });
    },
    chime() { [784, 659, 523].forEach((f, i) => Snd.tone({ f0: f, dur: .5, vol: .16, t: i * .22 })); },
    sunrise() { [523, 659, 784, 1047].forEach((f, i) => Snd.tone({ type: 'triangle', f0: f, dur: .35, vol: .17, t: i * .13 })); },
    bark() { [0, .24].forEach(d => Snd.tone({ type: 'sawtooth', path: [[0, 420], [.14, 170]], dur: .16, vol: .2, lp: 1300, t: d })); },
    meow() { Snd.tone({ type: 'sawtooth', path: [[0, 480], [.18, 950], [.5, 520]], dur: .5, vol: .15, lp: 2200, attack: .04 }); },
    crunch() {
      [0, .1, .2].forEach(d => Snd.noise({ filter: 'bandpass', f0: 2500, dur: .07, vol: .35, q: 1.5, t: d, attack: .005 }));
      Snd.tone({ f0: 400, f1: 800, dur: .1, vol: .12, t: .3 });
    },
    chomp() {
      [0, .25].forEach(d => {
        Snd.tone({ f0: 260, f1: 140, dur: .15, vol: .22, t: d });
        Snd.noise({ filter: 'lowpass', f0: 1500, dur: .06, vol: .2, t: d });
      });
      Snd.tone({ type: 'triangle', f0: 660, f1: 880, dur: .2, vol: .14, t: .55 });
    },
    sparkle() { for (let i = 0; i < 6; i++) Snd.tone({ type: 'triangle', f0: 1500 + Math.random() * 1800, dur: .14, vol: .12, t: i * .07 }); },
    doorbell() {
      Snd.tone({ f0: 659, dur: .45, vol: .2 });
      Snd.tone({ f0: 523, dur: .6, vol: .2, t: .4 });
    }
  };

  // ===================================================================
  // REACTIONS: what the object does when the answer is right.
  // Every function returns how long the reaction lasts (ms).
  // ===================================================================
  const A = (el, kf, opt) => el.animate(kf, Object.assign({ fill: 'forwards' }, opt));
  const glow = (el, c) => { el.style.filter = 'drop-shadow(0 0 14px ' + c + ')'; };

  function burst(scene, obj, colors, n, dist) {
    const s = scene.getBoundingClientRect(), r = obj.getBoundingClientRect();
    const cx = r.left - s.left + r.width / 2, cy = r.top - s.top + r.height / 2;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      const sz = 6 + Math.random() * 7;
      d.className = 'mp-dot';
      d.style.cssText = `left:${cx - sz / 2}px;top:${cy - sz / 2}px;width:${sz}px;height:${sz}px;background:${colors[i % colors.length]}`;
      scene.appendChild(d);
      const a = Math.PI * 2 * i / n + Math.random() * .5, dd = dist * (.6 + Math.random() * .8);
      const an = d.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * dd}px,${Math.sin(a) * dd}px) scale(.2)`, opacity: 0 }
      ], { duration: 700 + Math.random() * 300, easing: 'ease-out' });
      an.onfinish = () => d.remove();
    }
  }

  // Small cloud puff left behind the object (fx, fy = offset from the object centre, as a fraction of its size)
  function puff(scene, obj, color, fxo, fyo) {
    const s = scene.getBoundingClientRect(), r = obj.getBoundingClientRect();
    const x = r.left - s.left + r.width * (.5 + fxo), y = r.top - s.top + r.height * (.5 + fyo);
    const sz = 16 + Math.random() * 12;
    const d = document.createElement('div');
    d.className = 'mp-dot';
    d.style.cssText = `left:${x - sz / 2}px;top:${y - sz / 2}px;width:${sz}px;height:${sz}px;background:${color}`;
    scene.appendChild(d);
    const an = d.animate([
      { transform: 'translate(0,0) scale(.6)', opacity: .95 },
      { transform: `translate(${(Math.random() - .5) * 20}px,18px) scale(2)`, opacity: 0 }
    ], { duration: 650, easing: 'ease-out' });
    an.onfinish = () => d.remove();
  }

  const FX = {
    // Rocket points up-right, so turn it 45deg to point straight up, shake, then blast off
    launch({ obj, scene, H, sched }) {
      const D = 2200;
      A(obj, [
        { offset: 0,   transform: 'translate(0,0) rotate(0deg) scale(1)' },
        { offset: .08, transform: 'translate(0,0) rotate(-45deg) scale(1)' },
        { offset: .2,  transform: 'translate(-3px,2px) rotate(-45deg)' },
        { offset: .3,  transform: 'translate(3px,-2px) rotate(-45deg)' },
        { offset: .4,  transform: 'translate(-3px,2px) rotate(-45deg)', easing: 'cubic-bezier(.55,0,1,.45)' },
        { offset: 1,   transform: `translate(0,${-(H + 200)}px) rotate(-45deg) scale(.6)` }
      ], { duration: D, easing: 'linear' });
      for (let k = 0; k < 14; k++) sched(() => puff(scene, obj, k % 2 ? '#fde68a' : '#fb923c', 0, .38), 500 + k * 90);
      return D;
    },
    spin({ obj, scene }) {
      glow(obj, '#fde047');
      A(obj, [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.5) rotate(360deg)' },
        { transform: 'scale(1.2) rotate(720deg)' }
      ], { duration: 1300, easing: 'ease-in-out' });
      burst(scene, obj, ['#fde047', '#fff', '#fbbf24'], 12, 70);
      return 1300;
    },
    bounce({ obj }) {
      A(obj, [
        { transform: 'translateY(0)', easing: 'ease-out' }, { transform: 'translateY(-55px)', easing: 'ease-in' },
        { transform: 'translateY(0)', easing: 'ease-out' }, { transform: 'translateY(-34px)', easing: 'ease-in' },
        { transform: 'translateY(0)', easing: 'ease-out' }, { transform: 'translateY(-16px)', easing: 'ease-in' },
        { transform: 'translateY(0)' }
      ], { duration: 1200 });
      return 1200;
    },
    grow({ obj, scene }) {
      A(obj, [
        { transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.25) rotate(-4deg)' },
        { transform: 'scale(.95) rotate(4deg)' }, { transform: 'scale(1.15) rotate(-3deg)' },
        { transform: 'scale(1.1) rotate(0deg)' }
      ], { duration: 1100, easing: 'ease-in-out' });
      burst(scene, obj, ['#fde047', '#fb923c', '#fff'], 10, 80);
      return 1100;
    },
    drive({ obj, scene, W, t, sched }) {
      const dir = t.dir || -1, D = 1700;
      A(obj, [
        { offset: 0,   transform: 'translateX(0)' },
        { offset: .15, transform: 'translateX(-3px)' },
        { offset: .3,  transform: 'translateX(3px)' },
        { offset: .45, transform: 'translateX(-3px)', easing: 'cubic-bezier(.5,0,1,.6)' },
        { offset: 1,   transform: `translateX(${dir * (W + 220)}px)` }
      ], { duration: D, easing: 'linear' });
      for (let k = 0; k < 10; k++) sched(() => puff(scene, obj, '#e2e8f0', -dir * .45, .3), 600 + k * 90);
      return D;
    },
    flutter({ obj, H }) {
      const D = 2400;
      A(obj, [
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: 'translate(40px,-30px) rotate(12deg)' },
        { transform: 'translate(-10px,-80px) rotate(-12deg)' },
        { transform: 'translate(50px,-130px) rotate(12deg)' },
        { transform: 'translate(0,-180px) rotate(-10deg)' },
        { transform: `translate(40px,${-(H + 120)}px) rotate(8deg)` }
      ], { duration: D, easing: 'ease-in-out' });
      if (obj.firstElementChild) {
        A(obj.firstElementChild, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.5)' }],
          { duration: 120, iterations: 20, direction: 'alternate' });
      }
      return D;
    },
    float({ obj, H }) {
      const D = 2600;
      A(obj, [
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: 'translate(14px,-70px) rotate(5deg)' },
        { transform: 'translate(-14px,-150px) rotate(-5deg)' },
        { transform: 'translate(10px,-230px) rotate(4deg)' },
        { transform: `translate(0,${-(H + 160)}px) rotate(0deg)` }
      ], { duration: D, easing: 'ease-in' });
      return D;
    },
    bloom({ obj, scene }) {
      A(obj, [
        { transform: 'scale(.7) rotate(0deg)' }, { transform: 'scale(1.45) rotate(25deg)' },
        { transform: 'scale(.95) rotate(-12deg)' }, { transform: 'scale(1.2) rotate(6deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], { duration: 1300, easing: 'ease-out' });
      burst(scene, obj, ['#f9a8d4', '#fde047', '#fff'], 12, 75);
      return 1300;
    },
    jump({ obj, scene, sched }) {
      const h = 110;
      A(obj, [
        { transform: 'translateY(0) scale(1,1)' },
        { transform: `translateY(${-h * .5}px) scale(.9,1.15)` },
        { transform: `translateY(${-h}px) scale(1,1)` },
        { transform: `translateY(${-h * .5}px) scale(.95,1.05)` },
        { transform: 'translateY(0) scale(1.15,.85)' },
        { transform: 'translateY(0) scale(1,1)' }
      ], { duration: 1100, easing: 'ease-in-out' });
      burst(scene, obj, ['#bfdbfe', '#60a5fa', '#fff'], 10, 60);
      sched(() => burst(scene, obj, ['#bfdbfe', '#60a5fa', '#fff'], 8, 50), 850);
      return 1100;
    },
    hop({ obj }) {
      A(obj, [
        { transform: 'translateY(0) scale(1,1)' },
        { transform: 'translateY(-40px) scale(.92,1.12)' },
        { transform: 'translateY(-80px) scale(1,1)' },
        { transform: 'translateY(-40px) scale(.96,1.05)' },
        { transform: 'translateY(0) scale(1.12,.88)' },
        { transform: 'translateY(0) scale(1,1)' }
      ], { duration: 1000, easing: 'ease-in-out' });
      return 1000;
    },
    shine({ obj, scene, t }) {
      glow(obj, t.spin ? '#fbbf24' : '#fef9c3');
      const turn = t.spin ? 360 : 10;
      A(obj, [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: `scale(1.4) rotate(${t.spin ? 180 : -12}deg)` },
        { transform: `scale(1.15) rotate(${turn}deg)` }
      ], { duration: 1400, easing: 'ease-in-out' });
      burst(scene, obj, ['#fde047', '#fff', '#fbbf24'], 12, 80);
      return 1400;
    },
    fly({ obj, scene, W, H, sched }) {
      const D = 1800;
      A(obj, [
        { offset: 0,  transform: 'translate(0,0) rotate(0deg)' },
        { offset: .2, transform: 'translate(-14px,6px) rotate(4deg)' },
        { offset: 1,  transform: `translate(${W + 200}px,${-(H * .8)}px) rotate(-8deg)` }
      ], { duration: D, easing: 'ease-in' });
      for (let k = 0; k < 12; k++) sched(() => puff(scene, obj, '#ffffff', -.4, .3), 500 + k * 90);
      return D;
    },
    chomp({ obj, scene, sched }) {
      A(obj, [
        { transform: 'scale(1,1)' },
        { transform: 'scale(1.25,.75)' },
        { transform: 'translateY(-18px) scale(.85,1.2)' },
        { transform: 'scale(1.25,.75)' },
        { transform: 'translateY(-12px) scale(.85,1.2)' },
        { transform: 'scale(1,1)' }
      ], { duration: 1100, easing: 'ease-in-out' });
      sched(() => burst(scene, obj, ['#92400e', '#d97706', '#fbbf24'], 8, 55), 300);
      sched(() => burst(scene, obj, ['#92400e', '#d97706', '#fbbf24'], 8, 55), 700);
      return 1100;
    }
  };

  // ===================================================================
  // STYLES
  // ===================================================================
  const CSS = `
    .mp-wrap { display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:460px; margin:0 auto; padding:10px; font-family:system-ui,-apple-system,sans-serif; animation:mpFade .4s ease; user-select:none; -webkit-user-select:none; }
    @keyframes mpFade { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    .mp-level { font-size:14px; font-weight:bold; color:#718096; background:#EDF2F7; padding:4px 12px; border-radius:20px; }
    .mp-instr { font-size:1.2rem; font-weight:700; color:#2D3748; text-align:center; }
    .mp-scene { position:relative; width:100%; aspect-ratio:340/240; border-radius:22px; overflow:hidden; border:4px solid #fff; box-shadow:0 10px 25px rgba(0,0,0,.12); background:#bae6fd; }
    .mp-scene > svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
    .mp-obj { position:absolute; will-change:transform; pointer-events:none; }
    .mp-art { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; container-type:size; pointer-events:none; }
    .mp-art img { width:100%; height:100%; object-fit:contain; -webkit-user-drag:none; user-select:none; }
    .mp-emoji { font-size:74cqmin; line-height:1; }
    .mp-dot { position:absolute; border-radius:50%; pointer-events:none; z-index:5; }
    .mp-caption { min-height:32px; font-size:1.4rem; font-weight:800; color:#2f855a; opacity:0; transition:opacity .3s; }
    .mp-caption.show { opacity:1; }
    .mp-choices { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; width:100%; justify-items:center; }
    .mp-tile { position:relative; width:100%; max-width:104px; aspect-ratio:1; cursor:grab; touch-action:none; user-select:none; z-index:10; }
    .mp-clip { position:absolute; inset:0; overflow:hidden; }
    .mp-card .mp-clip { background:#fff; border:2px solid #E2E8F0; border-radius:20px; box-shadow:0 4px 6px rgba(0,0,0,.05); }
    .mp-card .mp-art { inset:10%; }
    .mp-piece { filter:drop-shadow(0 0 1.2px #475569) drop-shadow(0 4px 4px rgba(0,0,0,.18)); }
    .mp-piece .mp-clip { clip-path:url(#mp-piece-clip); background:#fff7ed; }
    .mp-crop { position:absolute; }
    .mp-wrong .mp-clip { background:#FFF5F5; }
    .mp-card.mp-wrong .mp-clip { border-color:#F56565; }
    .mp-piece.mp-wrong .mp-clip { background:#fecaca; }
  `;

  // ===================================================================
  // GAME FLOW
  // ===================================================================
  window.initGame = function (containerId) {
    stage = document.getElementById(containerId);
    if (!stage) return;
    levelIndex = 0;
    order = shuffle(TARGETS.slice());
    renderLevel();
  };

  function renderLevel() {
    token++;
    busy = false;
    const my = token;
    const L = levelInfo(levelIndex);
    const t = order[levelIndex];
    const hidden = L.mode === 'hidden';
    const instr = hidden ? `What is hiding in the ${COVERS[t.cover].label}?` : 'Which part belongs to this picture?';

    stage.innerHTML = `
      <style>${CSS}</style>
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <clipPath id="mp-piece-clip" clipPathUnits="objectBoundingBox"><path transform="scale(0.01)" d="${PIECE_D}"/></clipPath>
      </defs></svg>
      <div class="mp-wrap game-wrapper">
        <div class="mp-level">Level ${levelIndex + 1} / ${TOTAL}</div>
        <div class="mp-instr">${instr}</div>
        <div class="mp-scene" id="mp-scene"></div>
        <div class="mp-caption" id="mp-caption">&nbsp;</div>
        <div class="mp-choices" id="mp-choices"></div>
      </div>`;

    const scene = document.getElementById('mp-scene');
    const caption = document.getElementById('mp-caption');
    const choicesEl = document.getElementById('mp-choices');

    // --- scene: background, object, cover ---
    scene.innerHTML = bgSvg(t.bg);
    const size = hidden ? 120 : 172;
    const oy = hidden ? 112 : 120;
    const ox = (hidden && t.cover !== 'basket') ? 170 + Math.round((Math.random() * 2 - 1) * 18) : 170;
    const obj = document.createElement('div');
    obj.className = 'mp-obj';
    obj.style.cssText = `left:${(ox - size / 2) / VB_W * 100}%;top:${(oy - size / 2) / VB_H * 100}%;width:${size / VB_W * 100}%;height:${size / VB_H * 100}%;`;
    obj.appendChild(makeArt(t.icon));
    scene.appendChild(obj);

    let coverEl = null;
    if (hidden) {
      scene.insertAdjacentHTML('beforeend',
        `<svg class="mp-cover" viewBox="0 0 ${VB_W} ${VB_H}" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 ${L.shift})">${coverSvg(t.cover)}</g></svg>`);
      coverEl = scene.lastElementChild;
      coverEl.querySelectorAll('[data-bob]').forEach((g, i) => {
        const d = +g.getAttribute('data-bob');
        if (!d) return;
        g.animate([{ transform: `translateX(${-d}px)` }, { transform: `translateX(${d}px)` }],
          { duration: 2200 + i * 400, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
      });
    }

    // --- choices ---
    const picks = shuffle([t].concat(pickDistractors(t, L.similar, 3)));
    picks.forEach(p => {
      const tile = document.createElement('div');
      tile.className = 'mp-tile ' + (hidden ? 'mp-card' : 'mp-piece');
      tile.dataset.name = p.name;
      const clip = document.createElement('div');
      clip.className = 'mp-clip';
      if (hidden) {
        clip.appendChild(makeArt(p.icon));
      } else {
        const list = p.crops || CROPS;   // some shapes (the moon) are hollow in the middle and set their own crop points
        const c = list[Math.floor(Math.random() * list.length)], Z = CROP_ZOOM;
        const box = document.createElement('div');
        box.className = 'mp-crop';
        box.style.cssText = `width:${Z * 100}%;height:${Z * 100}%;left:${50 - c[0] * Z * 100}%;top:${50 - c[1] * Z * 100}%;`;
        box.appendChild(makeArt(p.icon));
        clip.appendChild(box);
      }
      tile.appendChild(clip);
      choicesEl.appendChild(tile);

      const drop = (x, y) => {
        if (busy) { if (tile.resetPosition) tile.resetPosition(); return; }
        const r = scene.getBoundingClientRect();
        const inside = x > r.left - 12 && x < r.right + 12 && y > r.top - 12 && y < r.bottom + 12;
        if (inside && p.name === t.name) onSuccess(tile, x, y);
        else onFail(tile);
      };
      if (window.GameHub && window.GameHub.utils && window.GameHub.utils.makeDraggable) {
        window.GameHub.utils.makeDraggable(tile, (x, y) => drop(x, y));
      } else {
        tile.onclick = e => { if (p.name === t.name) onSuccess(tile, e.clientX, e.clientY); else onFail(tile); };
      }
    });

    function onFail(tile) {
      if (window.GameHub) window.GameHub.playSound('wrong');
      tile.classList.add('mp-wrong');
      if (tile.resetPosition) tile.resetPosition(); else tile.style.transform = 'translate3d(0,0,0)';
      setTimeout(() => tile.classList.remove('mp-wrong'), 500);
    }

    function onSuccess(tile, x, y) {
      busy = true;
      tile.style.display = 'none';
      if (window.GameHub) { window.GameHub.triggerVFX(x, y); window.GameHub.playSound('correct'); }

      const go = () => {
        if (my !== token) return;
        if (SFX[t.sfx]) SFX[t.sfx]();
        const sched = (fn, ms) => setTimeout(() => { if (my === token) fn(); }, ms);
        const reaction = FX[t.fx] || FX.bounce;
        const ms = reaction({ obj, scene, W: scene.offsetWidth, H: scene.offsetHeight, t, sched });
        caption.textContent = t.name + '!';
        caption.classList.add('show');
        setTimeout(() => { if (my === token) nextRound(); }, ms + 700);
      };

      if (coverEl) {
        coverEl.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(35%)', opacity: 0 }],
          { duration: 450, easing: 'ease-in', fill: 'forwards' });
        setTimeout(go, 430);
      } else {
        setTimeout(go, 300);
      }
    }
  }

  function nextRound() {
    if (levelIndex < TOTAL - 1) {
      levelIndex++;
      renderLevel();
    } else if (window.GameHub && window.GameHub.showComplete) {
      token++;
      window.GameHub.showComplete('Shape Detective!', 'You found all ' + TOTAL + ' hidden pictures and parts!');
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel();
    }
  }

  window.nextRound = nextRound;
  window.previousRound = previousRound;
})();