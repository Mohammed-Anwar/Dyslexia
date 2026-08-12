// Writing > Spelling > Punctuation
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { sentence: "I love ice cream", answer: ".", hint: "It's a simple statement." },
    { sentence: "Watch out for that car", answer: "!", hint: "It's an urgent warning." },
    { sentence: "What time is it", answer: "?", hint: "It's asking something." },
    { sentence: "We won the game", answer: "!", hint: "It's exciting news." },
    { sentence: "My favorite color is blue", answer: ".", hint: "It's a simple statement." },
    { sentence: "Where do you live", answer: "?", hint: "It's asking something." }
  ];

  const MARKS = [".", "?", "!"];
  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .pn-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;}
        .pn-sentence{font-size:1.6rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .pn-hint{color:var(--text-muted);font-size:0.95rem;}
        .pn-options{display:flex;gap:20px;}
        .pn-opt{text-align: center;align-content: space-evenly;width:70px;height:70px;border-radius:16px;background:white;border:3px solid var(--primary-blue);font-size:2rem;font-weight:800;color:var(--primary-blue);cursor:pointer;}
        .pn-opt:hover{background:#EBF8FF;}
      </style>
      <div class="pn-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p class="pn-sentence">"${r.sentence} __"</p>
        <p class="pn-hint">💡 ${r.hint}</p>
        <div class="pn-options" id="pn-options"></div>
      </div>
    `;
    const container = document.getElementById("pn-options");
    MARKS.forEach(m => {
      const btn = document.createElement("div");
      btn.className = "pn-opt";
      btn.innerText = m;
      btn.onclick = (e) => {
        if (m === r.answer) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Punctuation Pro!", "You picked the right mark for every sentence.");
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
