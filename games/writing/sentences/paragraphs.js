// Writing > Sentences > Paragraphs
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      sentences: [
        "First, I woke up and brushed my teeth.",
        "Then, I ate breakfast with my family.",
        "After that, I packed my school bag.",
        "Finally, I walked to school with my friend."
      ]
    },
    {
      sentences: [
        "First, we mixed the flour and sugar.",
        "Then, we added the eggs and milk.",
        "After that, we baked the cake for 30 minutes.",
        "Finally, we decorated it with icing."
      ]
    },
    {
      sentences: [
        "First, the seed was planted in the soil.",
        "Then, it was watered every day.",
        "After that, a small green sprout appeared.",
        "Finally, it grew into a tall plant."
      ]
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    const shuffled = [...r.sentences].sort(() => Math.random() - 0.5);
    let built = [];

    stage.innerHTML = `
      <style>
        .pg-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;}
        .pg-title{font-weight:700;color:var(--text-dark);}
        .pg-paragraph{width:min(520px,92%);min-height:120px;background:#F8FAFC;border:2px dashed #CBD5E0;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px;}
        .pg-line{background:var(--primary-green);color:white;padding:10px 14px;border-radius:10px;font-weight:600;}
        .pg-pool{display:flex;flex-direction:column;gap:10px;width:min(520px,92%);}
        .pg-card{padding:12px 16px;border-radius:10px;background:white;border:2px solid var(--primary-blue);color:var(--text-dark);font-weight:600;cursor:pointer;text-align:left;}
        .pg-card:hover{background:#EBF8FF;}
        .pg-card.used{visibility:hidden;}
      </style>
      <div class="pg-wrap">
        <p class="pg-title">Round ${idx + 1} / ${ROUNDS.length} — Tap sentences in the correct order to build the paragraph</p>
        <div class="pg-paragraph" id="pg-paragraph"><span style="color:#A0AEC0;">Your paragraph will appear here...</span></div>
        <div class="pg-pool" id="pg-pool"></div>
      </div>
    `;

    const paragraph = document.getElementById("pg-paragraph");
    const pool = document.getElementById("pg-pool");
    shuffled.forEach(sentence => {
      const card = document.createElement("div");
      card.className = "pg-card";
      card.innerText = sentence;
      card.onclick = (e) => {
        const expected = r.sentences[built.length];
        if (sentence === expected) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          if (built.length === 0) paragraph.innerHTML = "";
          const line = document.createElement("div");
          line.className = "pg-line";
          line.innerText = sentence;
          paragraph.appendChild(line);
          card.classList.add("used");
          built.push(sentence);
          if (built.length === r.sentences.length) {
            idx++;
            setTimeout(() => {
              if (idx >= ROUNDS.length) {
                window.GameHub.showComplete("Paragraph Pro!", "You sequenced every paragraph in perfect order.");
              } else {
                build();
              }
            }, 800);
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
