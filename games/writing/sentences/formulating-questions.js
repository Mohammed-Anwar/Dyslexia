// Writing > Sentences > Formulating questions
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      answer: "Ahmed went to school.",
      questionWord: "Where",
      chips: ["Where", "did", "Ahmed", "go", "?"],
      built: "Where did Ahmed go?"
    },
    {
      answer: "She is eating an apple.",
      questionWord: "What",
      chips: ["What", "is", "she", "eating", "?"],
      built: "What is she eating?"
    },
    {
      answer: "The movie starts at 7 PM.",
      questionWord: "When",
      chips: ["When", "does", "the", "movie", "start", "?"],
      built: "When does the movie start?"
    },
    {
      answer: "My mom is cooking dinner.",
      questionWord: "Who",
      chips: ["Who", "is", "cooking", "dinner", "?"],
      built: "Who is cooking dinner?"
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    const shuffled = [...r.chips].sort(() => Math.random() - 0.5);
    let built = [];

    stage.innerHTML = `
      <style>
        .fq-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;}
        .fq-answer{font-size:1.2rem;font-weight:700;color:var(--text-dark);background:#F8FAFC;border:2px solid #E2E8F0;border-radius:12px;padding:14px 22px;}
        .fq-line{width:min(500px,90%);min-height:60px;border-bottom:4px solid var(--primary-blue);display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px;}
        .fq-pool{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:500px;}
        .fq-chip{padding:10px 16px;border-radius:10px;background:white;border:2px solid var(--primary-green);color:var(--primary-green);font-weight:700;cursor:pointer;}
        .fq-chip:hover{background:#F0FFF4;}
        .fq-chip.used{visibility:hidden;}
        .fq-built{padding:8px 12px;background:var(--primary-blue);color:white;border-radius:8px;font-weight:700;}
      </style>
      <div class="fq-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p style="font-weight:700;">Answer: <span class="fq-answer">${r.answer}</span></p>
        <p style="color:var(--text-muted);">Now build the QUESTION that goes with this answer:</p>
        <div class="fq-line" id="fq-line"></div>
        <div class="fq-pool" id="fq-pool"></div>
      </div>
    `;
    const line = document.getElementById("fq-line");
    const pool = document.getElementById("fq-pool");

    shuffled.forEach(chip => {
      const el = document.createElement("div");
      el.className = "fq-chip";
      el.innerText = chip;
      el.onclick = (e) => {
        const expected = r.chips[built.length];
        if (chip === expected) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          const b = document.createElement("span");
          b.className = "fq-built";
          b.innerText = chip;
          line.appendChild(b);
          el.classList.add("used");
          built.push(chip);
          if (built.length === r.chips.length) {
            idx++;
            setTimeout(() => {
              if (idx >= ROUNDS.length) {
                window.GameHub.showComplete("Question Master!", "You formulated every question correctly.");
              } else {
                build();
              }
            }, 800);
          }
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      pool.appendChild(el);
    });
  }

  build();
};
