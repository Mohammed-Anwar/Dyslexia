// Writing > Expression > Short story (Interactive Storybook)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const gameData = [
    // --- Phase 1: Story Structure (gameData 1-5) ---
    { 
      phase: 1, type: 'unscramble',
      storyTitle: "The Growing Plant",
      panels: ["🌱", "🌤️💧", "🌸"],
      sentences: [
        { text: "Finally, it becomes a beautiful flower.", order: 3 },
        { text: "First, I plant a small seed.", order: 1 },
        { text: "Then, the rain falls.", order: 2 }
      ]
    },
    { 
      phase: 1, type: 'unscramble',
      storyTitle: "The Butterfly",
      panels: ["🐛", "🛏️", "🦋"],
      sentences: [
        { text: "Then, it sleeps in a small bed.", order: 2 },
        { text: "Finally, it becomes a butterfly.", order: 3 },
        { text: "First, the caterpillar eats leaves.", order: 1 }
      ]
    },
    { 
      phase: 1, type: 'unscramble',
      storyTitle: "Baking a Cake",
      panels: ["🌾", "🔥", "🎂"],
      sentences: [
        { text: "Finally, we eat the yummy cake.", order: 3 },
        { text: "First, we mix flour and eggs.", order: 1 },
        { text: "Then, we bake it in the oven.", order: 2 }
      ]
    },
    { 
      phase: 1, type: 'unscramble',
      storyTitle: "The Soccer Game",
      panels: ["👦", "⚽", "🏆"],
      sentences: [
        { text: "Finally, he wins a big trophy.", order: 3 },
        { text: "First, the boy goes to the club.", order: 1 },
        { text: "Then, he plays soccer very well.", order: 2 }
      ]
    },
    { 
      phase: 1, type: 'unscramble',
      storyTitle: "The Hungry Bird",
      panels: ["🐤", "🪱", "😊"],
      sentences: [
        { text: "Finally, it is full and happy.", order: 3 },
        { text: "First, the bird is very hungry.", order: 1 },
        { text: "Then, it finds a worm to eat.", order: 2 }
      ]
    },

    // --- Phase 2: Guided Story Completion (gameData 6-10) ---
    { 
      phase: 2, type: 'typing',
      storyTitle: "Winning the Trophy",
      panels: ["👦", "⚽", "🏆"],
      textParts: ["First, the ", " goes to the club. Then, he plays ", " very well. Finally, he wins a big ", "."],
      blanks: [
        { answer: "boy", hint: "👦" },
        { answer: "soccer", hint: "⚽" },
        { answer: "trophy", hint: "🏆" }
      ]
    },
    { 
      phase: 2, type: 'typing',
      storyTitle: "The Hungry Bird",
      panels: ["🐤", "🪱", "😊"],
      textParts: ["First, the ", " is very hungry. Then, it finds a ", " to eat. Finally, it is full and ", "."],
      blanks: [
        { answer: "bird", hint: "🐤" },
        { answer: "worm", hint: "🪱" },
        { answer: "happy", hint: "😊" }
      ]
    },
    { 
      phase: 2, type: 'typing',
      storyTitle: "Building a Sandcastle",
      panels: ["⛱️", "👧", "🏰"],
      textParts: ["First, the girl goes to the ", ". Then, she builds a sand", " with her hands. Finally, she has a beautiful ", "."],
      blanks: [
        { answer: "beach", hint: "⛱️" },
        { answer: "castle", hint: "🏰" },
        { answer: "castle", hint: "🏰" }
      ]
    },
    { 
      phase: 2, type: 'typing',
      storyTitle: "The Lost Dog",
      panels: ["🐕", "❓", "🏠"],
      textParts: ["First, the dog is ", ". Then, he cries because he is lost. Finally, a boy takes him ", "."],
      blanks: [
        { answer: "lost", hint: "🐕" },
        { answer: "home", hint: "🏠" }
      ]
    },
    { 
      phase: 2, type: 'typing',
      storyTitle: "Making Lemonade",
      panels: ["🍋", "🥤", "😋"],
      textParts: ["First, we squeeze the ", ". Then, we add water and sugar. Finally, we drink cold ", "."],
      blanks: [
        { answer: "lemons", hint: "🍋" },
        { answer: "lemonade", hint: "🥤" }
      ]
    },

    // --- Phase 3: Independent Story Writing (gameData 11-15) ---
    { 
      phase: 3, type: 'writing',
      storyTitle: "The Lost Dog",
      panels: ["🐕", "❓", "🏠"],
      wordBank: ["First", "Then", "Finally", "dog", "lost", "walks", "cries", "boy", "finds", "home", "happy"],
      requiredKeywords: ["dog", "lost", "home"]
    },
    { 
      phase: 3, type: 'writing',
      storyTitle: "Building a Sandcastle",
      panels: ["🏖️", "👧🏰", "⭐"],
      wordBank: ["First", "Then", "Finally", "beach", "sand", "castle", "girl", "builds", "beautiful", "big"],
      requiredKeywords: ["beach", "sand", "castle"]
    },
    { 
      phase: 3, type: 'writing',
      storyTitle: "Sick and Better",
      panels: ["👧", "👨‍⚕️💊", "🎈"],
      wordBank: ["First", "Then", "Finally", "sick", "bed", "doctor", "medicine", "better", "plays", "happy"],
      requiredKeywords: ["sick", "doctor", "better"]
    },
    { 
      phase: 3, type: 'writing',
      storyTitle: "The Trip",
      panels: ["🧳", "✈️", "🏖️☀️"],
      wordBank: ["First", "Then", "Finally", "pack", "bag", "plane", "fly", "beach", "sun", "vacation"],
      requiredKeywords: ["plane", "beach", "vacation"]
    },
    { 
      phase: 3, type: 'writing',
      storyTitle: "The Treasure Hunt",
      panels: ["🗺️", "🚢", "💰"],
      wordBank: ["First", "Then", "Finally", "map", "treasure", "ship", "sail", "find", "gold", "chest"],
      requiredKeywords: ["treasure", "ship", "gold"]
    }
  ];

  let levelIndex = 0;
  let currentOrder = [];
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

  // Confetti Effect for Final Celebration
  function launchConfetti() {
    const colors = ['#4A90E2', '#48BB78', '#F6E05E', '#F56565', '#9F7AEA'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        
        confetti.animate([
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(${window.innerHeight}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
          duration: duration * 1000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
      }, i * 20);
    }
  }

  function renderStoryPages() {
    const container = document.getElementById('story-pages');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentOrder.length === 0) {
      container.innerHTML = '<div class="empty-pages">Drag sentences here to build the story...</div>';
      return;
    }
    
    // Sort by position
    const sortedSentences = [...currentOrder].sort((a, b) => a.position - b.position);
    
    sortedSentences.forEach((item, index) => {
      const page = document.createElement('div');
      page.className = 'story-page';
      page.innerHTML = `
        <div class="page-number">Page ${index + 1}</div>
        <div class="page-text">${item.text}</div>
        <button class="remove-btn" onclick="removeSentence(${index})">×</button>
      `;
      container.appendChild(page);
    });
  }

  function renderLevel() {
    const r = gameData[levelIndex];
    const phaseName = r.phase === 1 ? "Phase 1: Build the Story" : r.phase === 2 ? "Phase 2: Complete the Story" : "Phase 3: Write Your Story";
    
    currentOrder = [];
    
    let contentHTML = '';

    if (r.phase === 1) {
      const shuffledSentences = [...r.sentences].sort(() => Math.random() - 0.5);
      contentHTML = `
        <div class="story-book">
          <div class="book-pages" id="story-pages">
            <div class="empty-pages">Drag sentences here to build the story...</div>
          </div>
        </div>
        <div class="sentence-bank" id="sentence-bank">
          ${shuffledSentences.map((s, i) => `
            <div class="sentence-chip" draggable="true" data-index="${i}" data-text="${s.text}">
              ${s.text}
            </div>
          `).join('')}
        </div>
        <button class="game-btn success check-btn" style="margin-top:20px;">Check Story Order</button>
      `;
    } else if (r.phase === 2) {
      let html = '<div class="typing-story">';
      let blankIndex = 0;
      r.textParts.forEach((part) => {
        html += `<span class="story-text">${part}</span>`;
        if (blankIndex < r.blanks.length) {
          html += `
            <div class="blank-wrapper">
              <input type="text" class="story-blank" data-index="${blankIndex}" placeholder="?" autocomplete="off">
              <span class="blank-hint" onclick="speakText('${r.blanks[blankIndex].answer}')" title="Listen">${r.blanks[blankIndex].hint}</span>
            </div>
          `;
          blankIndex++;
        }
      });
      html += '</div><button class="game-btn success check-btn" style="margin-top:20px;">Check Story</button>';
      contentHTML = html;
    } else if (r.phase === 3) {
      contentHTML = `
        <div class="visual-clues">
          ${r.panels.map(p => `<span class="clue-emoji">${p}</span>`).join('')}
        </div>
        <div class="story-book">
          <textarea class="story-textarea" placeholder="Write your story here...&#10;First,...&#10;Then,...&#10;Finally,..." rows="8"></textarea>
        </div>
        <div class="word-bank-container">
          <div class="wb-title">Word Bank:</div>
          <div class="wb-chips">
            ${r.wordBank.map(w => `<span class="wb-chip">${w}</span>`).join('')}
          </div>
        </div>
        <button class="game-btn success check-btn" style="margin-top:15px;">Finish Story</button>
      `;
    }

    stage.innerHTML = `
      <style>
        .sb-wrap { display:flex; flex-direction:column; align-items:center; gap:15px; padding:20px; width:100%; height:100%; font-family: 'Segoe UI', sans-serif; user-select: none; overflow-y: auto; }
        .phase-badge { font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary-blue); }
        .round-badge { font-size:0.9rem; color:var(--text-muted); font-weight:600; }
        
        .story-header {
          width:min(700px, 95%); display:flex; justify-content:space-between; align-items:center;
          padding:15px 20px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius:16px; color:white; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        }
        .story-title { font-size:1.3rem; font-weight:700; display:flex; align-items:center; gap:10px; }
        .voice-btn { background:rgba(255,255,255,0.2); border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:1.2rem; transition:var(--transition); color:white; }
        .voice-btn:hover { background:rgba(255,255,255,0.3); transform:scale(1.1); }

        .visual-clues { display:flex; gap:15px; padding:15px; background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .clue-emoji { font-size:2.5rem; animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Story Book Design */
        .story-book {
          width:min(650px, 95%); background:linear-gradient(to right, #fff9f0 0%, #fff 50%, #fff9f0 100%);
          border:3px solid #E2E8F0; border-radius:20px; padding:30px; box-shadow:0 8px 30px rgba(0,0,0,0.1);
          position:relative; min-height:200px;
        }
        .story-book::before {
          content:''; position:absolute; left:50%; top:0; bottom:0; width:3px;
          background:linear-gradient(to bottom, transparent, #CBD5E0, transparent);
          transform:translateX(-50%);
        }

        /* Phase 1: Drag & Drop */
        .book-pages { min-height:150px; display:flex; flex-direction:column; gap:12px; }
        .empty-pages {
          text-align:center; color:#A0AEC0; font-style:italic; padding:40px;
          border:3px dashed #CBD5E0; border-radius:12px; background:rgba(255,255,255,0.5);
        }
        .story-page {
          background:white; border:2px solid #E2E8F0; border-radius:12px; padding:15px 20px;
          display:flex; align-items:center; gap:15px; box-shadow:0 2px 6px rgba(0,0,0,0.04);
          transition:var(--transition); position:relative;
        }
        .story-page.correct { border-color:var(--primary-green); background:#F0FFF4; }
        .story-page.incorrect { border-color:#E53E3E; background:#FFF5F5; }
        .page-number {
          font-size:0.8rem; font-weight:700; color:var(--primary-blue);
          background:#EBF8FF; padding:4px 10px; border-radius:20px;
        }
        .page-text { flex:1; font-size:1.05rem; color:var(--text-dark); font-weight:600; }
        .remove-btn {
          background:#FED7D7; border:none; color:#C53030; width:28px; height:28px;
          border-radius:50%; cursor:pointer; font-size:1.2rem; line-height:1;
          transition:var(--transition);
        }
        .remove-btn:hover { background:#F56565; color:white; }

        .sentence-bank {
          display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:15px;
          padding:15px; background:#F7FAFC; border-radius:12px;
        }
        .sentence-chip {
          padding:12px 18px; background:white; border:2px solid var(--primary-blue);
          color:var(--primary-blue); border-radius:12px; font-weight:600; cursor:pointer;
          transition:var(--transition); max-width:280px; text-align:center;
        }
        .sentence-chip:hover { background:var(--primary-blue); color:white; transform:translateY(-3px); box-shadow:0 4px 12px rgba(74,144,226,0.3); }
        .sentence-chip.used { opacity:0.3; pointer-events:none; }

        /* Phase 2: Typing */
        .typing-story {
          font-size:1.15rem; line-height:2.4; color:var(--text-dark);
          display:flex; flex-wrap:wrap; align-items:center; gap:8px;
        }
        .story-text { font-weight:600; }
        .blank-wrapper { display:inline-flex; flex-direction:column; align-items:center; gap:5px; }
        .story-blank {
          width:120px; padding:8px 12px; border:none; border-bottom:3px solid var(--primary-blue);
          background:rgba(74,144,226,0.1); font-size:1.1rem; font-weight:700; text-align:center;
          color:var(--text-dark); outline:none; border-radius:6px 6px 0 0;
        }
        .story-blank:focus { border-bottom-color:var(--primary-green); background:rgba(72,187,120,0.1); }
        .story-blank.correct { border-bottom-color:var(--primary-green); background:rgba(72,187,120,0.2); }
        .story-blank.incorrect { border-bottom-color:#E53E3E; background:rgba(229,62,62,0.2); }
        .blank-hint {
          font-size:1.5rem; cursor:pointer; background:#FFFBEA; border:2px solid #F6E05E;
          border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center;
          transition:var(--transition);
        }
        .blank-hint:hover { transform:scale(1.2); background:#F6E05E; }

        /* Phase 3: Writing */
        .story-textarea {
          width:100%; padding:20px; border:2px solid #E2E8F0; border-radius:12px;
          font-size:1.1rem; font-family:inherit; resize:vertical; outline:none;
          transition:var(--transition); background:white; line-height:1.8;
        }
        .story-textarea:focus { border-color:var(--primary-blue); box-shadow:0 0 0 4px rgba(74,144,226,0.1); }
        
        .word-bank-container {
          margin-top:15px; padding:15px; background:#F7FAFC; border-radius:12px;
        }
        .wb-title { font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; }
        .wb-chips { display:flex; flex-wrap:wrap; gap:6px; }
        .wb-chip {
          font-size:0.85rem; padding:6px 12px; background:white; border:1px solid #CBD5E0;
          border-radius:20px; color:var(--text-dark);
        }

        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        /* Final Celebration Overlay */
        .celebration-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.8); display:none;
          flex-direction:column; align-items:center; justify-content:center; z-index:10000;
        }
        .trophy { font-size:6rem; animation: trophyBounce 1s ease-in-out infinite; }
        @keyframes trophyBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(-10deg); }
        }
        .celebration-text {
          color:white; font-size:2.5rem; font-weight:800; text-align:center;
          margin-top:20px; text-shadow:0 4px 12px rgba(0,0,0,0.3);
        }
        .celebration-sub {
          color:#F6E05E; font-size:1.3rem; margin-top:10px;
        }
      </style>

      <div class="sb-wrap">
        <div class="phase-badge">${phaseName}</div>
        <div class="round-badge">Round ${levelIndex + 1} / ${gameData.length}</div>

        <div class="story-header">
          <div class="story-title">📖 ${r.storyTitle}</div>
          <button class="voice-btn" onclick="speakText('${r.storyTitle}')" title="Listen">🔊</button>
        </div>

        <div class="visual-clues">
          ${r.panels.map(p => `<span class="clue-emoji">${p}</span>`).join('')}
        </div>

        ${contentHTML}
      </div>

      <div class="celebration-overlay" id="celebration">
        <div class="trophy">🏆</div>
        <div class="celebration-text">Congratulations!<br>You're a Master Storyteller!</div>
        <div class="celebration-sub">You completed all ${gameData.length} stories!</div>
      </div>
    `;

    const currentLevel = gameData[levelIndex];

    // Voice button
    const voiceBtn = stage.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.addEventListener('click', () => speakText(currentLevel.storyTitle));

    if (currentLevel.phase === 1) {
      const pages = document.getElementById('story-pages');
      const bank = document.getElementById('sentence-bank');
      
      pages.addEventListener('dragover', (e) => { e.preventDefault(); pages.style.background = '#F0FFF4'; });
      pages.addEventListener('dragleave', () => { pages.style.background = ''; });
      pages.addEventListener('drop', (e) => {
        e.preventDefault();
        pages.style.background = '';
        const text = e.dataTransfer.getData('text');
        const index = e.dataTransfer.getData('index');
        if (text) addSentenceToStory(text, index);
      });

      const chips = bank.querySelectorAll('.sentence-chip');
      chips.forEach(chip => {
        chip.addEventListener('dragstart', (e) => {
          isDragging = true;
          e.dataTransfer.setData('text', chip.getAttribute('data-text'));
          e.dataTransfer.setData('index', chip.getAttribute('data-index'));
        });
        chip.addEventListener('dragend', () => { setTimeout(() => { isDragging = false; }, 50); });
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isDragging) { isDragging = false; return; }
          const text = chip.getAttribute('data-text');
          const index = chip.getAttribute('data-index');
          addSentenceToStory(text, index);
        });
      });

      stage.querySelector('.check-btn').addEventListener('click', () => checkStoryOrder());
    } 
    else if (currentLevel.phase === 2) {
      stage.querySelector('.check-btn').addEventListener('click', () => checkTypedStory());
      setTimeout(() => {
        const firstBlank = stage.querySelector('.story-blank');
        if (firstBlank) firstBlank.focus();
      }, 100);
    } 
    else if (currentLevel.phase === 3) {
      stage.querySelector('.check-btn').addEventListener('click', () => checkWrittenStory());
      setTimeout(() => {
        const textarea = stage.querySelector('.story-textarea');
        if (textarea) {
          textarea.focus();
          textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) checkWrittenStory();
          });
        }
      }, 100);
    }
  }

  // --- Phase 1 Functions ---
  function addSentenceToStory(text, originalIndex) {
    const chip = document.querySelector(`.sentence-chip[data-index="${originalIndex}"]`);
    if (!chip || chip.classList.contains('used')) return;
    
    currentOrder.push({
      text: text,
      originalIndex: originalIndex,
      position: currentOrder.length
    });
    
    chip.classList.add('used');
    renderStoryPages();
  }

  window.removeSentence = function(position) {
    const item = currentOrder.find((_, i) => i === position);
    if (!item) return;
    
    currentOrder = currentOrder.filter((_, i) => i !== position);
    
    const chip = document.querySelector(`.sentence-chip[data-index="${item.originalIndex}"]`);
    if (chip) chip.classList.remove('used');
    
    renderStoryPages();
  };

  function checkStoryOrder() {
    const r = gameData[levelIndex];
    const pages = document.querySelectorAll('.story-page');
    
    if (currentOrder.length !== r.sentences.length) {
      alert("Please place all sentences in the story!");
      return;
    }
    
    let allCorrect = true;
    const sortedCorrect = [...r.sentences].sort((a, b) => a.order - b.order);
    
    pages.forEach((page, i) => {
      page.classList.remove('correct', 'incorrect');
      const expectedText = sortedCorrect[i].text;
      const actualText = currentOrder[i].text;
      
      if (actualText === expectedText) {
        page.classList.add('correct');
      } else {
        page.classList.add('incorrect');
        allCorrect = false;
      }
    });
    
    if (allCorrect) {
      handleCorrect(document.querySelector('.story-book'));
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      const book = document.querySelector('.story-book');
      book.classList.add('shake');
      setTimeout(() => book.classList.remove('shake'), 400);
    }
  }

  // --- Phase 2 Functions ---
  function checkTypedStory() {
    const r = gameData[levelIndex];
    const blanks = stage.querySelectorAll('.story-blank');
    let allCorrect = true;
    let firstWrong = null;

    blanks.forEach((blank, i) => {
      const userVal = blank.value.trim().toLowerCase();
      const correctVal = r.blanks[i].answer.toLowerCase();
      
      blank.classList.remove('correct', 'incorrect');
      
      if (userVal === correctVal) {
        blank.classList.add('correct');
      } else {
        blank.classList.add('incorrect');
        allCorrect = false;
        if (!firstWrong) firstWrong = blank;
      }
    });

    if (allCorrect) {
      handleCorrect(stage.querySelector('.typing-story'));
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      if (firstWrong) {
        firstWrong.classList.add('shake');
        setTimeout(() => firstWrong.classList.remove('shake'), 400);
      }
    }
  }

  // --- Phase 3 Functions ---
  function checkWrittenStory() {
    const r = gameData[levelIndex];
    const textarea = stage.querySelector('.story-textarea');
    const text = textarea.value.toLowerCase();
    
    const hasKeywords = r.requiredKeywords.every(kw => text.includes(kw.toLowerCase()));
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const hasThreeSentences = text.split(/[.!?]/).filter(s => s.trim().length > 10).length >= 3;
    
    if (hasKeywords && wordCount >= 20 && hasThreeSentences) {
      handleCorrect(textarea);
    } else {
      if (window.GameHub) window.GameHub.playSound("wrong");
      textarea.classList.add('shake');
      setTimeout(() => textarea.classList.remove('shake'), 400);
      
      let msg = "Your story needs: ";
      if (!hasKeywords) msg += "key words from the pictures, ";
      if (wordCount < 20) msg += "more words (at least 20), ";
      if (!hasThreeSentences) msg += "at least 3 complete sentences";
      alert(msg);
    }
  }

  // --- Common Functions ---
  function handleCorrect(element) {
    if (window.GameHub) window.GameHub.playSound("correct");
    if (element && window.GameHub) {
      const rect = element.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setTimeout(() => {
      levelIndex++;
      if (levelIndex >= gameData.length) {
        launchConfetti();
        const celebration = document.getElementById('celebration');
        celebration.style.display = 'flex';
        
        if (window.GameHub) {
          setTimeout(() => {
            window.GameHub.showComplete(" Master Storyteller! ", `You completed all ${gameData.length} story levels! You are an amazing writer!`);
          }, 2000);
        }
      } else {
        renderLevel();
      }
    }, 800);
  }

  // Start the game
  renderLevel();
};