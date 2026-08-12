// Writing > Expression > Invitation
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const FIELDS = [
    { key: "to", label: "To:", options: ["My friend", "My cousin", "My teacher", "Type a name..."], custom: true },
    { key: "place", label: "Place:", options: ["My house", "The park", "The pool", "Type a place..."], custom: true },
    { key: "time", label: "Time:", options: ["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"] },
    { key: "day", label: "Day:", options: ["Saturday", "Sunday", "Friday"] }
  ];

  const answers = {};
  let fieldIdx = 0;

  function build() {
    stage.innerHTML = `
      <style>
        .iv-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;width:100%;}
        .iv-card{width:min(420px,92%);background:linear-gradient(135deg,#FFF5F7,#FFFBEA);border:3px solid var(--primary-green);border-radius:20px;padding:24px;box-shadow:0 4px 10px rgba(0,0,0,0.06);}
        .iv-card h3{color:var(--primary-green);margin-bottom:14px;text-align:center;}
        .iv-row{margin-bottom:10px;font-weight:600;color:var(--text-dark);}
        .iv-row b{color:var(--primary-blue);}
        .iv-field{font-size:1.05rem;font-weight:700;color:var(--text-dark);margin-bottom:10px;text-align:center;}
        .iv-options{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
        .iv-opt{padding:10px 16px;border-radius:10px;background:white;border:2px solid var(--primary-green);color:var(--primary-green);font-weight:700;cursor:pointer;}
        .iv-opt:hover{background:#F0FFF4;}
      </style>
      <div class="iv-wrap">
        <div class="iv-card">
          <h3>🎉 Birthday Invitation</h3>
          <div id="iv-summary"></div>
        </div>
        <div id="iv-question"></div>
      </div>
    `;
    renderSummary();
    renderQuestion();
  }

  function renderSummary() {
    const summary = document.getElementById("iv-summary");
    summary.innerHTML = FIELDS.map(f => `<div class="iv-row">${f.label} <b>${answers[f.key] || "____"}</b></div>`).join("");
  }

  function renderQuestion() {
    const qEl = document.getElementById("iv-question");
    if (fieldIdx >= FIELDS.length) {
      qEl.innerHTML = "";
      window.GameHub.showComplete("Party Time!", "You wrote a complete invitation with all the important details.");
      return;
    }
    const f = FIELDS[fieldIdx];
    qEl.innerHTML = `<p class="iv-field">${f.label}</p><div class="iv-options" id="iv-opts"></div>`;
    const opts = document.getElementById("iv-opts");
    f.options.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "iv-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (f.custom && opt.startsWith("Type")) {
          const val = prompt("Type it here:");
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
