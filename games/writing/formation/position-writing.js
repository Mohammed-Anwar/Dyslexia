// Writing > Formation > The Password (Position Writing)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Pool of 3-letter words for the game
  const WORD_POOL = [
    "CAT", "DOG", "SUN", "BAT", "PIG", "FOX", "RED", "PEN", "HAT", "CUP",
    "MAP", "BED", "BUS", "CAR", "BOX", "MUG", "NET", "WEB", "LOG", "ANT",
    "LIP", "LEG", "TEN", "SIX", "ZIP", "POT", "PAN", "JAM", "NUT", "TOY"
  ];

  let levelIndex = 0;
  const MAX_LEVELS = 15;
  let currentWord = "";
  let missingIndex = 0;
  let gameWords = [];
  
  // Dragging state
  let draggedEl = null;
  let startX = 0, startY = 0;
  let initialX = 0, initialY = 0;

  // 1. Shuffle and pick 15 words
  function initWords() {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    gameWords = shuffled.slice(0, MAX_LEVELS);
  }

  // Text-to-Speech function
  window.playWordAudio = function(word) {
    if (window.GameHub && typeof window.GameHub.speak === 'function') {
      window.GameHub.speak(word, 'en-US');
    }
  };

  function renderLevel() {
    if (levelIndex === 0) initWords();
    currentWord = gameWords[levelIndex];

    // Determine missing index based on the 15-round breakdown
    if (levelIndex < 5) {
      missingIndex = 0; // Rounds 1-5: First letter
    } else if (levelIndex < 10) {
      missingIndex = 2; // Rounds 6-10: Last letter
    } else {
      missingIndex = 1; // Rounds 11-15: Middle letter
    }

    const correctLetter = currentWord[missingIndex];
    
    // Generate options (1 correct, 2 random distractors)
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let options = [correctLetter];
    while (options.length < 3) {
      const randChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!options.includes(randChar)) options.push(randChar);
    }
    options = options.sort(() => 0.5 - Math.random());

    stage.innerHTML = `
      <style>
        /* الاعتماد على متغيرات الموقع الأساسية */
        .pw-header { display: flex; justify-content: space-between; width: 100%; max-width: 400px; font-weight: bold; color: var(--text-dark); margin-bottom: 10px; }
        .pw-title { font-size: 1.2rem; }
        .pw-round { font-size: 1.1rem; background: #E2E8F0; padding: 4px 12px; border-radius: 12px; color: var(--text-muted); }
        
        .pw-lock-screen { display: flex; gap: 15px; margin: 30px 0; padding: 20px; background: #F7FAFC; border-radius: 16px; box-shadow: inset 0 4px 6px rgba(0,0,0,0.3); }
        .pw-slot { width: 60px; height: 80px; background: rgba(255,255,255,0.1); border: 3px solid var(--text-muted); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: var(--text-dark); transition: var(--transition); }
        .pw-slot.empty { border: 3px dashed var(--text-muted); color: transparent; }
        
        .pw-options { display: flex; gap: 20px; margin-top: 20px; }
        .pw-letter { width: 60px; height: 60px; background: white; border: 3px solid #E2E8F0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: var(--text-dark); cursor: grab; box-shadow: 0 4px 0 #CBD5E0; touch-action: none; position: relative; z-index: 10; transition: border-color 0.2s; }
        .pw-letter:hover { border-color: var(--primary-blue); }
        .pw-letter.dragging { z-index: 100; cursor: grabbing; box-shadow: 0 10px 15px rgba(0,0,0,0.2); transition: none; }
        
        /* Success Animation using site's primary green */
        .success-flash .pw-slot { background: var(--primary-green) !important; border-color: white !important; color: white !important; }
      </style>

      <!-- استخدام كلاس cd-wrap الخاص بموقعك -->
      <div class="cd-wrap">
        <div class="pw-header">
          <div class="pw-title">The Password</div>
          <div class="pw-round">Round ${levelIndex + 1}/${MAX_LEVELS}</div>
        </div>

        <!-- استخدام كلاس game-btn الخاص بموقعك -->
        <button class="game-btn" onclick="window.playWordAudio('${currentWord}')">
          🔊 Listen
        </button>

        <div class="pw-lock-screen" id="pw-lock">
          ${[0, 1, 2].map(i => `
            <div class="pw-slot ${i === missingIndex ? 'empty target-slot' : ''}" id="slot-${i}">
              ${i === missingIndex ? '?' : currentWord[i]}
            </div>
          `).join('')}
        </div>

        <div class="pw-options">
          ${options.map(letter => `
            <div class="pw-letter" data-char="${letter}">${letter}</div>
          `).join('')}
        </div>
      </div>
    `;

    setTimeout(() => window.playWordAudio(currentWord), 500);
    bindDragEvents();
  }

  function bindDragEvents() {
    const letters = stage.querySelectorAll('.pw-letter');
    
    const startDrag = (e) => {
      e.preventDefault();
      if (draggedEl) return;
      
      draggedEl = e.target;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      draggedEl.classList.add('dragging');
      draggedEl.style.transform = `translate(0px, 0px)`;
    };

    letters.forEach(l => {
      l.addEventListener('mousedown', startDrag);
      l.addEventListener('touchstart', startDrag, { passive: false });
    });
  }

  const handleMove = (e) => {
    if (!draggedEl) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    draggedEl.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleEnd = (e) => {
    if (!draggedEl) return;
    
    const targetSlot = stage.querySelector('.target-slot');
    const targetRect = targetSlot.getBoundingClientRect();
    const letterRect = draggedEl.getBoundingClientRect();

    const letterCenterX = letterRect.left + letterRect.width / 2;
    const letterCenterY = letterRect.top + letterRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(letterCenterX - targetCenterX, letterCenterY - targetCenterY);

    if (distance < 50) { 
      const char = draggedEl.getAttribute('data-char');
      if (char === currentWord[missingIndex]) {
        targetSlot.innerHTML = char;
        targetSlot.classList.remove('empty');
        draggedEl.style.display = 'none';
        
        handleSuccess(e);
      } else {
        draggedEl.style.transform = `translate(0px, 0px)`;
      }
    } else {
      draggedEl.style.transform = `translate(0px, 0px)`;
    }

    draggedEl.classList.remove('dragging');
    draggedEl = null;
  };

  function handleSuccess(e) {
    const lockScreen = document.getElementById('pw-lock');
    lockScreen.classList.add('success-flash');
    
    if(window.GameHub) {
      window.GameHub.playSound("correct");
      const clientX = e && e.changedTouches ? e.changedTouches[0].clientX : (e ? e.clientX : window.innerWidth / 2);
      const clientY = e && e.changedTouches ? e.changedTouches[0].clientY : (e ? e.clientY : window.innerHeight / 2);
      window.GameHub.triggerVFX(clientX, clientY);
    }
    
    window.playWordAudio(currentWord);

    setTimeout(() => {
      levelIndex++;
      if (levelIndex >= MAX_LEVELS) {
        if(window.GameHub) {
          window.GameHub.showComplete("Password Accepted!", "You successfully unlocked all words!");
        } else {
          alert("Password Accepted! You successfully unlocked all words!");
        }
      } else {
        renderLevel();
      }
    }, 1500);
  }

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("mouseup", handleEnd);
  window.addEventListener("touchend", handleEnd);

  renderLevel();
};