// Writing > Spelling > Silent letters
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 جولة مقسمة بدقة على 3 مراحل تعليمية
  const ROUNDS = [
    // Phase 1: Discovery (Rounds 1-5) - Click the silent letter
    { phase: 1, emoji: "🔪", word: "knife", silent: "k", prompt: "Click on the silent letter you write but don't pronounce!" },
    { phase: 1, emoji: "✍️", word: "write", silent: "w", prompt: "Click on the silent letter you write but don't pronounce!" },
    { phase: 1, emoji: "🧮", word: "comb", silent: "b", prompt: "Click on the silent letter you write but don't pronounce!" },
    { phase: 1, emoji: "👍", word: "thumb", silent: "b", prompt: "Click on the silent letter you write but don't pronounce!" },
    { phase: 1, emoji: "🏰", word: "castle", silent: "t", prompt: "Click on the silent letter you write but don't pronounce!" },

    // Phase 2: Discrimination (Rounds 6-10) - Choose the correct word with the silent letter
    { phase: 2, emoji: "🧠", prompt: "Choose the correct word matching the picture.", correct: "know", options: ["know", "no"] },
    { phase: 2, emoji: "🦵", prompt: "Choose the correct word matching the picture.", correct: "knee", options: ["knee", "need"] },
    { phase: 2, emoji: "🎁", prompt: "Choose the correct word matching the picture.", correct: "wrap", options: ["rap", "wrap"] },
    { phase: 2, emoji: "🛑", prompt: "Choose the correct word matching the picture.", correct: "sign", options: ["sin", "sign"] },
    { phase: 2, emoji: "⏰", prompt: "Choose the correct word matching the picture.", correct: "hour", options: ["our", "hour"] },

    // Phase 3: Application & Building (Rounds 11-15) - Drag and drop to spell
    { phase: 3, emoji: "⌚", word: "wrist", prompt: "Drag the letters to spell the word correctly. Don't forget the silent letter!" },
    { phase: 3, emoji: "❓", word: "doubt", prompt: "Drag the letters to spell the word correctly. Don't forget the silent letter!" },
    { phase: 3, emoji: "🏝️", word: "island", prompt: "Drag the letters to spell the word correctly. Don't forget the silent letter!" },
    { phase: 3, emoji: "💪", word: "muscle", prompt: "Drag the letters to spell the word correctly. Don't forget the silent letter!" },
    { phase: 3, emoji: "🛥️", word: "yacht", prompt: "Drag the letters to spell the word correctly. Don't forget the silent letter!" }
  ];

  let levelIndex = 0;
  let placedCount = 0;

  function build() {
    const round = ROUNDS[levelIndex];
    stage.innerHTML = "";
    placedCount = 0;

    const wrap = document.createElement("div");
    wrap.className = "cd-wrap";

    // Header
    const header = document.createElement("div");
    header.style.cssText = "width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding: 0 10px;";
    header.innerHTML = `
      <span style="font-weight:700; color:var(--primary-blue); font-size: 1.1rem;">Round ${levelIndex + 1}/15</span>
      <span style="font-weight:600; color:var(--text-muted); font-size: 0.85rem; background: var(--card-bg); padding: 4px 12px; border-radius: 20px;">Phase ${round.phase}</span>
    `;
    wrap.appendChild(header);

    // Emoji & Prompt
    wrap.innerHTML += `
      <div style="font-size:4.5rem; margin: 10px 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${round.emoji}</div>
      <p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; max-width:400px; line-height:1.4; margin-bottom:15px;">${round.prompt}</p>
    `;

    // ================= PHASE 1: Discovery =================
    if (round.phase === 1) {
      const wordContainer = document.createElement("div");
      wordContainer.style.cssText = "display:flex; gap:8px; font-size:3.5rem; font-weight:800; color:var(--text-dark); margin: 20px 0;";
      
      round.word.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.cssText = "cursor:pointer; padding:0 4px; border-radius:8px; transition: all 0.3s; user-select:none;";
        span.onmouseenter = () => { if (!span.classList.contains("found")) span.style.background = "#EBF8FF"; };
        span.onmouseleave = () => { if (!span.classList.contains("found")) span.style.background = "transparent"; };
        
        span.onclick = (e) => {
          if (char === round.silent) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            span.style.color = "var(--primary-green)";
            span.style.background = "rgba(72,187,120,0.1)";
            span.classList.add("found");
            setTimeout(nextRound, 1200);
          } else {
            window.GameHub.playSound("wrong");
            window.GameHub.speak("Try again");
            span.style.color = "#E53E3E";
            span.style.transform = "translateX(-4px)";
            setTimeout(() => { span.style.transform = "translateX(4px)"; }, 50);
            setTimeout(() => { 
              span.style.transform = "translateX(0)"; 
              span.style.color = "var(--text-dark)"; 
            }, 100);
          }
        };
        wordContainer.appendChild(span);
      });
      wrap.appendChild(wordContainer);

    // ================= PHASE 2: Discrimination =================
    } else if (round.phase === 2) {
      const optionsContainer = document.createElement("div");
      optionsContainer.style.cssText = "display:flex; gap:20px; justify-content:center; margin-top:10px;";
      
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      
      shuffledOptions.forEach(opt => {
        const btn = document.createElement("div");
        btn.className = "vs-opt"; // Reusing style from previous game for consistency
        btn.style.cssText = `width:140px; height:80px; border-radius:16px; background:white; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:800; color:var(--primary-blue); cursor:pointer; transition: all 0.2s; box-shadow: 0 4px 0 #2b6cb0; user-select:none;`;
        btn.innerText = opt;
        
        btn.onmouseenter = () => { btn.style.transform = "translateY(-2px)"; btn.style.background = "#EBF8FF"; };
        btn.onmouseleave = () => { btn.style.transform = "translateY(0)"; btn.style.background = "white"; };
        btn.onmousedown = () => { btn.style.transform = "translateY(2px)"; btn.style.boxShadow = "0 1px 0 #2b6cb0"; };
        btn.onmouseup = () => { btn.style.transform = "translateY(-2px)"; btn.style.boxShadow = "0 4px 0 #2b6cb0"; };
        
        btn.onclick = (e) => {
          if (opt === round.correct) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            btn.style.background = "var(--primary-green)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--primary-green)";
            btn.style.boxShadow = "0 4px 0 #2f855a";
            window.GameHub.speak(opt);
            setTimeout(nextRound, 1000);
          } else {
            window.GameHub.playSound("wrong");
            window.GameHub.speak("Try again");
            btn.style.borderColor = "#E53E3E";
            btn.style.color = "#E53E3E";
            btn.style.transform = "translateX(-5px)";
            setTimeout(() => { btn.style.transform = "translateX(5px)"; }, 50);
            setTimeout(() => { 
              btn.style.transform = "translateX(0)"; 
              btn.style.borderColor = "var(--primary-blue)";
              btn.style.color = "var(--primary-blue)";
            }, 100);
          }
        };
        optionsContainer.appendChild(btn);
      });
      wrap.appendChild(optionsContainer);

    // ================= PHASE 3: Application & Building =================
    } else if (round.phase === 3) {
      // Slots Area
      const slotsContainer = document.createElement("div");
      slotsContainer.style.cssText = "display:flex; gap:8px; margin: 20px 0; justify-content:center;";
      
      round.word.split("").forEach((char, i) => {
        const slot = document.createElement("div");
        slot.className = "sl-slot";
        slot.dataset.expected = char;
        slot.dataset.index = i;
        slot.style.cssText = `width:55px; height:65px; border-bottom:4px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:800; color:var(--primary-blue); background:rgba(74,144,226,0.05); border-radius:8px 8px 0 0; transition: all 0.3s;`;
        slot.innerText = "?";
        slotsContainer.appendChild(slot);
      });
      wrap.appendChild(slotsContainer);

      // Draggable Letters Tray
      const tray = document.createElement("div");
      tray.style.cssText = "display:flex; gap:12px; flex-wrap:wrap; justify-content:center; max-width:450px; margin-top:10px;";
      
      const scrambledLetters = round.word.split("").sort(() => Math.random() - 0.5);
      
      scrambledLetters.forEach((char, i) => {
        const tile = document.createElement("div");
        tile.className = "sl-tile";
        tile.style.cssText = `width:55px; height:55px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none; transition: transform 0.1s;`;
        tile.innerText = char;
        tile.dataset.char = char;
        tile.dataset.id = `tile-${i}`;
        tray.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
          const slots = document.querySelectorAll(".sl-slot");
          let closestSlot = null;
          let minDist = Infinity;

          // Find the closest empty slot
          slots.forEach(slot => {
            if (!slot.classList.contains("filled")) {
              const rect = slot.getBoundingClientRect();
              const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
              if (dist < minDist) {
                minDist = dist;
                closestSlot = slot;
              }
            }
          });

          if (closestSlot && minDist < 50) {
            if (draggedEl.dataset.char === closestSlot.dataset.expected) {
              // Correct placement
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              
              closestSlot.innerText = draggedEl.dataset.char;
              closestSlot.style.borderBottomColor = "var(--primary-green)";
              closestSlot.style.background = "rgba(72,187,120,0.1)";
              closestSlot.classList.add("filled");
              
              draggedEl.style.visibility = "hidden";
              placedCount++;

              if (placedCount === round.word.length) {
                setTimeout(nextRound, 1000);
              }
            } else {
              // Wrong letter for this slot
              window.GameHub.playSound("wrong");
              window.GameHub.speak("Not quite");
              draggedEl.style.transform = "translate3d(0,0,0)";
              if (draggedEl.resetPosition) draggedEl.resetPosition();
            }
          } else {
            // Dropped outside any slot
            draggedEl.style.transform = "translate3d(0,0,0)";
            if (draggedEl.resetPosition) draggedEl.resetPosition();
          }
        });
      });
      wrap.appendChild(tray);
    }

    stage.appendChild(wrap);
    
    // Auto-speak prompt on round start
    setTimeout(() => {
      if (round.phase === 1) window.GameHub.speak("Find the silent letter in " + round.word);
      if (round.phase === 2) window.GameHub.speak(round.prompt);
      if (round.phase === 3) window.GameHub.speak("Spell the word " + round.word);
    }, 600);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= ROUNDS.length) {
      window.GameHub.showComplete("Silent Letter Master!", "You discovered, identified, and built words with silent letters perfectly.");
    } else {
      build();
    }
  }

  // بدء اللعبة
  build();
};