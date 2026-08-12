// Writing > Spelling > Diacritics
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Simplified diacritic model using accent marks that must be dragged onto the right letter in a word.
  const ROUNDS = [
    { word: "cafe", target: 3, mark: "´", markedWord: "café", note: "Add the accent to the final E." },
    { word: "naive", target: 2, mark: "¨", markedWord: "naïve", note: "Add the two dots to the I." },
    { word: "resume", target: 1, mark: "´", markedWord: "résumé", note: "Add the accent to the first E." }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    const letters = r.word.split("");
    stage.innerHTML = `
      <style>
        .dc-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:16px;}
        .dc-banner{background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;padding:8px 14px;border-radius:8px;font-size:0.85rem;font-weight:600;text-align:center;max-width:400px;}
        .dc-title{font-size:1.15rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .dc-word{display:flex;gap:6px;}
        .dc-letter{position:relative;font-size:2.4rem;font-weight:800;color:var(--text-dark);padding-top:34px;}
        .dc-slot{position:absolute;top:0;left:50%;transform:translateX(-50%);width:34px;height:28px;border:2px dashed #CBD5E0;border-radius:6px;background:rgba(255,255,255,0.6);}
        .dc-mark{width:56px;height:56px;border-radius:50%;background:var(--primary-green);color:white;font-size:1.8rem;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 4px 0 #2f855a;}
      </style>
      <div class="dc-wrap">
        <div class="dc-banner">💡 Note: This activity is originally designed for Arabic diacritics (تشكيل), but English is currently used as a placeholder.</div>
        <p style="color:var(--text-muted);font-weight:600;margin:0;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p class="dc-title">${r.note}</p>
        <div class="dc-word" id="dc-word"></div>
        <div class="dc-mark" id="dc-mark">${r.mark}</div>
      </div>
    `;
    const wordEl = document.getElementById("dc-word");
    
    letters.forEach((ch, i) => {
      const wrap = document.createElement("div");
      wrap.className = "dc-letter";
      wrap.innerText = ch;
      
      // إنشاء خانة تشكيل فوق كل حرف، وتخزين ما إذا كانت هي الصحيحة أم لا
      const slot = document.createElement("div");
      slot.className = "dc-slot";
      slot.dataset.correct = (i === r.target) ? "true" : "false";
      wrap.appendChild(slot);
      
      wordEl.appendChild(wrap);
    });

    const mark = document.getElementById("dc-mark");
    window.GameHub.utils.makeDraggable(mark, (x, y) => {
      const slots = document.querySelectorAll(".dc-slot");
      let droppedOnCorrect = false;
      let droppedOnAny = false;

      slots.forEach((slot) => {
        const rect = slot.getBoundingClientRect();
        const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
        if (dist < 40) {
          droppedOnAny = true;
          if (slot.dataset.correct === "true") {
            droppedOnCorrect = true;
            // تلوين الخانة الصحيحة باللون الأخضر وإظهار التشكيل فيها
            slot.style.borderStyle = "solid";
            slot.style.background = "var(--primary-green)";
            slot.style.borderColor = "var(--primary-green)";
            slot.innerText = r.mark;
            slot.style.display = "flex";
            slot.style.alignItems = "center";
            slot.style.justifyContent = "center";
            slot.style.color = "white";
            slot.style.fontSize = "1.2rem";
            slot.style.fontWeight = "bold";
          }
        }
      });

      if (droppedOnCorrect) {
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(x, y);
        mark.style.visibility = "hidden";
        idx++;
        setTimeout(() => {
          if (idx >= ROUNDS.length) {
            window.GameHub.showComplete("Mark Master!", "You placed every diacritic mark in the right spot.");
          } else {
            build();
          }
        }, 700);
      } else {
        window.GameHub.playSound("wrong");
        mark.style.transform = "translate3d(0,0,0)";
        mark.resetPosition();
      }
    });
  }

  build();
};