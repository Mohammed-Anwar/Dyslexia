// Writing > Readiness > Distances
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { animal: "🐰", food: "🥕", needed: "short", note: "The rabbit's carrot is CLOSE." },
    { animal: "🐘", food: "🍌", needed: "long", note: "The elephant's banana is FAR away." },
    { animal: "🐱", food: "🐟", needed: "medium", note: "The cat's fish is a MEDIUM distance." },
    { animal: "🐦", food: "🐛", needed: "short", note: "The bird's worm is CLOSE." },
    { animal: "🐢", food: "🥬", needed: "long", note: "The turtle's lettuce is FAR away." }
  ];

  const OPTIONS = [
    { key: "short", label: "Short", width: 60 },
    { key: "medium", label: "Medium", width: 140 },
    { key: "long", label: "Long", width: 240 }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    stage.innerHTML = `
      <style>
        .di-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;}
        .di-title{font-size:1.15rem;font-weight:700;color:var(--text-dark);text-align:center;}
        .di-scene{display:flex;align-items:center;justify-content:center;gap:10px;font-size:3rem;background:#F8FAFC;border-radius:16px;padding:20px 40px;border:2px solid #E2E8F0;}
        .di-line-target{height:6px;width:120px;background:repeating-linear-gradient(90deg,#CBD5E0 0 8px,transparent 8px 16px);border-radius:4px;}
        .di-options{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}
        .di-opt{padding:14px 10px;background:white;border:3px solid var(--primary-blue);border-radius:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;color:var(--primary-blue);}
        .di-opt-bar{height:8px;border-radius:4px;background:var(--primary-blue);}
        .di-opt:hover{background:#EBF8FF;}
        .di-progress{color:var(--text-muted);font-weight:600;}
      </style>
      <div class="di-wrap">
        <p class="di-progress">Round ${idx + 1} / ${ROUNDS.length}</p>
        <div class="di-scene">
          <span>${r.animal}</span>
          <div class="di-line-target"></div>
          <span>${r.food}</span>
        </div>
        <p class="di-title">${r.note}<br>Pick the matching line length.</p>
        <div class="di-options" id="di-options"></div>
      </div>
    `;
    const container = document.getElementById("di-options");
    const shuffled = [...OPTIONS].sort(() => Math.random() - 0.5);
    shuffled.forEach(o => {
      const btn = document.createElement("div");
      btn.className = "di-opt";
      btn.innerHTML = `<div class="di-opt-bar" style="width:${o.width}px"></div><span>${o.label}</span>`;
      btn.onclick = (e) => {
        if (o.key === r.needed) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Great Judging!", "You matched every distance correctly.");
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
