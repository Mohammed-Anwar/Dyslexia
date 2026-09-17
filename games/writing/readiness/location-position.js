// Writing > Readiness > Location / Position (15 Therapeutic gameData)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // قاعدة البيانات للـ 15 جولة حسب المراحل العلاجية
  const gameData = [
    // المرحلة الأولى: الاتجاهات الأساسية
    { desc: "Drag the apple to be ON the table.", hl: "ON", drag: "🍎", anchor: "🪑", mode: "on" },
    { desc: "Drag the ball to be UNDER the chair.", hl: "UNDER", drag: "⚽", anchor: "🪑", mode: "under" },
    { desc: "Drag the toy to be INSIDE the box.", hl: "INSIDE", drag: "🧸", anchor: "📦", mode: "inside" },
    { desc: "Drag the cat to be NEXT TO the bed.", hl: "NEXT TO", drag: "🐱", anchor: "🛏️", mode: "next_to" },
    { desc: "Drag the bird to be OUTSIDE the cage.", hl: "OUTSIDE", drag: "🐦", anchor: "🛖", mode: "outside" },
    
    // المرحلة الثانية: الإدراك المكاني المتقدم والعمق
    { desc: "Drag the ball to be BETWEEN the two boxes.", hl: "BETWEEN", drag: "🏀", anchor: "📦", mode: "between" },
    { desc: "Drag the dog to be BEHIND the tree.", hl: "BEHIND", drag: "🐶", anchor: "🌲", mode: "behind" }, // ستختفي جزئياً خلف الشجرة
    { desc: "Drag the car to be IN FRONT OF the house.", hl: "IN FRONT OF", drag: "🚗", anchor: "🏠", mode: "in_front" },
    { desc: "Drag the cloud to be ABOVE the sun.", hl: "ABOVE", drag: "☁️", anchor: "☀️", mode: "above" },
    { desc: "Drag the fish to be BELOW the boat.", hl: "BELOW", drag: "🐟", anchor: "⛵", mode: "below" },
    
    // المرحلة الثالثة: اتجاهات الصفحة وحوافها (محاكاة الدفتر)
    { desc: "Drag the star to the LEFT side.", hl: "LEFT", drag: "⭐", anchor: "", mode: "board_left" },
    { desc: "Drag the star to the RIGHT side.", hl: "RIGHT", drag: "⭐", anchor: "", mode: "board_right" },
    { desc: "Drag the stamp to the TOP LEFT corner.", hl: "TOP LEFT", drag: "🏷️", anchor: "", mode: "board_top_left" },
    { desc: "Drag the sticker to the BOTTOM RIGHT corner.", hl: "BOTTOM RIGHT", drag: "🎇", anchor: "", mode: "board_bottom_right" },
    { desc: "Drag the title to the CENTER.", hl: "CENTER", drag: "📝", anchor: "", mode: "board_center" }
  ];

  let levelIndex = 0;

  stage.innerHTML = `
    <style>
      .lp-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; height:100%; padding:20px; font-family: sans-serif; }
      .lp-header { display:flex; justify-content:space-between; align-items:center; width:min(560px,100%); }
      .lp-progress { font-weight:700; color:var(--text-muted, #64748b); margin:0; }
      .lp-speak-btn { background:none; border:none; font-size:1.8rem; cursor:pointer; padding:5px; border-radius:50%; transition:0.2s; }
      .lp-speak-btn:hover { background: #e2e8f0; }
      .lp-instruction { font-size:1.3rem; font-weight:700; color:var(--text-dark, #1e293b); text-align:center; margin:0; }
      .lp-instruction b { color:var(--primary-blue, #3b82f6); }
      
      .lp-arena { position:relative; width:min(560px,90%); height:360px; background:#F1F5F9; border:3px dashed #CBD5E0; border-radius:20px; flex-shrink:0; overflow:hidden; transition: all 0.5s ease; }
      
      /* تنسيق السبورة للمرحلة الثالثة */
      .lp-board { background: #ffffff !important; border: 4px solid #4a5568 !important; box-shadow: 0 8px 16px rgba(0,0,0,0.05); border-radius: 8px !important; }
      
      .anchor-item { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size: 6rem; user-select:none; pointer-events:none; }
      .anchor-twin-left { left: 25%; }
      .anchor-twin-right { left: 75%; }
      
      /* طبقات العمق (Z-Index) */
      .anchor-front { z-index: 10; }
      .anchor-back { z-index: 2; }
      .drag-front { z-index: 15; }
      .drag-back { z-index: 5; } /* تستخدم لجعل العنصر خلف الشجرة */

      .drag-item { position:absolute; top:16px; left:16px; width:64px; height:64px; border-radius:50%; background:white; box-shadow:0 4px 10px rgba(0,0,0,0.15); font-size:2.5rem; display:flex; align-items:center; justify-content:center; cursor:grab; user-select:none; border: 3px solid #e2e8f0; }
      .drag-item:active { cursor:grabbing; transform:scale(1.1); transition:transform 0.1s; }
    </style>
    <div class="lp-wrap">
      <div class="lp-header">
        <p class="lp-progress">Round <span id="lp-round">1</span> / ${gameData.length}</p>
        <button id="lp-speak-btn" class="lp-speak-btn" title="Listen Again">🔊</button>
      </div>
      <p class="lp-instruction" id="lp-instruction-text"></p>
      <div class="lp-arena" id="lp-arena"></div>
    </div>
  `;

  const arena = document.getElementById("lp-arena");
  const speakBtn = document.getElementById("lp-speak-btn");

  // نظام التعليق الصوتي باستخدام SpeechSynthesis API
  function playVoiceOver() {
    const round = gameData[levelIndex];
    if (!round || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(round.desc);
    msg.lang = 'en-US';
    msg.rate = 0.85; // سرعة أبطأ قليلاً لتناسب الأطفال
    window.speechSynthesis.speak(msg);
  }

  speakBtn.addEventListener("click", playVoiceOver);

  function checkPlacement(round) {
    const star = document.getElementById("lp-star");
    const arenaRect = arena.getBoundingClientRect();
    const dragRect = star.getBoundingClientRect();
    
    // إحداثيات مركز العنصر المسحوب
    const cx = dragRect.left + dragRect.width / 2;
    const cy = dragRect.top + dragRect.height / 2;

    // قياسات مرنة ومتسامحة لتناسب الأطفال ذوي التحديات الحركية
    if (round.mode.startsWith('board_')) {
      const mX = arenaRect.left + arenaRect.width / 2;
      const mY = arenaRect.top + arenaRect.height / 2;
      switch(round.mode) {
        case 'board_left': return cx < arenaRect.left + arenaRect.width * 0.4;
        case 'board_right': return cx > arenaRect.right - arenaRect.width * 0.4;
        case 'board_top_left': return cx < arenaRect.left + arenaRect.width * 0.4 && cy < arenaRect.top + arenaRect.height * 0.4;
        case 'board_bottom_right': return cx > arenaRect.right - arenaRect.width * 0.4 && cy > arenaRect.bottom - arenaRect.height * 0.4;
        case 'board_center': return Math.abs(cx - mX) < arenaRect.width * 0.25 && Math.abs(cy - mY) < arenaRect.height * 0.25;
      }
    }

    const anchors = document.querySelectorAll('.anchor-item');
    if (round.mode === 'between' && anchors.length === 2) {
      const a1 = anchors[0].getBoundingClientRect();
      const a2 = anchors[1].getBoundingClientRect();
      const minX = Math.min(a1.right, a2.right);
      const maxX = Math.max(a1.left, a2.left);
      return cx > minX && cx < maxX && Math.abs(cy - (a1.top + a1.height/2)) < 80;
    }

    const mainAnchor = document.getElementById('anchor-main');
    if (!mainAnchor) return false;
    const aRect = mainAnchor.getBoundingClientRect();
    
    // إحداثيات نسبية من مركز الهدف
    const rx = cx - (aRect.left + aRect.width / 2);
    const ry = cy - (aRect.top + aRect.height / 2);

    switch(round.mode) {
      case 'on': return Math.abs(rx) < aRect.width * 0.6 && ry < 20 && ry > -aRect.height;
      case 'under': return Math.abs(rx) < aRect.width * 0.6 && ry > -20 && ry < aRect.height;
      case 'inside': return Math.abs(rx) < aRect.width * 0.5 && Math.abs(ry) < aRect.height * 0.5;
      case 'next_to': return Math.abs(ry) < aRect.height * 0.6 && Math.abs(rx) > aRect.width * 0.3 && Math.abs(rx) < aRect.width * 1.5;
      case 'outside': return (Math.abs(rx) > aRect.width * 0.7 || Math.abs(ry) > aRect.height * 0.7) && cx > arenaRect.left && cx < arenaRect.right && cy > arenaRect.top && cy < arenaRect.bottom;
      case 'behind':
      case 'in_front': return Math.abs(rx) < aRect.width * 0.4 && Math.abs(ry) < aRect.height * 0.4;
      case 'above': return Math.abs(rx) < aRect.width * 0.6 && ry < -aRect.height * 0.3; // أعلى بمسافة
      case 'below': return Math.abs(rx) < aRect.width * 0.6 && ry > aRect.height * 0.3;  // أسفل بمسافة
    }
    return false;
  }

  function setRound() {
    if (levelIndex >= gameData.length) return;
    const round = gameData[levelIndex];

    document.getElementById('lp-round').innerText = levelIndex + 1;
    document.getElementById('lp-instruction-text').innerHTML = round.desc.replace(round.hl, `<b>${round.hl}</b>`);

    // بناء البيئة بناءً على المرحلة
    let arenaHTML = '';
    if (round.mode.startsWith('board_')) {
      arena.className = "lp-arena lp-board";
      arenaHTML = `<div class="drag-item drag-front" id="lp-star">${round.drag}</div>`;
    } else if (round.mode === 'between') {
      arena.className = "lp-arena";
      arenaHTML = `
        <div class="anchor-item anchor-twin-left anchor-back">${round.anchor}</div>
        <div class="anchor-item anchor-twin-right anchor-back">${round.anchor}</div>
        <div class="drag-item drag-front" id="lp-star">${round.drag}</div>
      `;
    } else {
      arena.className = "lp-arena";
      // تطبيق خدعة الإخفاء في جولة (BEHIND) باستخدام الـ z-index
      let zAnchor = round.mode === 'behind' ? 'anchor-front' : 'anchor-back';
      let zDrag = round.mode === 'behind' ? 'drag-back' : 'drag-front';
      arenaHTML = `
        <div class="anchor-item ${zAnchor}" id="anchor-main">${round.anchor}</div>
        <div class="drag-item ${zDrag}" id="lp-star">${round.drag}</div>
      `;
    }
    
    arena.innerHTML = arenaHTML;
    
    const star = document.getElementById("lp-star");
    window.GameHub.utils.makeDraggable(star, (x, y) => {
      if (checkPlacement(round)) {
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(x, y);
        levelIndex++;
        if (levelIndex >= gameData.length) {
          setTimeout(() => window.GameHub.showComplete("Excellent!", "You're ready for writing!"), 400);
        } else {
          setTimeout(setRound, 500);
        }
      } else {
        window.GameHub.playSound("wrong");
        // إعادة العنصر لنقطة البداية بلطف
        star.style.transform = "translate3d(0,0,0)";
        if(star.resetPosition) star.resetPosition();
      }
    });

    playVoiceOver();
  }

  // بدء الجولة الأولى
  setRound();
};