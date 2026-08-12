// Writing > Readiness > Location / Position
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    { target: "top", label: "TOP", icon: "☁️" },
    { target: "bottom", label: "BOTTOM", icon: "🌱" },
    { target: "left", label: "LEFT", icon: "⬅️" },
    { target: "right", label: "RIGHT", icon: "➡️" },
    { target: "inside", label: "INSIDE", icon: "📦" },
    { target: "outside", label: "OUTSIDE", icon: "🌳" }
  ];

  let order = [...ROUNDS].sort(() => Math.random() - 0.5).slice(0, 5);
  let idx = 0;

  stage.innerHTML = `
    <style>
      .lp-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;width:100%;height:100%;padding:20px;}
      .lp-instruction{font-size:1.3rem;font-weight:700;color:var(--text-dark);text-align:center;}
      .lp-instruction b{color:var(--primary-blue);}
      .lp-arena{position:relative;width:min(560px,90%);height:340px;background:#F1F5F9;border:3px dashed #CBD5E0;border-radius:20px;flex-shrink:0;}
      .lp-box{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:130px;height:130px;background:white;border:3px solid var(--primary-blue);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2rem;}
      .lp-star{position:absolute;top:16px;left:16px;width:64px;height:64px;border-radius:50%;background:var(--primary-green);color:white;font-size:2rem;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 4px 0 #2f855a;user-select:none;}
      .lp-progress{font-weight:700;color:var(--text-muted);}
    </style>
    <div class="lp-wrap">
      <p class="lp-progress">Round <span id="lp-round">1</span> / ${order.length}</p>
      <p class="lp-instruction">Drag the star to be <b id="lp-target-label"></b> the box!</p>
      <div class="lp-arena" id="lp-arena">
        <div class="lp-box" id="lp-box">📦</div>
        <div class="lp-star" id="lp-star">⭐</div>
      </div>
    </div>
  `;

  const arena = document.getElementById("lp-arena");
  const box = document.getElementById("lp-box");
  const star = document.getElementById("lp-star");
  const label = document.getElementById("lp-target-label");
  const roundEl = document.getElementById("lp-round");

  function setRound() {
    star.resetPosition && star.resetPosition();
    star.style.top = "16px";
    star.style.left = "16px";
    label.innerText = order[idx].label;
    roundEl.innerText = idx + 1;
  }

  function checkPlacement(clientX, clientY) {
    const arenaRect = arena.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const relX = (clientX - boxRect.left - boxRect.width / 2);
    const relY = (clientY - boxRect.top - boxRect.height / 2);
    const inside = Math.abs(relX) < boxRect.width * 0.3 && Math.abs(relY) < boxRect.height * 0.3;
    const outside = clientX < arenaRect.left + 10 || clientX > arenaRect.right - 10 ||
      clientY < arenaRect.top + 10 || clientY > arenaRect.bottom - 10;

    let result;
    if (inside) result = "inside";
    else if (Math.abs(relY) > Math.abs(relX)) result = relY < 0 ? "top" : "bottom";
    else result = relX < 0 ? "left" : "right";
    if (order[idx].target === "outside" && outside) result = "outside";

    return result === order[idx].target;
  }

  window.GameHub.utils.makeDraggable(star, (x, y) => {
    if (checkPlacement(x, y)) {
      window.GameHub.playSound("correct");
      window.GameHub.triggerVFX(x, y);
      idx++;
      if (idx >= order.length) {
        setTimeout(() => window.GameHub.showComplete("Great Positioning!", "You placed every star in the right spot."), 400);
      } else {
        setTimeout(setRound, 500);
      }
    } else {
      window.GameHub.playSound("wrong");
      star.style.transform = "translate3d(0,0,0)";
      star.resetPosition();
    }
  });

  setRound();
};
