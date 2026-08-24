// Writing > Readiness > Geo shapes (Explorer's Gadgets - 15 Rounds)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // 15 Rounds divided into 3 stages (Solid -> Lines -> Complex)
  const SHAPES = [
    // Stage 1: Repairing Equipment (Solid Shapes)
    { name: "Compass", pieces: [ { id: "body", label: "●", desc: "Core", target: { x: 200, y: 140 } }, { id: "n", label: "▲", desc: "North", target: { x: 200, y: 80 } }, { id: "s", label: "▼", desc: "South", target: { x: 200, y: 200 } } ] },
    { name: "Flashlight", pieces: [ { id: "handle", label: "▬", desc: "Handle", target: { x: 160, y: 140 } }, { id: "head", label: "■", desc: "Head", target: { x: 240, y: 140 } } ] },
    { name: "Radar", pieces: [ { id: "base", label: "▭", desc: "Base", target: { x: 200, y: 190 } }, { id: "dishL", label: "◤", desc: "Dish L", target: { x: 150, y: 110 } }, { id: "dishR", label: "◥", desc: "Dish R", target: { x: 250, y: 110 } }, { id: "ant", label: "▯", desc: "Antenna", target: { x: 200, y: 230 } } ] },
    { name: "Camera", pieces: [ { id: "body", label: "▭", desc: "Body", target: { x: 200, y: 150 } }, { id: "lens", label: "◎", desc: "Lens", target: { x: 200, y: 150 } }, { id: "flash", label: "▄", desc: "Flash", target: { x: 160, y: 90 } } ] },
    { name: "Digi-Map", pieces: [ { id: "screen", label: "▤", desc: "Screen", target: { x: 200, y: 140 } }, { id: "fTop", label: "▬", desc: "Frame Top", target: { x: 200, y: 90 } }, { id: "fBot", label: "▬", desc: "Frame Bot", target: { x: 200, y: 190 } } ] },
    
    // Stage 2: Decoding (Lines and Angles)
    { name: "Laser Code", pieces: [ { id: "core", label: "│", desc: "Core", target: { x: 200, y: 210 } }, { id: "node", label: "●", desc: "Node", target: { x: 200, y: 120 } }, { id: "rayL", label: "╱", desc: "Ray L", target: { x: 160, y: 170 } }, { id: "rayR", label: "╲", desc: "Ray R", target: { x: 240, y: 170 } } ] },
    { name: "Star Gate", pieces: [ { id: "l1", label: "╲", desc: "Line", target: { x: 160, y: 110 } }, { id: "l2", label: "╱", desc: "Line", target: { x: 240, y: 110 } }, { id: "l3", label: "─", desc: "Base", target: { x: 200, y: 180 } } ] },
    { name: "Hex-Crystal", pieces: [ { id: "e1", label: "╱", desc: "Edge", target: { x: 170, y: 110 } }, { id: "e2", label: "╲", desc: "Edge", target: { x: 230, y: 110 } }, { id: "e3", label: "╲", desc: "Edge", target: { x: 170, y: 170 } }, { id: "e4", label: "╱", desc: "Edge", target: { x: 230, y: 170 } } ] },
    { name: "Prism Lock", pieces: [ { id: "top", label: "△", desc: "Top", target: { x: 200, y: 90 } }, { id: "bot", label: "▽", desc: "Bot", target: { x: 200, y: 190 } }, { id: "link", label: "│", desc: "Link", target: { x: 200, y: 140 } } ] },
    { name: "Energy Core", pieces: [ { id: "c", label: "◎", desc: "Center", target: { x: 200, y: 140 } }, { id: "x", label: "✛", desc: "Crosshair", target: { x: 200, y: 140 } }, { id: "f", label: "□", desc: "Frame", target: { x: 200, y: 140 } } ] },
    
    // Stage 3: Complex Assembly (Mixed Shapes & Lines)
    { name: "Mars Rover", pieces: [ { id: "body", label: "▅", desc: "Body", target: { x: 200, y: 140 } }, { id: "w1", label: "○", desc: "Wheel 1", target: { x: 150, y: 190 } }, { id: "w2", label: "○", desc: "Wheel 2", target: { x: 250, y: 190 } }, { id: "ant", label: "╱", desc: "Antenna", target: { x: 160, y: 90 } } ] },
    { name: "Scout Drone", pieces: [ { id: "chas", label: "▬", desc: "Chassis", target: { x: 200, y: 140 } }, { id: "rL", label: "✖", desc: "Rotor L", target: { x: 130, y: 140 } }, { id: "rR", label: "✖", desc: "Rotor R", target: { x: 270, y: 140 } } ] },
    { name: "Submarine", pieces: [ { id: "hull", label: "⬭", desc: "Hull", target: { x: 200, y: 150 } }, { id: "fin", label: "△", desc: "Fin", target: { x: 200, y: 90 } }, { id: "win", label: "◎", desc: "Window", target: { x: 240, y: 150 } } ] },
    { name: "Jetpack", pieces: [ { id: "tL", label: "▯", desc: "Tank L", target: { x: 170, y: 130 } }, { id: "tR", label: "▯", desc: "Tank R", target: { x: 230, y: 130 } }, { id: "fL", label: "▲", desc: "Flame", target: { x: 170, y: 200 } }, { id: "fR", label: "▲", desc: "Flame", target: { x: 230, y: 200 } } ] },
    { name: "Spaceship", pieces: [ { id: "nose", label: "▲", desc: "Nose", target: { x: 200, y: 70 } }, { id: "hull", label: "▅", desc: "Hull", target: { x: 200, y: 140 } }, { id: "wL", label: "◢", desc: "Wing L", target: { x: 140, y: 160 } }, { id: "wR", label: "◣", desc: "Wing R", target: { x: 260, y: 160 } } ] }
  ];

  let level = 0;
  let placed = 0;

  function buildStage() {
    if(level >= SHAPES.length) return;
    const shape = SHAPES[level];
    placed = 0;

    stage.innerHTML = `
      <style>
        .gs-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 16px; 
          width: 100%; height: 100%; font-family: monospace, sans-serif;
          background: #0f172a; /* خلفية داكنة مستقبلية */
          border-radius: 12px;
          user-select: none; -webkit-user-select: none; /* منع تحديد النص */
        }
        .gs-header { display: flex; justify-content: space-between; width: min(400px, 100%); color: #38bdf8; font-weight: bold; }
        .gs-title { font-size: 1.1rem; font-weight: 700; color: #f8fafc; text-align: center; margin: 0; }
        .gs-title span { color: #34d399; }
        
        /* لوحة الرادار / العمل */
        .gs-board {
          position: relative; width: 400px; height: 280px; 
          background: #1e293b; 
          background-image: linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px);
          background-size: 20px 20px; /* شبكة ليزرية */
          border: 2px solid #38bdf8; border-radius: 12px;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.2) inset;
        }
        
        .gs-slot {
          position: absolute; width: 60px; height: 60px; 
          border: 2px dashed #475569; border-radius: 8px; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 2rem; color: #475569; 
          transform: translate(-50%, -50%); transition: all 0.3s ease;
        }
        .gs-slot.filled {
          background: rgba(16, 185, 129, 0.2); 
          color: #34d399; border: 2px solid #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
          text-shadow: 0 0 8px #34d399;
        }
        
        .gs-tray { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
        .gs-piece {
          width: 56px; height: 56px; border-radius: 8px; 
          background: #1e293b; border: 2px solid #0ea5e9; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 2rem; cursor: grab; color: #38bdf8; font-weight: 800;
          box-shadow: 0 4px 0 #0284c7; 
          text-shadow: 0 0 5px rgba(56,189,248,0.5);
        }
        .gs-piece:active { cursor: grabbing; transform: translateY(2px); box-shadow: 0 2px 0 #0284c7; }
        .gs-piece.placed { visibility: hidden; }
      </style>
      <div class="gs-wrap">
        <div class="gs-header">
          <span>MISSION ${level + 1}/${SHAPES.length}</span>
          <span>SYSTEM: ONLINE</span>
        </div>
        <p class="gs-title">Assemble the <span>${shape.name}</span>!</p>
        <div class="gs-board" id="gs-board"></div>
        <div class="gs-tray" id="gs-tray"></div>
      </div>
    `;

    const board = document.getElementById("gs-board");
    const tray = document.getElementById("gs-tray");

    // نطق المهمة باستخدام Voice-over
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`Assemble the ${shape.name}`);
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }

    shape.pieces.forEach(p => {
      const slot = document.createElement("div");
      slot.className = "gs-slot";
      slot.id = "slot-" + p.id;
      slot.style.left = p.target.x + "px";
      slot.style.top = p.target.y + "px";
      slot.innerText = p.label;
      board.appendChild(slot);
    });

    // خلط القطع في الصينية لزيادة التحدي البصري
    const shuffledPieces = [...shape.pieces].sort(() => Math.random() - 0.5);

    shuffledPieces.forEach(p => {
      const piece = document.createElement("div");
      piece.className = "gs-piece";
      piece.id = "piece-" + p.id;
      piece.innerText = p.label;
      piece.title = p.desc;
      tray.appendChild(piece);

      // تفعيل السحب مع إضافة e.preventDefault لمنع التحديد نهائياً
      piece.addEventListener('mousedown', (e) => e.preventDefault());
      
      window.GameHub.utils.makeDraggable(piece, (x, y) => {
        const slot = document.getElementById("slot-" + p.id);
        const rect = slot.getBoundingClientRect();
        // مساحة سماحية واسعة للطفل (Tolerance)
        const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
        
        if (dist < 55) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(x, y);
          slot.classList.add("filled");
          piece.classList.add("placed");
          placed++;
          
          if (placed >= shape.pieces.length) {
            level++;
            setTimeout(() => {
              if (level >= SHAPES.length) {
                window.GameHub.showComplete("Gadget Master!", "All explorer gadgets are fully operational.");
              } else {
                buildStage();
              }
            }, 800); // تأخير بسيط ليرى الطفل الشكل مكتملاً وهو يتوهج
          }
        } else {
          window.GameHub.playSound("wrong");
          piece.style.transform = "translate3d(0,0,0)";
          if(piece.resetPosition) piece.resetPosition();
        }
      });
    });
  }

  buildStage();
};