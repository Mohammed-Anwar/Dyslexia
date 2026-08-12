// Writing > Spelling > Vowel spelling
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { word: "cat", missingIndex: 1, options: ["a", "e", "i"] },
    { word: "dog", missingIndex: 1, options: ["o", "u", "a"] },
    { word: "pen", missingIndex: 1, options: ["e", "i", "o"] },
    { word: "sun", missingIndex: 1, options: ["u", "a", "e"] },
    { word: "boat", missingIndex: 1, options: ["oa", "ea", "ai"] },
    { word: "rain", missingIndex: 1, options: ["ai", "oa", "ee"] }
  ];

  let idx = 0;

  function speak(word) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }

  function build() {
    const r = ROUNDS[idx];
    const before = r.word.slice(0, r.missingIndex);
    // the correct option is whichever one actually matches the word at missingIndex
    const correct = r.options.find(o => r.word.slice(r.missingIndex, r.missingIndex + o.length) === o) || r.options[0];
    const afterPart = r.word.slice(r.missingIndex + correct.length);

    stage.innerHTML = `
      <style>
        .vs-wrap{display:flex;flex-direction:column;align-items:center;gap:22px;padding:20px;}
        .vs-word{font-size:2.6rem;font-weight:800;letter-spacing:4px;color:var(--text-dark);}
        .vs-blank{display:inline-block;min-width:50px;border-bottom:4px solid var(--primary-blue);color:var(--primary-blue);}
        .vs-btn{padding:10px 20px;border-radius:50px;border:none;background:var(--primary-blue);color:white;font-weight:700;cursor:pointer;}
        .vs-options{display:flex;gap:16px;}
        .vs-opt{text-align: center;align-content: space-evenly;width:70px;height:70px;border-radius:14px;background:white;border:3px solid var(--primary-blue);font-size:1.6rem;font-weight:800;color:var(--primary-blue);cursor:pointer;}
        .vs-opt:hover{background:#EBF8FF;}
      </style>
      <div class="vs-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <button class="vs-btn" id="vs-listen">🔊 Listen to the word</button>
        <div class="vs-word">${before}<span class="vs-blank" id="vs-blank">___</span>${afterPart}</div>
        <div class="vs-options" id="vs-options"></div>
      </div>
    `;

    document.getElementById("vs-listen").onclick = () => { window.GameHub.playSound("click"); speak(r.word); };

    const container = document.getElementById("vs-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "vs-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (opt === correct) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          document.getElementById("vs-blank").innerText = opt;
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Vowel Master!", "You filled in every missing vowel sound correctly.");
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

    speak(r.word);
  }

  build();
};
