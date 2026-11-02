/**
 * Distinguishing Images  (Reading > Pre-reading Readiness)
 * Filename: games/reading/readiness/distinguishing-images.js
 *
 * 15 LEVELS
 *   1-5    Colour contrast: find the item that looks different (unchanged from the old version)
 *   6-15   Find the hidden object (figure-ground). A small card in the corner of the board shows
 *          what to find; the object is hidden somewhere in a busy, detailed picture.
 *            6-9    find 1 object   (clutter and camouflage grow each level)
 *            10-12  find 2 objects
 *            13-15  find 3 objects
 *          Every found object reacts (the rocket launches, the fish jumps, the car drives off ...)
 *          with its own synthesized sound.  Tapping the corner card says the object's name again.
 *
 * HOW TO EDIT
 *   CONFIG       hints on/off, how many seconds before a hint, hint circle size ... (just below)
 *   FG_LEVELS    one row per hidden-object level: how many objects, how big, how much clutter,
 *                how sneaky the clutter is (mode), theme, overlap.
 *   TARGETS      the 15 objects that can be hidden (each has its own reaction `fx` and sound `sfx`).
 *   EXTRA        more pictures used only as clutter.
 *   Pictures use the PNGs from Static/Icons (window.EmojiToImageMap); the emoji is the fallback.
 *
 * You can also change the settings WITHOUT touching this file by defining, before the game loads:
 *   window.DISTINGUISH_CONFIG = { hints: { enabled: false } };
 *   window.DISTINGUISH_CONFIG = { hints: { afterSeconds: 20, repeatSeconds: 10 } };
 */
(function () {
    'use strict';

    // =====================================================================
    // SETTINGS
    // =====================================================================
    const CONFIG = {
        hints: {
            enabled: false,       // false = no hints at all
            afterSeconds: 12,    // quiet time (nothing found) before the FIRST hint circle
            repeatSeconds: 8,    // time between the following hints
            afterMisses: 6,      // also hint after this many wrong taps in a row (0 = off)
            startRadius: 105,    // size of the first hint circle (board is 340 units wide)
            shrinkBy: 25,        // every new hint circle is this much smaller, until it just fits the object
            stayMs: 4500         // how long a hint circle stays on screen
        },
        speakInstructions: false  // read "Find the key" aloud at the start of every hidden-object level
    };
    (function applyOverrides() {
        const u = window.DISTINGUISH_CONFIG;
        if (!u) return;
        if (u.hints) Object.assign(CONFIG.hints, u.hints);
        if (typeof u.speakInstructions === 'boolean') CONFIG.speakInstructions = u.speakInstructions;
    })();

    // =====================================================================
    // STATE
    // =====================================================================
    const totalRounds = 15;
    const CONTRAST_LEVELS = 5;
    let score = 0;
    let levelIndex = 0;
    let currentStage = null;
    let token = 0;              // bumped on every render; stale timers check it and do nothing
    let hintTimer = null;
    let plan = [];              // which objects are hidden in each hidden-object level

    // =====================================================================
    // STAGE 1 DATA (levels 1-5, unchanged)
    // =====================================================================
    const itemPool = [
        { char: '🍎', color: 'red' }, { char: '🍌', color: 'yellow' },
        { char: '🍇', color: 'purple' }, { char: '🍓', color: 'red' },
        { char: '🍊', color: 'orange' }, { char: '🍍', color: 'yellow' },
        { char: '🥦', color: 'green' }, { char: '🍉', color: 'green' },
        { char: '🐳', color: 'blue' }, { char: '🐧', color: 'black' },
        { char: '🐞', color: 'red' }, { char: '☀️', color: 'yellow' }
    ];

    // =====================================================================
    // HIDDEN-OBJECT DATA (levels 6-15)
    // =====================================================================
    const VB_W = 340, VB_H = 330;       // the board is drawn in a 340 x 330 coordinate space

    // n       how many objects to find
    // size    size of the hidden objects      clutter  how many other pictures      cmin/cmax  their sizes
    // mode    'contrast' clutter has different colours (easy)
    //         'camo'     clutter is mostly the SAME colour as the hidden object
    //         'cat'      clutter is mostly the same kind of thing (and colour)
    // gap     1 = clutter never overlaps, lower = more overlap (0.6 = heavy)
    // peek    how many clutter pictures partly cover each hidden object
    const FG_LEVELS = [
        { n: 1, size: 58, clutter: 14, cmin: 34, cmax: 44, mode: 'contrast', gap: 1.00, theme: 'garden',  peek: 0 },
        { n: 1, size: 52, clutter: 18, cmin: 36, cmax: 46, mode: 'contrast', gap: 0.95, theme: 'sea',     peek: 0 },
        { n: 1, size: 48, clutter: 26, cmin: 36, cmax: 46, mode: 'camo',     gap: 0.90, theme: 'toyroom', peek: 0 },
        { n: 1, size: 44, clutter: 32, cmin: 36, cmax: 48, mode: 'camo',     gap: 0.80, theme: 'space',   peek: 1 },
        { n: 2, size: 46, clutter: 28, cmin: 34, cmax: 46, mode: 'contrast', gap: 0.90, theme: 'sky',     peek: 0 },
        { n: 2, size: 42, clutter: 36, cmin: 36, cmax: 48, mode: 'camo',     gap: 0.80, theme: 'garden',  peek: 1 },
        { n: 2, size: 40, clutter: 44, cmin: 36, cmax: 48, mode: 'cat',      gap: 0.72, theme: 'sea',     peek: 1 },
        { n: 3, size: 42, clutter: 40, cmin: 36, cmax: 48, mode: 'camo',     gap: 0.75, theme: 'toyroom', peek: 1 },
        { n: 3, size: 38, clutter: 50, cmin: 36, cmax: 48, mode: 'cat',      gap: 0.65, theme: 'space',   peek: 1 },
        { n: 3, size: 36, clutter: 56, cmin: 36, cmax: 48, mode: 'cat',      gap: 0.60, theme: 'garden',  peek: 2 }
    ];

    const P = (icon, name, color, cat, extra) => Object.assign({ icon, name, color, cat }, extra);

    // The objects that can be hidden. fx = reaction, sfx = sound (both defined further down).
    const TARGETS = [
        P('🔑', 'key',       'yellow', 'object',  { fx: 'spin',     sfx: 'jingle'  }),
        P('🍎', 'apple',     'red',    'fruit',   { fx: 'bounce',   sfx: 'crunch'  }),
        P('🐟', 'fish',      'blue',   'sea',     { fx: 'jump',     sfx: 'splash'  }),
        P('🦋', 'butterfly', 'blue',   'animal',  { fx: 'flutter',  sfx: 'flutter' }),
        P('🚀', 'rocket',    'red',    'vehicle', { fx: 'launch',   sfx: 'launch'  }),
        P('🎈', 'balloon',   'red',    'object',  { fx: 'float',    sfx: 'whistle' }),
        P('⭐', 'star',      'yellow', 'sky',     { fx: 'shine',    sfx: 'twinkle' }),
        P('🚗', 'car',       'red',    'vehicle', { fx: 'drive',    sfx: 'vroom'   }),
        P('🐞', 'ladybug',   'red',    'animal',  { fx: 'crawl',    sfx: 'chirp'   }),
        P('🐝', 'bee',       'yellow', 'animal',  { fx: 'buzz',     sfx: 'buzz'    }),
        P('🐱', 'cat',       'orange', 'animal',  { fx: 'hop',      sfx: 'meow'    }),
        P('🐶', 'dog',       'brown',  'animal',  { fx: 'wiggle',   sfx: 'bark'    }),
        P('🥁', 'drum',      'red',    'object',  { fx: 'beat',     sfx: 'drum'    }),
        P('🎁', 'gift',      'red',    'object',  { fx: 'pop',      sfx: 'pop'     }),
        P('☀️', 'sun',       'yellow', 'sky',     { fx: 'sunshine', sfx: 'sunrise' })
    ];

    // Extra pictures, used only as clutter. Every icon here has a PNG in AssetsMapper.js.
    const EXTRA = [
        ['🍌', 'banana', 'yellow', 'fruit'], ['🍇', 'grapes', 'purple', 'fruit'], ['🍓', 'strawberry', 'red', 'fruit'],
        ['🍊', 'orange', 'orange', 'fruit'], ['🍍', 'pineapple', 'yellow', 'fruit'], ['🍉', 'watermelon', 'green', 'fruit'],
        ['🍐', 'pear', 'green', 'fruit'], ['🍋', 'lemon', 'yellow', 'fruit'], ['🥝', 'kiwi', 'green', 'fruit'],
        ['🥭', 'mango', 'orange', 'fruit'],
        ['🥕', 'carrot', 'orange', 'veg'], ['🥦', 'broccoli', 'green', 'veg'], ['🌽', 'corn', 'yellow', 'veg'],
        ['🍕', 'pizza', 'orange', 'food'], ['🍟', 'fries', 'yellow', 'food'], ['🍪', 'cookie', 'brown', 'food'],
        ['🍫', 'chocolate', 'brown', 'food'], ['🍞', 'bread', 'brown', 'food'], ['🧀', 'cheese', 'yellow', 'food'],
        ['🥨', 'pretzel', 'brown', 'food'], ['🍔', 'burger', 'brown', 'food'], ['🍰', 'cake', 'pink', 'food'],
        ['🌻', 'sunflower', 'yellow', 'plant'], ['🌹', 'rose', 'red', 'plant'], ['🌵', 'cactus', 'green', 'plant'],
        ['🌳', 'tree', 'green', 'plant'], ['🌲', 'pine', 'green', 'plant'], ['🌸', 'blossom', 'pink', 'plant'],
        ['🌿', 'herb', 'green', 'plant'], ['🌱', 'seedling', 'green', 'plant'], ['🍃', 'leaf', 'green', 'plant'],
        ['🐠', 'tropical fish', 'orange', 'sea'], ['🐳', 'whale', 'blue', 'sea'], ['🐋', 'big whale', 'blue', 'sea'],
        ['🐙', 'octopus', 'red', 'sea'], ['🦈', 'shark', 'blue', 'sea'], ['🪸', 'coral', 'pink', 'sea'],
        ['🐸', 'frog', 'green', 'animal'], ['🐧', 'penguin', 'black', 'animal'], ['🐰', 'rabbit', 'white', 'animal'],
        ['🦊', 'fox', 'orange', 'animal'], ['🐻', 'bear', 'brown', 'animal'], ['🐷', 'pig', 'pink', 'animal'],
        ['🐭', 'mouse', 'gray', 'animal'], ['🐯', 'tiger', 'orange', 'animal'], ['🦁', 'lion', 'yellow', 'animal'],
        ['🐹', 'hamster', 'orange', 'animal'], ['🐒', 'monkey', 'brown', 'animal'], ['🐘', 'elephant', 'gray', 'animal'],
        ['🦓', 'zebra', 'black', 'animal'], ['🐤', 'chick', 'yellow', 'animal'], ['🦜', 'parrot', 'red', 'animal'],
        ['🐛', 'caterpillar', 'green', 'animal'], ['🐜', 'ant', 'black', 'animal'], ['🐍', 'snake', 'green', 'animal'],
        ['🧸', 'teddy', 'brown', 'object'], ['⚽', 'ball', 'white', 'object'], ['🎺', 'trumpet', 'yellow', 'object'],
        ['🧢', 'cap', 'blue', 'object'], ['🎒', 'backpack', 'red', 'object'], ['🏆', 'trophy', 'yellow', 'object'],
        ['💎', 'gem', 'blue', 'object'], ['💡', 'bulb', 'yellow', 'object'], ['🎩', 'hat', 'black', 'object'],
        ['🪙', 'coin', 'yellow', 'object'], ['🏀', 'basketball', 'orange', 'object'], ['🎾', 'tennis', 'yellow', 'object'],
        ['📷', 'camera', 'black', 'object'], ['❤️', 'heart', 'red', 'object'],
        ['🌙', 'moon', 'yellow', 'sky'], ['☁️', 'cloud', 'blue', 'sky'], ['❄️', 'snowflake', 'blue', 'sky'],
        ['⚡', 'lightning', 'yellow', 'sky'], ['💧', 'drop', 'blue', 'sky'], ['🔥', 'fire', 'orange', 'sky'],
        ['🚕', 'taxi', 'yellow', 'vehicle'], ['🚌', 'bus', 'yellow', 'vehicle'], ['🚐', 'van', 'white', 'vehicle'],
        ['🚂', 'train', 'black', 'vehicle'], ['🚲', 'bicycle', 'blue', 'vehicle'], ['🚁', 'helicopter', 'red', 'vehicle'],
        ['✈️', 'plane', 'blue', 'vehicle'], ['⛵', 'boat', 'blue', 'vehicle'], ['🚢', 'ship', 'blue', 'vehicle']
    ].map(e => P(e[0], e[1], e[2], e[3]));

    const POOL = TARGETS.concat(EXTRA);
    const TWINS = { '🐟': '🐠', '🐠': '🐟' };   // pictures too alike to be used as clutter for each other
    const isTwin = (a, b) => TWINS[a] === b || TWINS[b] === a;

    // =====================================================================
    // SMALL HELPERS
    // =====================================================================
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
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
        for (const c of [icon, bare, bare + '️']) {
            if (map[c]) return 'Static/Icons/' + map[c] + '.png';
        }
        return null;
    }

    // A picture: the PNG icon, or the emoji text if there is no PNG / it fails to load
    function makeArt(icon) {
        const art = document.createElement('div');
        art.className = 'fg-art';
        const showEmoji = () => {
            art.innerHTML = '';
            const s = document.createElement('span');
            s.className = 'fg-emoji';
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

    function speak(text) {
        try { if (window.GameHub && typeof window.GameHub.speak === 'function') window.GameHub.speak(text, 'en-US'); } catch (e) { /* ignore */ }
    }

    // Which objects are hidden in each hidden-object level (no repeats inside a level, little repetition overall)
    function makePlan() {
        let deck = [];
        plan = FG_LEVELS.map(cfg => {
            const picks = [];
            while (picks.length < cfg.n) {
                if (!deck.length) deck = shuffle(TARGETS.slice());
                const t = deck.pop();
                if (!picks.includes(t)) picks.push(t);
            }
            return picks;
        });
    }

    // =====================================================================
    // SOUND  (all synthesized with Web Audio, no files needed)
    // =====================================================================
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
        jingle() {
            [1568, 2093, 1760, 2349, 2637].forEach((f, i) => Snd.tone({ type: 'triangle', f0: f, dur: .25, vol: .15, t: i * .09 }));
            Snd.noise({ filter: 'highpass', f0: 5000, dur: .12, vol: .1 });
        },
        crunch() {
            [0, .1, .2].forEach(d => Snd.noise({ filter: 'bandpass', f0: 2500, dur: .07, vol: .35, q: 1.5, t: d, attack: .005 }));
            Snd.tone({ f0: 400, f1: 800, dur: .1, vol: .12, t: .3 });
        },
        splash() {
            Snd.noise({ filter: 'highpass', f0: 900, dur: .45, vol: .35, attack: .01 });
            Snd.tone({ f0: 520, f1: 1100, dur: .16, vol: .16, t: .05 });
            Snd.tone({ f0: 700, f1: 1500, dur: .14, vol: .12, t: .16 });
        },
        flutter() {
            Snd.tone({ f0: 880, f1: 1100, dur: .9, vol: .14, trem: 16 });
            Snd.tone({ f0: 1320, f1: 1500, dur: .7, vol: .07, trem: 20, t: .3 });
        },
        launch() {
            Snd.noise({ filter: 'bandpass', f0: 250, f1: 2600, dur: 1.9, vol: .45, q: .7, attack: .3 });
            Snd.tone({ type: 'sawtooth', f0: 60, f1: 240, dur: 1.9, vol: .16, lp: 500, attack: .25 });
            Snd.tone({ type: 'sine', f0: 45, f1: 120, dur: 1.2, vol: .35, attack: .05 });
        },
        whistle() {
            Snd.tone({ f0: 500, f1: 1300, dur: .6, vol: .16, attack: .05 });
            Snd.tone({ type: 'triangle', f0: 1000, f1: 1400, dur: .4, vol: .08, t: .4 });
        },
        twinkle() { [1047, 1319, 1568, 2093].forEach((f, i) => Snd.tone({ type: 'triangle', f0: f, dur: .22, vol: .18, t: i * .11 })); },
        vroom() {
            Snd.tone({ type: 'square', f0: 392, dur: .12, vol: .12 });
            Snd.tone({ type: 'square', f0: 392, dur: .12, vol: .12, t: .2 });
            Snd.tone({ type: 'sawtooth', f0: 80, f1: 320, dur: 1.0, vol: .13, t: .45, lp: 700 });
            Snd.noise({ filter: 'lowpass', f0: 400, dur: 1.0, vol: .1, t: .45 });
        },
        chirp() { [0, .13, .26].forEach(d => Snd.tone({ path: [[0, 1800], [.08, 2700]], dur: .1, vol: .13, t: d })); },
        buzz() {
            Snd.tone({ type: 'sawtooth', f0: 190, f1: 230, dur: 1.5, vol: .1, lp: 1100, trem: 38 });
            Snd.tone({ type: 'sawtooth', f0: 380, f1: 330, dur: 1.2, vol: .05, lp: 1500, trem: 44, t: .15 });
        },
        meow() { Snd.tone({ type: 'sawtooth', path: [[0, 480], [.18, 950], [.5, 520]], dur: .5, vol: .15, lp: 2200, attack: .04 }); },
        bark() { [0, .24].forEach(d => Snd.tone({ type: 'sawtooth', path: [[0, 420], [.14, 170]], dur: .16, vol: .2, lp: 1300, t: d })); },
        drum() {
            [0, .22, .44, .6].forEach(d => {
                Snd.tone({ path: [[0, 190], [.15, 60]], dur: .2, vol: .4, t: d });
                Snd.noise({ filter: 'lowpass', f0: 500, dur: .08, vol: .22, t: d });
            });
        },
        pop() {
            Snd.noise({ filter: 'bandpass', f0: 1500, dur: .09, vol: .4, q: 1, attack: .005 });
            Snd.tone({ path: [[0, 650], [.12, 200]], dur: .14, vol: .22 });
            for (let i = 0; i < 6; i++) Snd.tone({ type: 'triangle', f0: 1500 + Math.random() * 1800, dur: .14, vol: .11, t: .15 + i * .06 });
        },
        sunrise() { [523, 659, 784, 1047].forEach((f, i) => Snd.tone({ type: 'triangle', f0: f, dur: .35, vol: .17, t: i * .13 })); },
        miss() { Snd.tone({ f0: 330, f1: 230, dur: .16, vol: .07 }); },
        hint() { Snd.tone({ type: 'triangle', f0: 880, f1: 1175, dur: .3, vol: .07 }); }
    };

    // =====================================================================
    // BACKGROUNDS: busy, detailed scenery (generated, so every round looks a little different)
    // =====================================================================
    const THEMES = {
        garden:  { top: '#ecfccb', bot: '#bbf7d0' },
        sea:     { top: '#bae6fd', bot: '#38bdf8' },
        space:   { top: '#1e1b4b', bot: '#581c87' },
        toyroom: { top: '#fef3c7', bot: '#fde68a' },
        sky:     { top: '#7dd3fc', bot: '#e0f2fe' }
    };

    function decoFor(theme, n) {
        let out = '';
        const X = () => rnd(0, VB_W), Y = () => rnd(0, VB_H);
        for (let i = 0; i < n; i++) {
            const x = X(), y = Y(), a = rnd(0, 360);
            switch (theme) {
                case 'garden':
                    if (i % 3 === 0) out += `<ellipse cx="${x}" cy="${y}" rx="${rnd(7, 14)}" ry="${rnd(3, 6)}" transform="rotate(${a} ${x} ${y})" fill="${pick(['#86efac', '#4ade80', '#bef264', '#a3e635'])}" opacity=".5"/>`;
                    else if (i % 3 === 1) out += `<path d="M${x} ${y} q${rnd(-4, 4)} ${-rnd(8, 16)} ${rnd(-6, 6)} ${-rnd(16, 26)}" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".5"/>`;
                    else out += `<circle cx="${x}" cy="${y}" r="${rnd(2, 4)}" fill="${pick(['#f9a8d4', '#fde047', '#fff', '#fdba74'])}" opacity=".6"/>`;
                    break;
                case 'sea':
                    if (i % 3 === 0) out += `<circle cx="${x}" cy="${y}" r="${rnd(2, 7)}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".55"/>`;
                    else if (i % 3 === 1) out += `<path d="M${x} ${y} q6 -7 12 0 t12 0 t12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".4" stroke-linecap="round"/>`;
                    else out += `<path d="M${x} ${y} q7 -9 0 -18 t0 -18" stroke="#34d399" stroke-width="3" fill="none" stroke-linecap="round" opacity=".4"/>`;
                    break;
                case 'space':
                    if (i % 4 === 3) out += `<circle cx="${x}" cy="${y}" r="${rnd(6, 14)}" fill="${pick(['#a78bfa', '#f472b6', '#60a5fa', '#34d399'])}" opacity=".22"/>`;
                    else if (i % 4 === 2) out += `<path d="M${x - 4} ${y} H${x + 4} M${x} ${y - 4} V${y + 4}" stroke="#fff" stroke-width="1.4" opacity=".6"/>`;
                    else out += `<circle cx="${x}" cy="${y}" r="${rnd(.6, 1.9)}" fill="#fff" opacity="${rnd(.4, .9).toFixed(2)}"/>`;
                    break;
                case 'toyroom':
                    if (i % 4 === 0) out += `<rect x="${x}" y="${y}" width="${rnd(8, 16)}" height="${rnd(8, 16)}" rx="2" transform="rotate(${a} ${x} ${y})" fill="${pick(['#fda4af', '#93c5fd', '#86efac', '#c4b5fd'])}" opacity=".42"/>`;
                    else if (i % 4 === 1) out += `<polygon points="${x},${y - 9} ${x + 9},${y + 7} ${x - 9},${y + 7}" transform="rotate(${a} ${x} ${y})" fill="${pick(['#fdba74', '#f9a8d4', '#a5f3fc'])}" opacity=".42"/>`;
                    else if (i % 4 === 2) out += `<polyline points="${x},${y} ${x + 6},${y - 7} ${x + 12},${y} ${x + 18},${y - 7} ${x + 24},${y}" stroke="${pick(['#f472b6', '#60a5fa', '#34d399'])}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".45"/>`;
                    else out += `<circle cx="${x}" cy="${y}" r="${rnd(3, 6)}" fill="${pick(['#fcd34d', '#f9a8d4', '#a7f3d0'])}" opacity=".5"/>`;
                    break;
                default: // sky
                    if (i % 3 === 0) out += `<ellipse cx="${x}" cy="${y}" rx="${rnd(14, 26)}" ry="${rnd(5, 9)}" fill="#fff" opacity=".5"/><ellipse cx="${x + 9}" cy="${y - 4}" rx="${rnd(8, 14)}" ry="${rnd(4, 7)}" fill="#fff" opacity=".5"/>`;
                    else if (i % 3 === 1) out += `<path d="M${x} ${y} q4 -5 8 0 q4 -5 8 0" stroke="#64748b" stroke-width="1.6" fill="none" opacity=".4" stroke-linecap="round"/>`;
                    else out += `<circle cx="${x}" cy="${y}" r="${rnd(1.5, 3)}" fill="#fff" opacity=".7"/>`;
            }
        }
        return out;
    }

    function bgSvg(theme) {
        const t = THEMES[theme] || THEMES.garden;
        return `<svg class="fg-bg" viewBox="0 0 ${VB_W} ${VB_H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs><linearGradient id="fg-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.top}"/><stop offset="1" stop-color="${t.bot}"/></linearGradient></defs>
            <rect width="${VB_W}" height="${VB_H}" fill="url(#fg-grad)"/>${decoFor(theme, 90)}</svg>`;
    }

    // =====================================================================
    // CLUTTER + LAYOUT
    // =====================================================================
    function pickClutter(targets, mode, count) {
        const tIcons = new Set(targets.map(t => t.icon));
        const colors = new Set(targets.map(t => t.color));
        const cats = new Set(targets.map(t => t.cat));
        const ok = p => !tIcons.has(p.icon) && !targets.some(t => isTwin(t.icon, p.icon));
        const base = POOL.filter(ok);

        const sameCat = base.filter(p => cats.has(p.cat) && colors.has(p.color));
        const catOnly = base.filter(p => cats.has(p.cat) && !colors.has(p.color));
        const colorOnly = base.filter(p => colors.has(p.color) && !cats.has(p.cat));
        const diffColor = base.filter(p => !colors.has(p.color));
        const anyOther = base;

        // weighted source lists per mode (the first non-empty list is the fallback)
        let sources;
        if (mode === 'contrast') sources = [[1, diffColor]];
        else if (mode === 'camo') sources = [[.8, sameCat.concat(colorOnly)], [.2, anyOther]];
        else sources = [[.35, sameCat], [.3, catOnly], [.25, colorOnly], [.1, anyOther]];
        sources = sources.filter(s => s[1].length);
        if (!sources.length) sources = [[1, anyOther]];

        const queues = sources.map(s => shuffle(s[1].slice()));
        const out = [];
        for (let i = 0; i < count; i++) {
            let r = Math.random() * sources.reduce((a, s) => a + s[0], 0), si = 0;
            for (; si < sources.length - 1; si++) { r -= sources[si][0]; if (r <= 0) break; }
            if (!queues[si].length) queues[si] = shuffle(sources[si][1].slice());
            out.push(queues[si].pop());
        }
        return out;
    }

    function layout(cfg, targets, clutter) {
        const M = 6;
        // the corner card hides this part of the board: keep every picture out of it
        const cardW = (2 + 4 + targets.length * 13 + (targets.length - 1) * 1.2) * (VB_W / 100) + 6;
        const cardH = (2 + 19) * (VB_W / 100) + 4;
        const items = [];

        const inside = (x, y, s) => x - s / 2 >= M && x + s / 2 <= VB_W - M && y - s / 2 >= M && y + s / 2 <= VB_H - M;
        const inCard = (x, y, s) => x + s / 2 > 0 && x - s / 2 < cardW && y + s / 2 > 0 && y - s / 2 < cardH;
        const free = (x, y, s, gap, list) => {
            if (!inside(x, y, s) || inCard(x, y, s)) return false;
            for (const it of list) if (Math.hypot(x - it.x, y - it.y) < (s + it.s) / 2 * gap) return false;
            return true;
        };

        // 1. the hidden objects (never touching each other)
        const tItems = [];
        targets.forEach(def => {
            const s = cfg.size;
            for (let tries = 0; tries < 400; tries++) {
                const x = rnd(M + s / 2, VB_W - M - s / 2), y = rnd(M + s / 2, VB_H - M - s / 2);
                if (free(x, y, s, 1.6, tItems)) { tItems.push({ x, y, s, rot: rnd(-8, 8), icon: def.icon, def }); return; }
            }
            tItems.push({ x: rnd(120, 280), y: rnd(120, 280), s, rot: 0, icon: def.icon, def });   // never reached in practice
        });
        items.push(...tItems);

        // 2. clutter that partly covers each hidden object (drawn on top of it, never hides it completely)
        const queue = clutter.slice();
        const peekers = [];
        tItems.forEach(t => {
            for (let i = 0; i < cfg.peek && queue.length; i++) {
                const p = queue.pop(), s = rnd(cfg.cmin, cfg.cmax);
                for (let tries = 0; tries < 40; tries++) {
                    const a = rnd(0, Math.PI * 2), d = (t.s + s) / 2 * rnd(.58, .72);
                    const x = t.x + Math.cos(a) * d, y = t.y + Math.sin(a) * d;
                    if (inside(x, y, s) && !inCard(x, y, s)) { peekers.push({ x, y, s, rot: rnd(-28, 28), icon: p.icon }); break; }
                }
            }
        });

        // 3. the rest of the clutter, spread over the board
        const placed = items.concat(peekers);
        const rest = [];
        queue.forEach(p => {
            const s = rnd(cfg.cmin, cfg.cmax);
            let gap = cfg.gap;
            for (let tries = 0; tries < 70; tries++) {
                if (tries && tries % 20 === 0) gap *= .9;     // squeeze in if the board is getting full
                const x = rnd(M + s / 2, VB_W - M - s / 2), y = rnd(M + s / 2, VB_H - M - s / 2);
                if (free(x, y, s, gap, placed)) {
                    const it = { x, y, s, rot: rnd(-28, 28), icon: p.icon };
                    placed.push(it); rest.push(it);
                    return;
                }
            }
        });

        // draw order: clutter and hidden objects shuffled together, the "peeking" clutter always on top
        return { order: shuffle(rest.concat(tItems)).concat(peekers), targets: tItems };
    }

    // =====================================================================
    // REACTIONS (what the object does when it is found)
    // Each one returns how long it lasts (ms). Objects that fly off leave the board.
    // =====================================================================
    const A = (el, kf, opt) => el.animate(kf, Object.assign({ fill: 'forwards' }, opt));
    const glow = (el, color) => { el.style.filter = 'drop-shadow(0 0 7px ' + color + ') drop-shadow(0 0 14px ' + color + ')'; };

    function burst(scene, cen, colors, n, dist) {
        for (let i = 0; i < n; i++) {
            const d = document.createElement('div');
            const sz = 5 + Math.random() * 7;
            d.className = 'fg-dot';
            d.style.cssText = `left:${cen.x - sz / 2}px;top:${cen.y - sz / 2}px;width:${sz}px;height:${sz}px;background:${colors[i % colors.length]}`;
            scene.appendChild(d);
            const a = Math.PI * 2 * i / n + Math.random() * .5, dd = dist * (.6 + Math.random() * .8);
            const an = d.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(a) * dd}px,${Math.sin(a) * dd}px) scale(.2)`, opacity: 0 }
            ], { duration: 700 + Math.random() * 300, easing: 'ease-out' });
            an.onfinish = () => d.remove();
        }
    }

    function puff(scene, cen, color, dx, dy) {
        const sz = 12 + Math.random() * 10;
        const d = document.createElement('div');
        d.className = 'fg-dot';
        d.style.cssText = `left:${cen.x + dx - sz / 2}px;top:${cen.y + dy - sz / 2}px;width:${sz}px;height:${sz}px;background:${color}`;
        scene.appendChild(d);
        const an = d.animate([
            { transform: 'translate(0,0) scale(.6)', opacity: .95 },
            { transform: `translate(${(Math.random() - .5) * 16}px,14px) scale(2)`, opacity: 0 }
        ], { duration: 650, easing: 'ease-out' });
        an.onfinish = () => d.remove();
    }

    // c = { item, scene, t (x, y, s in board units), k (pixels per board unit), later(fn, ms), center(), burst(), puff() }
    const FX = {
        spin(c) {
            glow(c.item, '#fde047');
            A(c.item, [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.7) rotate(360deg)' }, { transform: 'scale(1.25) rotate(720deg)' }], { duration: 1300, easing: 'ease-in-out' });
            c.burst(['#fde047', '#fff', '#fbbf24'], 14, 52 * c.k);
            return 1300;
        },
        bounce(c) {
            const u = c.k;
            glow(c.item, '#4ade80');
            A(c.item, [
                { transform: 'translateY(0)', easing: 'ease-out' }, { transform: `translateY(${-34 * u}px)`, easing: 'ease-in' },
                { transform: 'translateY(0)', easing: 'ease-out' }, { transform: `translateY(${-20 * u}px)`, easing: 'ease-in' },
                { transform: 'translateY(0)', easing: 'ease-out' }, { transform: `translateY(${-9 * u}px)`, easing: 'ease-in' },
                { transform: 'translateY(0) scale(1.15)' }
            ], { duration: 1200 });
            c.later(() => c.burst(['#f87171', '#fecaca', '#4ade80'], 8, 38 * u), 1000);
            return 1200;
        },
        jump(c) {
            const u = c.k, h = 70 * u;
            glow(c.item, '#38bdf8');
            A(c.item, [
                { transform: 'translateY(0) scale(1,1)' },
                { transform: `translateY(${-h * .5}px) scale(.9,1.15) rotate(-15deg)` },
                { transform: `translateY(${-h}px) scale(1,1) rotate(0deg)` },
                { transform: `translateY(${-h * .5}px) scale(.95,1.05) rotate(15deg)` },
                { transform: 'translateY(0) scale(1.2,.85) rotate(0deg)' },
                { transform: 'translateY(0) scale(1.1,1.1)' }
            ], { duration: 1100, easing: 'ease-in-out' });
            c.burst(['#bfdbfe', '#60a5fa', '#fff'], 10, 40 * u);
            c.later(() => c.burst(['#bfdbfe', '#60a5fa', '#fff'], 8, 34 * u), 850);
            return 1100;
        },
        flutter(c) {
            const u = c.k, up = -(c.t.y + c.t.s + 40) * u;
            A(c.item, [
                { transform: 'translate(0,0) rotate(0deg)' },
                { transform: `translate(${20 * u}px,${-20 * u}px) rotate(12deg)` },
                { transform: `translate(${-14 * u}px,${-50 * u}px) rotate(-12deg)` },
                { transform: `translate(${24 * u}px,${-90 * u}px) rotate(12deg)` },
                { transform: `translate(${-10 * u}px,${-130 * u}px) rotate(-10deg)` },
                { transform: `translate(${14 * u}px,${up}px) rotate(8deg)` }
            ], { duration: 2300, easing: 'ease-in-out' });
            const art = c.item.querySelector('.fg-rot');
            if (art) A(art, [{ transform: art.style.transform + ' scaleX(1)' }, { transform: art.style.transform + ' scaleX(.45)' }], { duration: 120, iterations: 20, direction: 'alternate' });
            return 2300;
        },
        launch(c) {
            const u = c.k, D = 2100;
            A(c.item, [
                { offset: 0,   transform: 'translate(0,0) rotate(0deg) scale(1)' },
                { offset: .08, transform: 'translate(0,0) rotate(-45deg) scale(1)' },
                { offset: .2,  transform: 'translate(-3px,2px) rotate(-45deg)' },
                { offset: .3,  transform: 'translate(3px,-2px) rotate(-45deg)' },
                { offset: .4,  transform: 'translate(-3px,2px) rotate(-45deg)', easing: 'cubic-bezier(.55,0,1,.45)' },
                { offset: 1,   transform: `translate(0,${-(c.t.y + c.t.s + 60) * u}px) rotate(-45deg) scale(.6)` }
            ], { duration: D, easing: 'linear' });
            for (let i = 0; i < 14; i++) c.later(() => c.puff(i % 2 ? '#fde68a' : '#fb923c', 0, c.t.s * u * .35), 450 + i * 85);
            return D;
        },
        float(c) {
            const u = c.k;
            A(c.item, [
                { transform: 'translate(0,0) rotate(0deg)' },
                { transform: `translate(${10 * u}px,${-50 * u}px) rotate(5deg)` },
                { transform: `translate(${-10 * u}px,${-110 * u}px) rotate(-5deg)` },
                { transform: `translate(${8 * u}px,${-170 * u}px) rotate(4deg)` },
                { transform: `translate(0,${-(c.t.y + c.t.s + 50) * u}px) rotate(0deg)` }
            ], { duration: 2500, easing: 'ease-in' });
            return 2500;
        },
        shine(c) {
            glow(c.item, '#fde047');
            A(c.item, [
                { transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.6) rotate(-12deg)' },
                { transform: 'scale(1.2) rotate(10deg)' }, { transform: 'scale(1.5) rotate(-6deg)' },
                { transform: 'scale(1.25) rotate(0deg)' }
            ], { duration: 1300, easing: 'ease-in-out' });
            c.burst(['#fde047', '#fff', '#fbbf24'], 14, 56 * c.k);
            c.later(() => c.burst(['#fde047', '#fff'], 8, 40 * c.k), 600);
            return 1300;
        },
        drive(c) {
            const u = c.k, D = 1700;
            A(c.item, [
                { offset: 0,   transform: 'translateX(0)' },
                { offset: .15, transform: 'translateX(-3px)' },
                { offset: .3,  transform: 'translateX(3px)' },
                { offset: .45, transform: 'translateX(-3px)', easing: 'cubic-bezier(.5,0,1,.6)' },
                { offset: 1,   transform: `translateX(${-(c.t.x + c.t.s + 30) * u}px)` }
            ], { duration: D, easing: 'linear' });
            for (let i = 0; i < 9; i++) c.later(() => c.puff('#e2e8f0', c.t.s * u * .45, c.t.s * u * .3), 550 + i * 90);
            return D;
        },
        crawl(c) {
            const u = c.k;
            A(c.item, [
                { transform: 'translate(0,0) rotate(0deg)' },
                { transform: `translate(${6 * u}px,${-4 * u}px) rotate(14deg)` },
                { transform: `translate(${12 * u}px,${-2 * u}px) rotate(-14deg)` },
                { transform: `translate(${20 * u}px,${-10 * u}px) rotate(14deg)` },
                { transform: `translate(${60 * u}px,${-50 * u}px) rotate(20deg) scale(1.1)` },
                { transform: `translate(${(VB_W - c.t.x + c.t.s) * u}px,${-(c.t.y + c.t.s) * u}px) rotate(30deg) scale(.7)` }
            ], { duration: 1900, easing: 'ease-in' });
            return 1900;
        },
        buzz(c) {
            const u = c.k;
            A(c.item, [
                { transform: 'translate(0,0) rotate(0deg)' },
                { transform: `translate(${-26 * u}px,${-14 * u}px) rotate(-14deg)` },
                { transform: `translate(${26 * u}px,${-34 * u}px) rotate(14deg)` },
                { transform: `translate(${-26 * u}px,${-54 * u}px) rotate(-14deg)` },
                { transform: `translate(${26 * u}px,${-74 * u}px) rotate(14deg)` },
                { transform: `translate(${(VB_W - c.t.x + c.t.s) * u}px,${-(c.t.y * .8 + 40) * u}px) rotate(10deg)` }
            ], { duration: 2000, easing: 'ease-in-out' });
            return 2000;
        },
        hop(c) {
            const u = c.k;
            glow(c.item, '#fdba74');
            A(c.item, [
                { transform: 'translateY(0) scale(1,1)' },
                { transform: `translateY(${-24 * u}px) scale(.92,1.12)` },
                { transform: `translateY(${-50 * u}px) scale(1,1)` },
                { transform: `translateY(${-24 * u}px) scale(.96,1.05)` },
                { transform: 'translateY(0) scale(1.12,.88)' },
                { transform: `translateY(${-14 * u}px) scale(1,1)` },
                { transform: 'translateY(0) scale(1.1,1.1)' }
            ], { duration: 1100, easing: 'ease-in-out' });
            return 1100;
        },
        wiggle(c) {
            const u = c.k;
            glow(c.item, '#a3e635');
            A(c.item, [
                { transform: 'translateY(0) rotate(0deg)' },
                { transform: `translateY(${-22 * u}px) rotate(-14deg)` },
                { transform: 'translateY(0) rotate(12deg)' },
                { transform: `translateY(${-22 * u}px) rotate(-12deg)` },
                { transform: 'translateY(0) rotate(10deg)' },
                { transform: 'translateY(0) rotate(0deg) scale(1.15)' }
            ], { duration: 1100, easing: 'ease-in-out' });
            return 1100;
        },
        beat(c) {
            glow(c.item, '#f87171');
            A(c.item, [
                { transform: 'scale(1,1)' }, { transform: 'scale(1.25,.8)' }, { transform: 'scale(.92,1.12)' },
                { transform: 'scale(1.25,.8)' }, { transform: 'scale(.92,1.12)' },
                { transform: 'scale(1.25,.8)' }, { transform: 'scale(1.1,1.1)' }
            ], { duration: 1200, easing: 'ease-in-out' });
            [0, 220, 440, 600].forEach(ms => c.later(() => c.burst(['#fecaca', '#f87171', '#fff'], 6, 34 * c.k), ms));
            return 1200;
        },
        pop(c) {
            glow(c.item, '#f472b6');
            A(c.item, [
                { transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(-12deg) scale(1.05)' }, { transform: 'rotate(12deg) scale(1.1)' },
                { transform: 'rotate(-12deg) scale(1.15)' }, { transform: 'rotate(0deg) scale(1.7)' }, { transform: 'rotate(0deg) scale(1.25)' }
            ], { duration: 1100, easing: 'ease-in-out' });
            c.later(() => c.burst(['#f87171', '#fde047', '#4ade80', '#60a5fa', '#f472b6'], 22, 66 * c.k), 650);
            return 1100;
        },
        sunshine(c) {
            glow(c.item, '#fbbf24');
            A(c.item, [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.55) rotate(180deg)' }, { transform: 'scale(1.3) rotate(360deg)' }], { duration: 1400, easing: 'ease-in-out' });
            c.burst(['#fde047', '#fff', '#fbbf24'], 16, 60 * c.k);
            return 1400;
        }
    };

    // =====================================================================
    // STYLES
    // =====================================================================
    function injectStyles() {
        if (!document.getElementById('game-vfx-styles')) {
            const style = document.createElement('style');
            style.id = 'game-vfx-styles';
            style.innerHTML = `
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }
        if (!document.getElementById('fg-styles')) {
            const s = document.createElement('style');
            s.id = 'fg-styles';
            s.innerHTML = `
                .fg-scene { position: relative; width: 100%; max-width: 380px; margin: 0 auto; aspect-ratio: ${VB_W} / ${VB_H}; border-radius: 22px; overflow: hidden;
                    box-shadow: 0 0 0 4px #fff, 0 10px 25px rgba(0,0,0,.14); container-type: inline-size; touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent; cursor: pointer; user-select: none; -webkit-user-select: none; background: #bae6fd; }
                .fg-bg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
                .fg-item { position: absolute; pointer-events: none; will-change: transform; }
                .fg-rot { position: relative; width: 100%; height: 100%; }
                .fg-art { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; container-type: size; pointer-events: none; }
                .fg-art img { width: 100%; height: 100%; object-fit: contain; -webkit-user-drag: none; user-select: none; pointer-events: none; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.3)); }
                .fg-emoji { font-size: 74cqmin; line-height: 1; }
                .fg-card { position: absolute; left: 2cqw; top: 2cqw; display: flex; gap: 1.2cqw; padding: 1.6cqw 2cqw 1.4cqw; background: rgba(255,255,255,.93);
                    border-radius: 3.5cqw; box-shadow: 0 2px 8px rgba(0,0,0,.25); z-index: 90; cursor: pointer; }
                .fg-slot { position: relative; width: 13cqw; display: flex; flex-direction: column; align-items: center; gap: .3cqw; transition: opacity .3s; }
                .fg-slot .fg-art { position: relative; inset: auto; width: 10.5cqw; height: 10.5cqw; }
                .fg-name { font-size: max(9px, 3cqw); font-weight: 800; color: #334155; line-height: 1.1; text-transform: lowercase; white-space: nowrap; }
                .fg-slot.done { opacity: .55; }
                .fg-slot.done::after { content: '✓'; position: absolute; top: -.6cqw; right: .4cqw; width: 4.6cqw; height: 4.6cqw; border-radius: 50%; background: #22c55e; color: #fff;
                    font-size: 3.3cqw; font-weight: 900; display: flex; align-items: center; justify-content: center; }
                .fg-dot { position: absolute; border-radius: 50%; pointer-events: none; z-index: 95; }
                .fg-ripple { position: absolute; width: 10cqw; height: 10cqw; margin: -5cqw 0 0 -5cqw; border-radius: 50%; border: 3px solid rgba(255,255,255,.9);
                    background: rgba(255,255,255,.2); pointer-events: none; z-index: 70; animation: fgRipple .5s ease-out forwards; }
                @keyframes fgRipple { from { transform: scale(.3); opacity: 1; } to { transform: scale(1.7); opacity: 0; } }
                .fg-hint { position: absolute; border-radius: 50%; border: 4px solid #fde047; box-shadow: 0 0 0 3px rgba(250,204,21,.35), 0 0 18px #facc15;
                    pointer-events: none; z-index: 80; animation: fgPulse 1.1s ease-in-out infinite; }
                @keyframes fgPulse { 0%, 100% { transform: scale(.95); } 50% { transform: scale(1.06); } }
            `;
            document.head.appendChild(s);
        }
    }

    // =====================================================================
    // GAME SHELL (header, instruction, grid)
    // =====================================================================
    const GRID_CSS = 'display: grid; gap: 10px; margin-bottom: 20px; min-height: 300px; align-items: center; justify-content: center; width: 100%;';
    const FG_GRID_CSS = 'display: block; width: 100%; margin: 0 auto 16px; min-height: 0;';

    window.initGame = function (containerId) {
        currentStage = document.getElementById(containerId);
        if (!currentStage) return;
        currentStage.innerHTML = '';
        levelIndex = 0;
        score = 0;
        injectStyles();
        makePlan();

        const gameWrapper = document.createElement('div');
        gameWrapper.className = 'game-wrapper';
        gameWrapper.style.cssText = `display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 100%; animation: fadeIn 0.5s ease; user-select: none; padding: 10px; box-sizing: border-box; justify-content: flex-start;`;

        const header = document.createElement('div');
        header.style.cssText = "display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 350px; margin-bottom: 10px;";

        const prevBtn = document.createElement('button');
        prevBtn.id = "prev-btn";
        prevBtn.innerText = "⬅️ Previous";
        prevBtn.style.cssText = "background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #718096; visibility: hidden;";
        prevBtn.onclick = previousRound;

        const stats = document.createElement('div');
        stats.id = "game-stats";
        stats.style.cssText = `font-weight: bold; color: #718096; font-size: 1rem; background: #EDF2F7; padding: 6px 14px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);`;

        header.appendChild(prevBtn);
        header.appendChild(stats);

        const instruction = document.createElement('h2');
        instruction.id = "game-instruction";
        instruction.style.cssText = "margin-bottom: 10px; color: #2D3748; text-align: center; font-size: 1.4rem; width: 100%;";

        const grid = document.createElement('div');
        grid.id = "game-grid";
        grid.style.cssText = GRID_CSS;

        gameWrapper.appendChild(header);
        gameWrapper.appendChild(instruction);
        gameWrapper.appendChild(grid);
        currentStage.appendChild(gameWrapper);

        renderRound();
    };

    function renderRound() {
        token++;
        clearTimeout(hintTimer);
        const grid = document.getElementById('game-grid');
        const stats = document.getElementById('game-stats');
        const instruction = document.getElementById('game-instruction');
        const prevBtn = document.getElementById('prev-btn');
        if (!grid) return;

        grid.innerHTML = '';
        grid.style.cssText = GRID_CSS;
        stats.innerText = `Level: ${levelIndex + 1} / ${totalRounds} | Score: ${score}`;
        if (prevBtn) prevBtn.style.visibility = levelIndex > 0 ? 'visible' : 'hidden';

        if (levelIndex < CONTRAST_LEVELS) setupContrastStage(grid, instruction);
        else setupFindStage(grid, instruction, levelIndex - CONTRAST_LEVELS);
    }

    // =====================================================================
    // LEVELS 1-5: colour contrast (unchanged)
    // =====================================================================
    function setupContrastStage(grid, instruction) {
        instruction.innerText = "Find the item that looks different!";
        grid.style.gridTemplateColumns = "repeat(3, 100px)";
        let main = itemPool[Math.floor(Math.random() * itemPool.length)];
        let odd = itemPool[Math.floor(Math.random() * itemPool.length)];
        while (odd.color === main.color || odd.char === main.char) {
            odd = itemPool[Math.floor(Math.random() * itemPool.length)];
        }
        createGrid(grid, 9, main.char, odd.char);
    }

    function createGrid(grid, count, mainChar, oddChar) {
        const oddIndex = Math.floor(Math.random() * count);
        for (let i = 0; i < count; i++) {
            const char = (i === oddIndex) ? oddChar : mainChar;
            const card = createCard(char);
            card.onclick = (e) => {
                if (i === oddIndex) onCorrect(e, card, grid);
                else onWrong(card);
            };
            grid.appendChild(card);
        }
    }

    function createCard(symbol) {
        const card = document.createElement('button');
        card.innerText = symbol;
        card.classList = 'option-icon';
        card.style.cssText = `font-size: 40px; width: 90px; height: 90px; border: 3px solid #E2E8F0; border-radius: 20px; background: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); outline: none; margin: auto;`;
        card.onmouseenter = () => card.style.transform = "scale(1.05)";
        card.onmouseleave = () => card.style.transform = "scale(1)";
        return card;
    }

    function onCorrect(e, card, grid) {
        score++;
        updateStats();
        if (window.GameHub) {
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            window.GameHub.playSound('correct');
        }
        card.style.background = "#C6F6D5";
        card.style.borderColor = "#48BB78";
        grid.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
        const my = token;
        setTimeout(() => { if (my === token) nextRound(); }, 800);
    }

    function onWrong(card) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        card.style.animation = "shake 0.4s";
        card.style.background = "#FFF5F5";
        card.style.borderColor = "#F56565";
        setTimeout(() => {
            card.style.animation = "";
            card.style.background = "white";
            card.style.borderColor = "#E2E8F0";
        }, 400);
    }

    function updateStats() {
        const stats = document.getElementById('game-stats');
        if (stats) stats.innerText = `Level: ${levelIndex + 1} / ${totalRounds} | Score: ${score}`;
    }

    // =====================================================================
    // LEVELS 6-15: find the hidden object(s)
    // =====================================================================
    function instructionFor(targets) {
        const names = targets.map(t => 'the ' + t.name);
        if (targets.length === 1) return `Find ${names[0]}!`;
        if (targets.length === 2) return `Find ${names[0]} and ${names[1]}!`;
        return `Find ${names[0]}, ${names[1]} and ${names[2]}!`;
    }

    function setupFindStage(grid, instruction, k) {
        const my = token;
        const cfg = FG_LEVELS[k];
        const defs = plan[k];
        const later = (fn, ms) => setTimeout(() => { if (my === token) fn(); }, ms);

        const text = instructionFor(defs);
        instruction.innerText = text;
        if (CONFIG.speakInstructions) speak(text.replace('!', ''));

        grid.style.cssText = FG_GRID_CSS;
        const scene = document.createElement('div');
        scene.className = 'fg-scene';
        scene.innerHTML = bgSvg(cfg.theme);
        grid.appendChild(scene);

        // --- pictures ---
        const clutter = pickClutter(defs, cfg.mode, cfg.clutter);
        const lay = layout(cfg, defs, clutter);
        const targets = lay.targets;                       // { x, y, s, def, el, found }
        lay.order.forEach(it => {
            const el = document.createElement('div');
            el.className = 'fg-item' + (it.def ? ' fg-target' : '');
            el.style.cssText = `left:${(it.x - it.s / 2) / VB_W * 100}%;top:${(it.y - it.s / 2) / VB_H * 100}%;width:${it.s / VB_W * 100}%;height:${it.s / VB_H * 100}%;`;
            const rot = document.createElement('div');
            rot.className = 'fg-rot';
            rot.style.transform = `rotate(${it.rot.toFixed(1)}deg)`;
            rot.appendChild(makeArt(it.icon));
            el.appendChild(rot);
            scene.appendChild(el);
            it.el = el;
            if (it.def) { el.dataset.name = it.def.name; it.found = false; }
        });

        // --- the corner card: what to find (tap it to hear the name again) ---
        const card = document.createElement('div');
        card.className = 'fg-card';
        card.title = 'Tap to hear it';
        const slotOf = new Map();
        targets.forEach(t => {
            const slot = document.createElement('div');
            slot.className = 'fg-slot';
            slot.appendChild(makeArt(t.def.icon));
            const nm = document.createElement('div');
            nm.className = 'fg-name';
            nm.textContent = t.def.name;
            slot.appendChild(nm);
            card.appendChild(slot);
            slotOf.set(t, slot);
        });
        card.addEventListener('click', e => { e.stopPropagation(); speak(instructionFor(defs).replace('!', '')); });
        scene.appendChild(card);

        // --- helpers ---
        const sceneK = () => scene.offsetWidth / VB_W;       // pixels per board unit
        const centerOf = el => {
            const r = el.getBoundingClientRect(), s = scene.getBoundingClientRect();
            const ratio = s.width / (scene.offsetWidth || 1) || 1;
            return { x: (r.left + r.width / 2 - s.left) / ratio, y: (r.top + r.height / 2 - s.top) / ratio };
        };

        let missStreak = 0, hintStep = 0, doneCount = 0, longest = 0;

        function showHint() {
            if (my !== token) return;
            const left = targets.filter(t => !t.found);
            if (!left.length) return;
            const t = pick(left);
            const R = Math.max(t.s * .8, CONFIG.hints.startRadius - hintStep * CONFIG.hints.shrinkBy);
            hintStep++;
            const slack = Math.max(0, R - t.s * .55);
            const a = rnd(0, Math.PI * 2), off = slack * rnd(.3, .85);
            const cx = t.x + Math.cos(a) * off, cy = t.y + Math.sin(a) * off;
            const ring = document.createElement('div');
            ring.className = 'fg-hint';
            ring.style.cssText = `left:${(cx - R) / VB_W * 100}%;top:${(cy - R) / VB_H * 100}%;width:${R * 2 / VB_W * 100}%;height:${R * 2 / VB_H * 100}%;`;
            scene.appendChild(ring);
            ring.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
            SFX.hint();
            later(() => {
                const fade = ring.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
                fade.onfinish = () => ring.remove();
            }, CONFIG.hints.stayMs);
            armHint(CONFIG.hints.repeatSeconds);
        }

        function armHint(seconds) {
            clearTimeout(hintTimer);
            if (!CONFIG.hints.enabled) return;
            hintTimer = setTimeout(showHint, seconds * 1000);
        }

        function clearHints() {
            scene.querySelectorAll('.fg-hint').forEach(r => r.remove());
        }

        function miss(ux, uy) {
            const r = document.createElement('div');
            r.className = 'fg-ripple';
            r.style.left = (ux / VB_W * 100) + '%';
            r.style.top = (uy / VB_H * 100) + '%';
            scene.appendChild(r);
            setTimeout(() => r.remove(), 560);
            SFX.miss();
            missStreak++;
            if (CONFIG.hints.enabled && CONFIG.hints.afterMisses > 0 && missStreak >= CONFIG.hints.afterMisses) {
                missStreak = 0;
                if (!scene.querySelector('.fg-hint')) showHint();
            }
        }

        function found(t, cx, cy) {
            t.found = true;
            doneCount++;
            missStreak = 0;
            hintStep = 0;
            score++;
            updateStats();
            clearHints();
            slotOf.get(t).classList.add('done');
            if (window.GameHub) {
                window.GameHub.triggerVFX(cx, cy);
                window.GameHub.playSound('correct');
            }
            t.el.style.zIndex = 60;
            const kk = sceneK();
            const ctx = {
                item: t.el, scene, t, k: kk, later,
                center: () => centerOf(t.el),
                burst: (colors, n, dist) => burst(scene, centerOf(t.el), colors, n, dist),
                puff: (color, dx, dy) => puff(scene, centerOf(t.el), color, dx, dy)
            };
            later(() => { if (SFX[t.def.sfx]) SFX[t.def.sfx](); }, 120);
            const ms = (FX[t.def.fx] || FX.bounce)(ctx);
            longest = Math.max(longest, ms);
            later(() => speak(t.def.name), Math.min(ms, 900) + 150);

            if (doneCount >= targets.length) {
                clearTimeout(hintTimer);
                later(() => nextRound(), longest + 900);
            } else {
                armHint(CONFIG.hints.afterSeconds);
            }
        }

        // --- taps on the board ---
        scene.addEventListener('click', e => {
            if (my !== token || doneCount >= targets.length) return;
            const r = scene.getBoundingClientRect();
            if (!r.width || !r.height) return;
            const ux = (e.clientX - r.left) / r.width * VB_W, uy = (e.clientY - r.top) / r.height * VB_H;
            let best = null, bd = Infinity;
            targets.forEach(t => {
                if (t.found) return;
                const d = Math.hypot(ux - t.x, uy - t.y);
                if (d < bd) { bd = d; best = t; }
            });
            if (best && bd <= best.s * .4 + 4) found(best, e.clientX, e.clientY);
            else miss(ux, uy);
        });

        armHint(CONFIG.hints.afterSeconds);
    }

    // =====================================================================
    // ROUND NAVIGATION
    // =====================================================================
    function nextRound() {
        if (levelIndex < totalRounds - 1) {
            levelIndex++;
            renderRound();
        } else {
            token++;
            clearTimeout(hintTimer);
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete("Master Explorer!", `You completed all 15 levels with a score of ${score}!`);
            }
        }
    }

    function previousRound() {
        if (levelIndex > 0) {
            levelIndex--;
            renderRound();
        }
    }

    window.nextRound = nextRound;
    window.previousRound = previousRound;
})();