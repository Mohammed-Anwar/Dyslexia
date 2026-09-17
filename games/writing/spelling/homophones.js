// Writing > Spelling > Homophones
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 جولة مقسمة على 3 مراحل تعليمية وتفاعلية مختلفة
  const gameData = [
    // Phase 1: Visual Matching (Levels 1-5) - Click the correct word for the image
    { phase: 1, emoji: "2️⃣", correct: "two", options: ["two", "to"] },
    { phase: 1, emoji: "☀️", correct: "sun", options: ["sun", "son"] },
    { phase: 1, emoji: "🌊", correct: "sea", options: ["sea", "see"] },
    { phase: 1, emoji: "8️⃣", correct: "eight", options: ["eight", "ate"] },
    { phase: 1, emoji: "🌾", correct: "flour", options: ["flour", "flower"] },

    // Phase 2: Direct Sentence Context (Levels 6-10) - Drag to the blank
    { phase: 2, sentence: "Turn ___ at the corner.", correct: "right", options: ["right", "write"], fullText: "Turn right at the corner." },
    { phase: 2, sentence: "I want to ___ a new toy.", correct: "buy", options: ["buy", "by"], fullText: "I want to buy a new toy." },
    { phase: 2, sentence: "I ___ the answer!", correct: "know", options: ["know", "no"], fullText: "I know the answer!" },
    { phase: 2, sentence: "___ car is parked outside.", correct: "Their", options: ["Their", "There"], fullText: "Their car is parked outside." },
    { phase: 2, sentence: "Our team ___ the match.", correct: "won", options: ["won", "one"], fullText: "Our team won the match." },

    // Phase 3: Smart Editor - Error Detection (Levels 11-15) - Drag to replace the wrong word
    { phase: 3, before: "I can ", wrong: "sea", after: " a bird.", correct: "see", options: ["see", "sea"], fullText: "I can see a bird." },
    { phase: 3, before: "I have ", wrong: "to", after: " pens.", correct: "two", options: ["two", "to"], fullText: "I have two pens." },
    { phase: 3, before: "My favorite color is ", wrong: "blew", after: ".", correct: "blue", options: ["blue", "blew"], fullText: "My favorite color is blue." },
    { phase: 3, before: "Nice to ", wrong: "meat", after: " you.", correct: "meet", options: ["meet", "meat"], fullText: "Nice to meet you." },
    { phase: 3, before: "Can you ", wrong: "here", after: " the bell?", correct: "hear", options: ["hear", "here"], fullText: "Can you hear the bell?" }
  ];

  let levelIndex = 0;

  function renderLevel() {
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

    // ================= PHASE 1: Visual Matching =================
    if (round.phase === 1) {
      wrap.innerHTML += `
        <p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:10px;">Which word matches this picture?</p>
        <div style="font-size:6rem; margin: 10px 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); cursor:default;">${round.emoji}</div>
        <div id="options-container" style="display:flex; gap:20px; justify-content:center; margin-top:20px;"></div>
      `;

      const container = wrap.querySelector("#options-container");
      const shuffled = [...round.options].sort(() => Math.random() - 0.5);

      shuffled.forEach(opt => {
        const btn = document.createElement("div");
        btn.style.cssText = `width:140px; height:70px; border-radius:16px; background:white; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:1.6rem; font-weight:800; color:var(--primary-blue); cursor:pointer; transition: all 0.2s; box-shadow: 0 4px 0 #2b6cb0; user-select:none;`;
        btn.innerText = opt;
        
        btn.onmouseenter = () => { btn.style.transform = "translateY(-3px)"; btn.style.background = "#EBF8FF"; };
        btn.onmouseleave = () => { btn.style.transform = "translateY(0)"; btn.style.background = "white"; };
        btn.onmousedown = () => { btn.style.transform = "translateY(2px)"; btn.style.boxShadow = "0 1px 0 #2b6cb0"; };
        btn.onmouseup = () => { btn.style.transform = "translateY(-3px)"; btn.style.boxShadow = "0 4px 0 #2b6cb0"; };

        btn.onclick = (e) => {
          if (opt === round.correct) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            btn.style.background = "var(--primary-green)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--primary-green)";
            btn.style.boxShadow = "0 4px 0 #2f855a";
            window.GameHub.speak(round.correct);
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
        container.appendChild(btn);
      });

    // ================= PHASE 2: Direct Sentence Context =================
    } else if (round.phase === 2) {
      wrap.innerHTML += `
        <p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">Drag the correct word into the blank!</p>
        <div style="font-size:1.8rem; font-weight:700; color:var(--text-dark); text-align:center; background:var(--card-bg); padding:20px; border-radius:16px; border:2px solid #E2E8F0; max-width:500px; line-height:1.6; margin-bottom:30px;">
          ${round.sentence.split("___")[0]}
          <span id="drop-zone" style="display:inline-flex; min-width:90px; height:50px; border-bottom:4px solid var(--primary-blue); vertical-align:middle; align-items:center; justify-content:center; color:var(--primary-blue); font-weight:800; background:rgba(74,144,226,0.05); border-radius:8px 8px 0 0; margin: 0 5px; transition: all 0.3s;"></span>
          ${round.sentence.split("___")[1]}
        </div>
        <div id="options-container" style="display:flex; gap:20px; justify-content:center;"></div>
      `;

      const container = wrap.querySelector("#options-container");
      const shuffled = [...round.options].sort(() => Math.random() - 0.5);

      shuffled.forEach((opt, i) => {
        const tile = document.createElement("div");
        tile.style.cssText = `width:120px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none; transition: transform 0.1s;`;
        tile.innerText = opt;
        tile.dataset.value = opt;
        tile.dataset.id = `tile-${i}`;
        container.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
          const dropZone = document.getElementById("drop-zone");
          const rect = dropZone.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));

          if (dist < 60) {
            if (draggedEl.dataset.value === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              dropZone.innerText = round.correct;
              dropZone.style.borderBottomColor = "var(--primary-green)";
              dropZone.style.background = "rgba(72,187,120,0.15)";
              dropZone.style.color = "var(--primary-green)";
              draggedEl.style.visibility = "hidden";
              window.GameHub.speak(round.fullText);
              setTimeout(nextRound, 1200);
            } else {
              window.GameHub.playSound("wrong");
              window.GameHub.speak("Not quite");
              draggedEl.resetPosition();
            }
          } else {
            draggedEl.resetPosition();
          }
        });
      });

    // ================= PHASE 3: Smart Editor (Error Detection) =================
    } else if (round.phase === 3) {
      wrap.innerHTML += `
        <p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; margin-bottom:20px;">Find the wrong word and replace it with the correct one!</p>
        <div style="font-size:1.8rem; font-weight:700; color:var(--text-dark); text-align:center; background:var(--card-bg); padding:20px; border-radius:16px; border:2px solid #E2E8F0; max-width:500px; line-height:1.6; margin-bottom:30px;">
          <span>${round.before}</span>
          <span id="drop-zone" style="display:inline-flex; min-width:80px; height:50px; border-bottom:3px solid #E53E3E; vertical-align:middle; align-items:center; justify-content:center; color:#E53E3E; font-weight:800; background:rgba(229,62,62,0.05); border-radius:8px 8px 0 0; margin: 0 5px; transition: all 0.3s; text-decoration: line-through;">${round.wrong}</span>
          <span>${round.after}</span>
        </div>
        <div id="options-container" style="display:flex; gap:20px; justify-content:center;"></div>
      `;

      const container = wrap.querySelector("#options-container");
      const shuffled = [...round.options].sort(() => Math.random() - 0.5);

      shuffled.forEach((opt, i) => {
        const tile = document.createElement("div");
        tile.style.cssText = `width:120px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none; transition: transform 0.1s;`;
        tile.innerText = opt;
        tile.dataset.value = opt;
        tile.dataset.id = `tile-${i}`;
        container.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
          const dropZone = document.getElementById("drop-zone");
          const rect = dropZone.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));

          if (dist < 60) {
            if (draggedEl.dataset.value === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              
              // Auto-replace and turn green
              dropZone.innerText = round.correct;
              dropZone.style.borderBottomColor = "var(--primary-green)";
              dropZone.style.background = "rgba(72,187,120,0.15)";
              dropZone.style.color = "var(--primary-green)";
              dropZone.style.textDecoration = "none"; // Remove strikethrough
              
              draggedEl.style.visibility = "hidden";
              window.GameHub.speak(round.fullText);
              setTimeout(nextRound, 1200);
            } else {
              window.GameHub.playSound("wrong");
              draggedEl.resetPosition();
            }
          } else {
            draggedEl.resetPosition();
          }
        });
      });
    }

    stage.appendChild(wrap);
    
    // Auto-speak instruction or sentence on round start
    setTimeout(() => {
      
    }, 500);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= gameData.length) {
      window.GameHub.showComplete("Homophone Hero!", "You mastered matching, context, and correcting sound-alike words.");
    } else {
      renderLevel();
    }
  }

  // بدء اللعبة
  renderLevel();
};