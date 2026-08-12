// Writing > Readiness > Connecting dots
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const PATHS = [
    { points: [[60, 200], [150, 80], [240, 200], [330, 80], [420, 200]], name: "Zigzag" },
    { points: [[60, 120], [140, 220], [220, 60], [300, 220], [380, 120]], name: "Wavy" },
    { points: [[60, 200], [150, 200], [150, 80], [250, 80], [250, 200], [340, 200]], name: "Steps" }
  ];

  let level = 0;

  stage.innerHTML = `
    <style>
      .cd-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px;width:100%;height:100%;}
      .cd-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);}
      .cd-canvas-wrap{position:relative;width:min(480px,92%);}
      svg{width:100%;background:#F8FAFC;border-radius:16px;border:2px solid #E2E8F0;touch-action:none;}
      .cd-pen{position:absolute;width:36px;height:36px;border-radius:50%;background:var(--primary-green);box-shadow:0 3px 0 #2f855a;display:flex;align-items:center;justify-content:center;font-size:18px;pointer-events:none;transform:translate(-50%,-50%);}
      .cd-hint{color:var(--text-muted);font-size:0.9rem;}
    </style>
    <div class="cd-wrap">
      <p class="cd-title">Trace ${PATHS[level].name} the line from ⭐ to 🎯 without lifting!</p>
      <div class="cd-canvas-wrap">
        <svg id="cd-svg" viewBox="0 0 480 280"></svg>
        <div class="cd-pen" id="cd-pen">✏️</div>
      </div>
      <p class="cd-hint">Click / touch and drag along the dotted line.</p>
    </div>
  `;

  const svg = document.getElementById("cd-svg");
  const pen = document.getElementById("cd-pen");
  let progress = 0;
  let drawing = false;
  let currentPath = PATHS[level];

  function segLength(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function totalLength(pts) {
    let l = 0;
    for (let i = 1; i < pts.length; i++) l += segLength(pts[i - 1], pts[i]);
    return l;
  }
  function pointAt(pts, dist) {
    let remaining = dist;
    for (let i = 1; i < pts.length; i++) {
      const segLen = segLength(pts[i - 1], pts[i]);
      if (remaining <= segLen) {
        const t = segLen === 0 ? 0 : remaining / segLen;
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      }
      remaining -= segLen;
    }
    return pts[pts.length - 1];
  }

  function render() {
    const pts = currentPath.points;
    const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
    svg.innerHTML = `
      <path d="${d}" stroke="#CBD5E0" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round" fill="none"/>
      <path id="cd-progress-path" d="${d}" stroke="#48BB78" stroke-width="6" stroke-linecap="round" fill="none"
        stroke-dasharray="${totalLength(pts)}" stroke-dashoffset="${totalLength(pts)}"/>
      <text x="${pts[0][0]}" y="${pts[0][1] - 20}" font-size="26" text-anchor="middle">⭐</text>
      <text x="${pts[pts.length - 1][0]}" y="${pts[pts.length - 1][1] - 20}" font-size="26" text-anchor="middle">🎯</text>
    `;
    const start = pts[0];
    positionPen(start[0], start[1]);
  }

  function positionPen(svgX, svgY) {
    const rect = svg.getBoundingClientRect();
    const scaleX = rect.width / 480, scaleY = rect.height / 280;
    
    // إزالة الإزاحات الإضافية والاكتفاء بضرب الإحداثيات في معامل القياس
    pen.style.left = (svgX * scaleX) + "px";
    pen.style.top = (svgY * scaleY) + "px";
  }

  function toSvgCoords(clientX, clientY) {
    const rect = svg.getBoundingClientRect();
    return [(clientX - rect.left) / rect.width * 480, (clientY - rect.top) / rect.height * 280];
  }

  function handleMove(clientX, clientY) {
    if (!drawing) return;
    const [x, y] = toSvgCoords(clientX, clientY);
    const total = totalLength(currentPath.points);
    // find nearest progress point ahead of current progress within tolerance
    let best = progress, bestDist = Infinity;
    for (let d = progress; d <= total; d += 3) {
      const p = pointAt(currentPath.points, d);
      const dist = Math.hypot(p[0] - x, p[1] - y);
      if (dist < bestDist) { bestDist = dist; best = d; }
      if (d - progress > 60) break;
    }
    if (bestDist < 28) {
      progress = best;
      const pathEl = document.getElementById("cd-progress-path");
      pathEl.setAttribute("stroke-dashoffset", total - progress);
      const p = pointAt(currentPath.points, progress);
      positionPen(p[0], p[1]);
      window.GameHub.playSound("click");
      if (progress >= total - 4) {
        drawing = false;
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(clientX, clientY);
        level++;
        setTimeout(() => {
          if (level >= PATHS.length) {
            window.GameHub.showComplete("Steady Hands!", "You traced every line perfectly.");
          } else {
            currentPath = PATHS[level];
            progress = 0;
            stage.querySelector(".cd-title").innerText = `Trace the ${currentPath.name} line from ⭐ to 🎯 without lifting!`;
            render();
          }
        }, 500);
      }
    } else {
      window.GameHub.playSound("wrong");
    }
  }

  function start(e) {
    drawing = true;
    const p = e.touches ? e.touches[0] : e;
    handleMove(p.clientX, p.clientY);
  }
  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = e.touches ? e.touches[0] : e;
    handleMove(p.clientX, p.clientY);
  }
  function end() { drawing = false; }

  svg.addEventListener("mousedown", start);
  svg.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);

  render();
};
