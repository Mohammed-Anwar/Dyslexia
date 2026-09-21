// Writing > Spelling > Punctuation
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const gameData = [
    // Phase 1: End Marks (Levels 1-5)
    { phase: 1, text: "I live in a big house", answer: ".", options: [".", "?", "!"], fullText: "I live in a big house." },
    { phase: 1, text: "What is your favorite food", answer: "?", options: [".", "?", "!"], fullText: "What is your favorite food?" },
    { phase: 1, text: "Wow, it is a huge bird", answer: "!", options: [".", "?", "!"], fullText: "Wow, it is a huge bird!" },
    { phase: 1, text: "How do we breathe", answer: "?", options: [".", "?", "!"], fullText: "How do we breathe?" },
    { phase: 1, text: "We grow rice in Egypt", answer: ".", options: [".", "?", "!"], fullText: "We grow rice in Egypt." },

    // Phase 2: Capitalization (Levels 6-10)
    { phase: 2, prefix: "", missing: "A", suffix: "li is my friend.", options: ["A", "a"], fullText: "Ali is my friend." },
    { phase: 2, prefix: "we live in ", missing: "E", suffix: "gypt.", options: ["E", "e"], fullText: "We live in Egypt." },
    { phase: 2, prefix: "", missing: "M", suffix: "y mom makes delicious food.", options: ["M", "m"], fullText: "My mom makes delicious food." },
    { phase: 2, prefix: "he is from ", missing: "C", suffix: "airo.", options: ["C", "c"], fullText: "He is from Cairo." },
    { phase: 2, prefix: "", missing: "W", suffix: "here is the hospital?", options: ["W", "w"], fullText: "Where is the hospital?" },

    // Phase 3: The Comma (Levels 11-15)
    { phase: 3, parts: ["I like chocolate", "BLANK", " ice cream", "BLANK", " and pizza."], answers: [",", ","], options: [",", ",", ".", "!"], fullText: "I like chocolate, ice cream, and pizza." },
    { phase: 3, parts: ["We grow rice", "BLANK", " tomatoes", "BLANK", " and onions."], answers: [",", ","], options: [",", ",", ".", "?"], fullText: "We grow rice, tomatoes, and onions." },
    { phase: 3, parts: ["My favorite animals are cats", "BLANK", " dogs", "BLANK", " and birds."], answers: [",", ","], options: [",", ",", "!", "?"], fullText: "My favorite animals are cats, dogs, and birds." },
    { phase: 3, parts: ["Yes", "BLANK", " I like healthy food."], answers: [","], options: [",", ".", "!"], fullText: "Yes, I like healthy food." },
    { phase: 3, parts: ["No", "BLANK", " I don't eat candy."], answers: [","], options: [",", "?", "!"], fullText: "No, I don't eat candy." },

    // Phase 4: Comprehensive Editor (Levels 16-20)
    { phase: 4, parts: ["BLANK", "o you like fish", "BLANK"], answers: ["D", "?"], options: ["D", "d", "?", "!", "."], fullText: "Do you like fish?" },
    { phase: 4, parts: ["BLANK", "y name is hani", "BLANK"], answers: ["M", "."], options: ["M", "m", ".", "?", "!"], fullText: "My name is hani." },
    { phase: 4, parts: ["BLANK", "hat do farmers grow", "BLANK"], answers: ["W", "?"], options: ["W", "w", "?", ".", "!"], fullText: "What do farmers grow?" },
    { phase: 4, parts: ["BLANK", "e are healthy", "BLANK"], answers: ["W", "."], options: ["W", "w", ".", "?", "!"], fullText: "We are healthy." },
    { phase: 4, parts: ["BLANK", "ook at this beautiful flower", "BLANK"], answers: ["L", "!"], options: ["L", "l", "!", "?", "."], fullText: "Look at this beautiful flower!" }
  ];

  let levelIndex = 0;
  let filledCount = 0;
  let totalBlanks = 0;

  function createSlot(expected) {
    const slot = document.createElement("div");
    slot.className = "drop-zone";
    slot.dataset.expected = expected;
    slot.style.cssText = `min-width:50px; height:60px; border:3px dashed var(--primary-blue); border-radius:10px; display:inline-flex; align-items:center; justify-content:center; font-size:2rem; font-weight:800; color:var(--primary-blue); background:rgba(74,144,226,0.05); transition: all 0.3s; padding: 0 10px; margin: 0 4px;`;
    return slot;
  }

  function renderLevel() {
    const round = gameData[levelIndex];
    stage.innerHTML = "";
    filledCount = 0;
    
    totalBlanks = round.answers ? round.answers.length : 1;

    const wrap = document.createElement("div");
    wrap.className = "cd-wrap";

    const header = document.createElement("div");
    header.style.cssText = "width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding: 0 10px;";
    header.innerHTML = `
      <span style="font-weight:700; color:var(--primary-blue); font-size: 1.1rem;">Round ${levelIndex + 1}/20</span>
      <span style="font-weight:600; color:var(--text-muted); font-size: 0.85rem; background: var(--card-bg); padding: 4px 12px; border-radius: 20px;">Phase ${round.phase}</span>
    `;
    wrap.appendChild(header);

    let promptText = "";
    if (round.phase === 1) promptText = "Drag the correct end mark to complete the sentence!";
    else if (round.phase === 2) promptText = "Drag the correct capital letter to fix the sentence!";
    else if (round.phase === 3) promptText = "Drag the commas to separate the items in the list!";
    else if (round.phase === 4) promptText = "Fix the sentence: Add the capital letter and the end mark!";

    wrap.innerHTML += `<p style="font-size:1.1rem; font-weight:700; color:var(--text-dark); text-align:center; max-width:500px; line-height:1.4; margin-bottom:25px;">${promptText}</p>`;

    const sentenceBox = document.createElement("div");
    sentenceBox.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:4px; font-size:2rem; font-weight:700; color:var(--text-dark); background:var(--card-bg); padding:20px 30px; border-radius:16px; border:2px solid #E2E8F0; min-height:100px; max-width:650px; margin-bottom:30px;";
    
    if (round.phase === 1) {
        const span = document.createElement("span");
        span.innerText = round.text;
        sentenceBox.appendChild(span);
        sentenceBox.appendChild(createSlot(round.answer));
    } else if (round.phase === 2) {
        if (round.prefix) {
            const span = document.createElement("span");
            span.innerText = round.prefix;
            sentenceBox.appendChild(span);
        }
        sentenceBox.appendChild(createSlot(round.missing));
        const span2 = document.createElement("span");
        span2.innerText = round.suffix;
        sentenceBox.appendChild(span2);
    } else if (round.phase === 3 || round.phase === 4) {
        // --- هنا كان الخطأ وتم إصلاحه باستخدام عداد منفصل ---
        let answerIndex = 0; 
        round.parts.forEach((part) => {
            if (part === "BLANK") {
                sentenceBox.appendChild(createSlot(round.answers[answerIndex]));
                answerIndex++; // نزيد العداد فقط عند مواجهة فراغ
            } else {
                const span = document.createElement("span");
                span.innerText = part;
                sentenceBox.appendChild(span);
            }
        });
    }
    wrap.appendChild(sentenceBox);

    const tray = document.createElement("div");
    tray.style.cssText = "display:flex; gap:15px; flex-wrap:wrap; justify-content:center; max-width:500px;";
    
    const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach((opt, i) => {
        const tile = document.createElement("div");
        tile.style.cssText = `width:60px; height:60px; border-radius:12px; background:var(--primary-green); color:white; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; cursor:grab; box-shadow:0 4px 0 #2f855a; user-select:none; transition: transform 0.1s;`;
        tile.innerText = opt;
        tile.dataset.value = opt;
        tile.dataset.id = `tile-${i}`;
        tray.appendChild(tile);

        window.GameHub.utils.makeDraggable(tile, (x, y, draggedEl) => {
            const slots = document.querySelectorAll(".drop-zone:not(.filled)");
            let closestSlot = null;
            let minDist = Infinity;

            slots.forEach(slot => {
                const rect = slot.getBoundingClientRect();
                const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
                if (dist < minDist) {
                    minDist = dist;
                    closestSlot = slot;
                }
            });

            if (closestSlot && minDist < 60) {
                let isCorrect = false;
                if (round.phase === 3) {
                    isCorrect = (draggedEl.dataset.value === ",");
                } else {
                    isCorrect = (draggedEl.dataset.value === closestSlot.dataset.expected);
                }

                if (isCorrect) {
                    window.GameHub.playSound("correct");
                    window.GameHub.triggerVFX(x, y);
                    closestSlot.innerText = draggedEl.dataset.value;
                    closestSlot.classList.add("filled");
                    closestSlot.style.borderStyle = "solid";
                    closestSlot.style.borderColor = "var(--primary-green)";
                    closestSlot.style.background = "rgba(72,187,120,0.15)";
                    closestSlot.style.color = "var(--primary-green)";
                    draggedEl.style.visibility = "hidden";
                    filledCount++;

                    if (filledCount === totalBlanks) {
                      if (round.phase != 1){window.GameHub.speak(round.fullText);}
                        setTimeout(nextRound, 1500);
                    }
                } else {
                    window.GameHub.playSound("wrong");
                    draggedEl.resetPosition();
                }
            } else {
                draggedEl.resetPosition();
            }
        });
    });
    wrap.appendChild(tray);

    const listenBtn = document.createElement("button");
    listenBtn.style.cssText = "margin-top:20px; padding:10px 20px; border-radius:50px; border:none; background:var(--primary-blue); color:white; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; font-size:1rem; box-shadow: 0 3px 0 #2b6cb0; transition: transform 0.1s;";
    listenBtn.innerHTML = `<span>🔊</span> Listen`;
    listenBtn.onclick = () => {
        window.GameHub.playSound("click");
        let textToSpeak = "";
        if (round.phase === 1) textToSpeak = round.text;
        else if (round.phase === 2) textToSpeak = (round.prefix || "blank") + " " + round.suffix;
        else if (round.phase === 3 || round.phase === 4) {
            textToSpeak = round.parts.map(p => p === "BLANK" ? "blank" : p).join(" ");
        }
        window.GameHub.speak(textToSpeak);
    };
    listenBtn.onmousedown = () => { listenBtn.style.transform = "translateY(2px)"; listenBtn.style.boxShadow = "0 1px 0 #2b6cb0"; };
    listenBtn.onmouseup = () => { listenBtn.style.transform = "translateY(0)"; listenBtn.style.boxShadow = "0 3px 0 #2b6cb0"; };
    wrap.appendChild(listenBtn);

    stage.appendChild(wrap);
    
    setTimeout(() => {
        let textToSpeak = "";
        if (round.phase === 1) textToSpeak = round.text;
        else if (round.phase === 2) textToSpeak = (round.prefix || "blank") + " " + round.suffix;
        else if (round.phase === 3 || round.phase === 4) {
            textToSpeak = round.parts.map(p => p === "BLANK" ? "blank" : p).join(" ");
        }
        window.GameHub.speak(textToSpeak);
    }, 600);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= gameData.length) {
      window.GameHub.showComplete("Punctuation Master!", "You mastered end marks, capitalization, commas, and full sentence editing.");
    } else {
      renderLevel();
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel();
    }
  }

  renderLevel();
  window.nextRound = nextRound;
  window.previousRound = previousRound;
};