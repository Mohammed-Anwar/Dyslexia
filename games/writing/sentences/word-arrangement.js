// Writing > Sentences > Word arrangement
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { words: ["The", "cat", "is", "sleeping"] },
    { words: ["I", "like", "to", "read", "books"] },
    { words: ["We", "played", "in", "the", "park"] },
    { words: ["She", "is", "my", "best", "friend"] }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    const shuffled = [...r.words].sort(() => Math.random() - 0.5);
    stage.innerHTML = `
      <style>
        .wa-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;width:100%;}
        .wa-line{width:min(500px,92%);min-height:70px;border-bottom:4px solid var(--primary-blue);display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:6px;}
        .wa-slot{width:90px;height:44px;border:2px dashed #CBD5E0;border-radius:8px;}
        .wa-slot.filled{border:none;}
        .wa-pool{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:500px;}
        .wa-card{padding:10px 18px;border-radius:10px;background:white;border:2px solid var(--primary-green);color:var(--primary-green);font-weight:700;cursor:pointer;}
        .wa-card:hover{background:#F0FFF4;}
        .wa-card.used{visibility:hidden;}
      </style>
      <div class="wa-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length} — Tap words in the right order</p>
        <div class="wa-line" id="wa-line"></div>
        <div class="wa-pool" id="wa-pool"></div>
      </div>
    `;
    const line = document.getElementById("wa-line");
    r.words.forEach(() => {
      const slot = document.createElement("div");
      slot.className = "wa-slot";
      line.appendChild(slot);
    });

    let built = [];
    const pool = document.getElementById("wa-pool");
    shuffled.forEach(word => {
      const card = document.createElement("div");
      card.className = "wa-card";
      card.innerText = word;
      card.onclick = (e) => {
        const expected = r.words[built.length];
        if (word === expected && !card.classList.contains("used")) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          card.classList.add("used");
          const slots = document.querySelectorAll("#wa-line .wa-slot");
          slots[built.length].innerHTML = `<div style="padding:8px 14px;background:var(--primary-blue);color:white;border-radius:8px;font-weight:700;text-align:center;">${word}</div>`;
          slots[built.length].classList.add("filled");
          built.push(word);
          if (built.length === r.words.length) {
            idx++;
            setTimeout(() => {
              if (idx >= ROUNDS.length) {
                window.GameHub.showComplete("Sentence Builder!", "You arranged every sentence in the right order.");
              } else {
                build();
              }
            }, 700);
          }
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      pool.appendChild(card);
    });
  }

  build();
};
