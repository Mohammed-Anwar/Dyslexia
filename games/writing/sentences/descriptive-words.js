// Writing > Sentences > Descriptive words
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    {
      base: "The boy plays",
      slots: [
        { type: "adjective", options: ["active", "sleepy", "hungry"], correct: "active", pos: "before boy" },
        { type: "detail", options: ["ball in the garden", "spoon in the kitchen"], correct: "ball in the garden", pos: "after plays" }
      ],
      template: (adj, detail) => `The ${adj} boy plays ${detail}.`
    },
    {
      base: "The dog runs",
      slots: [
        { type: "adjective", options: ["fast", "quiet", "tiny"], correct: "fast", pos: "before dog" },
        { type: "detail", options: ["through the yard", "under the table"], correct: "through the yard", pos: "after runs" }
      ],
      template: (adj, detail) => `The ${adj} dog runs ${detail}.`
    },
    {
      base: "The girl sings",
      slots: [
        { type: "adjective", options: ["happy", "shy", "loud"], correct: "happy", pos: "before girl" },
        { type: "detail", options: ["a beautiful song", "in the shower"], correct: "a beautiful song", pos: "after sings" }
      ],
      template: (adj, detail) => `The ${adj} girl sings ${detail}.`
    }
  ];

  let idx = 0;
  let chosen = {};

  function build() {
    const r = ROUNDS[idx];
    chosen = {};
    stage.innerHTML = `
      <style>
        .dw-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;width:100%;}
        .dw-base{font-size:1.3rem;font-weight:700;color:var(--text-dark);}
        .dw-preview{font-size:1.4rem;font-weight:700;color:var(--primary-green);min-height:40px;text-align:center;}
        .dw-slot-group{display:flex;flex-direction:column;gap:8px;align-items:center;}
        .dw-label{color:var(--text-muted);font-weight:600;font-size:0.85rem;}
        .dw-options{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
        .dw-opt{padding:10px 18px;border-radius:10px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-weight:700;cursor:pointer;}
        .dw-opt.chosen{background:var(--primary-blue);color:white;}
        .dw-opt:hover{background:#EBF8FF;}
      </style>
      <div class="dw-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        <p class="dw-base">Start: "${r.base}..."</p>
        <p class="dw-preview" id="dw-preview">Choose words to describe the sentence!</p>
        <div id="dw-slots" style="display:flex;gap:30px;flex-wrap:wrap;justify-content:center;"></div>
      </div>
    `;
    const slotsEl = document.getElementById("dw-slots");
    r.slots.forEach((slot, si) => {
      const group = document.createElement("div");
      group.className = "dw-slot-group";
      group.innerHTML = `<span class="dw-label">Pick a ${slot.type}</span>`;
      const opts = document.createElement("div");
      opts.className = "dw-options";
      const shuffled = [...slot.options].sort(() => Math.random() - 0.5);
      shuffled.forEach(opt => {
        const btn = document.createElement("div");
        btn.className = "dw-opt";
        btn.innerText = opt;
        btn.onclick = (e) => {
          opts.querySelectorAll(".dw-opt").forEach(b => b.classList.remove("chosen"));
          btn.classList.add("chosen");
          chosen[si] = opt;
          updatePreview(r);
          if (Object.keys(chosen).length === r.slots.length) {
            const correctPick = r.slots.every((s, i) => chosen[i] === s.correct);
            setTimeout(() => {
              if (correctPick) {
                window.GameHub.playSound("correct");
                window.GameHub.triggerVFX(e.clientX, e.clientY);
                idx++;
                setTimeout(() => {
                  if (idx >= ROUNDS.length) {
                    window.GameHub.showComplete("Vivid Writer!", "You expanded every sentence with great detail.");
                  } else {
                    build();
                  }
                }, 700);
              } else {
                window.GameHub.playSound("wrong");
              }
            }, 200);
          }
        };
        opts.appendChild(btn);
      });
      group.appendChild(opts);
      slotsEl.appendChild(group);
    });
  }

  function updatePreview(r) {
    const adj = chosen[0] || "___";
    const detail = chosen[1] || "___";
    document.getElementById("dw-preview").innerText = r.template(adj, detail);
  }

  build();
};
