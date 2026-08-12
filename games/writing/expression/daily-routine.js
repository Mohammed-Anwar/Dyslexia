// Writing > Expression > Daily routine
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ACTIVITIES = [
    { emoji: "🌅", text: "I wake up", time: "7:00 AM" },
    { emoji: "🦷", text: "I brush my teeth", time: "7:15 AM" },
    { emoji: "🍳", text: "I eat breakfast", time: "7:30 AM" },
    { emoji: "📚", text: "I study at school", time: "9:00 AM" },
    { emoji: "⚽", text: "I play outside", time: "4:00 PM" },
    { emoji: "🌙", text: "I go to sleep", time: "8:30 PM" }
  ];

  let built = [];

  function build() {
    built = [];
    const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
    stage.innerHTML = `
      <style>
        .dr-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;}
        .dr-title{font-weight:700;color:var(--text-dark);text-align:center;}
        .dr-timeline{width:min(500px,92%);display:flex;flex-direction:column;gap:8px;min-height:80px;}
        .dr-slot{background:#F8FAFC;border:2px dashed #CBD5E0;border-radius:10px;height:50px;display:flex;align-items:center;padding:0 14px;color:#A0AEC0;font-weight:600;}
        .dr-slot.filled{background:white;border:2px solid var(--primary-green);color:var(--text-dark);}
        .dr-pool{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:500px;}
        .dr-card{padding:10px 16px;border-radius:10px;background:white;border:2px solid var(--primary-blue);color:var(--text-dark);font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;}
        .dr-card:hover{background:#EBF8FF;}
        .dr-card.used{visibility:hidden;}
      </style>
      <div class="dr-wrap">
        <p class="dr-title">Tap the activities in the order they happen during the day, starting with the morning.</p>
        <div class="dr-timeline" id="dr-timeline"></div>
        <div class="dr-pool" id="dr-pool"></div>
      </div>
    `;
    const timeline = document.getElementById("dr-timeline");
    ACTIVITIES.forEach(() => {
      const slot = document.createElement("div");
      slot.className = "dr-slot";
      slot.innerText = "⋯";
      timeline.appendChild(slot);
    });

    const pool = document.getElementById("dr-pool");
    shuffled.forEach(act => {
      const card = document.createElement("div");
      card.className = "dr-card";
      card.innerHTML = `<span>${act.emoji}</span> ${act.text}`;
      card.onclick = (e) => {
        const expected = ACTIVITIES[built.length];
        if (act.text === expected.text) {
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          const slots = document.querySelectorAll("#dr-timeline .dr-slot");
          slots[built.length].classList.add("filled");
          slots[built.length].innerHTML = `<span style="margin-right:8px;">${act.emoji}</span> ${act.text} <span style="margin-left:auto;color:var(--primary-blue);font-size:0.85rem;">${act.time}</span>`;
          card.classList.add("used");
          built.push(act);
          if (built.length === ACTIVITIES.length) {
            setTimeout(() => window.GameHub.showComplete("Great Routine!", "You put your whole day in the right order."), 700);
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
