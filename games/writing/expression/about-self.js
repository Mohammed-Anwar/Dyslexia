// Writing > Expression > About self
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const FIELDS = [
    { key: "name", label: "My name is", options: ["Alex", "Sam", "Mia", "Type your own..."], custom: true },
    { key: "age", label: "I am ___ years old", options: ["6", "7", "8", "9", "10"] },
    { key: "hobby", label: "My favorite hobby is", options: ["drawing", "soccer", "reading", "dancing", "swimming"] },
    { key: "color", label: "My favorite color is", options: ["red", "blue", "green", "purple", "yellow"] }
  ];

  const answers = {};
  let fieldIdx = 0;

  function build() {
    stage.innerHTML = `
      <style>
        .as-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;width:100%;}
        .as-card{width:min(420px,92%);background:white;border:3px solid var(--primary-blue);border-radius:20px;padding:24px;box-shadow:0 4px 10px rgba(0,0,0,0.06);}
        .as-card h3{color:var(--primary-blue);margin-bottom:14px;text-align:center;}
        .as-row{margin-bottom:10px;font-weight:600;color:var(--text-dark);}
        .as-row b{color:var(--primary-green);}
        .as-field{font-size:1.05rem;font-weight:700;color:var(--text-dark);margin-bottom:10px;text-align:center;}
        .as-options{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
        .as-opt{padding:10px 16px;border-radius:10px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-weight:700;cursor:pointer;}
        .as-opt:hover{background:#EBF8FF;}
        .as-input{padding:10px;border:2px solid var(--primary-blue);border-radius:10px;font-size:1rem;text-align:center;}
      </style>
      <div class="as-wrap">
        <div class="as-card">
          <h3>🪪 My ID Card</h3>
          <div id="as-summary"></div>
        </div>
        <div id="as-question"></div>
      </div>
    `;
    renderSummary();
    renderQuestion();
  }

  function renderSummary() {
    const summary = document.getElementById("as-summary");
    summary.innerHTML = FIELDS.map(f => `<div class="as-row">${f.label.replace("___", "")}: <b>${answers[f.key] || "____"}</b></div>`).join("");
  }

  function renderQuestion() {
    const qEl = document.getElementById("as-question");
    if (fieldIdx >= FIELDS.length) {
      qEl.innerHTML = "";
      window.GameHub.showComplete("Nice to Meet You!", "You filled out your very own ID card.");
      return;
    }
    const f = FIELDS[fieldIdx];
    qEl.innerHTML = `<p class="as-field">${f.label}...</p><div class="as-options" id="as-opts"></div>`;
    const opts = document.getElementById("as-opts");
    f.options.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "as-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (f.custom && opt === "Type your own...") {
          const val = prompt("Type your name:");
          if (val) selectAnswer(f, val, e);
        } else {
          selectAnswer(f, opt, e);
        }
      };
      opts.appendChild(btn);
    });
  }

  function selectAnswer(f, value, e) {
    answers[f.key] = value;
    window.GameHub.playSound("correct");
    if (e) window.GameHub.triggerVFX(e.clientX, e.clientY);
    renderSummary();
    fieldIdx++;
    setTimeout(renderQuestion, 400);
  }

  build();
};
