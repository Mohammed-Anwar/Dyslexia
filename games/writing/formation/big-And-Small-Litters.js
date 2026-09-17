window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // تعريف الـ 15 جولة مقسمة على 3 مراحل
  const ROUNDS = [
    // Phase 1: Match uppercase with lowercase (Rounds 1-5)
    { phase: 1, target: 'A', options: ['a', 'e', 'd'], correct: 'a' },
    { phase: 1, target: 'B', options: ['b', 'd', 'p'], correct: 'b' },
    { phase: 1, target: 'M', options: ['m', 'n', 'w'], correct: 'm' },
    { phase: 1, target: 'T', options: ['t', 'f', 'l'], correct: 't' },
    { phase: 1, target: 'H', options: ['h', 'n', 'k'], correct: 'h' },
    
    // Phase 2: Sort the family (Rounds 6-10)
    { phase: 2, letters: ['A', 'a', 'T', 't'] },
    { phase: 2, letters: ['M', 'm', 'R', 'r'] },
    { phase: 2, letters: ['B', 'b', 'D', 'd'] },
    { phase: 2, letters: ['P', 'p', 'Q', 'q'] },
    { phase: 2, letters: ['H', 'h', 'K', 'k'] },

    // Phase 3: Tricky letters challenge (Rounds 11-15)
    { phase: 3, target: 'c', prompt: 'Find the UPPERCASE twin for "c"', options: ['C', 'O', 'Q'], correct: 'C' },
    { phase: 3, target: 's', prompt: 'Find the UPPERCASE twin for "s"', options: ['S', 'C', 'U'], correct: 'S' },
    { phase: 3, target: 'V', prompt: 'Find the lowercase twin for "V"', options: ['v', 'u', 'w'], correct: 'v' },
    { phase: 3, target: 'W', prompt: 'Find the lowercase twin for "W"', options: ['w', 'v', 'u'], correct: 'w' },
    { phase: 3, target: 'b', prompt: 'Find the UPPERCASE twin for "b"', options: ['B', 'D', 'P'], correct: 'B' }
  ];
  
  let levelIndex = 0;
  let phase2SortedCount = 0;

  function build() {
    const round = ROUNDS[levelIndex];
    stage.innerHTML = '';
    
    const wrap = document.createElement('div');
    wrap.className = 'cd-wrap';
    
    // Header: Round Counter & Phase Indicator
    const header = document.createElement('div');
    header.style.cssText = 'width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding: 0 10px;';
    header.innerHTML = `
      <span style="font-weight:700; color:var(--primary-blue); font-size: 1.1rem;">Round ${levelIndex + 1}/15</span>
      <span style="font-weight:600; color:var(--text-muted); font-size: 0.9rem; background: var(--card-bg); padding: 4px 12px; border-radius: 20px;">Phase ${round.phase}</span>
    `;
    wrap.appendChild(header);

    // ================= PHASE 1 =================
    if (round.phase === 1) {
      wrap.innerHTML += `
        <div class="cnd-title" style="font-size:1.3rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">
          Match the lowercase twin for <span style="color:var(--primary-blue); font-size:2.2rem;">${round.target}</span>
        </div>
        <div class="cnd-board" id="cnd-board" style="position:relative; width:300px; height:150px; background:var(--card-bg); border:2px solid #E2E8F0; border-radius:16px; display:flex; justify-content:center; align-items:center;">
          <div class="cnd-slot" id="cnd-slot" style="width:80px; height:80px; border:3px dashed #CBD5E0; border-radius:12px; display:flex; justify-content:center; align-items:center; font-size:2.5rem; font-weight:700; color:var(--text-muted);">?</div>
        </div>
        <div class="cnd-tray" id="cnd-tray" style="display:flex; justify-content:center; gap:20px; margin-top:30px;"></div>
      `;
      
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      const tray = wrap.querySelector('#cnd-tray');
      
      shuffledOptions.forEach(opt => {
        const el = document.createElement('div');
        el.className = 'cnd-circle';
        el.style.cssText = `width:70px; height:70px; border-radius:12px; background:var(--primary-blue); color:white; display:flex; justify-content:center; align-items:center; font-size:2rem; font-weight:700; cursor:grab; box-shadow:0 4px 0 #2b6cb0; user-select:none;`;
        el.textContent = opt;
        el.dataset.value = opt;
        tray.appendChild(el);
        
        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const slot = wrap.querySelector('#cnd-slot');
          const rect = slot.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
          
          if (dist < 50) { // Snap distance
            if (opt === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              slot.textContent = opt;
              slot.style.background = "var(--primary-green)";
              slot.style.color = "white";
              slot.style.borderStyle = "solid";
              slot.style.borderColor = "var(--primary-green)";
              el.style.visibility = "hidden";
              setTimeout(() => {
                levelIndex++;
                if (levelIndex >= ROUNDS.length) {
                  window.GameHub.showComplete("Amazing!", "You mastered Uppercase and Lowercase letters!");
                } else {
                  build();
                }
              }, 800);
            } else {
              window.GameHub.playSound("wrong");
              el.style.transform = "translate3d(0,0,0)";
              if (el.resetPosition) el.resetPosition();
            }
          }
        });
      });

    // ================= PHASE 2 =================
    } else if (round.phase === 2) {
      wrap.innerHTML += `
        <div class="cnd-title" style="font-size:1.2rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">
          Sort the letters into their correct boxes!
        </div>
        <div style="display:flex; gap:30px; margin-bottom:30px; justify-content: center;">
          <div class="sort-box" id="box-upper" style="width:140px; height:160px; border:3px dashed var(--primary-blue); border-radius:16px; display:flex; flex-direction:column; justify-content:center; align-items:center; background:rgba(74,144,226,0.05); transition: background 0.3s;">
            <span style="font-size:1.5rem; font-weight:800; color:var(--primary-blue);">BIG</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">(Uppercase)</span>
          </div>
          <div class="sort-box" id="box-lower" style="width:140px; height:160px; border:3px dashed var(--primary-green); border-radius:16px; display:flex; flex-direction:column; justify-content:center; align-items:center; background:rgba(72,187,120,0.05); transition: background 0.3s;">
            <span style="font-size:1.5rem; font-weight:800; color:var(--primary-green);">small</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">(Lowercase)</span>
          </div>
        </div>
        <div class="cnd-tray" id="cnd-tray" style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; max-width:400px;"></div>
      `;
      
      phase2SortedCount = 0;
      const shuffledLetters = [...round.letters].sort(() => Math.random() - 0.5);
      const tray = wrap.querySelector('#cnd-tray');
      
      shuffledLetters.forEach(letter => {
        const el = document.createElement('div');
        el.className = 'cnd-circle';
        el.style.cssText = `width:60px; height:60px; border-radius:12px; background:var(--card-bg); border:2px solid #E2E8F0; color:var(--text-dark); display:flex; justify-content:center; align-items:center; font-size:1.8rem; font-weight:700; cursor:grab; box-shadow:0 4px 0 #CBD5E0; user-select:none;`;
        el.textContent = letter;
        el.dataset.value = letter;
        tray.appendChild(el);
        
        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const boxUpper = wrap.querySelector('#box-upper');
          const boxLower = wrap.querySelector('#box-lower');
          const rectUpper = boxUpper.getBoundingClientRect();
          const rectLower = boxLower.getBoundingClientRect();
          
          const distUpper = Math.hypot(x - (rectUpper.left + rectUpper.width / 2), y - (rectUpper.top + rectUpper.height / 2));
          const distLower = Math.hypot(x - (rectLower.left + rectLower.width / 2), y - (rectLower.top + rectLower.height / 2));
          
          const isUpper = letter === letter.toUpperCase();
          
          if (distUpper < 60 && isUpper) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(x, y);
            el.style.visibility = "hidden";
            boxUpper.style.background = "var(--primary-blue)";
            setTimeout(() => { boxUpper.style.background = "rgba(74,144,226,0.05)"; }, 300);
            phase2SortedCount++;
            checkPhase2Complete();
          } else if (distLower < 60 && !isUpper) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(x, y);
            el.style.visibility = "hidden";
            boxLower.style.background = "var(--primary-green)";
            setTimeout(() => { boxLower.style.background = "rgba(72,187,120,0.05)"; }, 300);
            phase2SortedCount++;
            checkPhase2Complete();
          } else {
            window.GameHub.playSound("wrong");
            el.style.transform = "translate3d(0,0,0)";
            if (el.resetPosition) el.resetPosition();
          }
        });
      });
      
      function checkPhase2Complete() {
        if (phase2SortedCount >= round.letters.length) {
          setTimeout(() => {
            levelIndex++;
            if (levelIndex >= ROUNDS.length) {
              window.GameHub.showComplete("Fantastic!", "You sorted all the letter families!");
            } else {
              build();
            }
          }, 800);
        }
      }

    // ================= PHASE 3 =================
    } else if (round.phase === 3) {
      wrap.innerHTML += `
        <div class="cnd-title" style="font-size:1.2rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:10px;">
          ${round.prompt}
        </div>
        <div class="cnd-board" id="cnd-board" style="position:relative; width:300px; height:150px; background:var(--card-bg); border:2px solid #E2E8F0; border-radius:16px; display:flex; justify-content:center; align-items:center; margin-bottom:20px;">
          <div class="cnd-slot" id="cnd-slot" style="width:80px; height:80px; border:3px dashed #CBD5E0; border-radius:12px; display:flex; justify-content:center; align-items:center; font-size:2.5rem; font-weight:700; color:var(--text-muted);">${round.target}</div>
        </div>
        <div class="cnd-tray" id="cnd-tray" style="display:flex; justify-content:center; gap:20px; margin-top:10px;"></div>
      `;
      
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      const tray = wrap.querySelector('#cnd-tray');
      
      shuffledOptions.forEach(opt => {
        const el = document.createElement('div');
        el.className = 'cnd-circle';
        el.style.cssText = `width:70px; height:70px; border-radius:12px; background:var(--primary-green); color:white; display:flex; justify-content:center; align-items:center; font-size:2rem; font-weight:700; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none;`;
        el.textContent = opt;
        el.dataset.value = opt;
        tray.appendChild(el);
        
        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const slot = wrap.querySelector('#cnd-slot');
          const rect = slot.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
          
          if (dist < 50) { // Snap distance
            if (opt === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              slot.textContent = opt;
              slot.style.background = "var(--primary-green)";
              slot.style.color = "white";
              slot.style.borderStyle = "solid";
              slot.style.borderColor = "var(--primary-green)";
              el.style.visibility = "hidden";
              setTimeout(() => {
                levelIndex++;
                if (levelIndex >= ROUNDS.length) {
                  window.GameHub.showComplete("You're a Master!", "You conquered all the tricky letter twins!");
                } else {
                  build();
                }
              }, 800);
            } else {
              window.GameHub.playSound("wrong");
              el.style.transform = "translate3d(0,0,0)";
              if (el.resetPosition) el.resetPosition();
            }
          }
        });
      });
    }
    
    stage.appendChild(wrap);
  }

  // بدء اللعبة
  build();
};