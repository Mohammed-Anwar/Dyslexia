// Writing > Expression > Daily phrases (Comic Book Interactive Style)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const gameData = [
    // --- Phase 1: Drag & Drop / Choice (gameData 1-5) ---
    { 
      phase: 1, type: 'choice', 
      situation: "Good morning!", emoji: "☀️", 
      options: ["Good morning!", "Good night!", "Goodbye!"], 
      answer: "Good morning!" 
    },
    { 
      phase: 1, type: 'choice', 
      situation: "Here is a present for you.", emoji: "🎁", 
      options: ["Thank you.", "I am sorry.", "Hello."], 
      answer: "Thank you." 
    },
    { 
      phase: 1, type: 'choice', 
      situation: "Ah-choo! 🤧", emoji: "🤧", 
      options: ["Bless you.", "Excuse me.", "Please."], 
      answer: "Bless you." 
    },
    { 
      phase: 1, type: 'choice', 
      situation: "Oops! I broke the cup.", emoji: "💥", 
      options: ["I am very sorry.", "You are welcome.", "Good job."], 
      answer: "I am very sorry." 
    },
    { 
      phase: 1, type: 'choice', 
      situation: "Thank you for your help.", emoji: "🤝", 
      options: ["You are welcome.", "See you later.", "I am fine."], 
      answer: "You are welcome." 
    },
    
    // --- Phase 2: Unscramble (gameData 6-10) ---
    { 
      phase: 2, type: 'unscramble', 
      situation: "I need to go to the bathroom.", emoji: "🚻", 
      words: ["May", "I", "go", "to the toilet", "?"], 
      answer: "May I go to the toilet ?" 
    },
    { 
      phase: 2, type: 'unscramble', 
      situation: "I didn't hear what the teacher said.", emoji: "👂", 
      words: ["Can", "you", "repeat", "that", "please", "?"], 
      answer: "Can you repeat that please ?" 
    },
    { 
      phase: 2, type: 'unscramble', 
      situation: "I need a pen.", emoji: "🖊️", 
      words: ["Can", "I", "borrow", "a pen", "?"], 
      answer: "Can I borrow a pen ?" 
    },
    { 
      phase: 2, type: 'unscramble', 
      situation: "I need to talk to them.", emoji: "🗣️", 
      words: ["Excuse", "me", ",", "please", "."], 
      answer: "Excuse me , please ." 
    },
    { 
      phase: 2, type: 'unscramble', 
      situation: "I am leaving now.", emoji: "👋", 
      words: ["See", "you", "tomorrow", "."], 
      answer: "See you tomorrow ." 
    },

    // --- Phase 3: Guided Typing (gameData 11-15) ---
    { 
      phase: 3, type: 'typing', 
      situation: "Asking about the price of a toy.", emoji: "🧸", 
      prefix: "How", suffix: "is this toy?", 
      answer: "much" 
    },
    { 
      phase: 3, type: 'typing', 
      situation: "Wishing a friend a happy birthday.", emoji: "🎂", 
      prefix: "", suffix: "birthday to you!", 
      answer: "Happy" 
    },
    { 
      phase: 3, type: 'typing', 
      situation: "Asking a friend how they are.", emoji: "😊", 
      prefix: "How", suffix: "you today?", 
      answer: "are" 
    },
    { 
      phase: 3, type: 'typing', 
      situation: "Offering help to someone.", emoji: "🙋", 
      prefix: "Can I", suffix: "you?", 
      answer: "help" 
    },
    { 
      phase: 3, type: 'typing', 
      situation: "Going to sleep.", emoji: "🌙", 
      prefix: "Good", suffix: ", Mom.", 
      answer: "night" 
    }
  ];

  let levelIndex = 0;
  // مصفوفة لتتبع الكلمات المختارة مع معرفها الأصلي لمنع التكرار أو الحذف الخاطئ
  let currentUnscrambleWords = []; 
  let isDragging = false; // لمنع تعارض النقر مع السحب

  // Text-to-Speech Helper
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[^\w\s\?\.]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  // دالة لإعادة رسم منطقة الإجابة بناءً على الحالة الحالية (تمنع الاختفاء أو التكرار)
  function renderZone() {
    const zone = document.getElementById('answer-zone');
    if (!zone) return;
    
    zone.innerHTML = ''; // مسح المنطقة بأمان

    if (currentUnscrambleWords.length === 0) {
      zone.innerHTML = '<span class="placeholder-text">Tap words to build the sentence...</span>';
      return;
    }

    currentUnscrambleWords.forEach((item, zoneIndex) => {
      const chip = document.createElement('div');
      chip.className = 'word-chip';
      chip.style.background = 'var(--primary-blue)';
      chip.style.color = 'white';
      chip.style.borderColor = 'var(--primary-blue)';
      chip.style.cursor = 'pointer';
      chip.innerText = item.value;
      
      // عند النقر على الكلمة في منطقة الإجابة، إعادتها للبنك
      chip.onclick = (e) => {
        e.stopPropagation(); // منع انتشار الحدث
        returnWordToBank(item.originalId, zoneIndex);
      };
      
      zone.appendChild(chip);
    });
  }

  function renderLevel() {
    const r = gameData[levelIndex];
    const phaseName = r.phase === 1 ? "Phase 1: Choose the Response" : r.phase === 2 ? "Phase 2: Unscramble the Words" : "Phase 3: Complete the Sentence";
    
    let interactionHTML = '';

    if (r.type === 'choice') {
      const shuffledOptions = [...r.options].sort(() => Math.random() - 0.5);
      interactionHTML = `
        <div class="drop-zone" id="answer-zone">
          <span class="placeholder-text">Tap or drag the correct response here!</span>
        </div>
        <div class="options-bank">
          ${shuffledOptions.map(opt => `
            <div class="word-chip" draggable="true" data-value="${opt}">${opt}</div>
          `).join('')}
        </div>
      `;
    } else if (r.type === 'unscramble') {
      currentUnscrambleWords = []; // تصفير الحالة لكل جولة جديدة
      const shuffledWords = [...r.words].sort(() => Math.random() - 0.5);
      interactionHTML = `
        <div class="drop-zone unscramble-zone" id="answer-zone">
          <span class="placeholder-text">Tap words to build the sentence...</span>
        </div>
        <div class="options-bank" id="word-bank">
          ${shuffledWords.map((word, i) => `
            <div class="word-chip" draggable="true" data-value="${word}" id="word-${i}">${word}</div>
          `).join('')}
        </div>
        <button class="game-btn success check-btn" style="margin-top:20px;">Check Answer</button>
      `;
    } else if (r.type === 'typing') {
      interactionHTML = `
        <div class="typing-zone">
          <span class="typing-prefix">${r.prefix}</span>
          <input type="text" id="typing-input" class="typing-input" placeholder="..." autocomplete="off">
          <span class="typing-suffix">${r.suffix}</span>
        </div>
        <button class="game-btn success check-btn" style="margin-top:20px;">Check Answer</button>
      `;
    }

    stage.innerHTML = `
      <style>
        .cd-wrap { 
          display:flex; flex-direction:column; align-items:center; gap:14px; padding:20px; width:100%; height:100%; 
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          user-select: none; -webkit-user-select: none;
        }
        .phase-indicator {
          font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary-blue); margin-bottom: 5px;
        }
        .round-indicator { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }
        .comic-scene {
          display: flex; flex-direction: column; align-items: center; gap: 30px; width: 100%; max-width: 600px; margin-top: 20px;
        }
        .character-box { display: flex; align-items: flex-start; gap: 15px; width: 100%; }
        .emoji-avatar {
          font-size: 3rem; background: white; border-radius: 50%; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 2px solid #E2E8F0; flex-shrink: 0;
        }
        .speech-bubble {
          background: white; border: 2px solid var(--primary-blue); border-radius: 20px; border-top-left-radius: 4px;
          padding: 16px 20px; font-size: 1.1rem; font-weight: 600; color: var(--text-dark); position: relative;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px; flex: 1;
        }
        .voice-btn {
          background: var(--bg-light); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: var(--transition); flex-shrink: 0;
        }
        .voice-btn:hover { background: var(--primary-blue); color: white; transform: scale(1.1); }
        .player-response { display: flex; align-items: flex-end; gap: 15px; width: 100%; flex-direction: row-reverse; }
        .player-bubble {
          background: var(--primary-blue); color: white; border-radius: 20px; border-top-right-radius: 4px;
          padding: 20px; width: 100%; min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .drop-zone {
          width: 100%; min-height: 60px; border: 2px dashed #CBD5E0; border-radius: 12px; background: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; padding: 10px; transition: var(--transition);
        }
        .drop-zone.drag-over { border-color: var(--primary-green); background: #F0FFF4; }
        .placeholder-text { color: #A0AEC0; font-size: 0.9rem; font-weight: 500; }
        .options-bank { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 15px; }
        .word-chip {
          padding: 10px 18px; background: white; border: 2px solid var(--primary-blue); color: var(--primary-blue);
          border-radius: 50px; font-weight: 700; cursor: pointer; transition: var(--transition); user-select: none;
        }
        .word-chip:hover { background: var(--primary-blue); color: white; transform: translateY(-2px); }
        .word-chip.used { opacity: 0.4; pointer-events: none; cursor: default; }
        .typing-zone {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; font-size: 1.3rem; font-weight: 700; color: white;
        }
        .typing-input {
          width: 120px; padding: 8px 12px; border: none; border-radius: 8px; font-size: 1.2rem; font-weight: 700; text-align: center;
          color: var(--text-dark); outline: none; border-bottom: 3px solid rgba(255,255,255,0.5); background: rgba(255,255,255,0.9);
        }
        .typing-input:focus { border-bottom-color: white; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.4s ease-in-out; border-color: #E53E3E !important; }
      </style>

      <div class="cd-wrap">
        <div class="phase-indicator">${phaseName}</div>
        <div class="round-indicator">Round ${levelIndex + 1} / ${gameData.length}</div>

        <div class="comic-scene">
          <div class="character-box">
            <div class="emoji-avatar">${r.emoji}</div>
            <div class="speech-bubble">
              <span>${r.situation}</span>
              <button class="voice-btn" title="Listen">🔊</button>
            </div>
          </div>

          <div class="player-response">
            <div class="emoji-avatar" style="background:var(--primary-blue); border-color:white; color: white; display:flex; align-items:center; justify-content:center;">👤</div>
            <div class="player-bubble" id="player-bubble">
              ${interactionHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    // --- ربط الأحداث بأمان ---
    
    const voiceBtn = stage.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.addEventListener('click', () => speakText(r.situation));

    const zone = document.getElementById('answer-zone');
    if (zone) {
      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const elId = e.dataTransfer.getData('element-id');
        if (r.type === 'unscramble' && elId) {
          moveWordToZone(elId);
        } else if (r.type === 'choice') {
          const value = e.dataTransfer.getData('text/plain');
          const targetChip = Array.from(stage.querySelectorAll('.options-bank .word-chip')).find(c => c.getAttribute('data-value') === value);
          if (targetChip) selectChoice(targetChip);
        }
      });
    }

    // منطق المرحلة الأولى (Choice)
    if (r.type === 'choice') {
      stage.querySelectorAll('.options-bank .word-chip').forEach(chip => {
        chip.addEventListener('click', (e) => { e.stopPropagation(); selectChoice(chip); });
        chip.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', chip.getAttribute('data-value'));
        });
      });
    }

    // منطق المرحلة الثانية (Unscramble) - مع منع تعارض النقر والسحب
    if (r.type === 'unscramble') {
      stage.querySelectorAll('#word-bank .word-chip').forEach(chip => {
        chip.addEventListener('dragstart', (e) => {
          isDragging = true;
          e.dataTransfer.setData('text/plain', chip.getAttribute('data-value'));
          e.dataTransfer.setData('element-id', chip.id);
        });
        chip.addEventListener('dragend', () => {
          setTimeout(() => { isDragging = false; }, 50); // تأخير بسيط لضمان عدم تشغيل النقر
        });
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isDragging) {
            isDragging = false; // تم السحب، نتجاهل حدث النقر
            return;
          }
          moveWordToZone(chip.id);
        });
      });

      const checkBtn = stage.querySelector('.check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', () => {
          checkUnscramble();
        });
      }
    }

    // منطق المرحلة الثالثة (Typing)
    if (r.type === 'typing') {
      const checkBtn = stage.querySelector('.check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', () => checkTyping());
      }
      setTimeout(() => {
        const input = document.getElementById('typing-input');
        if (input) {
          input.focus();
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkTyping();
          });
        }
      }, 100);
    }
  }

  // --- دوال التفاعل ---

  function selectChoice(element) {
    if (!element) return;
    const value = element.getAttribute('data-value');
    const r = gameData[levelIndex];
    const zone = document.getElementById('answer-zone');
    if (!zone) return;
    
    zone.innerHTML = `<div class="word-chip" style="background:var(--primary-blue); color:white; border-color:var(--primary-blue);">${value}</div>`;
    
    if (value === r.answer) {
      handleCorrect(element);
    } else {
      handleWrong(zone);
    }
  }

  function moveWordToZone(originalId) {
    const bankChip = document.getElementById(originalId);
    if (!bankChip || bankChip.classList.contains('used')) return;

    const value = bankChip.getAttribute('data-value');
    
    // إضافة الكلمة مع معرفها الأصلي لتتبعها بدقة
    currentUnscrambleWords.push({ value, originalId });
    bankChip.classList.add('used');

    renderZone(); // إعادة الرسم الآمن
  }

  function returnWordToBank(originalId, zoneIndex) {
    // إزالة الكلمة من المصفوفة باستخدام الفهرس الدقيق
    const removedItem = currentUnscrambleWords.splice(zoneIndex, 1)[0];
    
    // إعادة تفعيل الكلمة في البنك
    const bankChip = document.getElementById(removedItem.originalId);
    if (bankChip) {
      bankChip.classList.remove('used');
    }

    renderZone(); // إعادة الرسم الآمن
  }

  function checkUnscramble() {
    const r = gameData[levelIndex];
    // تجميع الكلمات من المصفوفة مع تطبيع المسافات حول علامات الترقيم
    const userAnswer = currentUnscrambleWords.map(w => w.value).join(' ');
    const zone = document.getElementById('answer-zone');
    if (!zone) return;
    
    const normalize = str => str.replace(/\s+([?.])/g, '$1').trim();
    
    if (normalize(userAnswer) === normalize(r.answer)) {
      handleCorrect(zone);
    } else {
      handleWrong(zone);
    }
  }

  function checkTyping() {
    const r = gameData[levelIndex];
    const input = document.getElementById('typing-input');
    if (!input) return;
    const userAnswer = input.value.trim().toLowerCase();
    
    if (userAnswer === r.answer.toLowerCase()) {
      handleCorrect(input);
    } else {
      handleWrong(input);
    }
  }

  function handleCorrect(element) {
    if (window.GameHub) window.GameHub.playSound("correct");
    if (element && window.GameHub) {
      const rect = element.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    
    setTimeout(() => {
      levelIndex++;
      if (levelIndex >= gameData.length) {
        if (window.GameHub) {
          window.GameHub.showComplete("Polite & Kind!", "You picked the perfect phrase for every situation!");
        } else {
          alert("Polite & Kind! You picked the perfect phrase for every situation!");
        }
      } else {
        renderLevel();
      }
    }, 800);
  }

  function handleWrong(element) {
    if (!element) return;
    if (window.GameHub) window.GameHub.playSound("wrong");
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 400);
  }

  // بدء اللعبة
  renderLevel();
};