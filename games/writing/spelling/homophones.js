// Writing > Spelling > Homophones
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { sentence: "Please ___ your name here.", options: ["write", "right"], answer: "write" },
    { sentence: "Turn ___ at the corner.", options: ["write", "right"], answer: "right" },
    { sentence: "I can ___ the ball far.", options: ["throw", "though"], answer: "throw" },
    { sentence: "We ___ two apples for lunch.", options: ["ate", "eight"], answer: "ate" },
    { sentence: "There are ___ cookies left.", options: ["ate", "eight"], answer: "eight" },
    { sentence: "The ___ is blowing hard today.", options: ["wind", "wined"], answer: "wind" },
    { sentence: "Their ___ is parked outside.", options: ["car", "care"], answer: "car" }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    const parts = r.sentence.split("___");
    stage.innerHTML = `
      <style>
        .hp-wrap{display:flex;flex-direction:column;align-items:center;gap:22px;padding:20px;}
        .hp-sentence{font-size:1.4rem;font-weight:700;color:var(--text-dark);text-align:center;max-width:500px;}
        .hp-blank{display:inline-block;min-width:80px;border-bottom:4px solid var(--primary-blue);color:var(--primary-blue);}
        .hp-options{display:flex;gap:20px;}
        .hp-opt{padding:14px 28px;border-radius:14px;background:white;border:3px solid var(--primary-blue);font-size:1.2rem;font-weight:700;color:var(--primary-blue);cursor:pointer;}
        .hp-opt:hover{background:#EBF8FF;}
      </style>
      <div class="hp-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p class="hp-sentence">${parts[0]}<span class="hp-blank" id="hp-blank">____</span>${parts[1]}</p>
        <div class="hp-options" id="hp-options"></div>
      </div>
    `;
    const container = document.getElementById("hp-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "hp-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (opt === r.answer) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          document.getElementById("hp-blank").innerText = opt;
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Sound-alike Star!", "You chose the correctly spelled word every time.");
            } else {
              build();
            }
          }, 600);
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      container.appendChild(btn);
    });
  }

  build();
};
