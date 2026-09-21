// Writing > Readiness > Connecting dots & Letters (Therapeutic 15 gameData)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 gameData divided into 3 Stages
  const gameData = [
    // Stage 1: Motor Warm-up (Lines)
    { d: "M 80,140 L 400,140", name: "Straight" },
    { d: "M 80,220 L 160,60 L 240,220 L 320,60 L 400,220", name: "Zigzag" },
    { d: "M 80,140 Q 120,40 160,140 T 240,140 T 320,140 T 400,140", name: "Wavy" }, // مسار منحني سلس
    { d: "M 80,220 L 160,220 L 160,100 L 240,100 L 240,220 L 320,220 L 320,100 L 400,100", name: "Steps" },
    { d: "M 80,190 C 140,190 140,70 100,70 C 60,70 140,230 200,230 C 260,230 260,70 220,70 C 180,70 260,230 320,230 C 380,230 380,70 340,70 C 300,70 380,230 420,230", name: "Loops" },
    
    // Stage 2: Visual Closure (Shapes - Start/End at same point)
    { d: "M 240,40 A 100,100 0 1,0 240.01,40", name: "Circle" },
    { d: "M 140,60 L 340,60 L 340,220 L 140,220 Z", name: "Square" },
    { d: "M 240,60 L 340,220 L 140,220 Z", name: "Triangle" },
    { d: "M 240,100 C 240,100 210,40 140,60 C 70,80 120,180 240,260 C 360,180 410,80 340,60 C 270,40 240,100 240,100", name: "Heart" },
    { d: "M 240,40 L 270,130 L 360,130 L 285,180 L 315,260 L 240,200 L 165,260 L 195,180 L 120,130 L 210,130 Z", name: "Star" },
    
    // Stage 3: Reversal Correction (Letters - With explicit directions)
    { d: "M 300,100 C 300,50 180,50 180,140 C 180,230 300,230 300,180", name: "Letter 'c'" },
    { d: "M 280,90 C 240,50 160,80 160,150 C 160,220 240,240 280,210 L 280,70 L 280,230", name: "Letter 'a'" }, // C first, then up & down
    { d: "M 280,110 C 240,70 160,90 160,160 C 160,230 240,250 280,210 L 280,40 L 280,230", name: "Letter 'd'" },
    { d: "M 200,40 L 200,220 C 200,220 200,130 250,130 C 310,130 310,220 250,220 L 200,220", name: "Letter 'b'" }, // Line down, then curve right
    { d: "M 320,90 C 320,40 220,30 220,100 C 220,170 320,160 320,230 C 320,280 220,280 220,240", name: "Letter 's'" }
  ];

  let levelIndex = 0;

  stage.innerHTML = `
    <style>
      .cd-wrap { display:flex; flex-direction:column; align-items:center; gap:14px; padding:20px; width:100%; height:100%; font-family: sans-serif; }
      .cd-header { display:flex; justify-content:space-between; align-items:center; width:min(480px,92%); }
      .cd-progress { font-weight:700; color:#64748b; margin:0; }
      .cd-title { font-size:1.2rem; font-weight:700; color:#1e293b; text-align:center; margin:0; }
      .cd-canvas-wrap { position:relative; width:min(480px,92%); }
      svg { width:100%; background:#F8FAFC; border-radius:16px; border:3px solid #E2E8F0; touch-action:none; }
      
      .cd-pen { position:absolute; width:44px; height:44px; border-radius:50%; background:var(--primary-green, #48BB78); box-shadow:0 3px 0 #2f855a; display:flex; align-items:center; justify-content:center; font-size:22px; pointer-events:none; transform:translate(-50%,-50%); z-index:10; transition: transform 0.1s; }
      .cd-pen.drawing { transform:translate(-50%,-50%) scale(1.1); }
      
      .cd-hint { color:#64748b; font-size:0.9rem; font-weight:600; text-align:center; }
      
      /* Juicy Feedback - توهج النيون */
      .neon-glow {
        filter: drop-shadow(0 0 10px #48BB78) drop-shadow(0 0 20px #48BB78);
        stroke: #48BB78 !important;
        stroke-width: 10px !important;
        transition: all 0.3s ease;
      }
    </style>
    <div class="cd-wrap">
      <div class="cd-header">
        <p class="cd-progress">Round <span id="cd-round">1</span> / ${gameData.length}</p>
      </div>
      <p class="cd-title" id="cd-title">Trace the line!</p>
      <div class="cd-canvas-wrap">
        <svg id="cd-svg" viewBox="0 0 480 280"></svg>
        <div class="cd-pen" id="cd-pen">✨</div>
      </div>
      <p class="cd-hint">Click / touch and drag without lifting!</p>
    </div>
  `;

  const svg = document.getElementById("cd-svg");
  const pen = document.getElementById("cd-pen");
  const titleEl = document.getElementById("cd-title");
  const roundEl = document.getElementById("cd-round");

  let progress = 0;
  let drawing = false;
  let pathEl; 
  let totalLength = 0;

  function nextRound() {
    if (levelIndex >= gameData.length - 1) {
      window.GameHub.showComplete("Master Tracer!", "You've successfully completed all writing prep levels.");
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
    progress = 0;
    const currentPath = gameData[levelIndex];
    titleEl.innerText = `Trace: ${currentPath.name}`;
    roundEl.innerText = levelIndex + 1;
    
    // إنشاء مسار مخفي للحسابات
    pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", currentPath.d);
    pathEl.setAttribute("fill", "none"); 
    pathEl.setAttribute("stroke", "none"); 
    pathEl.style.opacity = "0";
    svg.appendChild(pathEl);
    totalLength = pathEl.getTotalLength();

    // بناء الأسهم الإرشادية ديناميكياً
    let arrowsHTML = "";
    for (let i = 40; i < totalLength - 20; i += 70) {
      let pt1 = pathEl.getPointAtLength(i);
      let pt2 = pathEl.getPointAtLength(i + 5);
      let angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * (180 / Math.PI);
      arrowsHTML += `<text x="${pt1.x}" y="${pt1.y + 6}" font-size="16" fill="#A0AEC0" text-anchor="middle" transform="rotate(${angle}, ${pt1.x}, ${pt1.y})">▶</text>`;
    }

    const startPt = pathEl.getPointAtLength(0);
    const endPt = pathEl.getPointAtLength(totalLength);

    svg.innerHTML = `
      <!-- المسار الأساسي المنقط -->
      <path d="${currentPath.d}" stroke="#CBD5E0" stroke-width="8" stroke-dasharray="0 22" stroke-linecap="round" fill="none"/>
      
      <!-- أسهم الاتجاه -->
      ${arrowsHTML}
      
      <!-- مسار التقدم الأخضر -->
      <path id="cd-progress-path" d="${currentPath.d}" stroke="#48BB78" stroke-width="8" stroke-linecap="round" fill="none"
        stroke-dasharray="${totalLength}" stroke-dashoffset="${totalLength}"/>
        
      <text x="${startPt.x}" y="${startPt.y - 15}" font-size="28" text-anchor="middle">⭐</text>
      <text x="${endPt.x}" y="${endPt.y + 10}" font-size="28" text-anchor="middle">🎯</text>
    `;
    
    svg.appendChild(pathEl); // نعيده للمحرك لكي نستخدم getPointAtLength
    positionPen(startPt.x, startPt.y);
    pen.classList.remove("drawing");
  }

  function positionPen(svgX, svgY) {
    const rect = svg.getBoundingClientRect();
    const scaleX = rect.width / 480;
    const scaleY = rect.height / 280;
    pen.style.left = (svgX * scaleX) + "px";
    pen.style.top = (svgY * scaleY) + "px";
  }

  function toSvgCoords(clientX, clientY) {
    const rect = svg.getBoundingClientRect();
    return [
      ((clientX - rect.left) / rect.width) * 480,
      ((clientY - rect.top) / rect.height) * 280
    ];
  }

  function handleMove(clientX, clientY) {
    if (!drawing) return;
    const [x, y] = toSvgCoords(clientX, clientY);
    
    // نافذة البحث الأمامية (يمنع الرجوع للخلف ويقفل الاتجاه)
    let bestD = progress;
    let minGap = Infinity;
    
    // يبحث في مسافة 70 بكسل أمامية فقط لفرض الاتجاه الصحيح
    for (let d = progress; d <= Math.min(totalLength, progress + 70); d += 5) {
      let pt = pathEl.getPointAtLength(d);
      let dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist < minGap) { minGap = dist; bestD = d; }
    }

    // السماحية / الأنبوب غير المرئي (قطر واسع 55 بكسل لاحتواء الاهتزازات)
    if (minGap < 55) {
      progress = bestD;
      const progressPath = document.getElementById("cd-progress-path");
      progressPath.style.strokeDashoffset = totalLength - progress;
      
      let p = pathEl.getPointAtLength(progress);
      positionPen(p.x, p.y);

      // شرط النجاح
      if (progress >= totalLength - 10) {
        drawing = false;
        pen.classList.remove("drawing");
        
        // Juicy Feedback
        progressPath.classList.add("neon-glow");
        window.GameHub.playSound("correct"); // Magic chime
        window.GameHub.triggerVFX(clientX, clientY);
        
        setTimeout(() => nextRound(), 1200);
        return;
      }
    }
    // إذا ابتعد أكثر من اللازم لا يحدث شيء (ينتظره ليعود للخط)
  }

  function start(e) {
    // منع السلوك الافتراضي للمتصفح (تحديد النص) عند النقر بالفأرة
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    
    drawing = true;
    pen.classList.add("drawing");
    const p = e.touches ? e.touches[0] : e;
    handleMove(p.clientX, p.clientY);
  }
  
  function move(e) {
    if (!drawing) return;
    e.preventDefault(); // يمنع تمرير الصفحة أثناء السحب
    const p = e.touches ? e.touches[0] : e;
    handleMove(p.clientX, p.clientY);
  }
  
  function end() {
    if (!drawing) return;
    drawing = false;
    pen.classList.remove("drawing");
    
    // عقاب رفع الإصبع (إعادة الجولة بلطف)
    if (progress < totalLength - 10) {
      progress = 0;
      const progressPath = document.getElementById("cd-progress-path");
      progressPath.style.transition = "stroke-dashoffset 0.3s ease";
      progressPath.style.strokeDashoffset = totalLength;
      
      let p = pathEl.getPointAtLength(0);
      positionPen(p.x, p.y);
      window.GameHub.playSound("wrong"); // صوت بسيط ينبه بالخطأ
      
      setTimeout(() => {
        progressPath.style.transition = ""; // إزالة الأنيميشن للسحب القادم
      }, 300);
    }
  }

  svg.addEventListener("mousedown", start);
  svg.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);

  renderLevel();
  window.nextRound = nextRound;
window.previousRound = previousRound;
};
