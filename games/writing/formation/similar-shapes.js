// Writing > Formation > Similar shapes
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { base: "i", need: "dot on top", options: ["i", "l", "j"], answer: "i" },
    { base: "b/d", need: "loop on the RIGHT of the stick", options: ["b", "d", "p"], answer: "b" },
    { base: "b/d", need: "loop on the LEFT of the stick", options: ["b", "d", "q"], answer: "d" },
    { base: "u/n", need: "curve OPENS upward like a cup", options: ["u", "n", "m"], answer: "u" },
    { base: "u/n", need: "curve closed on top like a bridge", options: ["u", "n", "h"], answer: "n" }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .ss-wrap{display:flex;flex-direction:column;align-items:center;gap:22px;padding:20px;}
        .ss-title{font-size:1.2rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .ss-options{display:flex;gap:24px;}
        .ss-opt{width:110px;height:110px;border-radius:16px;background:white;border:3px solid var(--primary-blue);display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:800;color:var(--primary-blue);cursor:pointer;}
        .ss-opt:hover{background:#EBF8FF;}
        .ss-progress{color:var(--text-muted);font-weight:600;}
      </style>
      <div class="ss-wrap">
        <p class="ss-progress">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p class="ss-title">Which letter has: <br><b style="color:var(--primary-blue)">${r.need}</b>?</p>
        <div class="ss-options" id="ss-options"></div>
      </div>
    `;
    const container = document.getElementById("ss-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(letter => {
      const btn = document.createElement("div");
      btn.className = "ss-opt";
      btn.innerText = letter;
      btn.onclick = (e) => {
        if (letter === r.answer) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Sharp Eyes!", "You told apart every look-alike letter.");
            } else {
              build();
            }
          }, 500);
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      container.appendChild(btn);
    });
  }

  build();
};
