// Writing > Sentences > Descriptive words (Drag & Drop with Images)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 Levels with 3 Phases
  const gameData = [
    // Phase 1: Single Adjective (Levels 1-5)
    {
      phase: 1,
      image: "active-boy-playing",
      sentenceParts: ["The", "boy plays."],
      blanks: [{ type: "adjective", correct: "active", label: "Describe the boy" }],
      options: ["active", "sleepy", "hungry"]
    },
    {
      phase: 1,
      image: "fast-dog-running",
      sentenceParts: ["The", "dog runs."],
      blanks: [{ type: "adjective", correct: "fast", label: "Describe the dog" }],
      options: ["fast", "slow", "tiny"]
    },
    {
      phase: 1,
      image: "happy-girl-singing",
      sentenceParts: ["The", "girl sings."],
      blanks: [{ type: "adjective", correct: "happy", label: "Describe the girl" }],
      options: ["happy", "sad", "shy"]
    },
    {
      phase: 1,
      image: "healthy-food-plate",
      sentenceParts: ["I like to eat", "food."],
      blanks: [{ type: "adjective", correct: "healthy", label: "Describe the food" }],
      options: ["healthy", "bad", "sweet"]
    },
    {
      phase: 1,
      image: "strong-camel-desert",
      sentenceParts: ["The", "camel lives in the desert."],
      blanks: [{ type: "adjective", correct: "strong", label: "Describe the camel" }],
      options: ["strong", "weak", "small"]
    },

    // Phase 2: Double Description (Levels 6-10)
    {
      phase: 2,
      image: "active-farmer-food",
      sentenceParts: ["The", "farmer grows", "food."],
      blanks: [
        { type: "adjective", correct: "active", label: "Describe the farmer", position: 0 },
        { type: "adjective", correct: "healthy", label: "Describe the food", position: 1 }
      ],
      options: ["active", "healthy", "lazy", "bad"]
    },
    {
      phase: 2,
      image: "tall-boy-red-ball",
      sentenceParts: ["The", "boy has a", "ball."],
      blanks: [
        { type: "adjective", correct: "tall", label: "Describe the boy", position: 0 },
        { type: "adjective", correct: "red", label: "Describe the ball", position: 1 }
      ],
      options: ["tall", "red", "short", "slow"]
    },
    {
      phase: 2,
      image: "hungry-pelican-small-fish",
      sentenceParts: ["A", "pelican eats a", "fish."],
      blanks: [
        { type: "adjective", correct: "hungry", label: "Describe the pelican", position: 0 },
        { type: "adjective", correct: "small", label: "Describe the fish", position: 1 }
      ],
      options: ["hungry", "small", "dry", "big"]
    },
    {
      phase: 2,
      image: "strong-camel-long-legs",
      sentenceParts: ["The", "camel has", "legs."],
      blanks: [
        { type: "adjective", correct: "strong", label: "Describe the camel", position: 0 },
        { type: "adjective", correct: "long", label: "Describe the legs", position: 1 }
      ],
      options: ["strong", "long", "weak", "short"]
    },
    {
      phase: 2,
      image: "beautiful-flower-green-leaves",
      sentenceParts: ["Look at the", "flower with", "leaves."],
      blanks: [
        { type: "adjective", correct: "beautiful", label: "Describe the flower", position: 0 },
        { type: "adjective", correct: "green", label: "Describe the leaves", position: 1 }
      ],
      options: ["beautiful", "green", "ugly", "fast"]
    },

    // Phase 3: Error Detection (Levels 11-15)
    {
      phase: 3,
      image: "fennec-fox-big-ears",
      sentenceParts: ["The fennec fox has", "ears."],
      wrongWord: "small",
      correctWord: "big",
      blanks: [{ type: "adjective", correct: "big", label: "Fix the sentence" }],
      options: ["big", "tiny", "short"]
    },
    {
      phase: 3,
      image: "cold-juice-glass",
      sentenceParts: ["I like to drink", "juice."],
      wrongWord: "hot",
      correctWord: "cold",
      blanks: [{ type: "adjective", correct: "cold", label: "Fix the sentence" }],
      options: ["cold", "dry", "bad"]
    },
    {
      phase: 3,
      image: "strong-camel-carrying",
      sentenceParts: ["The", "camel carries heavy things."],
      wrongWord: "weak",
      correctWord: "strong",
      blanks: [{ type: "adjective", correct: "strong", label: "Fix the sentence" }],
      options: ["strong", "lazy", "fast"]
    },
    {
      phase: 3,
      image: "fast-rabbit-winning",
      sentenceParts: ["The", "rabbit wins the race."],
      wrongWord: "slow",
      correctWord: "fast",
      blanks: [{ type: "adjective", correct: "fast", label: "Fix the sentence" }],
      options: ["fast", "tall", "sad"]
    },
    {
      phase: 3,
      image: "dangerous-snake-attacking",
      sentenceParts: ["The", "snake bites the animal."],
      wrongWord: "helpful",
      correctWord: "dangerous",
      blanks: [{ type: "adjective", correct: "dangerous", label: "Fix the sentence" }],
      options: ["dangerous", "kind", "active"]
    }
  ];

  let levelIndex = 0;
  let draggedEl = null;
  let originParent = null;
  let shiftX = 0;
  let shiftY = 0;
  let placedWords = {};
  let wrongWordRemoved = false;

  // Image mapping (using emoji as placeholders - replace with actual images)
  const IMAGES = {
    "active-boy-playing": "🏃",
    "fast-dog-running": "🐕",
    "happy-girl-singing": "🎤",
    "healthy-food-plate": "",
    "strong-camel-desert": "🐪",
    "active-farmer-food": "👨‍🌾",
    "tall-boy-red-ball": "⚽",
    "hungry-pelican-small-fish": "",
    "strong-camel-long-legs": "🐫",
    "beautiful-flower-green-leaves": "🌸",
    "fennec-fox-big-ears": "🦊",
    "cold-juice-glass": "🧃",
    "strong-camel-carrying": "🐪",
    "fast-rabbit-winning": "🐇",
    "dangerous-snake-attacking": "🐍"
  };

  function renderLevel() {
    const r = gameData[levelIndex];
    placedWords = {};
    wrongWordRemoved = false;

    stage.innerHTML = `
      <style>
        .dw-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          width: 100%;
          height: 100%;
          user-select: none;
          -webkit-user-select: none;
        }
        .dw-image-container {
          width: 100%;
          max-width: 500px;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .dw-sentence-container {
          width: min(600px, 95%);
          padding: 25px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          min-height: 80px;
        }
        .dw-blank {
          min-width: 120px;
          height: 50px;
          border: 3px dashed var(--primary-blue);
          border-radius: 12px;
          background: rgba(74, 144, 226, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .dw-blank.filled {
          border-style: solid;
          border-color: var(--primary-green);
          background: var(--primary-green);
          color: white;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .dw-wrong-word {
          padding: 8px 16px;
          background: #FED7D7;
          color: #E53E3E;
          border-radius: 8px;
          border: 2px solid #E53E3E;
          cursor: grab;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .dw-trash-zone {
          width: 100px;
          height: 100px;
          border: 3px dashed #E53E3E;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(229, 62, 62, 0.1);
          color: #E53E3E;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .dw-trash-zone.drag-over {
          background: rgba(229, 62, 62, 0.3);
          transform: scale(1.1);
        }
        .dw-pool {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 600px;
          padding: 20px;
          background: var(--card-bg);
          border-radius: 16px;
          min-height: 80px;
        }
        .dw-card {
          padding: 14px 28px;
          border-radius: 14px;
          background: white;
          border: 3px solid var(--primary-green);
          color: var(--primary-green);
          font-weight: 800;
          font-size: 1.2rem;
          cursor: grab;
          touch-action: none;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .dw-card:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        .dw-card.placed {
          border-color: var(--primary-blue);
          color: white;
          background: var(--primary-blue);
          cursor: default;
          box-shadow: none;
        }
        .dw-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 10px;
          text-align: center;
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .dw-card.shake {
          animation: shake 0.4s ease-in-out;
          border-color: #E53E3E;
          color: #E53E3E;
        }
      </style>
      <div class="dw-wrap">
        <p style="color:var(--text-muted);font-weight:700;">Level ${levelIndex + 1} / ${gameData.length} — Phase ${r.phase}</p>
        <div class="dw-image-container">${IMAGES[r.image] || "️"}</div>
        <div class="dw-sentence-container" id="dw-sentence"></div>
        ${r.phase === 3 ? '<div class="dw-trash-zone" id="dw-trash">🗑️<br><small>Trash</small></div>' : ''}
        <div class="dw-label">${r.phase === 3 ? "Drag the wrong word to trash, then fix the sentence" : "Drag words into the blanks"}</div>
        <div class="dw-pool" id="dw-pool"></div>
      </div>
    `;

    buildSentence(r);
    buildOptions(r);

    if (r.phase === 3) {
      setupTrashZone();
    }
  }

  function buildSentence(r) {
    const container = document.getElementById("dw-sentence");
    
    if (r.phase === 3) {
      // Phase 3: Show sentence with wrong word highlighted
      r.sentenceParts.forEach((part, i) => {
        const span = document.createElement("span");
        span.textContent = part + " ";
        container.appendChild(span);
        
        if (i === 0) {
          const wrongSpan = document.createElement("span");
          wrongSpan.className = "dw-wrong-word";
          wrongSpan.textContent = r.wrongWord;
          wrongSpan.draggable = true;
          wrongSpan.dataset.wrongWord = "true";
          container.appendChild(wrongSpan);
          
          // Make it draggable
          wrongSpan.addEventListener('pointerdown', onPointerDown);
        }
      });
    } else {
      // Phase 1 & 2: Show sentence with blanks
      r.sentenceParts.forEach((part, i) => {
        const span = document.createElement("span");
        span.textContent = part + " ";
        container.appendChild(span);
        
        // Add blank after this part if needed
        const blank = r.blanks.find(b => b.position === i || (b.position === undefined && i === 0));
        if (blank && (blank.position === i || (blank.position === undefined && !r.blanks.find(b2 => b2.position !== undefined)))) {
          const blankEl = document.createElement("div");
          blankEl.className = "dw-blank";
          blankEl.dataset.blankIndex = r.blanks.indexOf(blank);
          blankEl.dataset.correct = blank.correct;
          
          // Drop zone events
          blankEl.addEventListener('dragover', handleDragOver);
          blankEl.addEventListener('drop', handleDrop);
          blankEl.addEventListener('dragenter', handleDragEnter);
          blankEl.addEventListener('dragleave', handleDragLeave);
          
          container.appendChild(blankEl);
        }
      });
    }
  }

  function buildOptions(r) {
    const pool = document.getElementById("dw-pool");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(word => {
      const card = document.createElement("div");
      card.className = "dw-card";
      card.textContent = word;
      card.addEventListener('pointerdown', onPointerDown);
      pool.appendChild(card);
    });
  }

  function setupTrashZone() {
    const trash = document.getElementById("dw-trash");
    
    trash.addEventListener('dragover', (e) => {
      e.preventDefault();
      trash.classList.add('drag-over');
    });
    
    trash.addEventListener('dragleave', () => {
      trash.classList.remove('drag-over');
    });
    
    trash.addEventListener('drop', (e) => {
      e.preventDefault();
      trash.classList.remove('drag-over');
      
      if (draggedEl && draggedEl.dataset.wrongWord === "true") {
        if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("correct");
        draggedEl.style.visibility = "hidden";
        wrongWordRemoved = true;
        checkPhase3Win();
      } else {
        if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("wrong");
      }
    });
  }

  // Drag and Drop Logic
  function onPointerDown(e) {
    if (!e.target.classList.contains('dw-card') && !e.target.classList.contains('dw-wrong-word')) return;
    if (e.target.classList.contains('placed')) return;
    
    e.preventDefault();
    draggedEl = e.target;
    originParent = draggedEl.parentElement;

    const rect = draggedEl.getBoundingClientRect();
    shiftX = e.clientX - rect.left;
    shiftY = e.clientY - rect.top;

    draggedEl.style.position = 'fixed';
    draggedEl.style.left = rect.left + 'px';
    draggedEl.style.top = rect.top + 'px';
    draggedEl.style.zIndex = 1000;
    draggedEl.style.width = rect.width + 'px';
    
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

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('dw-blank') && !e.target.classList.contains('filled')) {
      e.target.style.borderColor = "var(--primary-green)";
      e.target.style.background = "rgba(72, 187, 120, 0.2)";
    }
  }

  function handleDragLeave(e) {
    if (e.target.classList.contains('dw-blank')) {
      e.target.style.borderColor = "var(--primary-blue)";
      e.target.style.background = "rgba(74, 144, 226, 0.1)";
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const blank = e.target.closest('.dw-blank');
    if (!blank || blank.classList.contains('filled')) return;
    
    blank.style.borderColor = "var(--primary-blue)";
    blank.style.background = "rgba(74, 144, 226, 0.1)";
    
    const word = draggedEl.textContent;
    const correct = blank.dataset.correct;
    
    if (word === correct) {
      // Correct placement
      if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("correct");
      if (window.GameHub && window.GameHub.triggerVFX) window.GameHub.triggerVFX(e.clientX, e.clientY);
      
      blank.classList.add('filled');
      blank.textContent = word;
      blank.dataset.filled = "true";
      
      draggedEl.style.display = 'none';
      placedWords[blank.dataset.blankIndex] = word;
      
      checkWinCondition();
    } else {
      // Wrong placement
      if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("wrong");
      animateShake();
      resetDrag();
    }
  }

    function onPointerUp(e) {
    if (!draggedEl) return;
    
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // 1. Temporarily hide the dragged element so we can see what's underneath it
    draggedEl.style.visibility = 'hidden';
    
    // 2. Get the element currently under the pointer
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const blank = elemBelow ? elemBelow.closest('.dw-blank') : null;
    
    // 3. Make it visible again immediately
    draggedEl.style.visibility = 'visible';

    if (blank && !blank.classList.contains('filled') && !blank.dataset.filled) {
      const word = draggedEl.textContent.trim(); // .trim() prevents whitespace matching issues
      const correct = blank.dataset.correct;
      
      if (word === correct) {
        if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("correct");
        if (window.GameHub && window.GameHub.triggerVFX) window.GameHub.triggerVFX(e.clientX, e.clientY);
        
        blank.classList.add('filled');
        blank.textContent = word;
        blank.dataset.filled = "true";
        
        // Cleanly remove the card from the DOM instead of just hiding it
        draggedEl.remove(); 
        
        placedWords[blank.dataset.blankIndex] = word;
        checkWinCondition();
        draggedEl = null;
        return;
      }
    }
    
    // Wrong placement or dropped elsewhere
    if (window.GameHub && window.GameHub.playSound) window.GameHub.playSound("wrong");
    animateShake();
    resetDrag();
    draggedEl = null;
  }

  function resetDrag() {
    if (!draggedEl) return;
    draggedEl.style.position = 'static';
    draggedEl.style.zIndex = '';
    draggedEl.style.width = '';
    draggedEl.style.left = '';
    draggedEl.style.top = '';
    draggedEl.style.visibility = 'visible'; // Ensure it's always visible when reset
    originParent.appendChild(draggedEl);
  }

    function animateShake() {
    if (!draggedEl) return;
    
    // Capture the reference in a local variable
    const elementToShake = draggedEl; 
    
    elementToShake.classList.add('shake');
    setTimeout(() => {
      // Safely remove the class from the captured element
      if (elementToShake) {
        elementToShake.classList.remove('shake');
      }
    }, 400);
  }

  function nextRound() {
    if (levelIndex >= gameData.length - 1) {
      if (window.GameHub && window.GameHub.showComplete) {
        window.GameHub.showComplete("Descriptive Master!", "You've mastered the art of describing with adjectives!");
      }
    } else {
      levelIndex++;
      renderLevel();
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel();
    }
  }

  function checkWinCondition() {
    const r = gameData[levelIndex];
    const filledBlanks = document.querySelectorAll('.dw-blank.filled');
    
    if (filledBlanks.length === r.blanks.length) {
      setTimeout(() => nextRound(), 800);
    }
  }

  function checkPhase3Win() {
    if (wrongWordRemoved) {
      // Now show the blank for the correct word
      const r = gameData[levelIndex];
      const container = document.getElementById("dw-sentence");
      const wrongEl = container.querySelector('.dw-wrong-word');
      
      if (wrongEl) {
        const blank = document.createElement("div");
        blank.className = "dw-blank";
        blank.dataset.blankIndex = "0";
        blank.dataset.correct = r.correctWord;
        blank.style.minWidth = "100px";
        
        wrongEl.parentNode.replaceChild(blank, wrongEl);
        
        // Add drop events
        blank.addEventListener('dragover', handleDragOver);
        blank.addEventListener('drop', handleDrop);
        blank.addEventListener('dragenter', handleDragEnter);
        blank.addEventListener('dragleave', handleDragLeave);
      }
    }
  }

  renderLevel();
  window.nextRound = nextRound;
window.previousRound = previousRound;
};
