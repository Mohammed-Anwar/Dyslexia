// Writing > Formation > Position writing
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Each letter defined as an ordered set of strokes (polylines), traced in order start->end.
  const LETTERS = [
    {
      char: "L",
      strokes: [
        [[120, 60], [120, 220]],
        [[120, 220], [220, 220]]
      ]
    },
    {
      char: "T",
      strokes: [
        [[80, 70], [220, 70]],
        [[150, 70], [150, 220]]
      ]
    },
    {
      char: "A",
      strokes: [
        [[90, 220], [150, 60], [210, 220]],
        [[115, 150], [185, 150]]
      ]
    }
  ];

  let level = 0;
  let strokeIdx = 0;
  let progress = 0;

  function totalLen(pts) {
    let l = 0;
    for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return l;
  }
  function pointAt(pts, dist) {
    let remain = dist;
    for (let i = 1; i < pts.length; i++) {
      const segLen = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (remain <= segLen) {
        const t = segLen === 0 ? 0 : remain / segLen;
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      }
      remain -= segLen;
    }
    return pts[pts.length - 1];
  }

  function build() {
    strokeIdx = 0;
    progress = 0;
    stage.innerHTML = `
      <style>
        .pw-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px;}
        .pw-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);}
        svg{background:#F8FAFC;border:2px solid #E2E8F0;border-radius:16px;touch-action:none;}
        .pw-pen{position:absolute;width:34px;height:34px;border-radius:50%;background:var(--primary-green);box-shadow:0 3px 0 #2f855a;display:flex;align-items:center;justify-content:center;pointer-events:none;transform:translate(-50%,-50%);}
      </style>
      <div class="pw-wrap">
        <p class="pw-title">Trace the letter "${LETTERS[level].char}" — follow the numbers in order!</p>
        <div style="position:relative;">
          <svg id="pw-svg" viewBox="0 0 300 280" width="300" height="280"></svg>
          <div class="pw-pen" id="pw-pen">✏️</div>
        </div>
      </div>
    `;
    renderStroke();
  }

  function renderStroke() {
    const svg = document.getElementById("pw-svg");
    const letter = LETTERS[level];
    let ghost = "";
    letter.strokes.forEach((s, i) => {
      const d = s.map((p, j) => (j === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
      ghost += `<path d="${d}" stroke="#E2E8F0" stroke-width="10" stroke-linecap="round" fill="none"/>`;
    });
    const activeStroke = letter.strokes[strokeIdx];
    const d = activeStroke.map((p, j) => (j === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
    const len = totalLen(activeStroke);
    svg.innerHTML = ghost + `
      <path id="pw-progress" d="${d}" stroke="#48BB78" stroke-width="10" stroke-linecap="round" fill="none"
        stroke-dasharray="${len}" stroke-dashoffset="${len}"/>
      <circle cx="${activeStroke[0][0]}" cy="${activeStroke[0][1]}" r="12" fill="#4A90E2"/>
      <text x="${activeStroke[0][0]}" y="${activeStroke[0][1] + 5}" font-size="13" fill="white" text-anchor="middle" font-weight="bold">${strokeIdx + 1}</text>
      <text x="${activeStroke[activeStroke.length - 1][0] + 18}" y="${activeStroke[activeStroke.length - 1][1]}" font-size="20">🏁</text>
    `;
    positionPen(activeStroke[0]);
  }

  function positionPen(pt) {
    const svg = document.getElementById("pw-svg");
    const rect = svg.getBoundingClientRect();
    const pen = document.getElementById("pw-pen");
    
    // إزالة الإزاحات (stageRect) والاعتماد فقط على الإحداثيات مضروبة في معامل القياس
    pen.style.left = (pt[0] * rect.width / 300) + "px";
    pen.style.top = (pt[1] * rect.height / 280) + "px";
  }

  let drawing = false;
  function toSvg(clientX, clientY) {
    const svg = document.getElementById("pw-svg");
    const rect = svg.getBoundingClientRect();
    return [(clientX - rect.left) / rect.width * 300, (clientY - rect.top) / rect.height * 280];
  }

  function handleMove(clientX, clientY) {
    if (!drawing) return;
    const letter = LETTERS[level];
    const activeStroke = letter.strokes[strokeIdx];
    const [x, y] = toSvg(clientX, clientY);
    const total = totalLen(activeStroke);
    let best = progress, bestDist = Infinity;
    for (let d = progress; d <= total; d += 3) {
      const p = pointAt(activeStroke, d);
      const dist = Math.hypot(p[0] - x, p[1] - y);
      if (dist < bestDist) { bestDist = dist; best = d; }
      if (d - progress > 50) break;
    }
    if (bestDist < 26) {
      progress = best;
      const pathEl = document.getElementById("pw-progress");
      pathEl.setAttribute("stroke-dashoffset", total - progress);
      positionPen(pointAt(activeStroke, progress));
      if (progress >= total - 4) {
        drawing = false;
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(clientX, clientY);
        strokeIdx++;
        progress = 0;
        if (strokeIdx >= letter.strokes.length) {
          level++;
          setTimeout(() => {
            if (level >= LETTERS.length) {
              window.GameHub.showComplete("Perfect Strokes!", "You traced every letter in the correct order and direction.");
            } else {
              build();
            }
          }, 500);
        } else {
          setTimeout(renderStroke, 400);
        }
      }
    }
  }

  function start(e) { drawing = true; const p = e.touches ? e.touches[0] : e; handleMove(p.clientX, p.clientY); }
  function move(e) { if (!drawing) return; e.preventDefault(); const p = e.touches ? e.touches[0] : e; handleMove(p.clientX, p.clientY); }
  function end() { drawing = false; }

  build();
  stage.addEventListener("mousedown", start);
  stage.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);
};
