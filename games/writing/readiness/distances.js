// Writing > Readiness > Spacing & Distance Calibration
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    // Phase 1: Abstract Distance Calibration (Drag & Drop Cables) - Rounds 1 to 5
    {
      phase: 1,
      badge: "Phase 1: Power Cable Calibration",
      title: "Drag and drop the correct cable to connect the two power nodes.",
      targetWidth: 70,
      neededKey: "short"
    },
    {
      phase: 1,
      badge: "Phase 1: Power Cable Calibration",
      title: "Drag and drop the correct cable to connect the two power nodes.",
      targetWidth: 230,
      neededKey: "long"
    },
    {
      phase: 1,
      badge: "Phase 1: Power Cable Calibration",
      title: "Drag and drop the correct cable to connect the two power nodes.",
      targetWidth: 140,
      neededKey: "medium"
    },
    {
      phase: 1,
      badge: "Phase 1: Power Cable Calibration",
      title: "Drag and drop the correct cable to connect the two power nodes.",
      targetWidth: 70,
      neededKey: "short"
    },
    {
      phase: 1,
      badge: "Phase 1: Power Cable Calibration",
      title: "Drag and drop the correct cable to connect the two power nodes.",
      targetWidth: 230,
      neededKey: "long"
    },

    // Phase 2: Letter Spacing Calibration - Rounds 6 to 10
    {
      phase: 2,
      badge: "Phase 2: Letter Spacing",
      title: "Select the block with natural and readable letter spacing.",
      word: "CAT",
      options: [
        { spacing: "-6px", correct: false },
        { spacing: "6px", correct: true },
        { spacing: "22px", correct: false }
      ]
    },
    {
      phase: 2,
      badge: "Phase 2: Letter Spacing",
      title: "Select the block with natural and readable letter spacing.",
      word: "SUN",
      options: [
        { spacing: "24px", correct: false },
        { spacing: "6px", correct: true },
        { spacing: "-6px", correct: false }
      ]
    },
    {
      phase: 2,
      badge: "Phase 2: Letter Spacing",
      title: "Select the block with natural and readable letter spacing.",
      word: "DOG",
      options: [
        { spacing: "6px", correct: true },
        { spacing: "-6px", correct: false },
        { spacing: "24px", correct: false }
      ]
    },
    {
      phase: 2,
      badge: "Phase 2: Letter Spacing",
      title: "Select the block with natural and readable letter spacing.",
      word: "ROBOT",
      options: [
        { spacing: "-6px", correct: false },
        { spacing: "24px", correct: false },
        { spacing: "6px", correct: true }
      ]
    },
    {
      phase: 2,
      badge: "Phase 2: Letter Spacing",
      title: "Select the block with natural and readable letter spacing.",
      word: "SPACE",
      options: [
        { spacing: "6px", correct: true },
        { spacing: "24px", correct: false },
        { spacing: "-6px", correct: false }
      ]
    },

    // Phase 3: Word Spacing Calibration - Rounds 11 to 15
    {
      phase: 3,
      badge: "Phase 3: Word Spacing",
      title: "Tap the gap slots to insert Space Bars between the words.",
      rawText: "Thecatisbig",
      gapIndices: [2, 5, 7]
    },
    {
      phase: 3,
      badge: "Phase 3: Word Spacing",
      title: "Tap the gap slots to insert Space Bars between the words.",
      rawText: "Iseeastar",
      gapIndices: [0, 3, 4]
    },
    {
      phase: 3,
      badge: "Phase 3: Word Spacing",
      title: "Tap the gap slots to insert Space Bars between the words.",
      rawText: "Fixtheline",
      gapIndices: [2, 5]
    },
    {
      phase: 3,
      badge: "Phase 3: Word Spacing",
      title: "Tap the gap slots to insert Space Bars between the words.",
      rawText: "Runtomars",
      gapIndices: [2, 4]
    },
    {
      phase: 3,
      badge: "Phase 3: Word Spacing",
      title: "Tap the gap slots to insert Space Bars between the words.",
      rawText: "Acoolbot",
      gapIndices: [0, 4]
    }
  ];

  const CABLE_OPTIONS = [
    { key: "short", width: 70 },
    { key: "medium", width: 140 },
    { key: "long", width: 230 }
  ];

  let idx = 0;
  let selectedGaps = new Set();

  function build() {
    const r = ROUNDS[idx];
    selectedGaps.clear();

    let html = `
      <style>
        .di-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;width:100%;max-width:680px;margin:0 auto;box-sizing:border-box;font-family:'Segoe UI',Roboto,sans-serif;user-select:none;-webkit-user-select:none;}
        .di-badge{background:#EBF8FF;color:var(--primary-blue,#4A90E2);border:1.5px solid var(--primary-blue,#4A90E2);padding:5px 14px;border-radius:20px;font-size:0.85rem;font-weight:700;}
        .di-progress{color:var(--text-muted,#718096);font-weight:600;font-size:0.9rem;}
        .di-title{font-size:1.15rem;font-weight:700;color:var(--text-dark,#2D3748);text-align:center;margin:0;line-height:1.4;}
        
        /* Phase 1 Styles (Drag and Drop Area) */
        .di-scene-p1{display:flex;align-items:center;justify-content:center;gap:12px;background:var(--card-bg,#F2F5FB);border-radius:20px;padding:32px 20px;border:2px solid #E2E8F0;width:100%;box-shadow:0 2px 8px rgba(0,0,0,0.03);min-height:120px;box-sizing:border-box;position:relative;}
        .di-node{font-size:2rem;background:white;border:2.5px solid var(--primary-blue,#4A90E2);border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.05);z-index:2;}
        .di-drop-zone{height:32px;background:#E2E8F0;border:2px dashed #A0AEC0;border-radius:8px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;position:relative;}
        .di-drop-zone.hover{border-color:var(--primary-blue,#4A90E2);background:#EBF8FF;}
        
        .di-cable-tray{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:center;background:white;padding:20px;border-radius:16px;border:2px solid #E2E8F0;width:100%;box-sizing:border-box;}
        .di-cable-item{padding:12px 16px;background:var(--card-bg,#F2F5FB);border:2px solid #CBD5E0;border-radius:12px;cursor:grab;display:flex;align-items:center;justify-content:center;touch-action:none;transition:transform 0.1s, border-color 0.2s, box-shadow 0.2s;z-index:10;}
        .di-cable-item:hover{border-color:var(--primary-blue,#4A90E2);box-shadow:0 4px 10px rgba(74,144,226,0.15);}
        .di-cable-item.dragging{cursor:grabbing;opacity:0.85;box-shadow:0 8px 20px rgba(0,0,0,0.2);z-index:100;}
        .di-cable-bar{height:10px;border-radius:5px;background:linear-gradient(90deg,var(--primary-blue,#4A90E2),#63B3ED);pointer-events:none;}
        
        /* Phase 2 Styles */
        .di-options{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;width:100%;}
        .di-word-card{padding:20px 28px;background:var(--card-bg,#F2F5FB);border:2px solid #E2E8F0;border-radius:16px;cursor:pointer;font-size:1.8rem;font-family:monospace;font-weight:bold;color:var(--text-dark,#2D3748);transition:all 0.2s;display:flex;justify-content:center;align-items:center;min-width:140px;}
        .di-word-card:hover{border-color:var(--primary-blue,#4A90E2);background:white;transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,0.06);}

        /* Phase 3 Styles */
        .di-sentence-box{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;background:var(--card-bg,#F2F5FB);border:2px solid #E2E8F0;border-radius:20px;padding:28px 16px;width:100%;box-sizing:border-box;}
        .di-char{font-size:1.6rem;font-weight:800;font-family:monospace;color:var(--text-dark,#2D3748);background:white;width:40px;height:50px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid #CBD5E0;box-shadow:0 2px 4px rgba(0,0,0,0.02);}
        .di-gap-btn{height:50px;min-width:20px;background:white;border:2px dashed #A0AEC0;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#A0AEC0;font-weight:bold;font-size:0.85rem;padding:0 4px;transition:all 0.2s;}
        .di-gap-btn:hover{border-color:var(--primary-blue,#4A90E2);color:var(--primary-blue,#4A90E2);background:#EBF8FF;}
        .di-gap-btn.active{background:var(--primary-blue,#4A90E2);border:2px solid var(--primary-blue,#4A90E2);color:#FFFFFF;min-width:36px;box-shadow:0 4px 8px rgba(74,144,226,0.3);}
        .di-action-btn{padding:14px 32px;background:var(--primary-blue,#4A90E2);color:#FFFFFF;font-size:1rem;font-weight:700;border:none;border-radius:50px;cursor:pointer;box-shadow:0 4px 0 #2B6CB0;transition:all 0.15s;}
        .di-action-btn:hover{background:#3182CE;}
        .di-action-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #2B6CB0;}
      </style>
      <div class="di-wrap">
        <span class="di-badge">${r.badge}</span>
        <p class="di-progress">Round ${idx + 1} / ${ROUNDS.length}</p>
    `;

    if (r.phase === 1) {
      // Phase 1 Layout (Drag and Drop)
      html += `
        <div class="di-scene-p1">
          <div class="di-node">⚡</div>
          <div class="di-drop-zone" id="di-line-target" style="width:${r.targetWidth}px;"></div>
          <div class="di-node">⚡</div>
        </div>
        <p class="di-title">${r.title}</p>
        <div class="di-cable-tray" id="di-cable-tray"></div>
      `;
      stage.innerHTML = html + `</div>`;

      setupDragAndDropPhase1(r);

    } else if (r.phase === 2) {
      // Phase 2 Layout
      html += `
        <p class="di-title">${r.title}</p>
        <div class="di-options" id="di-options"></div>
      `;
      stage.innerHTML = html + `</div>`;

      const container = document.getElementById("di-options");
      const shuffledOpts = [...r.options].sort(() => Math.random() - 0.5);
      shuffledOpts.forEach(o => {
        const card = document.createElement("div");
        card.className = "di-word-card";
        card.style.letterSpacing = o.spacing;
        card.textContent = r.word;
        card.onclick = (e) => handleAnswer(o.correct, e);
        container.appendChild(card);
      });

    } else if (r.phase === 3) {
      // Phase 3 Layout
      html += `
        <p class="di-title">${r.title}</p>
        <div class="di-sentence-box" id="di-sentence-box"></div>
        <button class="di-action-btn" id="di-check-btn">Calibrate Spacing</button>
      `;
      stage.innerHTML = html + `</div>`;

      renderSentenceGaps(r);

      document.getElementById("di-check-btn").onclick = (e) => {
        const isCorrect = selectedGaps.size === r.gapIndices.length &&
          r.gapIndices.every(g => selectedGaps.has(g));
        handleAnswer(isCorrect, e);
      };
    }
  }

  // Setup Drag and Drop Mechanics via Pointer Events (Touch & Mouse Supported)
function setupDragAndDropPhase1(r) {
    const tray = document.getElementById("di-cable-tray");
    const dropZone = document.getElementById("di-line-target");
    if (!tray || !dropZone) return;

    const shuffledCables = [...CABLE_OPTIONS].sort(() => Math.random() - 0.5);

    shuffledCables.forEach(o => {
      const item = document.createElement("div");
      item.className = "di-cable-item";
      item.innerHTML = `<div class="di-cable-bar" style="width:${o.width}px;"></div>`;

      let activePointerId = null;
      let startX = 0, startY = 0;

      item.onpointerdown = (e) => {
        e.preventDefault();
        activePointerId = e.pointerId;
        item.setPointerCapture(e.pointerId);
        item.classList.add("dragging");
        startX = e.clientX;
        startY = e.clientY;
      };

      item.onpointermove = (e) => {
        if (activePointerId === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        item.style.transform = `translate(${dx}px, ${dy}px)`;

        const dropRect = dropZone.getBoundingClientRect();
        if (
          e.clientX >= dropRect.left &&
          e.clientX <= dropRect.right &&
          e.clientY >= dropRect.top &&
          e.clientY <= dropRect.bottom
        ) {
          dropZone.classList.add("hover");
        } else {
          dropZone.classList.remove("hover");
        }
      };

      const handlePointerUp = (e) => {
        if (activePointerId === null) return;
        item.releasePointerCapture(e.pointerId);
        activePointerId = null;

        dropZone.classList.remove("hover");

        const dropRect = dropZone.getBoundingClientRect();
        const droppedInZone =
          e.clientX >= dropRect.left &&
          e.clientX <= dropRect.right &&
          e.clientY >= dropRect.top &&
          e.clientY <= dropRect.bottom;

        item.classList.remove("dragging");

        if (droppedInZone) {
          const isCorrect = (o.key === r.neededKey);

          if (isCorrect) {
            // 1. تفريغ وتنسيق منطقة الإسقاط لعمل Snap في المنتصف تماماً
            dropZone.innerHTML = "";
            dropZone.style.border = "none";
            dropZone.style.background = "transparent";

            // 2. إزالة إطار وخلفية الكابل
            item.style.background = "transparent";
            item.style.border = "none";
            item.style.padding = "0";
            item.style.boxShadow = "none";
            item.style.transform = "none";

            // 3. تثبيت الكابل داخل منطقة الإسقاط
            dropZone.appendChild(item);

            // 4. تشغيل صوت الفوز والانتقال للجولة التالية
            handleAnswer(true, e);
            return;
          }
        }

        // في حالة الإجابة الخاطئة أو الإسقاط خارج المنطقة: يعود الكابل لمكانه الاصلي
        item.style.transform = "none";
        if (droppedInZone) {
          handleAnswer(false, e);
        }
      };

      item.onpointerup = handlePointerUp;
      item.onpointercancel = handlePointerUp;

      tray.appendChild(item);
    });
  }

  function renderSentenceGaps(r) {
    const box = document.getElementById("di-sentence-box");
    if (!box) return;
    box.innerHTML = "";

    for (let i = 0; i < r.rawText.length; i++) {
      const charSpan = document.createElement("div");
      charSpan.className = "di-char";
      charSpan.textContent = r.rawText[i];
      box.appendChild(charSpan);

      if (i < r.rawText.length - 1) {
        const gapBtn = document.createElement("button");
        const isActive = selectedGaps.has(i);
        gapBtn.className = `di-gap-btn ${isActive ? 'active' : ''}`;
        gapBtn.textContent = isActive ? "SPACE" : "+";
        gapBtn.onclick = () => {
          if (selectedGaps.has(i)) {
            selectedGaps.delete(i);
          } else {
            selectedGaps.add(i);
          }
          renderSentenceGaps(r);
        };
        box.appendChild(gapBtn);
      }
    }
  }

  function handleAnswer(isCorrect, event) {
    if (isCorrect) {
      window.GameHub.playSound("correct");
      window.GameHub.triggerVFX(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
      idx++;
      setTimeout(() => {
        if (idx >= ROUNDS.length) {
          window.GameHub.showComplete("System Calibrated!", "You matched and calibrated all 15 spacing modules correctly.");
        } else {
          build();
        }
      }, 1000);
    } else {
      window.GameHub.playSound("wrong");
    }
  }

  build();
};