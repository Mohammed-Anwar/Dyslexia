// Writing > Readiness > Geo Shapes (Explorer's Gadgets - 15 Rounds)
//
// HOW THIS FILE WORKS
// - The board is ONE <svg viewBox="0 0 400 280">, so everything scales together on any screen.
// - Every piece is drawn around its own centre (0,0) and placed on the board with x,y.
//   The same drawing is used for the tray piece and (as a dim silhouette) for the slot.
// - Pieces that look identical (wheels, rotors, tanks...) are interchangeable:
//   dropping one on any free matching slot works.
// - To add / change a gadget: edit the `gameData` array only. Use the helpers below
//   (OUT, C, bar, star) to keep the visual style consistent.
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // ---------- Shared style ----------
  const OUT = 'stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const C = {
    steel: '#94a3b8', dark: '#475569', light: '#e2e8f0', sky: '#38bdf8', glass: '#7dd3fc',
    amber: '#fbbf24', orange: '#fb923c', red: '#f87171', green: '#34d399',
    purple: '#a78bfa', navy: '#1e3a8a', teal: '#0f766e'
  };

  // Thick glowing line (outline + colour + highlight)
  const bar = (x1, y1, x2, y2, color, w = 10) => {
    const l = (sw, col, op) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"${op ? ` stroke-opacity="${op}"` : ''}/>`;
    return l(w + 5, '#0f172a') + l(w, color) + l(w * 0.3, '#ffffff', 0.55);
  };

  // Star path centred on (0,0)
  const star = (R, r, n = 5) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const rad = i % 2 === 0 ? R : r;
      const a = -Math.PI / 2 + (i * Math.PI) / n;
      d += (i ? 'L' : 'M') + (rad * Math.cos(a)).toFixed(1) + ' ' + (rad * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  };

  // ---------- Gadgets (board is 400 x 280, centre = 200,140) ----------
  // Pieces are listed BACK to FRONT (later pieces are drawn on top).
  const gameData = [
    // ===== Stage 1: Repairing Equipment =====
    {
      name: "Compass", pieces: [
        { id: "body", desc: "Case", x: 200, y: 140, svg:
          `<circle r="46" fill="${C.steel}" ${OUT}/><circle r="38" fill="#0b2545"/>
           <g stroke="${C.light}" stroke-width="3" stroke-linecap="round">
             <line x1="0" y1="-37" x2="0" y2="-32"/><line x1="0" y1="37" x2="0" y2="32"/>
             <line x1="-37" y1="0" x2="-32" y2="0"/><line x1="37" y1="0" x2="32" y2="0"/></g>` },
        { id: "n", desc: "North needle", x: 200, y: 123, svg:
          `<path d="M0 -17 L10 17 L-10 17 Z" fill="${C.red}" ${OUT}/>` },
        { id: "s", desc: "South needle", x: 200, y: 157, svg:
          `<path d="M0 17 L10 -17 L-10 -17 Z" fill="${C.light}" ${OUT}/><circle cx="0" cy="-17" r="3.5" fill="#0f172a"/>` }
      ]
    },
    {
      name: "Flashlight", pieces: [
        { id: "handle", desc: "Handle", x: 150, y: 140, svg:
          `<rect x="-40" y="-15" width="80" height="30" rx="7" fill="${C.dark}" ${OUT}/>
           <g stroke="${C.steel}" stroke-width="3" stroke-linecap="round">
             <line x1="-24" y1="-8" x2="-24" y2="8"/><line x1="-12" y1="-8" x2="-12" y2="8"/>
             <line x1="0" y1="-8" x2="0" y2="8"/><line x1="12" y1="-8" x2="12" y2="8"/>
             <line x1="24" y1="-8" x2="24" y2="8"/></g>
           <rect x="-7" y="-22" width="14" height="9" rx="3" fill="${C.red}" ${OUT}/>` },
        { id: "head", desc: "Head", x: 210, y: 140, svg:
          `<path d="M-20 -17 L20 -32 L20 32 L-20 17 Z" fill="${C.steel}" ${OUT}/>
           <ellipse cx="20" cy="0" rx="6" ry="30" fill="${C.amber}" ${OUT}/>` },
        { id: "beam", desc: "Light beam", x: 267, y: 140, svg:
          `<path d="M-30 -14 L40 -40 L40 40 L-30 14 Z" fill="#fde68a" fill-opacity="0.6" stroke="#fbbf24" stroke-width="2.5" stroke-linejoin="round"/>` }
      ]
    },
    {
      name: "Radar", pieces: [
        { id: "base", desc: "Base", x: 200, y: 192, svg:
          `<rect x="-40" y="-7" width="80" height="14" rx="4" fill="${C.steel}" ${OUT}/>
           <rect x="-22" y="-12" width="44" height="6" rx="3" fill="${C.dark}" ${OUT}/>` },
        { id: "ant", desc: "Mast", x: 200, y: 165, svg:
          `<rect x="-6" y="-20" width="12" height="40" fill="${C.dark}" ${OUT}/>
           <line x1="-6" y1="-6" x2="6" y2="-6" stroke="${C.steel}" stroke-width="3"/>
           <line x1="-6" y1="6" x2="6" y2="6" stroke="${C.steel}" stroke-width="3"/>` },
        { id: "dishL", desc: "Dish left", x: 175, y: 120, svg:
          `<path d="M-25 -25 A50 50 0 0 0 25 25 L25 -25 Z" fill="${C.light}" ${OUT}/>
           <line x1="-25" y1="-25" x2="25" y2="-25" stroke="${C.sky}" stroke-width="4" stroke-linecap="round"/>` },
        { id: "dishR", desc: "Dish right", x: 225, y: 120, svg:
          `<path d="M-25 -25 L-25 25 A50 50 0 0 0 25 -25 Z" fill="${C.light}" ${OUT}/>
           <line x1="-25" y1="-25" x2="25" y2="-25" stroke="${C.sky}" stroke-width="4" stroke-linecap="round"/>
           ${bar(-25, -27, -25, -44, C.steel, 4)}<circle cx="-25" cy="-46" r="5" fill="${C.red}" ${OUT}/>` }
      ]
    },
    {
      name: "Camera", pieces: [
        { id: "body", desc: "Body", x: 200, y: 150, svg:
          `<rect x="-60" y="-36" width="120" height="72" rx="10" fill="${C.steel}" ${OUT}/>
           <path d="M-58 -16 L-58 -26 Q-58 -34 -50 -34 L50 -34 Q58 -34 58 -26 L58 -16 Z" fill="${C.light}"/>
           <rect x="34" y="-44" width="18" height="9" rx="3" fill="${C.red}" ${OUT}/>` },
        { id: "flash", desc: "Flash", x: 165, y: 106, svg:
          `<rect x="-14" y="-8" width="28" height="16" rx="4" fill="${C.amber}" ${OUT}/>
           <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#ffffff" fill-opacity="0.75"/>` },
        { id: "lens", desc: "Lens", x: 200, y: 150, svg:
          `<circle r="30" fill="${C.dark}" ${OUT}/><circle r="22" fill="#0f172a"/>
           <circle r="15" fill="${C.glass}"/><circle cx="-5" cy="-5" r="5" fill="#ffffff" fill-opacity="0.75"/>` }
      ]
    },
    {
      name: "Digi-Map", pieces: [
        { id: "screen", desc: "Screen", x: 200, y: 140, svg:
          `<rect x="-80" y="-40" width="160" height="80" fill="${C.dark}" ${OUT}/>
           <rect x="-70" y="-40" width="140" height="80" fill="${C.teal}"/>
           <g stroke="#5eead4" stroke-opacity="0.5" stroke-width="1.5">
             <line x1="-70" y1="-14" x2="70" y2="-14"/><line x1="-70" y1="14" x2="70" y2="14"/>
             <line x1="-24" y1="-40" x2="-24" y2="40"/><line x1="24" y1="-40" x2="24" y2="40"/></g>
           <path d="M-50 30 L-24 14 L24 -14 L50 -28" fill="none" stroke="${C.amber}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 8"/>
           <circle cx="50" cy="-28" r="7" fill="${C.red}" ${OUT}/><circle cx="50" cy="-28" r="2.5" fill="#ffffff"/>` },
        { id: "fTop", desc: "Frame top", x: 200, y: 90, svg:
          `<path d="M-80 10 L-80 -2 Q-80 -10 -72 -10 L72 -10 Q80 -10 80 -2 L80 10 Z" fill="${C.dark}" ${OUT}/>
           <circle r="3.5" fill="${C.glass}"/><rect x="-26" y="-2" width="14" height="4" rx="2" fill="#0f172a"/>` },
        { id: "fBot", desc: "Frame bottom", x: 200, y: 190, svg:
          `<path d="M-80 -10 L80 -10 L80 2 Q80 10 72 10 L-72 10 Q-80 10 -80 2 Z" fill="${C.dark}" ${OUT}/>
           <circle r="5" fill="none" stroke="${C.light}" stroke-width="2.5"/>` }
      ]
    },

    // ===== Stage 2: Decoding (lines and angles) =====
    {
      name: "Laser Code", pieces: [
        { id: "core", desc: "Core", x: 200, y: 158, svg:
          `<path d="M-6 -42 L6 -42 L6 30 L18 30 L18 42 L-18 42 L-18 30 L-6 30 Z" fill="${C.steel}" ${OUT}/>
           <rect x="-2" y="-36" width="4" height="60" rx="2" fill="${C.sky}"/>` },
        { id: "rayL", desc: "Ray left", x: 170, y: 142, svg: bar(20, -30, -20, 30, '#fb7185', 8) },
        { id: "rayR", desc: "Ray right", x: 230, y: 142, svg: bar(-20, -30, 20, 30, '#fb7185', 8) },
        { id: "node", desc: "Node", x: 200, y: 100, svg:
          `<circle r="23" fill="${C.amber}" fill-opacity="0.25"/>
           <circle r="16" fill="${C.amber}" ${OUT}/><circle r="8" fill="#ffffff"/>` }
      ]
    },
    {
      name: "Star Gate", pieces: [
        { id: "l1", desc: "Left leg", x: 170, y: 140, svg: bar(30, -60, -30, 60, C.purple, 11) },
        { id: "l2", desc: "Right leg", x: 230, y: 140, svg: bar(-30, -60, 30, 60, C.purple, 11) },
        { id: "l3", desc: "Base", x: 200, y: 200, svg: bar(-60, 0, 60, 0, C.purple, 11) },
        { id: "star", desc: "Star", x: 200, y: 150, svg:
          `<path d="${star(22, 9)}" fill="${C.amber}" ${OUT}/>` }
      ]
    },
    {
      name: "Hex-Crystal", pieces: [
        { id: "e1", desc: "Edge", x: 170, y: 110, svg: bar(-30, 30, 30, -30, C.sky, 10) },
        { id: "e2", desc: "Edge", x: 230, y: 110, svg: bar(-30, -30, 30, 30, C.sky, 10) },
        { id: "e3", desc: "Edge", x: 170, y: 170, svg: bar(-30, -30, 30, 30, C.sky, 10) },
        { id: "e4", desc: "Edge", x: 230, y: 170, svg: bar(30, -30, -30, 30, C.sky, 10) },
        { id: "gem", desc: "Gem", x: 200, y: 140, svg:
          `<path d="M0 -26 L22 0 L0 26 L-22 0 Z" fill="${C.glass}" ${OUT}/>
           <path d="M0 -26 L22 0 L0 0 Z" fill="#ffffff" fill-opacity="0.5"/>` }
      ]
    },
    {
      name: "Prism Lock", pieces: [
        { id: "top", desc: "Top", x: 200, y: 88, svg:
          `<path d="M0 -28 L40 27 L-40 27 Z" fill="#67e8f9" ${OUT}/>
           <path d="M0 -28 L0 27 L-40 27 Z" fill="#ffffff" fill-opacity="0.25"/>` },
        { id: "bot", desc: "Bottom", x: 200, y: 192, svg:
          `<path d="M-40 -27 L40 -27 L0 28 Z" fill="#c4b5fd" ${OUT}/>
           <path d="M0 28 L-40 -27 L0 -27 Z" fill="#ffffff" fill-opacity="0.25"/>` },
        { id: "link", desc: "Link", x: 200, y: 140, svg:
          `<rect x="-9" y="-25" width="18" height="50" fill="${C.amber}" ${OUT}/>
           <circle cx="0" cy="-6" r="4" fill="#0f172a"/><rect x="-1.5" y="-6" width="3" height="14" fill="#0f172a"/>` }
      ]
    },
    {
      name: "Energy Core", pieces: [
        { id: "f", desc: "Frame", x: 200, y: 140, svg:
          `<path fill-rule="evenodd" d="M-56 -56 H56 V56 H-56 Z M-44 -44 V44 H44 V-44 Z" fill="${C.steel}" ${OUT}/>
           <g fill="${C.dark}"><circle cx="-50" cy="-50" r="3.5"/><circle cx="50" cy="-50" r="3.5"/>
           <circle cx="-50" cy="50" r="3.5"/><circle cx="50" cy="50" r="3.5"/></g>` },
        { id: "x", desc: "Crosshair", x: 200, y: 140, svg:
          `<path d="M-7 -52 H7 V-7 H52 V7 H7 V52 H-7 V7 H-52 V-7 H-7 Z" fill="${C.sky}" ${OUT}/>` },
        { id: "c", desc: "Core", x: 200, y: 140, svg:
          `<circle r="36" fill="${C.amber}" fill-opacity="0.25"/>
           <circle r="28" fill="${C.amber}" ${OUT}/><circle r="19" fill="${C.orange}"/><circle r="9" fill="#ffffff"/>` }
      ]
    },

    // ===== Stage 3: Complex Assembly =====
    (() => {
      const wheel =
        `<circle r="22" fill="${C.dark}" ${OUT}/><circle r="12" fill="${C.steel}"/>
         <g stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"><line x1="-10" y1="0" x2="10" y2="0"/><line x1="0" y1="-10" x2="0" y2="10"/></g>
         <circle r="3.5" fill="#0f172a"/>`;
      return {
        name: "Mars Rover", pieces: [
          { id: "body", desc: "Body", x: 200, y: 140, svg:
            `<rect x="-54" y="20" width="8" height="30" fill="${C.dark}" ${OUT}/>
             <rect x="46" y="20" width="8" height="30" fill="${C.dark}" ${OUT}/>
             <rect x="-60" y="-22" width="120" height="44" rx="10" fill="${C.orange}" ${OUT}/>
             <rect x="-48" y="-12" width="44" height="24" rx="4" fill="#0f172a" fill-opacity="0.35"/>
             <circle cx="30" cy="0" r="9" fill="${C.glass}" ${OUT}/>
             <rect x="-30" y="-33" width="60" height="11" rx="3" fill="${C.navy}" ${OUT}/>` },
          { id: "w1", desc: "Wheel 1", x: 150, y: 190, svg: wheel },
          { id: "w2", desc: "Wheel 2", x: 250, y: 190, svg: wheel },
          { id: "ant", desc: "Antenna", x: 160, y: 90, svg:
            `${bar(-15, 28, 15, -28, C.steel, 5)}<circle cx="15" cy="-30" r="6" fill="${C.red}" ${OUT}/>` }
        ]
      };
    })(),
    (() => {
      const rotor =
        `<ellipse rx="30" ry="7" transform="rotate(45)" fill="${C.sky}" fill-opacity="0.85" ${OUT}/>
         <ellipse rx="30" ry="7" transform="rotate(-45)" fill="${C.sky}" fill-opacity="0.85" ${OUT}/>
         <circle r="7" fill="${C.dark}" ${OUT}/>`;
      return {
        name: "Scout Drone", pieces: [
          { id: "chas", desc: "Chassis", x: 200, y: 140, svg:
            `<path d="M-22 18 L-30 42 M22 18 L30 42" stroke="${C.dark}" stroke-width="5" stroke-linecap="round" fill="none"/>
             <rect x="-70" y="-4" width="140" height="8" rx="4" fill="${C.dark}" ${OUT}/>
             <rect x="-38" y="-20" width="76" height="40" rx="14" fill="${C.light}" ${OUT}/>
             <circle cx="0" cy="4" r="9" fill="#0f172a"/><circle cx="0" cy="4" r="5" fill="${C.glass}"/>
             <circle cx="-24" cy="-8" r="3" fill="${C.green}"/><circle cx="24" cy="-8" r="3" fill="${C.red}"/>` },
          { id: "rL", desc: "Rotor L", x: 130, y: 140, svg: rotor },
          { id: "rR", desc: "Rotor R", x: 270, y: 140, svg: rotor }
        ]
      };
    })(),
    {
      name: "Submarine", pieces: [
        { id: "hull", desc: "Hull", x: 200, y: 150, svg:
          `<path d="M-84 -10 L-106 -28 L-106 28 L-84 10 Z" fill="${C.orange}" ${OUT}/>
           <ellipse rx="86" ry="36" fill="${C.amber}" ${OUT}/>
           <path d="M-70 -22 Q0 -34 70 -22" stroke="#ffffff" stroke-opacity="0.45" stroke-width="5" fill="none" stroke-linecap="round"/>
           <path d="M-70 18 Q0 30 70 18" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
        { id: "fin", desc: "Tower", x: 200, y: 96, svg:
          `<path d="M8 -12 V-30 H24" fill="none" stroke="${C.dark}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
           <path d="M-24 20 L-16 -12 L16 -12 L24 20 Z" fill="${C.orange}" ${OUT}/>` },
        { id: "win", desc: "Window", x: 240, y: 150, svg:
          `<circle r="15" fill="${C.steel}" ${OUT}/><circle r="10" fill="${C.glass}"/>
           <circle cx="-3" cy="-3" r="3.5" fill="#ffffff" fill-opacity="0.8"/>` }
      ]
    },
    (() => {
      const tank =
        `<path d="M-20 -30 Q-20 -46 0 -46 Q20 -46 20 -30 V38 H-20 Z" fill="${C.light}" ${OUT}/>
         <rect x="-20" y="-6" width="40" height="14" fill="${C.red}" ${OUT}/>
         <path d="M-12 38 L-8 50 H8 L12 38 Z" fill="${C.dark}" ${OUT}/>
         <line x1="-11" y1="-36" x2="-11" y2="-14" stroke="#ffffff" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round"/>`;
      const flame =
        `<path d="M-13 -22 Q-17 8 0 28 Q17 8 13 -22 Z" fill="${C.orange}" ${OUT}/>
         <path d="M-6 -16 Q-8 4 0 16 Q8 4 6 -16 Z" fill="${C.amber}"/>`;
      return {
        name: "Jetpack", pieces: [
          { id: "tL", desc: "Tank L", x: 170, y: 115, svg: tank },
          { id: "tR", desc: "Tank R", x: 230, y: 115, svg: tank },
          { id: "strap", desc: "Strap", x: 200, y: 100, svg:
            `<rect x="-16" y="-6" width="32" height="12" rx="3" fill="${C.dark}" ${OUT}/>` },
          { id: "fL", desc: "Flame", x: 170, y: 187, svg: flame },
          { id: "fR", desc: "Flame", x: 230, y: 187, svg: flame }
        ]
      };
    })(),
    {
      name: "Spaceship", pieces: [
        { id: "wL", desc: "Wing L", x: 155, y: 180, svg:
          `<path d="M17 -28 L17 22 L-17 40 Z" fill="${C.red}" ${OUT}/>` },
        { id: "wR", desc: "Wing R", x: 245, y: 180, svg:
          `<path d="M-17 -28 L-17 22 L17 40 Z" fill="${C.red}" ${OUT}/>` },
        { id: "hull", desc: "Hull", x: 200, y: 153, svg:
          `<path d="M-18 38 L-12 52 H12 L18 38 Z" fill="${C.dark}" ${OUT}/>
           <rect x="-28" y="-38" width="56" height="76" fill="${C.light}" ${OUT}/>
           <rect x="-28" y="14" width="56" height="10" fill="${C.sky}"/>
           <circle cx="0" cy="-10" r="12" fill="${C.glass}" ${OUT}/>
           <circle cx="-4" cy="-14" r="3.5" fill="#ffffff" fill-opacity="0.8"/>` },
        { id: "nose", desc: "Nose", x: 200, y: 87, svg:
          `<path d="M0 -32 C14 -20 26 0 28 28 L-28 28 C-26 0 -14 -20 0 -32 Z" fill="${C.red}" ${OUT}/>` }
      ]
    }
  ];

  const BOARD_W = 400;
  let levelIndex = 0;
  let placed = 0;
  let filledSlots = new Set();

  function nextRound() {
    if (levelIndex >= gameData.length - 1) {
      window.GameHub.showComplete("Gadget Master!", "All explorer gadgets are fully operational.");
    } else {
      levelIndex++;
      buildStage();
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      buildStage();
    }
  }

  function buildStage() {
    if (levelIndex >= gameData.length) return;
    const shape = gameData[levelIndex];
    const roundAtBuild = levelIndex;
    placed = 0;
    filledSlots = new Set();

    stage.innerHTML = `
      <style>
        .gs-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 16px;
          width: 100%; font-family: monospace, sans-serif;
          background: #0f172a; border-radius: 12px;
          user-select: none; -webkit-user-select: none;
        }
        .gs-header { display: flex; justify-content: space-between; width: min(480px, 100%); color: #38bdf8; font-weight: bold; }
        .gs-title { font-size: 1.1rem; font-weight: 700; color: #f8fafc; text-align: center; margin: 0; }
        .gs-title span { color: #34d399; }

        .gs-board {
          width: min(480px, 100%); height: auto; display: block;
          border: 2px solid #38bdf8; border-radius: 12px;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.2) inset;
          touch-action: none;
        }
        /* Empty slot = faint white silhouette of the piece */
        .gs-slot { filter: brightness(0) invert(1); opacity: 0.16; transition: opacity 0.3s ease; }
        .gs-slot.filled { filter: drop-shadow(0 0 5px rgba(52, 211, 153, 0.85)); opacity: 1; }

        .gs-tray { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .gs-piece {
          width: 78px; height: 78px; border-radius: 12px;
          background: #1e293b; border: 2px solid #0ea5e9;
          display: flex; align-items: center; justify-content: center;
          cursor: grab; box-shadow: 0 4px 0 #0284c7;
        }
        .gs-piece svg { width: 64px; height: 64px; pointer-events: none; overflow: visible; }
        .gs-piece.placed { visibility: hidden; }
      </style>
      <div class="gs-wrap">
        <div class="gs-header">
          <span>MISSION ${levelIndex + 1}/${gameData.length}</span>
          <span>SYSTEM: ONLINE</span>
        </div>
        <p class="gs-title">Assemble the <span>${shape.name}</span>!</p>
        <svg class="gs-board" id="gs-board" viewBox="0 0 ${BOARD_W} 280" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gs-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke="#334155" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="${BOARD_W}" height="280" fill="#1e293b"/>
          <rect width="${BOARD_W}" height="280" fill="url(#gs-grid)"/>
          ${shape.pieces.map(p =>
            `<g class="gs-slot" id="slot-${p.id}" transform="translate(${p.x} ${p.y})">${p.svg}</g>`
          ).join('')}
        </svg>
        <div class="gs-tray" id="gs-tray"></div>
      </div>
    `;

    const board = document.getElementById("gs-board");
    const tray = document.getElementById("gs-tray");

    if (window.GameHub && typeof window.GameHub.speak === 'function') {
      window.GameHub.speak(`Assemble the ${shape.name}`, 'en-US');
    }

    // Board (SVG units) -> screen pixels, so the drop check works at any screen size
    function slotCenterOnScreen(p) {
      const pt = board.createSVGPoint();
      pt.x = p.x; pt.y = p.y;
      const s = pt.matrixTransform(board.getScreenCTM());
      return { x: s.x, y: s.y };
    }

    // Shuffle the tray so the order never gives the answer away
    const shuffled = [...shape.pieces].sort(() => Math.random() - 0.5);

    shuffled.forEach(p => {
      const piece = document.createElement("div");
      piece.className = "gs-piece";
      piece.id = "piece-" + p.id;
      piece.title = p.desc;
      piece.innerHTML = `<svg viewBox="-50 -50 100 100"><g>${p.svg}</g></svg>`;
      tray.appendChild(piece);

      // Fit the drawing into the tray icon, centred on its own origin
      try {
        const bb = piece.querySelector("g").getBBox();
        if (bb.width > 0 && bb.height > 0) {
          const m = Math.max(34, Math.abs(bb.x), Math.abs(bb.y), Math.abs(bb.x + bb.width), Math.abs(bb.y + bb.height)) + 6;
          piece.querySelector("svg").setAttribute("viewBox", `${-m} ${-m} ${m * 2} ${m * 2}`);
        }
      } catch (e) { /* keep default viewBox */ }

      piece.addEventListener('mousedown', (e) => e.preventDefault());

      window.GameHub.utils.makeDraggable(piece, (x, y) => {
        const scale = board.getBoundingClientRect().width / BOARD_W;
        const tolerance = Math.max(45, 60 * scale);

        // Free slots that look exactly like this piece (so wheels, rotors, tanks... are interchangeable)
        const candidates = shape.pieces.filter(q => q.svg === p.svg && !filledSlots.has(q.id));
        let best = null, bestDist = Infinity;
        candidates.forEach(q => {
          const c = slotCenterOnScreen(q);
          const d = Math.hypot(x - c.x, y - c.y);
          if (d < bestDist) { bestDist = d; best = q; }
        });

        if (best && bestDist < tolerance) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(x, y);
          document.getElementById("slot-" + best.id).classList.add("filled");
          filledSlots.add(best.id);
          piece.classList.add("placed");
          placed++;

          if (placed >= shape.pieces.length) {
            setTimeout(() => {
              if (levelIndex === roundAtBuild) nextRound();
            }, 900);
          }
        } else {
          window.GameHub.playSound("wrong");
          if (piece.resetPosition) piece.resetPosition();
        }
      });
    });
  }

  buildStage();
  window.nextRound = nextRound;
  window.previousRound = previousRound;
};