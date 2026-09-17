// Writing > Formation > Similar shapes
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 جولة مقسمة على 3 مراحل بحتة بصرياً
  const gameData = [
    // Phase 1: Odd One Out (gameData 1-5) - Find the flipped/different letter
    { phase: 1, title: "Find the different letter!", items: ["b", "b", "d", "b"], answer: "d" },
    { phase: 1, title: "Find the different letter!", items: ["p", "p", "p", "q"], answer: "q" },
    { phase: 1, title: "Find the different letter!", items: ["n", "n", "u", "n"], answer: "u" },
    { phase: 1, title: "Find the different letter!", items: ["l", "l", "j", "l"], answer: "j" },
    { phase: 1, title: "Find the different letter!", items: ["m", "m", "w", "m"], answer: "w" },

    // Phase 2: Shadow Match (gameData 6-10) - Drag to the shadow
    { phase: 2, title: "Match the shadow!", target: "d", options: ["b", "d", "p"] },
    { phase: 2, title: "Match the shadow!", target: "q", options: ["p", "q", "d"] },
    { phase: 2, title: "Match the shadow!", target: "u", options: ["u", "n", "v"] },
    { phase: 2, title: "Match the shadow!", target: "j", options: ["i", "j", "l"] },
    { phase: 2, title: "Match the shadow!", target: "p", options: ["q", "p", "b"] },

    // Phase 3: Mirror Challenge (gameData 11-15) - Find the exact twin among mirrored options
    { phase: 3, title: "Find the exact twin!", target: "b", options: ["d", "b", "p"] },
    { phase: 3, title: "Find the exact twin!", target: "d", options: ["b", "q", "d"] },
    { phase: 3, title: "Find the exact twin!", target: "n", options: ["u", "n", "h"] },
    { phase: 3, title: "Find the exact twin!", target: "p", options: ["q", "d", "p"] },
    { phase: 3, title: "Find the exact twin!", target: "u", options: ["n", "v", "u"] }
  ];

  let levelIndex = 0;

  function renderLevel() {
    const round = gameData[levelIndex];
    stage.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "cd-wrap";

    // Header: Round & Phase
    const header = document.createElement("div");
    header.style.cssText = "width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding: 0 10px;";
    header.innerHTML = `
      <span style="font-weight:700; color:var(--primary-blue); font-size: 1.1rem;">Round ${levelIndex + 1}/15</span>
      <span style="font-weight:600; color:var(--text-muted); font-size: 0.85rem; background: var(--card-bg); padding: 4px 12px; border-radius: 20px;">Phase ${round.phase}</span>
    `;
    wrap.appendChild(header);

    // Title (Short, visual-driven)
    const title = document.createElement("div");
    title.className = "ss-title";
    title.style.cssText = "font-size:1.3rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:10px;";
    title.innerHTML = round.title;
    wrap.appendChild(title);

    // ================= PHASE 1: Odd One Out =================
    if (round.phase === 1) {
      const grid = document.createElement("div");
      grid.style.cssText = "display:grid; grid-template-columns: repeat(2, 1fr); gap:20px; margin-top:10px;";
      
      // Shuffle items so the answer isn't always in the same spot
      const shuffledItems = [...round.items].sort(() => Math.random() - 0.5);
      
      shuffledItems.forEach(letter => {
        const btn = document.createElement("div");
        btn.className = "ss-opt";
        btn.style.cssText = `width:100px; height:100px; border-radius:16px; background:white; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:3.5rem; font-weight:800; color:var(--primary-blue); cursor:pointer; transition: transform 0.2s, background 0.2s; user-select:none;`;
        btn.innerText = letter;
        
        btn.onmouseenter = () => { btn.style.transform = "scale(1.05)"; btn.style.background = "#EBF8FF"; };
        btn.onmouseleave = () => { btn.style.transform = "scale(1)"; btn.style.background = "white"; };
        
        btn.onclick = (e) => {
          if (letter === round.answer) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            btn.style.background = "var(--primary-green)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--primary-green)";
            setTimeout(() => {
              levelIndex++;
              if (levelIndex >= gameData.length) {
                window.GameHub.showComplete("Sharp Eyes!", "You spotted every look-alike letter.");
              } else {
                renderLevel();
              }
            }, 600);
          } else {
            window.GameHub.playSound("wrong");
            btn.style.transform = "translateX(-5px)";
            setTimeout(() => { btn.style.transform = "translateX(5px)"; }, 50);
            setTimeout(() => { btn.style.transform = "translateX(0)"; }, 100);
          }
        };
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);

    // ================= PHASE 2: Shadow Match =================
    } else if (round.phase === 2) {
      // Shadow Area
      const shadowArea = document.createElement("div");
      shadowArea.id = "shadow-target";
      shadowArea.style.cssText = `width:140px; height:140px; border:4px dashed var(--text-muted); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:6rem; font-weight:800; color:#0000002e; background:rgba(0,0,0,0.03); margin: 20px 0; position:relative;`;
      shadowArea.innerText = round.target;
      wrap.appendChild(shadowArea);

      // Draggable Options
      const tray = document.createElement("div");
      tray.style.cssText = "display:flex; justify-content:center; gap:20px; margin-top:10px;";
      
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      
      shuffledOptions.forEach(letter => {
        const el = document.createElement("div");
        el.className = "ss-opt";
        el.style.cssText = `width:90px; height:90px; border-radius:16px; background:var(--primary-blue); color:white; display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2b6cb0; user-select:none;`;
        el.innerText = letter;
        el.dataset.value = letter;
        tray.appendChild(el);

        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const shadow = document.getElementById("shadow-target");
          const rect = shadow.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));

          if (dist < 60) { // Snap distance
            if (letter === round.target) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              shadow.style.color = "var(--primary-green)";
              shadow.style.border = "4px solid var(--primary-green)";
              shadow.style.background = "rgba(72,187,120,0.1)";
              el.style.visibility = "hidden";
              setTimeout(() => {
                levelIndex++;
                if (levelIndex >= gameData.length) {
                  window.GameHub.showComplete("Perfect Match!", "You connected every letter to its shadow.");
                } else {
                  renderLevel();
                }
              }, 700);
            } else {
              window.GameHub.playSound("wrong");
              el.style.transform = "translate3d(0,0,0)";
              if (el.resetPosition) el.resetPosition();
            }
          }
        });
      });
      wrap.appendChild(tray);

    // ================= PHASE 3: Mirror Challenge =================
    } else if (round.phase === 3) {
      // Target Display
      const targetDisplay = document.createElement("div");
      targetDisplay.style.cssText = `font-size:6rem; font-weight:800; color:var(--primary-blue); margin: 10px 0; text-shadow: 2px 2px 0px rgba(0,0,0,0.1);`;
      targetDisplay.innerText = round.target;
      wrap.appendChild(targetDisplay);

      // Options (with mirrored wrong answers for visual challenge)
      const grid = document.createElement("div");
      grid.style.cssText = "display:flex; justify-content:center; gap:20px; margin-top:10px;";
      
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      
      shuffledOptions.forEach(letter => {
        const btn = document.createElement("div");
        btn.className = "ss-opt";
        const isMirrored = (letter !== round.target); // Mirror only the wrong answers to create the "Mirror Challenge"
        btn.style.cssText = `width:100px; height:100px; border-radius:16px; background:white; border:3px solid var(--primary-green); display:flex; align-items:center; justify-content:center; font-size:3.5rem; font-weight:800; color:var(--primary-green); cursor:pointer; transition: transform 0.2s; user-select:none;`;
        
        // We must un-mirror the text inside so it's readable, but the shape is flipped
        // Actually, scaleX(-1) on the container flips the letter, which is exactly the "Mirror" effect we want for wrong options.
        
        btn.innerText = letter;
        
        
        btn.onclick = (e) => {
          if (letter === round.target) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            btn.style.background = "var(--primary-green)";
            btn.style.color = "white";
            setTimeout(() => {
              levelIndex++;
              if (levelIndex >= gameData.length) {
                window.GameHub.showComplete("Mirror Master!", "You conquered all the tricky reflections.");
              } else {
                renderLevel();
              }
            }, 600);
          } else {
            window.GameHub.playSound("wrong");
            btn.style.borderColor = "#E53E3E";
            btn.style.color = "#E53E3E";
            setTimeout(() => { 
              btn.style.borderColor = "var(--primary-green)"; 
              btn.style.color = "var(--primary-green)"; 
            }, 400);
          }
        };
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);
    }

    stage.appendChild(wrap);
  }

  // بدء اللعبة
  renderLevel();
};