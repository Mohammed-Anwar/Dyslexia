// Writing > Expression > Short story
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      panels: ["🌱", "🌤️💧", "🌻"],
      question: "What happens next?",
      options: [
        { text: "The seed grows into a beautiful flower.", correct: true },
        { text: "The seed turns into a rock.", correct: false },
        { text: "The seed flies into space.", correct: false }
      ]
    },
    {
      panels: ["🐛", "🛏️", "🦋"],
      question: "How does the story end?",
      options: [
        { text: "The caterpillar becomes a butterfly.", correct: true },
        { text: "The caterpillar turns into a fish.", correct: false },
        { text: "The caterpillar disappears forever.", correct: false }
      ]
    },
    {
      panels: ["👦", "⚽", "🏆"],
      question: "What is the ending of the story?",
      options: [
        { text: "The boy practices soccer and wins a trophy.", correct: true },
        { text: "The boy loses his shoes.", correct: false },
        { text: "The boy goes to sleep instead.", correct: false }
      ]
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .st-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;}
        .st-panels{display:flex;gap:16px;}
        .st-panel{width:100px;height:100px;background:#F8FAFC;border:2px solid #E2E8F0;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2.6rem;}
        .st-arrow{font-size:1.6rem;color:#CBD5E0;align-self:center;}
        .st-question{font-weight:700;color:var(--text-dark);}
        .st-options{display:flex;flex-direction:column;gap:12px;width:min(460px,90%);}
        .st-opt{padding:14px 18px;border-radius:12px;background:white;border:2px solid var(--primary-blue);color:var(--text-dark);font-weight:600;cursor:pointer;text-align:left;}
        .st-opt:hover{background:#EBF8FF;}
      </style>
      <div class="st-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <div class="st-panels">
          ${r.panels.map((p, i) => `<div class="st-panel">${p}</div>${i < r.panels.length - 1 ? '<span class="st-arrow">➡️</span>' : ''}`).join("")}
        </div>
        <p class="st-question">${r.question}</p>
        <div class="st-options" id="st-options"></div>
      </div>
    `;
    const container = document.getElementById("st-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "st-opt";
      btn.innerText = opt.text;
      btn.onclick = (e) => {
        if (opt.correct) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Storyteller!", "You chose the perfect ending for every story.");
            } else {
              build();
            }
          }, 700);
        } else {
          window.GameHub.playSound("wrong");
        }
      };
      container.appendChild(btn);
    });
  }

  build();
};
