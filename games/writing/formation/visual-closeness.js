// Writing > Formation > Visual closeness
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Words split into letters, each letter positioned on baseline (0), ascender(-1) or descender(+1)
  const WORDS = [
    { word: "jump", rows: { j: 1, u: 0, m: 0, p: 1 } },
    { word: "top", rows: { t: -1, o: 0, p: 1 } },
    { word: "gym", rows: { g: 1, y: 1, m: 0 } }
  ];

  let idx = 0;
  let placedCount = 0;

  // 4-line notebook: top guide, midline (x-height top), baseline, descender line
  const LINE_TOP = 40, LINE_MID = 100, LINE_BASE = 160, LINE_DESC = 220;

  function build() {
    const w = WORDS[idx];
    placedCount = 0;
    const letters = w.word.split("");
    stage.innerHTML = `
      <style>
        .vc-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:16px;width:100%;}
        .vc-title{font-size:1.15rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .vc-notebook{position:relative;width:min(480px,90%);height:${LINE_DESC + 40}px;background:white;border:2px solid #E2E8F0;border-radius:12px;}
        .vc-line{position:absolute;left:0;right:0;height:2px;background:#CBD5E0;}
        .vc-line.base{background:#4A90E2;height:3px;}
        .vc-slot{position:absolute;width:50px;height:50px;border:2px dashed #E2E8F0;border-radius:8px;}
        .vc-tray{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
        .vc-letter{width:50px;height:50px;border-radius:10px;background:var(--primary-green);color:white;font-size:1.6rem;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 3px 0 #2f855a;}
      </style>
      <div class="vc-wrap">
        <p class="vc-title">Spell "${w.word}" — place each letter on its correct line!<br>
          <span style="font-size:0.85rem;color:var(--text-muted);font-weight:500;">Tall letters touch the top line, tail letters dip below the base.</span></p>
        <div class="vc-notebook" id="vc-notebook">
          <div class="vc-line" style="top:${LINE_TOP}px;"></div>
          <div class="vc-line" style="top:${LINE_MID}px;"></div>
          <div class="vc-line base" style="top:${LINE_BASE}px;"></div>
          <div class="vc-line" style="top:${LINE_DESC}px;"></div>
        </div>
        <div class="vc-tray" id="vc-tray"></div>
      </div>
    `;
    const notebook = document.getElementById("vc-notebook");
    const tray = document.getElementById("vc-tray");

    letters.forEach((ch, i) => {
      const rowType = w.rows[ch];
      let slotTop;
      if (rowType === -1) slotTop = LINE_TOP; // ascender: top of letter at top line
      else if (rowType === 1) slotTop = LINE_MID; // descender: top of letter at mid line, tail below base
      else slotTop = LINE_MID; // x-height letter sits between mid and base

      const slot = document.createElement("div");
      slot.className = "vc-slot";
      slot.id = "vc-slot-" + i;
      slot.style.left = (40 + i * 65) + "px";
      slot.style.top = slotTop + "px";
      notebook.appendChild(slot);

      const letter = document.createElement("div");
      letter.className = "vc-letter";
      letter.innerText = ch;
      letter.id = "vc-letter-" + i;
      
      // إضافة هذا السطر لبعثرة الحروف عشوائياً في الصندوق السفلي
      letter.style.order = Math.floor(Math.random() * 100);
      
      tray.appendChild(letter);

      window.GameHub.utils.makeDraggable(letter, (x, y) => {
        const rect = slot.getBoundingClientRect();
        const dist = Math.hypot(x - (rect.left + 25), y - (rect.top + 25));
        if (dist < 45) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(x, y);
          
          // تغيير شكل الإطار
          slot.style.borderStyle = "solid";
          slot.style.borderColor = "var(--primary-blue)";
          
          // إظهار الحرف وتوسيطه داخل المكان الصحيح
          slot.innerText = ch;
          slot.style.display = "flex";
          slot.style.alignItems = "center";
          slot.style.justifyContent = "center";
          slot.style.fontSize = "1.8rem";
          slot.style.fontWeight = "800";
          slot.style.color = "var(--primary-blue)";
          
          // إخفاء العنصر الأصلي الذي تم سحبه
          letter.style.visibility = "hidden";
          
          placedCount++;
          if (placedCount >= letters.length) {
            idx++;
            setTimeout(() => {
              if (idx >= WORDS.length) {
                window.GameHub.showComplete("Well Aligned!", "You placed every letter exactly on its line.");
              } else {
                build();
              }
            }, 600);
          }
        } else {
          window.GameHub.playSound("wrong");
          letter.style.transform = "translate3d(0,0,0)";
          letter.resetPosition();
        }
      });
    });
  }

  build();
};
