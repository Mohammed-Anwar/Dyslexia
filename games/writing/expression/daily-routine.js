window.initGame = function (stageId) {
  const currentStage = document.getElementById(stageId);
  if (!currentStage) return;

  const gameData = [
    // --- المرحلة الأولى: بناء الهيكل وتلقين الروابط (سحب وإفلات) ---
    { stage: 1, sentences: [ "I wake up ", "I wash my face ", "I eat breakfast ", "I go to school "], fullText: "First, I wake up. Then, I wash my face. After that, I eat breakfast. Finally, I go to school. " },
    { stage: 1, sentences: [ "I go home ", "I eat lunch ", "I do my homework ", "I play outside "], fullText: "First, I go home. Then, I eat lunch. After that, I do my homework. Finally, I play outside. " },
    { stage: 1, sentences: [ "I eat dinner ", "I watch TV ", "I brush my teeth ", "I go to sleep "], fullText: "First, I eat dinner. Then, I watch TV. After that, I brush my teeth. Finally, I go to sleep. " },
    { stage: 1, sentences: [ "I wake up late ", "I play with my friends ", "I read a book ", "I sleep early "], fullText: "First, I wake up late. Then, I play with my friends. After that, I read a book. Finally, I sleep early. " },
    { stage: 1, sentences: [ "I pack my bag ", "I wear my shoes ", "I go to the club ", "I play football "], fullText: "First, I pack my bag. Then, I wear my shoes. After that, I go to the club. Finally, I play football. " },
    // --- المرحلة الثانية: الكتابة الموجهة بملء الفراغات ---
    { stage: 2, parts: ["First, I ", " up. Then, I ", " breakfast. Finally, I ", " to school."], blanks: [{a:"wake",h:"🛏️"},{a:"eat",h:"🍳"},{a:"go",h:"🏫"}], fullText: "First, I wake up. Then, I eat breakfast. Finally, I go to school." },
    { stage: 2, parts: ["First, I ", " my hands. Then, I ", " lunch. Finally, I ", " water."], blanks: [{a:"wash",h:"🧼"},{a:"eat",h:"🥪"},{a:"drink",h:"💧"}], fullText: "First, I wash my hands. Then, I eat lunch. Finally, I drink water." },
    { stage: 2, parts: ["First, I ", " my homework. Then, I ", " my bag. Finally, I ", "."], blanks: [{a:"do",h:"📝"},{a:"pack",h:"🎒"},{a:"sleep",h:"🛌"}], fullText: "First, I do my homework. Then, I pack my bag. Finally, I sleep." },
    { stage: 2, parts: ["First, I ", " to the park. Then, I ", " football. Finally, I ", " home."], blanks: [{a:"go",h:"🌳"},{a:"play",h:"⚽"},{a:"go",h:"🏠"}], fullText: "First, I go to the park. Then, I play football. Finally, I go home." },
    { stage: 2, parts: ["First, I ", " a book. Then, I ", " my teeth. Finally, I ", "."], blanks: [{a:"read",h:"📖"},{a:"brush",h:"🪥"},{a:"sleep",h:"🛌"}], fullText: "First, I read a book. Then, I brush my teeth. Finally, I sleep." },
    // --- المرحلة الثالثة: الكتابة الحرة المدعومة ---
    { stage: 3, images: ["🛏️", "🍳", "🏫"], verbs: ["wake", "eat", "go"], transitions: ["first", "then", "finally"], fullText: "First, I wake up. Then, I eat breakfast. Finally, I go to school." },
    { stage: 3, images: ["🧼", "🥪", "🪥"], verbs: ["wash", "eat", "brush"], transitions: ["first", "then", "finally"], fullText: "First, I wash my hands. Then, I eat lunch. Finally, I brush my teeth." },
    { stage: 3, images: ["⚽", "📖", "🛌"], verbs: ["play", "read", "sleep"], transitions: ["first", "then", "finally"], fullText: "First, I play football. Then, I read a story. Finally, I sleep." },
    { stage: 3, images: ["🧹", "📚", "📺"], verbs: ["tidy", "study", "watch"], transitions: ["first", "then", "finally"], fullText: "First, I tidy my room. Then, I study. Finally, I watch TV." },
    { stage: 3, images: ["🏟️", "🏊", "🏠"], verbs: ["go", "swim", "go"], transitions: ["first", "then", "finally"], fullText: "First, I go to the club. Then, I swim. Finally, I go home." }
  ];

  let levelIndex = 0;
  let built = [];
  const transitions = ["First,", "Then,", "After that,", "Finally,"];

  function speakParagraph(text, callback) {
    if (window.GameHub && typeof window.GameHub.speak === 'function') {
      window.GameHub.speak(text, 'en-US');
      if (callback) setTimeout(callback, 800);
    } else if (callback) {
      setTimeout(callback, 1500);
    }
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function renderLevel(stage) {
    const r = gameData[levelIndex];
    built = [];
    let specificHTML = "";
    const stageName = r.stage === 1 ? "Stage 1: Drag & Build" : r.stage === 2 ? "Stage 2: Fill in the Verbs" : "Stage 3: Write the Paragraph";
    
    if (r.stage === 1) {
      const shuffledSentences = shuffle(r.sentences);
      specificHTML = `
        <p class="dr-instruction">Drag the sentences to the correct order to build your paragraph.</p>
        <div class="dr-paragraph" id="dr-paragraph">
          ${[0,1,2,3].map(i => `<div class="dr-slot" data-index="${i}">${i+1}</div>`).join('')}
        </div>
        <div class="dr-pool" id="dr-pool">
          ${shuffledSentences.map((s, i) => `<div class="dr-card" data-text="${s}" data-id="c${i}">${s}</div>`).join('')}
        </div>
      `;
    } else if (r.stage === 2) {
      let paraHTML = "";
      for(let i = 0; i < r.blanks.length; i++) {
        paraHTML += r.parts[i];
        paraHTML += `<span class="dr-blank-wrap"><span class="dr-hint">${r.blanks[i].h}</span><input type="text" class="dr-blank" data-index="${i}" maxlength="10" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></span>`;
      }
      paraHTML += r.parts[r.parts.length - 1];
      specificHTML = `
        <p class="dr-instruction">Look at the hints and type the missing verbs.</p>
        <div class="dr-text-display" id="dr-text-display">${paraHTML}</div>
      `;
    } else if (r.stage === 3) {
      const bankWords = ["First,", "Then,", "Finally,", ...r.verbs];
      specificHTML = `
        <p class="dr-instruction">Look at the pictures and write the full paragraph using the word bank.</p>
        <div class="dr-images">${r.images.map(img => `<span>${img}</span>`).join('<span style="color:#CBD5E0;">➡️</span>')}</div>
        <textarea class="dr-textarea" id="dr-textarea" placeholder="Start with 'First,'..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
        <div class="dr-word-bank">
          ${bankWords.map(w => `<span class="dr-word-chip">${w}</span>`).join('')}
        </div>
        <button class="game-btn success" id="dr-check-btn" style="margin-top:15px;">Check Paragraph</button>
      `;
    }

    stage.innerHTML = `
      <style>
        .dr-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px; width: 100%; user-select: none; -webkit-user-select: none; overflow-y: auto; height: 100%; }
        .dr-header { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 600px; justify-content: space-between; }
        .dr-title-box { display: flex; align-items: center; gap: 10px; }
        .dr-icon { font-size: 2.2rem; }
        .dr-title { font-weight: 800; color: var(--primary-blue); font-size: 1.1rem; }
        .dr-round { font-weight: 700; color: var(--text-muted); font-size: 0.9rem; }
        .dr-instruction { font-weight: 600; color: var(--text-dark); text-align: center; font-size: 1rem; }
        .dr-paragraph { width: 100%; max-width: 600px; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; min-height: 120px; }
        .dr-slot { background: white; border: 2px dashed #CBD5E0; border-radius: 10px; padding: 14px; font-weight: 600; color: #A0AEC0; text-align: center; transition: all 0.3s ease; font-size: 1.05rem; }
        .dr-slot.filled { border: 2px solid var(--primary-green); background: #F0FFF4; color: var(--text-dark); text-align: left; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .dr-trans { color: var(--primary-blue); font-weight: 800; margin-right: 6px; }
        .dr-period { color: var(--text-dark); font-weight: 800; }
        .dr-pool { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; max-width: 600px; align-items:center; }
        .dr-card { padding: 12px 18px; border-radius: 12px; background: white; border: 2px solid var(--primary-blue); color: var(--text-dark); font-weight: 700; cursor: grab; transition: all 0.2s ease; box-shadow: 0 3px 0 #2b6cb0; font-size: 1.05rem; touch-action: none; }
        .dr-card:hover { background: #EBF8FF; transform: translateY(-2px); }
        .dr-card:active { cursor: grabbing; transform: translateY(1px); box-shadow: 0 1px 0 #2b6cb0; }
        .dr-card.used { visibility: hidden; pointer-events: none; opacity: 0; width: 0; padding: 0; margin: 0; border: 0; box-shadow: none; }
        .dr-text-display { width: 100%; max-width: 600px; background: white; border: 2px solid #E2E8F0; border-radius: 16px; padding: 24px; font-size: 1.2rem; font-weight: 600; color: var(--text-dark); line-height: 2.8; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .dr-blank-wrap { display: inline-flex; flex-direction: column; align-items: center; margin: 0 6px; vertical-align: bottom; }
        .dr-hint { font-size: 1.4rem; margin-bottom: 2px; }
        .dr-blank { width: 90px; border: none; border-bottom: 3px dashed var(--primary-blue); text-align: center; font-size: 1.1rem; font-weight: 700; color: var(--primary-blue); outline: none; background: transparent; user-select: text; -webkit-user-select: text; }
        .dr-blank:focus { border-bottom-style: solid; }
        .dr-filled { color: var(--primary-green); font-weight: 800; border-bottom: 3px solid var(--primary-green); padding: 0 4px; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .dr-images { display: flex; gap: 15px; font-size: 3rem; background: white; padding: 16px 24px; border-radius: 16px; border: 2px solid #E2E8F0; align-items: center; }
        .dr-textarea { width: 100%; max-width: 600px; min-height: 120px; padding: 16px; font-size: 1.1rem; border: 2px solid var(--primary-blue); border-radius: 12px; outline: none; resize: vertical; font-family: inherit; font-weight: 600; line-height: 1.6; user-select: text; -webkit-user-select: text; }
        .dr-textarea:focus { border-color: var(--primary-green); box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.2); }
        .dr-word-bank { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 600px; background: #F8FAFC; padding: 12px; border-radius: 12px; border: 1px dashed #CBD5E0; }
        .dr-word-chip { padding: 6px 12px; background: white; border: 1px solid #E2E8F0; border-radius: 8px; font-weight: 700; color: var(--text-muted); font-size: 0.95rem; cursor: default; }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes gentleBounce { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        .bounce-anim { animation: gentleBounce 0.4s ease-in-out; border-color: #ED8936 !important; background: #FFFAF0 !important; }
      </style>
      <div class="dr-wrap">
        <div class="dr-header">
          <button id="prev-btn" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:var(--text-muted); visibility: ${levelIndex > 0 ? 'visible' : 'hidden'};">⬅️ Previous</button>
          <div class="dr-title-box">
            <span class="dr-icon">🦸</span>
            <span class="dr-title">The Hero's Daily Quests</span>
          </div>
          <span class="dr-round">${stageName} | ${levelIndex + 1} / ${gameData.length}</span>
        </div>
        <div style="width:100%; max-width:600px; display:flex; flex-direction:column; align-items:center; gap:15px;">
          ${specificHTML}
        </div>
      </div>
    `;

    const prevBtn = stage.querySelector('#prev-btn');
    if (prevBtn) prevBtn.onclick = previousRound;

    if (r.stage === 1) setupStage1DragAndDrop(stage);
    else if (r.stage === 2) setupStage2(stage);
    else if (r.stage === 3) setupStage3(stage);
  }

  function setupStage1DragAndDrop(stage) {
    const r = gameData[levelIndex];
    const pool = stage.querySelector("#dr-pool");
    const cards = pool.querySelectorAll(".dr-card");
    cards.forEach(card => {
      card.addEventListener("pointerdown", (e) => {
        if (card.classList.contains("used")) return;
        e.preventDefault(); 
        const draggedItem = card;
        const rect = card.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const clone = card.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.left = rect.left + "px";
        clone.style.top = rect.top + "px";
        clone.style.width = rect.width + "px";
        clone.style.zIndex = 1000;
        clone.style.pointerEvents = "none";
        clone.style.opacity = "0.9";
        clone.style.transition = "none"; 
        document.body.appendChild(clone);
        card.style.opacity = "0.3";
        const onMove = (moveEvent) => {
          moveEvent.preventDefault();
          const x = moveEvent.clientX - offsetX;
          const y = moveEvent.clientY - offsetY;
          clone.style.transform = `translate(${x - rect.left}px, ${y - rect.top}px)`;
        };
        const onUp = (upEvent) => {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          const expectedText = r.sentences[built.length];
          clone.style.display = "none";
          const elemBelow = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
          clone.style.display = "block";
          const slot = elemBelow ? elemBelow.closest(".dr-slot") : null;
          if (slot && parseInt(slot.dataset.index) === built.length && draggedItem.dataset.text === expectedText) {
            handleCorrectDrop(draggedItem, upEvent.clientX, upEvent.clientY, stage);
          } else {
            handleWrongDrop(draggedItem);
          }
          clone.remove();
          draggedItem.style.opacity = "1";
        };
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
      });
    });

    function handleCorrectDrop(item, x, y, stage) {
      if (window.GameHub) {
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(x, y);
      }
      const slot = stage.querySelector(`.dr-slot[data-index="${built.length}"]`);
      slot.classList.add("filled");
      slot.innerHTML = `<span class="dr-trans">${transitions[built.length]}</span> ${item.dataset.text}<span class="dr-period">.</span>`;
      item.classList.add("used");
      built.push(item.dataset.text);
      if (built.length === r.sentences.length) {
        speakParagraph(r.fullText, nextRound);
      }
    }

    function handleWrongDrop(item) {
      if (window.GameHub) window.GameHub.playSound("wrong");
      item.classList.add("bounce-anim");
      setTimeout(() => item.classList.remove("bounce-anim"), 400);
    }
  }

  function setupStage2(stage) {
    const r = gameData[levelIndex];
    const inputs = stage.querySelectorAll(".dr-blank");
    let completedCount = 0;
    inputs.forEach(input => {
      const i = parseInt(input.dataset.index);
      const checkBlank = () => {
        const correctAns = r.blanks[i].a.toLowerCase();
        const userAns = input.value.trim().toLowerCase();
        if (userAns === correctAns) {
          if (window.GameHub) window.GameHub.playSound("correct");
          const span = document.createElement('span');
          span.className = 'dr-filled';
          span.innerText = input.value.trim();
          input.replaceWith(span);
          completedCount++;
          if (completedCount === r.blanks.length) {
            speakParagraph(r.fullText, nextRound);
          }
        } else {
          if (window.GameHub) window.GameHub.playSound("wrong");
          input.classList.add("bounce-anim");
          setTimeout(() => {
            input.classList.remove("bounce-anim");
            input.value = "";
            input.focus();
          }, 400);
        }
      };
      input.addEventListener("keypress", (e) => { if (e.key === "Enter") checkBlank(); });
      input.addEventListener("blur", () => { if (input.value.trim() !== "") checkBlank(); });
    });
  }

  function setupStage3(stage) {
    const r = gameData[levelIndex];
    const textarea = stage.querySelector("#dr-textarea");
    const checkBtn = stage.querySelector("#dr-check-btn");
    const checkParagraph = () => {
      const text = textarea.value.toLowerCase();
      const hasTransitions = r.transitions.every(t => text.includes(t));
      const hasVerbs = r.verbs.every(v => text.includes(v));
      if (hasTransitions && hasVerbs && text.length > 15) {
        if (window.GameHub) window.GameHub.playSound("correct");
        speakParagraph(r.fullText, nextRound);
      } else {
        if (window.GameHub) window.GameHub.playSound("wrong");
        textarea.classList.add("bounce-anim");
        setTimeout(() => textarea.classList.remove("bounce-anim"), 400);
      }
    };
    checkBtn.addEventListener("click", checkParagraph);
    setTimeout(() => textarea.focus(), 100);
  }

  function nextRound() {
    levelIndex++;
    if (levelIndex >= gameData.length) {
      if (window.GameHub) {
        window.GameHub.showComplete("Hero's Quest Complete!", "You mastered your daily routine and wrote perfect paragraphs!");
      } else {
        alert("Hero's Quest Complete! You mastered your daily routine and wrote perfect paragraphs!");
      }
    } else {
      renderLevel(currentStage);
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel(currentStage);
    }
  }

  renderLevel(currentStage);
  window.nextRound = nextRound;
  window.previousRound = previousRound;
};