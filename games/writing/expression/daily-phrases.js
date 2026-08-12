// Writing > Expression > Daily phrases
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      situation: "😔 You bumped into a friend by accident.",
      options: ["I'm sorry!", "Thank you!", "Welcome!"],
      answer: "I'm sorry!"
    },
    {
      situation: "🎁 Someone gave you a present.",
      options: ["Excuse me.", "Thank you so much!", "Goodbye."],
      answer: "Thank you so much!"
    },
    {
      situation: "🚪 A guest arrives at your house.",
      options: ["Welcome! Come on in.", "I'm sorry.", "See you later."],
      answer: "Welcome! Come on in."
    },
    {
      situation: "🤧 Your friend just sneezed.",
      options: ["Bless you!", "Congratulations!", "Please."],
      answer: "Bless you!"
    },
    {
      situation: "🎂 It's your friend's birthday.",
      options: ["Happy Birthday!", "I'm sorry.", "Excuse me."],
      answer: "Happy Birthday!"
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .dp-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;}
        .dp-situation{font-size:1.2rem;font-weight:700;color:var(--text-dark);text-align:center;max-width:440px;background:#F8FAFC;border:2px solid #E2E8F0;border-radius:16px;padding:20px;}
        .dp-options{display:flex;flex-direction:column;gap:12px;width:min(400px,90%);}
        .dp-opt{padding:14px 18px;border-radius:12px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-weight:700;cursor:pointer;text-align:center;}
        .dp-opt:hover{background:#EBF8FF;}
      </style>
      <div class="dp-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <div class="dp-situation">${r.situation}<br><span style="font-size:0.9rem;color:var(--text-muted);font-weight:500;">What should you say?</span></div>
        <div class="dp-options" id="dp-options"></div>
      </div>
    `;
    const container = document.getElementById("dp-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "dp-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (opt === r.answer) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Polite & Kind!", "You picked the perfect phrase for every situation.");
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
