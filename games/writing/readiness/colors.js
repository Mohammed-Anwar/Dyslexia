// Writing > Readiness > Colors
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // Rows of boxes; child must click them in order (top-to-bottom or left-to-right) to color them the instructed color.
  const LEVELS = [
    { instruction: "Color the boxes BLUE from left to right", color: "#4A90E2", colorName: "blue", count: 5, direction: "row" },
    { instruction: "Color the boxes GREEN from top to bottom", color: "#48BB78", colorName: "green", count: 5, direction: "col" },
    { instruction: "Color the boxes ORANGE from left to right", color: "#ED8936", colorName: "orange", count: 6, direction: "row" }
  ];

  let level = 0;
  let nextIndex = 0;

  function build() {
    const L = LEVELS[level];
    nextIndex = 0;
    stage.innerHTML = `
      <style>
        .co-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;}
        .co-title{font-size:1.2rem;font-weight:700;text-align:center;color:var(--text-dark);}
        .co-grid{display:flex;flex-direction:${L.direction === "row" ? "row" : "column"};gap:10px;}
        .co-box{width:56px;height:56px;border-radius:10px;border:3px solid #CBD5E0;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:800;color:#A0AEC0;transition:var(--transition, all .2s);}
        .co-box.done{border-color:${L.color};background:${L.color};color:white;}
        .co-box.wrong-shake{animation:shake .3s;}
        @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
      </style>
      <div class="co-wrap">
        <p class="co-title">${L.instruction}</p>
        <div class="co-grid" id="co-grid"></div>
      </div>
    `;
    const grid = document.getElementById("co-grid");
    for (let i = 0; i < L.count; i++) {
      const box = document.createElement("div");
      box.className = "co-box";
      box.innerText = i + 1;
      box.onclick = () => handleClick(box, i);
      grid.appendChild(box);
    }
  }

  function handleClick(box, i) {
    const L = LEVELS[level];
    if (i === nextIndex) {
      box.classList.add("done");
      window.GameHub.playSound("correct");
      const rect = box.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + 28, rect.top + 28);
      nextIndex++;
      if (nextIndex >= L.count) {
        level++;
        setTimeout(() => {
          if (level >= LEVELS.length) {
            window.GameHub.showComplete("Coloring Champ!", "You followed every direction perfectly.");
          } else {
            build();
          }
        }, 500);
      }
    } else {
      window.GameHub.playSound("wrong");
      box.classList.add("wrong-shake");
      setTimeout(() => box.classList.remove("wrong-shake"), 300);
    }
  }

  build();
};
