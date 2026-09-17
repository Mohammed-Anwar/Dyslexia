// Writing > Sentences > Word arrangement (Drag & Drop Version)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 Levels with Scaffolding (3 phases)
  const gameData = [
    // Phase 1: 3-word sentences (Levels 1-5) - Building confidence
    { words: ["I", "like", "apples."] },
    { words: ["He", "is", "tall."] },
    { words: ["Ali", "plays", "tennis."] },
    { words: ["She", "reads", "books."] },
    { words: ["We", "are", "happy."] },
    
    // Phase 2: 4-word sentences with adjectives (Levels 6-10)
    { words: ["The", "cat", "is", "sleeping."] },
    { words: ["I", "have", "big", "eyes."] },
    { words: ["This", "is", "my", "bag."] },
    { words: ["He", "is", "my", "brother."] },
    { words: ["I", "eat", "healthy", "food."] },
    
    // Phase 3: 5-word sentences or questions (Levels 11-15) - Higher challenge
    { words: ["She", "is", "my", "best", "friend."] },
    { words: ["What", "is", "your", "favorite", "color?"] },
    { words: ["I", "live", "in", "a", "house."] },
    { words: ["Farmers", "grow", "rice", "in", "Egypt."] },
    { words: ["Do", "you", "like", "ice", "cream?"] }
  ];

  let levelIndex = 0;

  // Drag and Drop State Variables
  let draggedEl = null;
  let originParent = null;
  let shiftX = 0;
  let shiftY = 0;

  function renderLevel() {
    const r = gameData[levelIndex];
    // Shuffle words for the pool
    const shuffled = [...r.words].sort(() => Math.random() - 0.5);
    
    stage.innerHTML = `
      <style>
        .wa-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          padding: 30px;
          width: 100%;
          height: 100%;
          user-select: none;
          -webkit-user-select: none;
        }
        .wa-instructions {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 1.1rem;
          text-align: center;
        }
        .wa-line {
          width: min(600px, 95%);
          min-height: 80px;
          border: 3px dashed var(--primary-blue);
          border-radius: 16px;
          background-color: rgba(74, 144, 226, 0.05);
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 12px;
        }
        .wa-slot {
          width: 110px;
          height: 55px;
          border: 2px dashed #CBD5E0;
          border-radius: 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .wa-slot:empty {
          background: repeating-linear-gradient(
            45deg,
            #f8fafc,
            #f8fafc 10px,
            #ffffff 10px,
            #ffffff 20px
          );
        }
        .wa-pool {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 600px;
          min-height: 70px;
          padding: 15px;
          background: var(--card-bg);
          border-radius: 16px;
        }
        .wa-card {
          padding: 12px 24px;
          border-radius: 14px;
          background: white;
          border: 3px solid var(--primary-green);
          color: var(--primary-green);
          font-weight: 800;
          font-size: 1.25rem;
          cursor: grab;
          touch-action: none; /* Prevents scrolling while dragging on mobile */
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.1s, box-shadow 0.1s;
          text-align: center;
        }
        .wa-card:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        .wa-card.locked {
          border-color: var(--primary-blue);
          color: white;
          background: var(--primary-blue);
          cursor: default;
          box-shadow: none;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
          0% { transform: scale(0.8); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .wa-card.shake {
          animation: shake 0.4s ease-in-out;
          border-color: #E53E3E;
          color: #E53E3E;
        }
      </style>
      <div class="wa-wrap">
        <p class="wa-instructions">Level ${levelIndex + 1} / ${gameData.length} — Drag words into the boxes in the right order</p>
        <div class="wa-line" id="wa-line"></div>
        <div class="wa-pool" id="wa-pool"></div>
      </div>
    `;

    // Create slots
    const line = document.getElementById("wa-line");
    r.words.forEach(() => {
      const slot = document.createElement("div");
      slot.className = "wa-slot";
      line.appendChild(slot);
    });

    // Create draggable cards
    const pool = document.getElementById("wa-pool");
    shuffled.forEach(word => {
      const card = document.createElement("div");
      card.className = "wa-card";
      card.innerText = word;
      
      // Pointer events for unified Mouse & Touch drag support
      card.addEventListener('pointerdown', onPointerDown);
      
      pool.appendChild(card);
    });
  }

  // --- Drag & Drop Logic ---
  function onPointerDown(e) {
    // Only allow dragging if it's a card and not already locked
    if (!e.target.classList.contains('wa-card') || e.target.classList.contains('locked')) return;
    
    e.preventDefault(); // Prevent text selection and page scroll
    draggedEl = e.target;
    originParent = draggedEl.parentElement;

    const rect = draggedEl.getBoundingClientRect();
    shiftX = e.clientX - rect.left;
    shiftY = e.clientY - rect.top;

    // Move element to body to allow free dragging across the screen
    draggedEl.style.position = 'fixed';
    draggedEl.style.left = rect.left + 'px';
    draggedEl.style.top = rect.top + 'px';
    draggedEl.style.zIndex = 1000;
    draggedEl.style.width = rect.width + 'px'; // Maintain size
    
    document.body.appendChild(draggedEl);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!draggedEl) return;
    e.preventDefault();
    draggedEl.style.left = (e.clientX - shiftX) + 'px';
    draggedEl.style.top = (e.clientY - shiftY) + 'px';
  }

  function onPointerUp(e) {
    if (!draggedEl) return;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // Temporarily hide dragged element to find what's underneath it
    draggedEl.style.display = 'none';
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    draggedEl.style.display = '';

    const slot = elemBelow ? elemBelow.closest('.wa-slot') : null;

    // Check if dropped inside an EMPTY slot
    if (slot && !slot.hasChildNodes()) {
      const slotIndex = Array.from(slot.parentElement.children).indexOf(slot);
      const word = draggedEl.innerText;
      const expected = gameData[levelIndex].words[slotIndex];

      if (word === expected) {
        // Correct placement
        if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("correct");
        if (window.GameHub && window.GameHub.triggerVFX) window.GameHub.triggerVFX(e.clientX, e.clientY);
        
        // Snap to slot
        draggedEl.style.position = 'static';
        draggedEl.style.zIndex = '';
        draggedEl.style.width = '';
        draggedEl.style.left = '';
        draggedEl.style.top = '';
        draggedEl.classList.add('locked');
        slot.appendChild(draggedEl);
        
        checkWinCondition();
      } else {
        // Wrong placement
        if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("wrong");
        animateShake();
        resetDrag();
      }
    } else {
      // Dropped outside valid slot
      resetDrag();
    }
    
    draggedEl = null;
  }

  function resetDrag() {
    draggedEl.style.position = 'static';
    draggedEl.style.zIndex = '';
    draggedEl.style.width = '';
    draggedEl.style.left = '';
    draggedEl.style.top = '';
    originParent.appendChild(draggedEl);
  }

  function animateShake() {
    draggedEl.classList.add('shake');
    setTimeout(() => {
      draggedEl.classList.remove('shake');
    }, 400);
  }

  function checkWinCondition() {
    const lockedCards = document.querySelectorAll('.wa-card.locked');
    if (lockedCards.length === gameData[levelIndex].words.length) {
      levelIndex++;
      setTimeout(() => {
        if (levelIndex >= gameData.length) {
          if (window.GameHub && window.GameHub.showComplete) {
            window.GameHub.showComplete("Sentence Builder!", "You arranged every sentence in the right order. Amazing job!");
          }
        } else {
          renderLevel();
        }
      }, 800);
    }
  }

  // Start the game
  renderLevel();
};