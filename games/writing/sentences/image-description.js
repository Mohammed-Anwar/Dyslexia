// Writing > Sentences > Image description
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      scene: "🐶🎾", options: [
        "The dog is chasing the ball.",
        "The dog is sleeping in bed.",
        "The cat is drinking milk."
      ], answer: "The dog is chasing the ball."
    },
    {
      scene: "👧☂️🌧️", options: [
        "The girl is swimming in the pool.",
        "The girl is holding an umbrella in the rain.",
        "The boy is riding a bike."
      ], answer: "The girl is holding an umbrella in the rain."
    },
    {
      scene: "👦🚲🏞️", options: [
        "The boy is riding his bike in the park.",
        "The boy is eating breakfast.",
        "The girl is reading a book."
      ], answer: "The boy is riding his bike in the park."
    },
    {
      scene: "👩🍳🍳", options: [
        "The woman is cooking eggs in the kitchen.",
        "The man is washing the car.",
        "The child is flying a kite."
      ], answer: "The woman is cooking eggs in the kitchen."
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .id-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;}
        .id-scene{font-size:4rem;background:#F8FAFC;border:2px solid #E2E8F0;border-radius:20px;padding:24px 50px;}
        .id-options{display:flex;flex-direction:column;gap:12px;width:min(460px,90%);}
        .id-opt{padding:14px 18px;border-radius:12px;background:white;border:2px solid var(--primary-blue);color:var(--text-dark);font-weight:600;cursor:pointer;text-align:left;}
        .id-opt:hover{background:#EBF8FF;}
      </style>
      <div class="id-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <div class="id-scene">${r.scene}</div>
        <p style="font-weight:700;color:var(--text-dark);">Which sentence describes this scene?</p>
        <div class="id-options" id="id-options"></div>
      </div>
    `;
    const container = document.getElementById("id-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "id-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (opt === r.answer) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Great Describer!", "You matched every scene to the right sentence.");
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
