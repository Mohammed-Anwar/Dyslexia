// Writing > Formation > Connect / Detach
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Each letter is made of a "stick" and a "circle" placed on a specific side.
  const LETTERS = [
    { char: "b", circleSide: "bottom-right", note: "Stick UP, circle at the BOTTOM-RIGHT." },
    { char: "d", circleSide: "bottom-left", note: "Stick UP, circle at the BOTTOM-LEFT." },
    { char: "p", circleSide: "top-right", note: "Stick DOWN, circle at the TOP-RIGHT." },
    { char: "q", circleSide: "top-left", note: "Stick DOWN, circle at the TOP-LEFT." }
  ];

  const SIDE_POS = {
    "bottom-right": { x: 180, y: 185 },
    "bottom-left": { x: 108, y: 185 },
    "top-right": { x: 180, y: 95 },
    "top-left": { x: 108, y: 95 }
  };

  let idx = 0;

  function build() {
    const L = LETTERS[idx];
    const target = SIDE_POS[L.circleSide];
    stage.innerHTML = `
      <style>
        .cnd-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px;}
        .cnd-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .cnd-board{position:relative;width:340px;height:280px;background:#F8FAFC;border:2px solid #E2E8F0;border-radius:16px;}
        .cnd-stick{position:absolute;left:140px;top:60px;width:8px;height:160px;background:var(--primary-blue);border-radius:4px;}
        .cnd-slot{position:absolute;width:70px;height:70px;border:3px dashed #CBD5E0;border-radius:50%;transform:translate(-50%,-50%);}
        .cnd-tray{display:flex;justify-content:center;}
        .cnd-circle{width:64px;height:64px;border-radius:50%;background:var(--primary-green);cursor:grab;box-shadow:0 4px 0 #2f855a;}
      </style>
      <div class="cnd-wrap">
        <p class="cnd-title">Build the letter "${L.char}"<br><span style="color:var(--text-muted);font-size:0.95rem;font-weight:500;">${L.note}</span></p>
        <div class="cnd-board" id="cnd-board">
          <div class="cnd-stick"></div>
          <div class="cnd-slot" id="cnd-slot" style="left:${target.x}px; top:${target.y}px;"></div>
        </div>
        <div class="cnd-tray">
          <div class="cnd-circle" id="cnd-circle"></div>
        </div>
      </div>
    `;

    const circle = document.getElementById("cnd-circle");
    window.GameHub.utils.makeDraggable(circle, (x, y) => {
      const slot = document.getElementById("cnd-slot");
      const rect = slot.getBoundingClientRect();
      const dist = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
      if (dist < 45) {
        window.GameHub.playSound("correct");
        window.GameHub.triggerVFX(x, y);
        slot.style.background = "var(--primary-green)";
        slot.style.borderStyle = "solid";
        circle.style.visibility = "hidden";
        idx++;
        setTimeout(() => {
          if (idx >= LETTERS.length) {
            window.GameHub.showComplete("Letters Assembled!", "You built b, d, p and q with the parts in the right place.");
          } else {
            build();
          }
        }, 600);
      } else {
        window.GameHub.playSound("wrong");
        circle.style.transform = "translate3d(0,0,0)";
        circle.resetPosition();
      }
    });
  }

  build();
};
