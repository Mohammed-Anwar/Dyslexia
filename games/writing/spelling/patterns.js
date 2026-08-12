// Writing > Spelling > Patterns
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const GROUPS = [
    { pattern: "-ight", words: ["night", "light", "sight", "right"], distractors: ["cat", "dog", "sun"] },
    { pattern: "-ake", words: ["cake", "lake", "make", "rake"], distractors: ["ship", "frog", "pen"] },
    { pattern: "-ing", words: ["sing", "ring", "king", "wing"], distractors: ["boat", "milk", "star"] }
  ];

  let idx = 0;
  let found = 0;

  function build() {
    const g = GROUPS[idx];
    found = 0;
    const tiles = [...g.words, ...g.distractors].sort(() => Math.random() - 0.5);
    stage.innerHTML = `
      <style>
        .pt-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;}
        .pt-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .pt-basket{width:min(420px,90%);min-height:70px;border:3px dashed var(--primary-green);border-radius:16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;padding:10px;}
        .pt-basket-word{background:var(--primary-green);color:white;padding:8px 14px;border-radius:20px;font-weight:700;}
        .pt-tiles{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:460px;}
        .pt-tile{padding:12px 18px;border-radius:12px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-weight:700;cursor:pointer;}
        .pt-tile:hover{background:#EBF8FF;}
        .pt-tile.used{visibility:hidden;}
      </style>
      <div class="pt-wrap">
        <p class="pt-title">Find every word that rhymes with the pattern <b style="color:var(--primary-green)">"${g.pattern}"</b></p>
        <div class="pt-basket" id="pt-basket"><span style="color:#A0AEC0;">Drop matching words here</span></div>
        <div class="pt-tiles" id="pt-tiles"></div>
      </div>
    `;
    const basket = document.getElementById("pt-basket");
    const tilesEl = document.getElementById("pt-tiles");
    tiles.forEach(word => {
      const tile = document.createElement("div");
      tile.className = "pt-tile";
      tile.innerText = word;
      tile.onclick = (e) => {
        if (g.words.includes(word)) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          if (found === 0) basket.innerHTML = "";
          const chip = document.createElement("span");
          chip.className = "pt-basket-word";
          chip.innerText = word;
          basket.appendChild(chip);
          tile.classList.add("used");
          found++;
          if (found >= g.words.length) {
            idx++;
            setTimeout(() => {
              if (idx >= GROUPS.length) {
                window.GameHub.showComplete("Pattern Pro!", "You spotted every word family correctly.");
              } else {
                build();
              }
            }, 700);
          }
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      tilesEl.appendChild(tile);
    });
  }

  build();
};
