// Writing > Readiness > Colors to Letters (Sky, Grass, Dirt)
//
// 20 ROUNDS in 4 stages
//   1  (1-5)    Abstract colours into 3 coloured boxes
//   2  (6-10)   Colours onto the writing strip: blue = sky, green = grass, brown = dirt
//   3  (11-15)  Coloured letters onto the strip; a correct letter snaps onto the line in black ink
//   4  (16-20)  Black letters, no colour help: the child must remember where each letter lives
//
// THE WRITING STRIP (stages 2-4) looks like the client's photo: three crayon bands on ruled paper.
//   blue  = sky   (tall letters reach up into it:   b d f h k l t)
//   green = grass (every letter's body sits in it:  a c e i m n o r s u v w x z ...)
//   brown = dirt  (tails reach down into it:        g j p q y)
// Letters are DRAWN in code (the GLYPHS table below), not typed with a font, so that a "d" always
// stands in blue + green and a "g" in green + brown exactly, on every device.
//
// HOW TO EDIT
//   gameData      the 20 rounds (just change the letters in `items`)
//   COLORS        the ball / letter colours
//   BAND_COLORS   the crayon band colours
//   GLYPHS        the hand-drawn letter shapes (y: 0 = top of sky, 100 = top of grass, 200 = baseline, 300 = bottom of dirt)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  let levelIndex = 0;
  let token = 0;            // bumped on every render so late timers from an old round do nothing
  let activeItem = null;    // only used by the tap-to-place fallback
  let onResize = null;      // keeps the strip fitted to the screen (removed again on every new round)

  // ---------- Colours ----------
  const COLORS = {
    sky: "#4A90E2",   // Blue
    grass: "#48BB78", // Green
    dirt: "#8B4513"   // Brown
  };
  const BAND_COLORS = {
    sky: "rgba(74, 144, 226, 0.55)",
    grass: "rgba(72, 187, 120, 0.55)",
    dirt: "rgba(176, 112, 48, 0.50)"
  };
  const INK = "#1A202C";

  // Map each letter to its correct zone
  const LETTER_ZONES = {
    b:'sky', d:'sky', f:'sky', h:'sky', k:'sky', l:'sky', t:'sky',
    a:'grass', c:'grass', e:'grass', i:'grass', m:'grass', n:'grass', o:'grass', r:'grass', s:'grass', u:'grass', v:'grass', w:'grass', x:'grass', z:'grass',
    g:'dirt', j:'dirt', p:'dirt', q:'dirt', y:'dirt'
  };

  // ---------- Hand-drawn letters ----------
  // Every letter is drawn in the same 3-band space: y 0..100 sky, 100..200 grass (baseline at 200), 200..300 dirt.
  // d   = the stroke paths      dots = round dots (i, j)
  // x0/x1 = left/right edge of the letter    y0/y1 = top/bottom of the ink (used to crop the tray tile)
  const ring = "M4 150a44 44 0 1 0 88 0a44 44 0 1 0 -88 0";   // the round body used by a, b, d, g, o, p, q
  const GLYPHS = {
    a: { d: [ring, "M92 104V200"],                                             x0: -6, x1: 102, y0: 100, y1: 200 },
    b: { d: ["M4 0V200", ring],                                                x0: -6, x1: 102, y0: 0,   y1: 200 },
    c: { d: ["M81.7 121.7A44 44 0 1 0 81.7 178.3"],                            x0: -6, x1: 92,  y0: 100, y1: 200 },
    d: { d: [ring, "M92 0V200"],                                               x0: -6, x1: 102, y0: 0,   y1: 200 },
    e: { d: ["M4 150H92A44 44 0 1 0 81.7 178.3"],                              x0: -6, x1: 102, y0: 100, y1: 200 },
    f: { d: ["M38 200V40Q38 8 76 10", "M10 106H68"],                           x0: 0,  x1: 86,  y0: 4,   y1: 200 },
    g: { d: [ring, "M92 106V254Q92 290 48 290Q18 290 8 262"],                  x0: -6, x1: 102, y0: 100, y1: 296 },
    h: { d: ["M4 0V200", "M4 140Q4 106 48 106Q92 106 92 150V200"],             x0: -6, x1: 102, y0: 0,   y1: 200 },
    i: { d: ["M10 106V200"], dots: [[10, 66]],                                 x0: 0,  x1: 20,  y0: 58,  y1: 200 },
    j: { d: ["M12 106V252Q12 290 -18 286"], dots: [[12, 66]],                  x0: -30, x1: 22, y0: 58,  y1: 296 },
    k: { d: ["M4 0V200", "M82 104L4 158", "M36 134L88 200"],                   x0: -6, x1: 98,  y0: 0,   y1: 200 },
    l: { d: ["M10 0V200"],                                                     x0: 0,  x1: 20,  y0: 0,   y1: 200 },
    m: { d: ["M4 106V200", "M4 150Q4 106 36 106Q68 106 68 150V200", "M68 150Q68 106 100 106Q132 106 132 150V200"],
                                                                               x0: -6, x1: 142, y0: 100, y1: 200 },
    n: { d: ["M4 106V200", "M4 150Q4 106 48 106Q92 106 92 150V200"],           x0: -6, x1: 102, y0: 100, y1: 200 },
    o: { d: [ring],                                                            x0: -6, x1: 102, y0: 100, y1: 200 },
    p: { d: ["M4 106V290", ring],                                              x0: -6, x1: 102, y0: 100, y1: 296 },
    q: { d: [ring, "M92 106V290"],                                             x0: -6, x1: 102, y0: 100, y1: 296 },
    r: { d: ["M4 106V200", "M4 150Q4 106 40 106Q58 106 68 118"],               x0: -6, x1: 78,  y0: 100, y1: 200 },
    s: { d: ["M74 122Q60 106 42 106Q14 106 14 128Q14 148 44 153Q76 160 76 178Q76 196 44 196Q22 196 8 180"],
                                                                               x0: -2, x1: 86,  y0: 100, y1: 200 },
    t: { d: ["M34 40V172Q34 200 70 196", "M8 106H62"],                         x0: -2, x1: 80,  y0: 36,  y1: 200 },
    u: { d: ["M4 106V156Q4 198 48 198Q92 198 92 156", "M92 106V200"],          x0: -6, x1: 102, y0: 100, y1: 200 },
    v: { d: ["M4 106L48 200L92 106"],                                          x0: -6, x1: 102, y0: 100, y1: 200 },
    w: { d: ["M4 106L36 200L68 120L100 200L132 106"],                          x0: -6, x1: 142, y0: 100, y1: 200 },
    x: { d: ["M6 106L90 200", "M90 106L6 200"],                                x0: -4, x1: 100, y0: 100, y1: 200 },
    y: { d: ["M4 106L52 200", "M90 106L52 200L30 262Q22 282 4 290"],           x0: -6, x1: 100, y0: 100, y1: 296 },
    z: { d: ["M8 106H80L8 200H80"],                                            x0: -2, x1: 90,  y0: 100, y1: 200 }
  };

  // Letter drawing. 'strip' = full 3-band height (what ends up on the paper), 'tile' = cropped to fit the drag tile.
  function glyphSvg(ch, mode) {
    const g = GLYPHS[ch];
    const w = g.x1 - g.x0;
    const paths = g.d.map(d => `<path d="${d}"/>`).join('') +
                  (g.dots || []).map(p => `<path class="dot" d="M${p[0]} ${p[1]}h.1"/>`).join('');
    if (mode === 'strip') {
      return `<svg class="co-glyph co-glyph-strip" viewBox="${g.x0} 0 ${w} 300" style="width:calc(var(--bh) * ${(3 * w / 300).toFixed(3)})">${paths}</svg>`;
    }
    const pad = 14;
    return `<svg class="co-glyph co-glyph-tile" viewBox="${g.x0} ${g.y0 - pad} ${w} ${g.y1 - g.y0 + pad * 2}">${paths}</svg>`;
  }

  // 20 Unique, Hand-crafted gameData for Perfect Pedagogical Progression
  const gameData = [
    // STAGE 1: Abstract Colors to Boxes (Increasing Quantity)
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky", "grass"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["grass", "dirt", "sky"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky", "sky", "grass", "dirt"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["grass", "grass", "sky", "dirt", "dirt"] },

    // STAGE 2: Colors to Notebook Lines (Bridging the concept)
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass", "grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "dirt", "sky", "grass", "dirt"] },

    // STAGE 3: Colored Letters to Lines (Introducing shapes with color hints)
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["b", "a"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["d", "p", "e"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["h", "m", "y"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["t", "l", "g", "q"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["f", "s", "j", "i", "k"] },

    // STAGE 4: Black Letters to Lines (Fading color hints, testing memory)
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["b", "a"] },
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["c", "o", "g"] },
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["d", "q", "p"] }, // Tricky similarities
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["h", "n", "u", "y"] },
    { stage: 4, text: "Final Boss: Place letters by memory!", layout: "lines", type: "black-letter", items: ["k", "v", "w", "x", "z", "j"] }
  ];

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function nextRound() {
    if (levelIndex >= gameData.length - 1) {
      token++;
      window.GameHub.showComplete("Writing Champion!", "You mastered all the writing zones.");
    } else {
      levelIndex++;
      renderLevel();
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel();
    }
  }

  function renderLevel() {
    token++;
    const my = token;
    activeItem = null;
    const levelData = gameData[levelIndex];
    const isLetters = levelData.type !== "color";
    const total = levelData.items.length;
    let placed = 0;

    // Parse the items for this specific level
    const items = levelData.items.map(val => {
      if (levelData.type === "color") {
        return { zone: val, content: "", color: COLORS[val], isCircle: true };
      }
      const zone = LETTER_ZONES[val];
      return {
        zone, content: val, isCircle: false,
        color: (levelData.type === "colored-letter") ? COLORS[zone] : INK   // coloured hint, or plain black
      };
    });

    // Each letter has its own place on the paper, in alphabetical order (like a b c d e ... in the photo),
    // so the finished line always reads neatly no matter in which order the child places them.
    items.slice().sort((p, q) => p.content < q.content ? -1 : p.content > q.content ? 1 : 0)
      .forEach((it, i) => { it.slot = i; });

    // Shuffle items so they appear in random order at the bottom
    const itemsToRender = shuffle(items.slice());

    // Generate Layout based on level config
    let layoutHTML = "";
    if (levelData.layout === "boxes") {
      layoutHTML = `
        <div class="co-boxes">
          <div class="co-dropzone co-box" data-zone="sky" style="border-color:${COLORS.sky}; --c:${COLORS.sky}"></div>
          <div class="co-dropzone co-box" data-zone="grass" style="border-color:${COLORS.grass}; --c:${COLORS.grass}"></div>
          <div class="co-dropzone co-box" data-zone="dirt" style="border-color:${COLORS.dirt}; --c:${COLORS.dirt}"></div>
        </div>
      `;
    } else {
      const band = z => `
          <div class="co-dropzone co-band co-${z}" data-zone="${z}">
            <i class="co-band-bg"></i>
            <div class="co-hold"></div>
          </div>`;
      // one reserved place per letter on the paper (alphabetical), so spacing stays even while letters are placed
      const slotsHTML = !isLetters ? '' : items.slice().sort((p, q) => p.slot - q.slot).map(it => {
        const g = GLYPHS[it.content];
        return `<div class="co-slot" data-slot="${it.slot}" style="width:calc(var(--bh) * ${(3 * (g.x1 - g.x0) / 300).toFixed(3)})"></div>`;
      }).join('');
      layoutHTML = `
        <div class="co-notebook">
          <div class="co-pad"></div>
          <div class="co-strip">${band('sky')}${band('grass')}${band('dirt')}
            <div class="co-ink">${slotsHTML}</div>
          </div>
          <div class="co-pad"></div>
        </div>
      `;
    }

    // Render HTML & CSS
    stage.innerHTML = `
      <style>
        .co-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; font-family: sans-serif; user-select: none; -webkit-user-select: none; width: 100%; max-width: 560px; }
        .co-title { font-size: 1.2rem; font-weight: 700; text-align: center; color: #2D3748; margin-bottom: 5px; }
        .co-level { font-size: 0.9rem; color: #718096; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }

        /* Stage 1: Abstract Boxes */
        .co-boxes { display: flex; gap: 20px; width: 100%; justify-content: center; }
        .co-box { width: 90px; min-height: 90px; border-radius: 16px; border: 4px solid; background: #fff; display: flex; flex-wrap: wrap; gap: 5px; align-items: center; justify-content: center; padding: 5px; transition: box-shadow 0.3s; }
        .co-box.co-lit { box-shadow: 0 0 18px 4px var(--c); }

        /* Stages 2-4: the writing strip (blue sky / green grass / brown dirt on ruled paper) */
        .co-notebook { --bh: clamp(44px, 11.5vw, 58px); width: min(100%, 520px); background-color: #fffdf8; border-left: 3px solid #E53E3E; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          background-image: repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--bh) - 1.5px), #cdd6e0 calc(var(--bh) - 1.5px), #cdd6e0 var(--bh)); }
        .co-pad { height: var(--bh); }
        .co-strip { position: relative; }
        .co-band { position: relative; height: var(--bh); }
        .co-band-bg { position: absolute; inset: 0; filter: url(#co-crayon);
          background: repeating-linear-gradient(96deg, rgba(255,255,255,0.22) 0 1.5px, rgba(255,255,255,0) 1.5px 4px),
                      repeating-linear-gradient(86deg, rgba(0,0,0,0.05) 0 1px, rgba(0,0,0,0) 1px 7px),
                      var(--band); }
        .co-sky   { --band: ${BAND_COLORS.sky}; }
        .co-grass { --band: ${BAND_COLORS.grass}; border-top: 2px dashed rgba(26,32,44,0.28); border-bottom: 2px solid rgba(26,32,44,0.45); }
        .co-dirt  { --band: ${BAND_COLORS.dirt}; }
        .co-hold { position: relative; z-index: 1; height: 100%; display: flex; gap: 14px; align-items: center; justify-content: center; }
        .co-band.co-glow::after { content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none; animation: coGlow 0.7s ease-out; }
        @keyframes coGlow { 0% { box-shadow: inset 0 0 0 0 rgba(255,255,255,0); } 30% { box-shadow: inset 0 0 26px 8px rgba(255,255,255,0.95); } 100% { box-shadow: inset 0 0 0 0 rgba(255,255,255,0); } }

        /* Letters that have been placed on the paper (black ink, spanning the bands like real handwriting) */
        .co-ink { position: absolute; inset: 0; z-index: 5; pointer-events: none; display: flex; justify-content: space-evenly; align-items: flex-start; }
        .co-slot { flex: none; height: calc(var(--bh) * 3); }
        .co-placed-in { display: block; transform-origin: 50% 60%; }

        /* Draggable Items */
        .co-items { display: flex; flex-wrap: wrap; gap: 20px; min-height: 90px; margin-top: 10px; align-items: center; justify-content: center; width: 100%; }
        .co-item { cursor: grab; display: flex; align-items: center; justify-content: center; touch-action: none; }
        .co-item.selected { transform: scale(1.15); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .co-circle { width: 45px; height: 45px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .co-tile { width: 84px; height: 84px; border-radius: 18px; background: #fff; border: 2px solid #E2E8F0; box-shadow: 0 4px 6px rgba(0,0,0,0.06); }
        .co-dropzone .co-item { cursor: default; }
        .co-dropzone .co-circle { transform: scale(0.8); }
        .co-box .co-circle { transform: scale(0.9); }

        .co-glyph { display: block; overflow: visible; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }
        .co-glyph path { vector-effect: non-scaling-stroke; }
        .co-glyph-tile { width: 64px; height: 64px; }
        .co-glyph-tile path { stroke-width: 5px; }
        .co-glyph-tile .dot { stroke-width: 8px; }
        .co-glyph-strip { height: calc(var(--bh) * 3); }
        .co-glyph-strip path { stroke-width: calc(var(--bh) * 0.14); }
        .co-glyph-strip .dot { stroke-width: calc(var(--bh) * 0.2); }

        /* Animations */
        .wrong-shake { animation: coShake 0.3s; }
        .co-band.wrong-shake .co-band-bg { background-color: rgba(229,62,62,0.35); }
        .co-box.wrong-shake { border-color: #E53E3E !important; }
        @keyframes coShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      </style>

      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <filter id="co-crayon" x="-2%" y="-12%" width="104%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.45" numOctaves="2" seed="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs></svg>

      <div class="co-wrap game-wrapper">
        <div class="co-level">Round ${levelIndex + 1} / ${gameData.length}</div>
        <p class="co-title">${levelData.text}</p>
        ${layoutHTML}
        <div class="co-items" id="co-items"></div>
      </div>
    `;

    // Render Draggable Items
    const itemsContainer = document.getElementById("co-items");
    itemsToRender.forEach(item => {
      const el = document.createElement("div");
      el.className = `co-item ${item.isCircle ? 'co-circle' : 'co-tile'}`;
      el.dataset.zone = item.zone;
      el.dataset.type = levelData.type; // "color", "colored-letter", "black-letter"
      if (item.content) el.dataset.letter = item.content;

      if (item.isCircle) {
        el.style.backgroundColor = item.color;
      } else {
        el.style.color = item.color;
        el.innerHTML = glyphSvg(item.content, 'tile');
      }
      el._item = item;
      itemsContainer.appendChild(el);
    });

    // ----- make the strip fit the screen: shrink the bands a little if this round's letters need more room -----
    const nb = stage.querySelector('.co-notebook');
    function fitBands() {
      if (!nb || !isLetters || my !== token) return;
      nb.style.removeProperty('--bh');
      const sumW = items.reduce((s, it) => s + (GLYPHS[it.content].x1 - GLYPHS[it.content].x0), 0);
      const units = sumW / 100 + 0.4 * (items.length + 1);           // letters + even gaps, in band-heights
      const bh = nb.querySelector('.co-band').offsetHeight;
      const free = nb.clientWidth - 6;                                 // minus the red margin line
      if (bh * units > free) nb.style.setProperty('--bh', (free / units).toFixed(1) + 'px');
    }
    if (onResize) window.removeEventListener('resize', onResize);
    onResize = fitBands;
    if (nb) { window.addEventListener('resize', onResize); fitBands(); }

    // ----- placement -----
    const zones = Array.from(stage.querySelectorAll('.co-dropzone'));

    function zoneAt(x, y) {
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 4 && y <= r.bottom + 4) return z;
      }
      return null;
    }

    // Which bands light up when a letter lands: its tall / tail part AND the grass its body stands in
    function glowBands(zone) {
      const names = zone === 'sky' ? ['sky', 'grass'] : zone === 'dirt' ? ['grass', 'dirt'] : ['grass'];
      names.forEach(n => {
        const b = stage.querySelector(`.co-band[data-zone="${n}"]`);
        if (!b) return;
        b.classList.remove('co-glow'); void b.offsetWidth; b.classList.add('co-glow');
        setTimeout(() => b.classList.remove('co-glow'), 750);
      });
    }

    function failShake(zoneEl) {
      zoneEl.classList.add("wrong-shake");
      setTimeout(() => zoneEl.classList.remove("wrong-shake"), 300);
    }

    function resetItem(el) {
      if (el.resetPosition) el.resetPosition(); else el.style.transform = '';
    }

    function placeLetter(el, zoneEl) {
      const item = el._item;
      const slotEl = stage.querySelector(`.co-slot[data-slot="${item.slot}"]`);
      slotEl.innerHTML = `<span class="co-placed-in" style="color:${INK}">${glyphSvg(item.content, 'strip')}</span>`;

      // the "magnet": the letter flies from where it was dropped onto its line and turns to black ink
      const inner = slotEl.firstElementChild;
      const from = el.getBoundingClientRect(), to = inner.getBoundingClientRect();
      const nb = stage.querySelector('.co-notebook');
      const ratio = (nb.getBoundingClientRect().width / (nb.offsetWidth || 1)) || 1;
      const dx = (from.left + from.width / 2 - (to.left + to.width / 2)) / ratio;
      const dy = (from.top + from.height / 2 - (to.top + to.height / 2)) / ratio;
      if (inner.animate) {
        inner.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(0.45)`, opacity: 0.6 },
          { transform: 'translate(0, 0) scale(1)', opacity: 1 }
        ], { duration: 320, easing: 'cubic-bezier(.2,1.15,.35,1)' });
      }
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      resetItem(el);
    }

    function tryPlace(el, zoneEl) {
      if (!el || !zoneEl || el._done) return;
      if (el.dataset.zone !== zoneEl.dataset.zone) {
        // Wrong Logic
        window.GameHub.playSound("wrong");
        failShake(zoneEl);
        resetItem(el);
        if (activeItem) { activeItem.classList.remove('selected'); activeItem = null; }
        return;
      }

      // Success Logic
      el._done = true;
      window.GameHub.playSound("correct");
      const rect = zoneEl.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);

      if (levelData.layout === "boxes") {
        resetItem(el);
        zoneEl.appendChild(el);
        zoneEl.classList.add('co-lit');           // the box lights up
      } else if (isLetters) {
        placeLetter(el, zoneEl);
        glowBands(el.dataset.zone);
      } else {
        resetItem(el);
        zoneEl.querySelector('.co-hold').appendChild(el);
        glowBands(el.dataset.zone);
      }

      el.classList.remove('selected');
      el.style.cursor = 'default';
      if (activeItem === el) activeItem = null;

      placed++;
      if (placed >= total) {
        // a short pause so the child can see the finished line
        setTimeout(() => { if (my === token) nextRound(); }, isLetters ? 1300 : 800);
      }
    }

    // ----- input: drag (mouse + touch) through the hub's drag helper; tap-to-place if it is missing -----
    const hasDrag = !!(window.GameHub && window.GameHub.utils && window.GameHub.utils.makeDraggable);
    stage.querySelectorAll('.co-item').forEach(el => {
      if (hasDrag) {
        window.GameHub.utils.makeDraggable(el, (x, y) => {
          if (my !== token || el._done) return;
          const z = zoneAt(x, y);
          if (z) tryPlace(el, z); else resetItem(el);
        });
      } else {
        el.addEventListener('click', () => {
          if (el._done) return;
          stage.querySelectorAll('.co-item').forEach(d => d.classList.remove('selected'));
          el.classList.add('selected');
          activeItem = el;
        });
      }
    });
    if (!hasDrag) {
      zones.forEach(z => z.addEventListener('click', () => { if (activeItem) tryPlace(activeItem, z); }));
    }
  }

  // Start Game
  renderLevel();
  window.nextRound = nextRound;
  window.previousRound = previousRound;
};