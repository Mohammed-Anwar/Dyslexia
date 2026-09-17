// Writing > Expression > Invitation (Post Office Theme)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // قاعدة البيانات للـ 15 جولة
  const ROUNDS = [
    // --- Phase 1: Unscramble (Rounds 1-5) ---
    { 
      phase: 1, type: 'unscramble', event: "Birthday Party",
      lines: [
        { words: ["party", "my", "to", "come", "Please"], answer: "Please come to my party" },
        { words: ["is", "Sunday", "It", "on"], answer: "It is on Sunday" },
        { words: ["at", "house", "my", "It", "is"], answer: "It is at my house" }
      ]
    },
    { 
      phase: 1, type: 'unscramble', event: "Graduation Party",
      lines: [
        { words: ["graduation", "my", "to", "come", "Please"], answer: "Please come to my graduation" },
        { words: ["is", "Friday", "It", "on"], answer: "It is on Friday" },
        { words: ["at", "school", "the", "It", "is"], answer: "It is at the school" }
      ]
    },
    { 
      phase: 1, type: 'unscramble', event: "Football Match",
      lines: [
        { words: ["match", "football", "the", "to", "come", "Please"], answer: "Please come to the football match" },
        { words: ["is", "Saturday", "It", "on"], answer: "It is on Saturday" },
        { words: ["at", "stadium", "the", "It", "is"], answer: "It is at the stadium" }
      ]
    },
    { 
      phase: 1, type: 'unscramble', event: "BBQ Party",
      lines: [
        { words: ["party", "BBQ", "our", "to", "come", "Please"], answer: "Please come to our BBQ party" },
        { words: ["is", "Sunday", "It", "on"], answer: "It is on Sunday" },
        { words: ["in", "garden", "the", "It", "is"], answer: "It is in the garden" }
      ]
    },
    { 
      phase: 1, type: 'unscramble', event: "End of Year Party",
      lines: [
        { words: ["party", "year", "of", "end", "the", "to", "come", "Please"], answer: "Please come to the end of year party" },
        { words: ["is", "Thursday", "It", "on"], answer: "It is on Thursday" },
        { words: ["at", "club", "the", "It", "is"], answer: "It is at the club" }
      ]
    },

    // --- Phase 2: Guided Typing (Rounds 6-10) ---
    { 
      phase: 2, type: 'typing', event: "Success Party",
      textParts: ["Please come to my party.", "It is on ", " PM.", "It is in the ", "."],
      blanks: [
        { hint: " Friday", answer: "friday", placeholder: "day" },
        { hint: "🕕 6", answer: "6", placeholder: "time" },
        { hint: "🌳 Park", answer: "park", placeholder: "place" }
      ]
    },
    { 
      phase: 2, type: 'typing', event: "Graduation",
      textParts: ["Please come to my graduation.", "It is on ", ".", "It is at ", "."],
      blanks: [
        { hint: "📅 Monday", answer: "monday", placeholder: "day" },
        { hint: " School", answer: "school", placeholder: "place" }
      ]
    },
    { 
      phase: 2, type: 'typing', event: "Football Match",
      textParts: ["Please come to the match.", "It is on ", ".", "It is at the ", "."],
      blanks: [
        { hint: "📅 Saturday", answer: "saturday", placeholder: "day" },
        { hint: "🏟️ Stadium", answer: "stadium", placeholder: "place" }
      ]
    },
    { 
      phase: 2, type: 'typing', event: "BBQ Party",
      textParts: ["Please come to our BBQ.", "It is on ", ".", "It is in the ", "."],
      blanks: [
        { hint: "📅 Sunday", answer: "sunday", placeholder: "day" },
        { hint: "🌻 Garden", answer: "garden", placeholder: "place" }
      ]
    },
    { 
      phase: 2, type: 'typing', event: "Movie Night",
      textParts: ["Please come to movie night.", "It is on ", ".", "It is at the ", "."],
      blanks: [
        { hint: "📅 Friday", answer: "friday", placeholder: "day" },
        { hint: " Cinema", answer: "cinema", placeholder: "place" }
      ]
    },

    // --- Phase 3: Independent Writing (Rounds 11-15) ---
    { 
      phase: 3, type: 'writing', event: "Birthday",
      stickyNote: "Event: Birthday\nDay: Monday\nPlace: Club",
      wordBank: ["Please", "come", "to", "my", "birthday", "It", "is", "on", "Monday", "at", "the", "club"],
      requiredKeywords: ["come", "monday", "club"]
    },
    { 
      phase: 3, type: 'writing', event: "Pizza Party",
      stickyNote: "Event: Pizza Party\nDay: Thursday\nTime: 7 PM",
      wordBank: ["Please", "come", "to", "my", "pizza", "party", "It", "is", "on", "Thursday", "at", "7", "PM"],
      requiredKeywords: ["pizza", "thursday", "7"]
    },
    { 
      phase: 3, type: 'writing', event: "Football Match",
      stickyNote: "Event: Football Match\nDay: Friday\nPlace: School",
      wordBank: ["Please", "come", "to", "the", "football", "match", "It", "is", "on", "Friday", "at", "school"],
      requiredKeywords: ["football", "friday", "school"]
    },
    { 
      phase: 3, type: 'writing', event: "Movie Night",
      stickyNote: "Event: Movie Night\nDay: Saturday\nPlace: My house",
      wordBank: ["Please", "come", "to", "movie", "night", "It", "is", "on", "Saturday", "at", "my", "house"],
      requiredKeywords: ["movie", "saturday", "house"]
    },
    { 
      phase: 3, type: 'writing', event: "Class Party",
      stickyNote: "Event: Class Party\nDay: Tuesday\nTime: 10 AM",
      wordBank: ["Please", "come", "to", "the", "class", "party", "It", "is", "on", "Tuesday", "at", "10", "AM"],
      requiredKeywords: ["class", "tuesday", "10"]
    }
  ];

  let levelIndex = 0;
  let lineStates = [{}, {}, {}]; // تتبع حالة كل سطر (الكلمات المختارة)
  let isDragging = false;

  // Text-to-Speech Helper
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[^\w\s\?\.]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  // إعادة رسم منطقة سحب محددة
  function renderLineZone(linelevelIndex) {
    const zone = document.getElementById(`zone-${linelevelIndex}`);
    if (!zone) return;
    
    const words = lineStates[linelevelIndex];
    zone.innerHTML = '';
    
    if (Object.keys(words).length === 0) {
      zone.innerHTML = '<span class="placeholder-text">Tap or drag words here...</span>';
      return;
    }
    
    // ترتيب الكلمات حسب موقعها
    const sortedWords = Object.entries(words).sort((a, b) => a[1].position - b[1].position);
    
    sortedWords.forEach(([originalId, data]) => {
      const chip = document.createElement('div');
      chip.className = 'word-chip active-chip';
      chip.innerText = data.value;
      chip.onclick = (e) => { 
        e.stopPropagation(); 
        returnWordToBank(linelevelIndex, originalId); 
      };
      zone.appendChild(chip);
    });
  }

  function build() {
    const r = ROUNDS[levelIndex];
    const phaseName = r.phase === 1 ? "Phase 1: Build the Sentences" : r.phase === 2 ? "Phase 2: Fill in the Blanks" : "Phase 3: Write the Invitation";
    
    // تصفير الحالات
    lineStates = [{}, {}, {}];
    
    let contentHTML = '';

    if (r.phase === 1) {
      // إنشاء 3 أسطر معاً
      contentHTML = '<div class="lines-container">';
      r.lines.forEach((line, linelevelIndex) => {
        const shuffledWords = [...line.words].sort(() => Math.random() - 0.5);
        contentHTML += `
          <div class="single-line" data-line="${linelevelIndex}">
            <div class="line-label">Line ${linelevelIndex + 1}</div>
            <div class="drop-zone" id="zone-${linelevelIndex}">
              <span class="placeholder-text">Tap or drag words here...</span>
            </div>
            <div class="options-bank" id="bank-${linelevelIndex}">
              ${shuffledWords.map((word, i) => `<div class="word-chip" draggable="true" data-value="${word}" data-line="${linelevelIndex}" data-levelIndex="${i}" id="w-${linelevelIndex}-${i}">${word}</div>`).join('')}
            </div>
          </div>
        `;
      });
      contentHTML += '</div><button class="game-btn success check-btn" style="margin-top:20px;">Check All Lines</button>';
    } else if (r.phase === 2) {
      let html = '<div class="typing-invitation">';
      let blevelIndex = 0;
      for (let i = 0; i < r.textParts.length; i++) {
        html += `<span class="text-part">${r.textParts[i]}</span>`;
        if (blevelIndex < r.blanks.length && i < r.textParts.length - 1) {
          html += `<div class="blank-wrapper">
                     <input type="text" class="blank-input" data-levelIndex="${blevelIndex}" placeholder="${r.blanks[blevelIndex].placeholder}" autocomplete="off">
                     <span class="hint-badge" onclick="speakText('${r.blanks[blevelIndex].hint}')" title="Listen to hint">💡 ${r.blanks[blevelIndex].hint}</span>
                   </div>`;
          blevelIndex++;
        }
      }
      html += '</div><button class="game-btn success check-btn" style="margin-top:20px;">Send Invitation</button>';
      contentHTML = html;
    } else if (r.phase === 3) {
      contentHTML = `
        <div class="sticky-note">
          <div class="sticky-pin"></div>
          <h4>Party Details:</h4>
          <pre>${r.stickyNote}</pre>
        </div>
        <div class="writing-area-wrapper">
          <textarea class="invite-textarea" placeholder="Please come to my..." rows="5"></textarea>
        </div>
        <div class="word-bank-ref">
          <span class="wb-label">Word Bank:</span>
          <div class="wb-chips">${r.wordBank.map(w => `<span class="wb-chip">${w}</span>`).join('')}</div>
        </div>
        <button class="game-btn success check-btn" style="margin-top:15px;">Send Invitation</button>
      `;
    }

    stage.innerHTML = `
      <style>
        .po-wrap { display:flex; flex-direction:column; align-items:center; gap:15px; padding:20px; width:100%; height:100%; font-family: 'Segoe UI', sans-serif; user-select: none; }
        .phase-badge { font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary-blue); }
        .round-badge { font-size:0.9rem; color:var(--text-muted); font-weight:600; }
        
        .invitation-card {
          width:min(600px, 95%); background:white; border:2px solid #E2E8F0; border-radius:16px;
          padding:24px; box-shadow:0 8px 20px rgba(0,0,0,0.06); position:relative;
          background-image: radial-gradient(#F7FAFC 1px, transparent 1px); background-size: 20px 20px;
        }
        .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:2px dashed #E2E8F0; padding-bottom:10px; }
        .card-title { font-size:1.2rem; font-weight:700; color:var(--primary-green); display:flex; align-items:center; gap:8px; }
        .voice-btn { background:var(--bg-light); border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:1rem; transition:var(--transition); }
        .voice-btn:hover { background:var(--primary-blue); color:white; }

        /* Phase 1 Styles - Multiple Lines */
        .lines-container { display:flex; flex-direction:column; gap:20px; }
        .single-line { background:rgba(255,255,255,0.6); border-radius:12px; padding:15px; border:2px solid transparent; transition:var(--transition); }
        .single-line.correct { border-color:var(--primary-green); background:rgba(72, 187, 120, 0.1); }
        .single-line.incorrect { border-color:#E53E3E; background:rgba(229, 62, 62, 0.1); }
        .line-label { font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase; }
        .drop-zone { min-height:50px; border:2px dashed #CBD5E0; border-radius:10px; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:flex-start; flex-wrap:wrap; gap:6px; padding:8px 12px; transition:var(--transition); margin-bottom:10px; }
        .drop-zone.drag-over { border-color:var(--primary-green); background:#F0FFF4; }
        .drop-zone.correct { border-color:var(--primary-green); border-style:solid; background:#F0FFF4; }
        .drop-zone.incorrect { border-color:#E53E3E; border-style:solid; background:#FFF5F5; }
        .options-bank { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; min-height:40px; }
        .word-chip { padding:6px 12px; background:white; border:2px solid var(--primary-blue); color:var(--primary-blue); border-radius:50px; font-weight:700; cursor:pointer; transition:var(--transition); font-size:0.95rem; }
        .word-chip:hover { background:var(--primary-blue); color:white; transform:translateY(-2px); }
        .word-chip.used { opacity:0.3; pointer-events:none; }
        .word-chip.active-chip { background:var(--primary-blue); color:white; border-color:var(--primary-blue); }
        .placeholder-text { color:#A0AEC0; font-size:0.85rem; width:100%; text-align:center; }

        /* Phase 2 Styles */
        .typing-invitation { font-size:1.1rem; font-weight:600; color:var(--text-dark); line-height:2.2; display:flex; flex-wrap:wrap; align-items:center; gap:5px; }
        .blank-wrapper { display:inline-flex; flex-direction:column; align-items:center; gap:4px; margin:0 4px; }
        .blank-input { width:100px; padding:6px 8px; border:none; border-bottom:3px solid var(--primary-blue); background:rgba(74, 144, 226, 0.1); font-size:1rem; font-weight:700; text-align:center; color:var(--text-dark); outline:none; border-radius:4px 4px 0 0; }
        .blank-input:focus { border-bottom-color:var(--primary-green); background:rgba(72, 187, 120, 0.1); }
        .blank-input.correct { border-bottom-color:var(--primary-green); background:rgba(72, 187, 120, 0.2); }
        .blank-input.incorrect { border-bottom-color:#E53E3E; background:rgba(229, 62, 62, 0.2); }
        .hint-badge { font-size:0.75rem; background:#FFFBEA; border:1px solid #F6E05E; color:#B7791F; padding:2px 8px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:4px; }

        /* Phase 3 Styles */
        .sticky-note { background:#FFFBEA; border:1px solid #F6E05E; border-radius:8px; padding:15px; margin-bottom:15px; position:relative; box-shadow:0 2px 4px rgba(0,0,0,0.05); transform:rotate(-1deg); }
        .sticky-pin { position:absolute; top:-10px; left:50%; transform:translateX(-50%); font-size:1.2rem; }
        .sticky-note h4 { margin:0 0 8px 0; color:#B7791F; font-size:0.9rem; text-transform:uppercase; }
        .sticky-note pre { margin:0; font-family:inherit; font-size:0.95rem; color:#744210; white-space:pre-wrap; }
        .invite-textarea { width:100%; padding:15px; border:2px solid #E2E8F0; border-radius:12px; font-size:1rem; font-family:inherit; resize:none; outline:none; transition:var(--transition); background:white; }
        .invite-textarea:focus { border-color:var(--primary-blue); box-shadow:0 0 0 3px rgba(74, 144, 226, 0.1); }
        .word-bank-ref { margin-top:15px; padding:10px; background:#F7FAFC; border-radius:8px; }
        .wb-label { font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px; }
        .wb-chips { display:flex; flex-wrap:wrap; gap:6px; }
        .wb-chip { font-size:0.8rem; padding:4px 10px; background:white; border:1px solid #CBD5E0; border-radius:12px; color:var(--text-dark); }

        /* Envelope Animation */
        .envelope-overlay {
          position:absolute; inset:0; background:rgba(255,255,255,0.95); display:none; flex-direction:column; align-items:center; justify-content:center; z-index:50; border-radius:16px;
        }
        .envelope-icon { font-size:4rem; animation: flyAway 1.2s ease-in-out forwards; }
        @keyframes flyAway {
          0% { transform: scale(0.5) translateY(0); opacity: 0; }
          30% { transform: scale(1.2) translateY(-10px); opacity: 1; }
          100% { transform: scale(0.8) translateY(-200px) rotate(15deg); opacity: 0; }
        }
        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      </style>

      <div class="po-wrap">
        <div class="phase-badge">${phaseName}</div>
        <div class="round-badge">Round ${levelIndex + 1} / ${ROUNDS.length}</div>

        <div class="invitation-card" id="invite-card">
          <div class="card-header">
            <div class="card-title">✉️ ${r.event} Invitation</div>
            <button class="voice-btn" onclick="speakText('${r.event} Invitation')" title="Listen">🔊</button>
          </div>
          ${contentHTML}
          
          <div class="envelope-overlay" id="envelope-anim">
            <div class="envelope-icon">✉️</div>
            <p style="margin-top:10px; font-weight:700; color:var(--primary-green);">Sent Successfully!</p>
          </div>
        </div>
      </div>
    `;

    // --- ربط الأحداث بأمان ---
    const levelIndex = ROUNDS[levelIndex];

    // Voice button
    const voiceBtn = stage.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.addEventListener('click', () => speakText(levelIndex.event + " Invitation"));

    if (levelIndex.phase === 1) {
      // إعداد كل سطر
      levelIndex.lines.forEach((line, linelevelIndex) => {
        const zone = document.getElementById(`zone-${linelevelIndex}`);
        const bank = document.getElementById(`bank-${linelevelIndex}`);
        
        // Drop zone events
        zone.addEventListener('dragover', (e) => { 
          e.preventDefault(); 
          zone.classList.add('drag-over'); 
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
          e.preventDefault(); 
          zone.classList.remove('drag-over');
          const lineData = e.dataTransfer.getData('line-levelIndex');
          const wordlevelIndex = e.dataTransfer.getData('word-levelIndex');
          if (lineData !== undefined && wordlevelIndex !== undefined) {
            moveWordToZone(parseInt(lineData), parseInt(wordlevelIndex), linelevelIndex);
          }
        });

        // Word chips events
        const chips = bank.querySelectorAll('.word-chip');
        chips.forEach(chip => {
          chip.addEventListener('dragstart', (e) => {
            isDragging = true;
            e.dataTransfer.setData('text/plain', chip.getAttribute('data-value'));
            e.dataTransfer.setData('line-levelIndex', chip.getAttribute('data-line'));
            e.dataTransfer.setData('word-levelIndex', chip.getAttribute('data-levelIndex'));
          });
          chip.addEventListener('dragend', () => { 
            setTimeout(() => { isDragging = false; }, 50); 
          });
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDragging) { 
              isDragging = false; 
              return; 
            }
            const wLine = parseInt(chip.getAttribute('data-line'));
            const wlevelIndex = parseInt(chip.getAttribute('data-levelIndex'));
            moveWordToZone(wLine, wlevelIndex, linelevelIndex);
          });
        });
      });

      stage.querySelector('.check-btn').addEventListener('click', () => checkAllLines());
    } 
    else if (levelIndex.phase === 2) {
      stage.querySelector('.check-btn').addEventListener('click', () => checkPhase2());
      setTimeout(() => {
        const firstBlank = stage.querySelector('.blank-input');
        if (firstBlank) firstBlank.focus();
      }, 100);
    } 
    else if (levelIndex.phase === 3) {
      stage.querySelector('.check-btn').addEventListener('click', () => checkPhase3());
      setTimeout(() => {
        const textarea = stage.querySelector('.invite-textarea');
        if (textarea) {
          textarea.focus();
          textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) checkPhase3();
          });
        }
      }, 100);
    }
  }

  // --- منطق المرحلة الأولى: Unscramble (3 أسطر معاً) ---
  function moveWordToZone(fromLine, wordlevelIndex, toLine) {
    if (fromLine !== toLine) return; // لا يمكن نقل الكلمات بين أسطر مختلفة
    
    const chipId = `w-${fromLine}-${wordlevelIndex}`;
    const bankChip = document.getElementById(chipId);
    
    if (!bankChip || bankChip.classList.contains('used')) return;
    
    const wordValue = bankChip.getAttribute('data-value');
    const position = Object.keys(lineStates[toLine]).length;
    
    lineStates[toLine][chipId] = { value: wordValue, position };
    bankChip.classList.add('used');
    
    renderLineZone(toLine);
  }

  function returnWordToBank(linelevelIndex, originalId) {
    const data = lineStates[linelevelIndex][originalId];
    if (!data) return;
    
    delete lineStates[linelevelIndex][originalId];
    
    const bankChip = document.getElementById(originalId);
    if (bankChip) bankChip.classList.remove('used');
    
    // إعادة ترتيب المواقع
    const remainingWords = Object.entries(lineStates[linelevelIndex]);
    remainingWords.sort((a, b) => a[1].position - b[1].position);
    remainingWords.forEach(([id, wordData], newPos) => {
      wordData.position = newPos;
    });
    
    renderLineZone(linelevelIndex);
  }

  function checkAllLines() {
    const r = ROUNDS[levelIndex];
    let allCorrect = true;
    
    r.lines.forEach((line, linelevelIndex) => {
      const zone = document.getElementById(`zone-${linelevelIndex}`);
      const lineContainer = zone.closest('.single-line');
      
      // تجميع الكلمات بالترتيب
      const words = lineStates[linelevelIndex];
      const sortedWords = Object.entries(words).sort((a, b) => a[1].position - b[1].position);
      const userAnswer = sortedWords.map(([_, data]) => data.value).join(' ');
      
      // إزالة التأثيرات السابقة
      lineContainer.classList.remove('correct', 'incorrect');
      zone.classList.remove('correct', 'incorrect');
      
      // التحقق من الإجابة
      if (userAnswer.toLowerCase() === line.answer.toLowerCase()) {
        lineContainer.classList.add('correct');
        zone.classList.add('correct');
      } else {
        lineContainer.classList.add('incorrect');
        zone.classList.add('incorrect');
        allCorrect = false;
      }
    });
    
    if (allCorrect) {
      handleCorrect(stage.querySelector('.lines-container'));
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      // اهتزاز البطاقة
      const card = document.getElementById('invite-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 400);
    }
  }

  // --- منطق المرحلة الثانية: Guided Typing ---
  function checkPhase2() {
    const r = ROUNDS[levelIndex];
    const inputs = stage.querySelectorAll('.blank-input');
    let allCorrect = true;
    let firstWrong = null;

    inputs.forEach((input, i) => {
      const userVal = input.value.trim().toLowerCase();
      const correctVal = r.blanks[i].answer.toLowerCase();
      
      input.classList.remove('correct', 'incorrect');
      
      if (userVal === correctVal) {
        input.classList.add('correct');
      } else {
        input.classList.add('incorrect');
        allCorrect = false;
        if (!firstWrong) firstWrong = input;
      }
    });

    if (allCorrect) {
      handleCorrect(stage.querySelector('.typing-invitation'));
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      if (firstWrong) {
        firstWrong.classList.add('shake');
        setTimeout(() => firstWrong.classList.remove('shake'), 400);
      }
    }
  }

  // --- منطق المرحلة الثالثة: Independent Writing ---
  function checkPhase3() {
    const r = ROUNDS[levelIndex];
    const textarea = stage.querySelector('.invite-textarea');
    const text = textarea.value.toLowerCase();
    
    // التحقق المرن: التأكد من وجود الكلمات المفتاحية الأساسية في النص
    const isCorrect = r.requiredKeywords.every(keyword => text.includes(keyword.toLowerCase()));
    
    if (isCorrect && text.split(/\s+/).length >= 10) {
      handleCorrect(textarea);
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      textarea.classList.add('shake');
      setTimeout(() => textarea.classList.remove('shake'), 400);
    }
  }

  // --- دوال المعالجة المشتركة ---
  function handleCorrect(element) {
    if (window.GameHub) window.GameHub.playSound("correct");
    if (element && window.GameHub) {
      const rect = element.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // تشغيل أنيميشن الظرف
    const envelope = document.getElementById('envelope-anim');
    envelope.style.display = 'flex';
    
    setTimeout(() => {
      levelIndex++;
      if (levelIndex >= ROUNDS.length) {
        if (window.GameHub) {
          window.GameHub.showComplete("Master Inviter!", "You successfully wrote and sent all the invitations!");
        } else {
          alert("Master Inviter! You successfully wrote and sent all the invitations!");
        }
      } else {
        envelope.style.display = 'none';
        build();
      }
    }, 1200);
  }

  // بدء اللعبة
  build();
};