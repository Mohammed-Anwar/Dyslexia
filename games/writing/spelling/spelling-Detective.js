// Writing > Spelling > Spelling Detective
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 جولة مقسمة بدقة على 3 مراحل تعليمية للإملاء
  const gameData = [
    // Phase 1: Magic E (gameData 1-5) - Drag 'e' to complete the word
    { phase: 1, emoji: "🪁", prefix: "kit", correct: "e", wrong: "a", fullWord: "kite", prompt: "Add the Magic E to complete the word!" },
    { phase: 1, emoji: "🎂", prefix: "cak", correct: "e", wrong: "o", fullWord: "cake", prompt: "Add the Magic E to complete the word!" },
    { phase: 1, emoji: "🦴", prefix: "bon", correct: "e", wrong: "i", fullWord: "bone", prompt: "Add the Magic E to complete the word!" },
    { phase: 1, emoji: "🤫", prefix: "hop", correct: "e", wrong: "u", fullWord: "hope", prompt: "Add the Magic E to complete the word!" },
    { phase: 1, emoji: "🧊", prefix: "cub", correct: "e", wrong: "a", fullWord: "cube", prompt: "Add the Magic E to complete the word!" },

    // Phase 2: Consonant Doubling (gameData 6-10) - Drag the double letter
    { phase: 2, emoji: "🏃", prefix: "ru", suffix: "ing", correct: "nn", wrong: "n", fullWord: "running", prompt: "Choose the correct middle part to complete the word!" },
    { phase: 2, emoji: "🏊", prefix: "swi", suffix: "ing", correct: "mm", wrong: "m", fullWord: "swimming", prompt: "Choose the correct middle part to complete the word!" },
    { phase: 2, emoji: "🐰", prefix: "ho", suffix: "ing", correct: "pp", wrong: "p", fullWord: "hopping", prompt: "Choose the correct middle part to complete the word!" },
    { phase: 2, emoji: "🛑", prefix: "sto", suffix: "ing", correct: "pp", wrong: "p", fullWord: "stopping", prompt: "Choose the correct middle part to complete the word!" },
    { phase: 2, emoji: "📅", prefix: "pla", suffix: "ing", correct: "nn", wrong: "n", fullWord: "planning", prompt: "Choose the correct middle part to complete the word!" },

    // Phase 3: Visual Word Discrimination (gameData 11-15) - Click the correctly spelled word
    { phase: 3, emoji: "🏃", correctWord: "running", wrongWord: "runing", prompt: "Tap the correctly spelled word!" },
    { phase: 3, emoji: "🏊", correctWord: "swimming", wrongWord: "swiming", prompt: "Tap the correctly spelled word!" },
    { phase: 3, emoji: "🐱", correctWord: "kitten", wrongWord: "kiten", prompt: "Tap the correctly spelled word!" },
    { phase: 3, emoji: "🐶", correctWord: "puppy", wrongWord: "pupy", prompt: "Tap the correctly spelled word!" },
    { phase: 3, emoji: "🤏", correctWord: "little", wrongWord: "litle", prompt: "Tap the correctly spelled word!" }
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

    // Emoji & Prompt
    wrap.innerHTML += `
      <div style="font-size:4.5rem; margin: 10px 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${round.emoji}</div>
      <p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; max-width:400px; line-height:1.4; margin-bottom:20px;">${round.prompt}</p>
    `;

    // ================= PHASE 1: Magic E =================
    if (round.phase === 1) {
      // Word Display with Slot
      const wordContainer = document.createElement("div");
      wordContainer.style.cssText = "display:flex; align-items:center; gap:6px; font-size:3rem; font-weight:800; color:var(--text-dark); margin-bottom:30px;";
      wordContainer.innerHTML = `
        <span>${round.prefix}</span>
        <div id="drop-slot" style="width:60px; height:70px; border-bottom:4px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; color:var(--primary-blue); background:rgba(74,144,226,0.05); border-radius:8px 8px 0 0;"></div>
      `;
      wrap.appendChild(wordContainer);

      // Options Tray
      const tray = document.createElement("div");
      tray.style.cssText = "display:flex; gap:20px; justify-content:center;";
      
      const options = [round.correct, round.wrong].sort(() => Math.random() - 0.5);
      options.forEach(opt => {
        const tile = document.createElement("div");
        tile.style.cssText = `width:60px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none;`;
        tile.innerText = opt;
        tile.dataset.value = opt;
        tray.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
          const slot = document.getElementById("drop-slot");
          const rect = slot.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));

          if (dist < 50) {
            if (draggedEl.dataset.value === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              slot.innerText = round.correct;
              slot.style.borderBottomColor = "var(--primary-green)";
              slot.style.background = "rgba(72,187,120,0.1)";
              slot.style.color = "var(--primary-green)";
              draggedEl.style.visibility = "hidden";
              window.GameHub.speak(round.fullWord);
              setTimeout(nextRound, 1000);
            } else {
              window.GameHub.playSound("wrong");
              draggedEl.style.transform = "translate3d(0,0,0)";
              if (draggedEl.resetPosition) draggedEl.resetPosition();
            }
          }
        });
      });
      wrap.appendChild(tray);

    // ================= PHASE 2: Consonant Doubling =================
    } else if (round.phase === 2) {
      // Word Display with Slot in the middle
      const wordContainer = document.createElement("div");
      wordContainer.style.cssText = "display:flex; align-items:center; gap:6px; font-size:2.5rem; font-weight:800; color:var(--text-dark); margin-bottom:30px;";
      wordContainer.innerHTML = `
        <span>${round.prefix}</span>
        <div id="drop-slot" style="width:80px; height:70px; border-bottom:4px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; color:var(--primary-blue); background:rgba(74,144,226,0.05); border-radius:8px 8px 0 0; font-size:2rem;"></div>
        <span>${round.suffix}</span>
      `;
      wrap.appendChild(wordContainer);

      // Options Tray
      const tray = document.createElement("div");
      tray.style.cssText = "display:flex; gap:20px; justify-content:center;";
      
      const options = [round.correct, round.wrong].sort(() => Math.random() - 0.5);
      options.forEach(opt => {
        const tile = document.createElement("div");
        tile.style.cssText = `width:80px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none;`;
        tile.innerText = opt;
        tile.dataset.value = opt;
        tray.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
          const slot = document.getElementById("drop-slot");
          const rect = slot.getBoundingClientRect();
          const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));

          if (dist < 50) {
            if (draggedEl.dataset.value === round.correct) {
              window.GameHub.playSound("correct");
              window.GameHub.triggerVFX(x, y);
              slot.innerText = round.correct;
              slot.style.borderBottomColor = "var(--primary-green)";
              slot.style.background = "rgba(72,187,120,0.1)";
              slot.style.color = "var(--primary-green)";
              draggedEl.style.visibility = "hidden";
              window.GameHub.speak(round.fullWord);
              setTimeout(nextRound, 1000);
            } else {
              window.GameHub.playSound("wrong");
              window.GameHub.speak("Not quite");
              draggedEl.style.transform = "translate3d(0,0,0)";
              if (draggedEl.resetPosition) draggedEl.resetPosition();
            }
          }
        });
      });
      wrap.appendChild(tray);

    // ================= PHASE 3: Visual Word Discrimination =================
    } else if (round.phase === 3) {
      const cardsContainer = document.createElement("div");
      cardsContainer.style.cssText = "display:flex; gap:30px; justify-content:center; margin-top:10px;";
      
      const options = [round.correctWord, round.wrongWord].sort(() => Math.random() - 0.5);
      
      options.forEach(word => {
        const card = document.createElement("div");
        card.style.cssText = `width:160px; height:80px; border-radius:16px; background:white; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; color:var(--primary-blue); cursor:pointer; transition: all 0.3s ease; box-shadow: 0 4px 0 #2b6cb0; user-select:none;`;
        card.innerText = word;
        
        card.onmouseenter = () => { card.style.transform = "translateY(-4px)"; card.style.background = "#EBF8FF"; };
        card.onmouseleave = () => { card.style.transform = "translateY(0)"; card.style.background = "white"; };
        card.onmousedown = () => { card.style.transform = "translateY(2px)"; card.style.boxShadow = "0 1px 0 #2b6cb0"; };
        card.onmouseup = () => { card.style.transform = "translateY(-4px)"; card.style.boxShadow = "0 4px 0 #2b6cb0"; };
        
        card.onclick = (e) => {
          if (word === round.correctWord) {
            window.GameHub.playSound("correct");
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            card.style.background = "var(--primary-green)";
            card.style.color = "white";
            card.style.borderColor = "var(--primary-green)";
            card.style.boxShadow = "0 4px 0 #2f855a";
            card.style.transform = "scale(1.15)"; // تكبير البطاقة الصحيحة
            
            // إخفاء البطاقة الخاطئة
            const allCards = cardsContainer.querySelectorAll("div");
            allCards.forEach(c => {
              if (c !== card) {
                c.style.opacity = "0";
                c.style.transform = "scale(0.8)";
                c.style.pointerEvents = "none";
              }
            });
            
            setTimeout(nextRound, 1200);
          } else {
            window.GameHub.playSound("wrong");
            window.GameHub.speak("Look closer");
            card.style.borderColor = "#E53E3E";
            card.style.color = "#E53E3E";
            card.style.transform = "translateX(-6px)";
            setTimeout(() => { card.style.transform = "translateX(6px)"; }, 50);
            setTimeout(() => { 
              card.style.transform = "translateX(0)"; 
              card.style.borderColor = "var(--primary-blue)";
              card.style.color = "var(--primary-blue)";
            }, 100);
          }
        };
        cardsContainer.appendChild(card);
      });
      wrap.appendChild(cardsContainer);
    }

    stage.appendChild(wrap);
    
    // Auto-speak prompt on round start
    setTimeout(() => {
      
    }, 500);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= gameData.length) {
      window.GameHub.showComplete("Spelling Detective!", "You mastered Magic E, double consonants, and visual word recognition.");
    } else {
      build();
    }
  }

  // بدء اللعبة
  build();
};