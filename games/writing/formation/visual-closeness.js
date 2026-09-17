// Writing > Formation > Visual closeness
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const gameData = [
    // Phase 1: Sound-to-Shape Match (gameData 1-5)
    { phase: 1, speakText: "Find the letter M", target: "m", options: ["m", "n"] },
    { phase: 1, speakText: "Find the letter N", target: "n", options: ["n", "h"] },
    { phase: 1, speakText: "Find the letter W", target: "w", options: ["w", "m"] },
    { phase: 1, speakText: "Find the letter T", target: "t", options: ["t", "l"] },
    { phase: 1, speakText: "Find the letter H", target: "h", options: ["h", "k"] },

    // Phase 2: Find the Intruder (gameData 6-10)
    { phase: 2, prompt: "Find the different letter!", items: ["n", "n", "m", "n"], answer: "m" },
    { phase: 2, prompt: "Find the different letter!", items: ["h", "h", "t", "h"], answer: "t" },
    { phase: 2, prompt: "Find the different letter!", items: ["w", "w", "v", "w"], answer: "v" },
    { phase: 2, prompt: "Find the different letter!", items: ["l", "l", "l", "t"], answer: "t" },
    { phase: 2, prompt: "Find the different letter!", items: ["p", "p", "q", "p"], answer: "q" },

    // Phase 3: Complete the Word with Image (gameData 11-15)
    { phase: 3, prompt: "Complete the word!", image: "🎩", wordParts: ["_", "a", "t"], target: "h", options: ["h", "m", "t"] },
    { phase: 3, prompt: "Complete the word!", image: "🐷", wordParts: ["_", "i", "g"], target: "p", options: ["p", "q", "b"] },
    { phase: 3, prompt: "Complete the word!", image: "🕸️", wordParts: ["n", "e", "_"], target: "t", options: ["t", "l", "h"] },
    { phase: 3, prompt: "Complete the word!", image: "🐔", wordParts: ["_", "e", "n"], target: "h", options: ["h", "n", "m"] },
    { phase: 3, prompt: "Complete the word!", image: "🧢", wordParts: ["_", "a", "p"], target: "c", options: ["c", "e", "o"] }
  ];

  let levelIndex = 0;

  function build() {
    const round = gameData[levelIndex];
    stage.innerHTML = "";

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

    // ================= PHASE 1: Sound-to-Shape Match =================
    if (round.phase === 1) {
      wrap.innerHTML += `
        <div style="font-size:1.2rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">Listen and drag the matching letter!</div>
        
        <button id="sound-btn" style="width:80px; height:80px; border-radius:50%; background:var(--primary-blue); color:white; border:none; font-size:2rem; cursor:pointer; box-shadow:0 4px 0 #2b6cb0; margin-bottom:20px; display:flex; align-items:center; justify-content:center; transition: transform 0.1s;">
          🔊
        </button>

        <div id="drop-zone" style="width:100px; height:100px; border:3px dashed var(--text-muted); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:800; color:transparent; background:var(--card-bg); margin-bottom:20px; transition: all 0.3s;">
          ?
        </div>

        <div id="tray" style="display:flex; gap:20px; justify-content:center;"></div>
      `;

      const soundBtn = wrap.querySelector("#sound-btn");
      soundBtn.onclick = () => {
        window.GameHub.playSound("click");
        window.GameHub.speak(round.speakText);
        // Add a little bounce animation
        soundBtn.style.transform = "scale(0.9)";
        setTimeout(() => { soundBtn.style.transform = "scale(1)"; }, 100);
      };

      // Auto-speak when the round loads
      setTimeout(() => window.GameHub.speak(round.speakText), 600);

      const dropZone = wrap.querySelector("#drop-zone");
      const tray = wrap.querySelector("#tray");
      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);

      shuffledOptions.forEach(letter => {
        const el = document.createElement("div");
        el.className = "vc-letter";
        el.style.cssText = `width:80px; height:80px; border-radius:16px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:2.5rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none;`;
        el.innerText = letter;
        tray.appendChild(el);

        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const rect = dropZone.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
          
          if (dist < 50) {
            if (letter === round.target) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              
              dropZone.innerText = letter;
              dropZone.style.color = "var(--primary-green)";
              dropZone.style.border = "3px solid var(--primary-green)";
              dropZone.style.background = "rgba(72,187,120,0.1)";
              el.style.visibility = "hidden";
              setTimeout(nextRound, 1000);
            } else {
              window.GameHub.playSound("wrong");
              window.GameHub.speak("Try again");
              el.style.transform = "translate3d(0,0,0)";
              if (el.resetPosition) el.resetPosition();
            }
          }
        });
      });

    // ================= PHASE 2: Find the Intruder =================
    } else if (round.phase === 2) {
      wrap.innerHTML += `
        <div style="font-size:1.2rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">${round.prompt}</div>
        <div id="grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px; max-width:300px;"></div>
      `;

      const grid = wrap.querySelector("#grid");
      const shuffledItems = [...round.items].sort(() => Math.random() - 0.5);

      shuffledItems.forEach(letter => {
        const btn = document.createElement("div");
        btn.className = "ss-opt";
        btn.style.cssText = `width:100px; height:100px; border-radius:16px; background:white; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:3.5rem; font-weight:800; color:var(--primary-blue); cursor:pointer; transition: transform 0.2s; user-select:none;`;
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
            setTimeout(nextRound, 800);
          } else {
            window.GameHub.playSound("wrong");
            window.GameHub.speak("Oops, look closer");
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
        grid.appendChild(btn);
      });

    // ================= PHASE 3: Complete the Word (Image Supported) =================
    } else if (round.phase === 3) {
      wrap.innerHTML += `
        <div style="font-size:1.2rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:10px;">${round.prompt}</div>
        <div style="font-size:4rem; margin: 10px 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${round.image}</div>
        
        <div id="word-display" style="display:flex; gap:10px; margin: 20px 0; align-items:center;"></div>
        
        <div id="tray" style="display:flex; gap:15px; justify-content:center; margin-top:20px;"></div>
      `;

      const wordDisplay = wrap.querySelector("#word-display");
      const tray = wrap.querySelector("#tray");
      let dropTarget = null;

      round.wordParts.forEach((part) => {
        if (part === "_") {
          const slot = document.createElement("div");
          slot.id = "word-slot";
          slot.style.cssText = `width:60px; height:70px; border-bottom:4px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:800; color:var(--primary-blue); background:rgba(74,144,226,0.05); border-radius:8px 8px 0 0;`;
          slot.innerText = "?";
          wordDisplay.appendChild(slot);
          dropTarget = slot;
        } else {
          const char = document.createElement("div");
          char.style.cssText = `width:60px; height:70px; display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:800; color:var(--text-dark);`;
          char.innerText = part;
          wordDisplay.appendChild(char);
        }
      });

      const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
      shuffledOptions.forEach(letter => {
        const el = document.createElement("div");
        el.className = "vc-letter";
        el.style.cssText = `width:60px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none;`;
        el.innerText = letter;
        tray.appendChild(el);

        window.GameHub.utils.makeDraggable(el, (x, y) => {
          const rect = dropTarget.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
          
          if (dist < 50) {
            if (letter === round.target) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              dropTarget.innerText = letter;
              dropTarget.style.borderBottom = "4px solid var(--primary-green)";
              dropTarget.style.background = "rgba(72,187,120,0.1)";
              el.style.visibility = "hidden";
              setTimeout(nextRound, 1000);
            } else {
              window.GameHub.playSound("wrong");
              window.GameHub.speak("Try another letter");
              el.style.transform = "translate3d(0,0,0)";
              if (el.resetPosition) el.resetPosition();
            }
          }
        });
      });
    }

    stage.appendChild(wrap);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= gameData.length) {
      window.GameHub.showComplete("Visual Master!", "You can tell apart even the trickiest letters.");
    } else {
      build();
    }
  }

  // بدء اللعبة
  build();
};