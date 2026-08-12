// Writing > Readiness > Geo shapes
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Each shape is built of pieces; each piece has a home slot (target) and a start tray position.
  const SHAPES = [
    {
      name: "House",
      pieces: [
        { id: "wall", label: "▭", desc: "square wall", target: { x: 200, y: 190, rot: 0 } },
        { id: "roofL", label: "◤", desc: "left roof line", target: { x: 150, y: 110, rot: 0 } },
        { id: "roofR", label: "◥", desc: "right roof line", target: { x: 250, y: 110, rot: 0 } },
        { id: "door", label: "▯", desc: "door line", target: { x: 200, y: 230, rot: 0 } }
      ]
    },
    {
      name: "Tree",
      pieces: [
        { id: "trunk", label: "│", desc: "vertical trunk", target: { x: 200, y: 230, rot: 0 } },
        { id: "leafC", label: "●", desc: "round leaves", target: { x: 200, y: 140, rot: 0 } },
        { id: "branchL", label: "╱", desc: "diagonal branch", target: { x: 160, y: 190, rot: 0 } },
        { id: "branchR", label: "╲", desc: "diagonal branch", target: { x: 240, y: 190, rot: 0 } }
      ]
    }
  ];

  let level = 0;
  let placed = 0;

  function buildStage() {
    const shape = SHAPES[level];
    placed = 0;
    stage.innerHTML = `
      <style>
        .gs-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px;width:100%;height:100%;}
        .gs-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);}
        .gs-board{position:relative;width:400px;height:280px;background:#F8FAFC;border:2px dashed #CBD5E0;border-radius:16px;}
        .gs-slot{position:absolute;width:60px;height:60px;border:2px dashed #A0AEC0;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:#CBD5E0;transform:translate(-50%,-50%);}
        .gs-tray{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
        .gs-piece{width:56px;height:56px;border-radius:10px;background:white;border:2px solid var(--primary-blue);display:flex;align-items:center;justify-content:center;font-size:1.8rem;cursor:grab;box-shadow:0 3px 0 #2b6cb0;color:var(--primary-blue);font-weight:800;}
        .gs-piece.placed{visibility:hidden;}
        .gs-slot.filled{background:var(--primary-green);color:white;border-style:solid;}
      </style>
      <div class="gs-wrap">
        <p class="gs-title">Build the ${shape.name}! Drag each shape into its matching outline.</p>
        <div class="gs-board" id="gs-board"></div>
        <div class="gs-tray" id="gs-tray"></div>
      </div>
    `;
    const board = document.getElementById("gs-board");
    const tray = document.getElementById("gs-tray");

    shape.pieces.forEach(p => {
      const slot = document.createElement("div");
      slot.className = "gs-slot";
      slot.id = "slot-" + p.id;
      slot.style.left = p.target.x + "px";
      slot.style.top = p.target.y + "px";
      slot.innerText = p.label;
      board.appendChild(slot);
    });

    shape.pieces.forEach(p => {
      const piece = document.createElement("div");
      piece.className = "gs-piece";
      piece.id = "piece-" + p.id;
      piece.innerText = p.label;
      piece.title = p.desc;
      tray.appendChild(piece);

      window.GameHub.utils.makeDraggable(piece, (x, y) => {
        const slot = document.getElementById("slot-" + p.id);
        const rect = slot.getBoundingClientRect();
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
                window.GameHub.showComplete("Shape Builder!", "You built every shape from its parts.");
              } else {
                buildStage();
              }
            }, 600);
          }
        } else {
          window.GameHub.playSound("wrong");
          piece.style.transform = "translate3d(0,0,0)";
          piece.resetPosition();
        }
      });
    });
  }

  buildStage();
};
