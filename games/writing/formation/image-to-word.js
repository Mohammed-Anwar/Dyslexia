// Writing > Formation > Image to word
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { emoji: "🐱", word: "CAT" },
    { emoji: "☀️", word: "SUN" },
    { emoji: "🐟", word: "FISH" },
    { emoji: "🌳", word: "TREE" },
    { emoji: "⭐", word: "STAR" }
  ];

  let idx = 0;
  let built = "";

  function build() {
    const r = ROUNDS[idx];
    built = "";
    const letters = r.word.split("");
    const distractors = "QXZJKV".split("").filter(l => !letters.includes(l)).sort(() => Math.random() - 0.5).slice(0, 3);
    const pool = [...letters, ...distractors].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <style>
        .iw-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;}
        .iw-emoji{font-size:5rem;}
        .iw-slots{display:flex;gap:8px;}
        .iw-slot{width:52px;height:60px;border-bottom:4px solid var(--primary-blue);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:var(--text-dark);}
        .iw-pool{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:420px;}
        .iw-key{text-align: center;align-content: space-evenly;width:52px;height:52px;border-radius:10px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-size:1.4rem;font-weight:800;cursor:pointer;}
        .iw-key:hover{background:#EBF8FF;}
        .iw-key.used{visibility:hidden;}
      </style>
      <div class="iw-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <div class="iw-emoji">${r.emoji}</div>
        <div class="iw-slots" id="iw-slots"></div>
        <div class="iw-pool" id="iw-pool"></div>
      </div>
    `;
    const slotsEl = document.getElementById("iw-slots");
    letters.forEach(() => {
      const s = document.createElement("div");
      s.className = "iw-slot";
      slotsEl.appendChild(s);
    });

    const poolEl = document.getElementById("iw-pool");
    pool.forEach((ch, i) => {
      const key = document.createElement("div");
      key.className = "iw-key";
      key.innerText = ch;
      key.onclick = () => handlePick(ch, key, r.word);
      poolEl.appendChild(key);
    });
  }

  function handlePick(ch, keyEl, word) {
    const expected = word[built.length];
    if (ch === expected) {
      window.GameHub.playSound("correct");
      const rect = keyEl.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left, rect.top);
      keyEl.classList.add("used");
      built += ch;
      const slots = document.querySelectorAll("#iw-slots .iw-slot");
      slots[built.length - 1].innerText = ch;
      slots[built.length - 1].style.color = "var(--primary-green)";
      if (built.length === word.length) {
        idx++;
        setTimeout(() => {
          if (idx >= ROUNDS.length) {
            window.GameHub.showComplete("Word Builder!", "You spelled every picture word correctly.");
          } else {
            build();
          }
        }, 600);
      }
    } else {
      window.GameHub.playSound("wrong");
    }
  }

  build();
};
