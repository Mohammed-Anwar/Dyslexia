// Writing > Readiness > Colors to Letters (Sky, Grass, Dirt)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);
  
  let levelIndexIndex = 0;

  // Visual Definitions
  const COLORS = {
    sky: "#4A90E2",   // Blue
    grass: "#48BB78", // Green
    dirt: "#8B4513"   // Brown
  };

  // Map each letter to its correct zone
  const LETTER_ZONES = {
    b:'sky', d:'sky', f:'sky', h:'sky', k:'sky', l:'sky', t:'sky',
    a:'grass', c:'grass', e:'grass', i:'grass', m:'grass', n:'grass', o:'grass', r:'grass', s:'grass', u:'grass', v:'grass', w:'grass', x:'grass', z:'grass',
    g:'dirt', j:'dirt', p:'dirt', q:'dirt', y:'dirt'
  };

  // 20 Unique, Hand-crafted gameData for Perfect Pedagogical Progression
  const gameData = [
    // STAGE 1: Abstract Colors to Boxes (Increasing Quantity)
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky", "grass"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["grass", "dirt", "sky"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["sky", "sky", "grass", "dirt"] },
    { stage: 1, text: "Stage 1: Sort colors into boxes", layout: "boxes", type: "color", items: ["grass", "grass", "sky", "dirt", "dirt"] },

    // STAGE 2: Colors to Notebook Lines (Bridging the concept)
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "grass", "grass", "dirt"] },
    { stage: 2, text: "Stage 2: Drag colors to correct lines", layout: "lines", type: "color", items: ["sky", "dirt", "sky", "grass", "dirt"] },

    // STAGE 3: Colored Letters to Lines (Introducing shapes with color hints)
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["b", "a"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["d", "p", "e"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["h", "m", "y"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["t", "l", "g", "q"] },
    { stage: 3, text: "Stage 3: Match colored letters to lines", layout: "lines", type: "colored-letter", items: ["f", "s", "j", "i", "k"] },

    // STAGE 4: Black Letters to Lines (Fading color hints, testing memory)
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["b", "a"] },
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["c", "o", "g"] },
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["d", "q", "p"] }, // Tricky similarities
    { stage: 4, text: "Stage 4: Place letters by memory!", layout: "lines", type: "black-letter", items: ["h", "n", "u", "y"] },
    { stage: 4, text: "Final Boss: Place letters by memory!", layout: "lines", type: "black-letter", items: ["k", "v", "w", "x", "z", "j"] }
  ];

  let activeItem = null; // Used for touch/click fallback

  function build() {
    const levelData = gameData[levelIndexIndex];
    let itemsToRender = [];

    // Parse the items for this specific level
    levelData.items.forEach(val => {
      let zone, content, color, isCircle;

      if (levelData.type === "color") {
        zone = val; // val is 'sky', 'grass', or 'dirt'
        content = "";
        color = COLORS[zone];
        isCircle = true;
      } else {
        content = val; // val is a letter like 'b'
        zone = LETTER_ZONES[content];
        isCircle = false;
        color = (levelData.type === "colored-letter") ? COLORS[zone] : "#1A202C"; // Color or Black
      }

      itemsToRender.push({ zone, content, color, isCircle });
    });

    // Shuffle items so they appear in random order at the bottom
    itemsToRender.sort(() => Math.random() - 0.5);

    // Generate Layout based on level config
    let layoutHTML = "";
    if (levelData.layout === "boxes") {
      layoutHTML = `
        <div class="co-boxes">
          <div class="co-dropzone co-box" data-zone="sky" style="border-color:${COLORS.sky}"></div>
          <div class="co-dropzone co-box" data-zone="grass" style="border-color:${COLORS.grass}"></div>
          <div class="co-dropzone co-box" data-zone="dirt" style="border-color:${COLORS.dirt}"></div>
        </div>
      `;
    } else {
      layoutHTML = `
        <div class="co-notebook">
          <div class="co-dropzone co-line sky-bg" data-zone="sky"></div>
          <div class="co-dropzone co-line grass-bg" data-zone="grass"></div>
          <div class="co-dropzone co-line dirt-bg" data-zone="dirt"></div>
        </div>
      `;
    }

    // Render HTML & CSS
    stage.innerHTML = `
      <style>
        .co-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; font-family: sans-serif; user-select: none; }
        .co-title { font-size: 1.2rem; font-weight: 700; text-align: center; color: #2D3748; margin-bottom: 5px; }
        .co-level { font-size: 0.9rem; color: #718096; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        
        /* Stage 1: Abstract Boxes */
        .co-boxes { display: flex; gap: 20px; width: 100%; justify-content: center; }
        .co-box { width: 90px; min-height: 90px; border-radius: 16px; border: 4px solid; background: #fff; display: flex; flex-wrap: wrap; gap: 5px; align-items: center; justify-content: center; padding: 5px; transition: all 0.3s; }
        
        /* Stages 2-4: Notebook Lines */
        .co-notebook { width: 100%; max-width: 500px; display: flex; flex-direction: column; border-left: 3px solid #E53E3E; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .co-line { min-height: 75px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: center; border-bottom: 2px dashed #CBD5E0; padding: 10px; transition: background 0.3s; }
        .co-line:last-child { border-bottom: 2px solid #A0AEC0; }
        .sky-bg { background-color: rgba(74, 144, 226, 0.15); }
        .grass-bg { background-color: rgba(72, 187, 120, 0.15); }
        .dirt-bg { background-color: rgba(139, 69, 19, 0.15); }
        
        /* Draggable Items */
        .co-items { display: flex; flex-wrap: wrap; gap: 20px; min-height: 80px; margin-top: 10px; align-items: center; justify-content: center; width: 100%; }
        .co-item { cursor: grab; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        .co-item:active { cursor: grabbing; transform: scale(1.1); }
        .co-item.selected { transform: scale(1.2); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        
        .co-circle { width: 45px; height: 45px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .co-letter { font-size: 3rem; font-family: "Comic Sans MS", "Chalkboard SE", sans-serif; font-weight: bold; line-height: 1; }
        
        /* Dropzone Items Adjustment */
        .co-dropzone .co-item { transform: scale(0.9); } /* Shrink slightly when placed */
        
        /* Animations */
        .wrong-shake { animation: shake 0.3s; border-color: #E53E3E !important; }
        .done-flash { animation: flash 0.4s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes flash { 0% { opacity: 1; } 50% { opacity: 0.5; background: #FFF; } 100% { opacity: 1; } }
      </style>
      
      <div class="co-wrap">
        <div class="co-level">Round ${levelIndexIndex + 1} / ${gameData.length}</div>
        <p class="co-title">${levelData.text}</p>
        ${layoutHTML}
        <div class="co-items" id="co-items"></div>
      </div>
    `;

    // Render Draggable Items
    const itemsContainer = document.getElementById("co-items");
    itemsToRender.forEach(item => {
      const el = document.createElement("div");
      el.className = `co-item ${item.isCircle ? 'co-circle' : 'co-letter'}`;
      el.draggable = true;
      el.dataset.zone = item.zone;
      el.dataset.type = levelData.type; // "color", "colored-letter", "black-letter"
      
      if (item.isCircle) {
        el.style.backgroundColor = item.color;
      } else {
        el.style.color = item.color;
        el.innerText = item.content;
      }
      
      itemsContainer.appendChild(el);
    });

    attachInteractionListeners(levelData.stage);
  }

  function attachInteractionListeners(stageNum) {
    const draggables = stage.querySelectorAll('.co-item');
    const dropzones = stage.querySelectorAll('.co-dropzone');
    
    // Setup Draggable Elements (Supports Mouse Drag & Click/Touch)
    draggables.forEach(el => {
      // 1. Drag Events
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', el.dataset.zone);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });

      // 2. Click/Touch Events (Fallback for Tablets)
      el.addEventListener('click', () => {
        if (el.parentElement.id !== "co-items") return; // Skip if already placed
        draggables.forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        activeItem = el;
      });
    });

    // Setup Drop Zones
    dropzones.forEach(zone => {
      // 1. Drag Drop Handling
      zone.addEventListener('dragover', (e) => e.preventDefault());
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedEl = stage.querySelector('.dragging');
        if (draggedEl) processPlacement(draggedEl, zone, stageNum);
      });

      // 2. Click/Touch Handling
      zone.addEventListener('click', () => {
        if (activeItem) processPlacement(activeItem, zone, stageNum);
      });
    });
  }

  function processPlacement(itemEl, zoneEl, stageNum) {
    const expectedZone = itemEl.dataset.zone;
    const targetZone = zoneEl.dataset.zone;
    
    if (expectedZone === targetZone) {
      // Success Logic
      window.GameHub.playSound("correct");
      const rect = zoneEl.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      // Move Item
      zoneEl.appendChild(itemEl);
      zoneEl.classList.add('done-flash');
      setTimeout(() => zoneEl.classList.remove('done-flash'), 400);

      // Disable interactions on completed item
      itemEl.draggable = false;
      itemEl.style.cursor = 'default';
      itemEl.classList.remove('selected');
      activeItem = null;
      
      // Stage 3 specific: snap color to standard black writing ink once placed
      if (stageNum === 3 && itemEl.dataset.type === 'colored-letter') {
        itemEl.style.color = "#1A202C"; 
      }

      checkWin();
    } else {
      // Wrong Logic
      window.GameHub.playSound("wrong");
      zoneEl.classList.add("wrong-shake");
      setTimeout(() => zoneEl.classList.remove("wrong-shake"), 300);
      
      if (activeItem) {
        activeItem.classList.remove('selected');
        activeItem = null;
      }
    }
  }

  function checkWin() {
    const itemsContainer = document.getElementById("co-items");
    // If no items are left in the starting container, the level is complete
    if (itemsContainer.children.length === 0) {
      levelIndexIndex++;
      setTimeout(() => {
        if (levelIndexIndex >= gameData.length) {
          window.GameHub.showComplete("Writing Champion!", "You mastered all the writing zones.");
        } else {
          build(); // Proceed to next level
        }
      }, 700);
    }
  }

  // Start Game
  build();
};