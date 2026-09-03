// Writing > Spelling > Vowel spelling (Magic E & Long Vowels)
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    // Phase 1: Magic E Transformations (Contrast Pairs) - Rounds 1 to 5
    { 
      type: "magic_e", 
      short: "cap", 
      long: "cape", 
      emoji: "🧢", 
      vowelIdx: 1, // Index of the vowel that will glow (0-based)
      prompt: "Add Magic E to make the vowel say its name!", 
      options: ["e", "s", "t"] 
    },
    { 
      type: "magic_e", 
      short: "hop", 
      long: "hope", 
      emoji: "🤸", 
      vowelIdx: 1, 
      prompt: "Add Magic E to make the vowel say its name!", 
      options: ["e", "r", "n"] 
    },
    { 
      type: "magic_e", 
      short: "kit", 
      long: "kite", 
      emoji: "🪁", 
      vowelIdx: 1, 
      prompt: "Add Magic E to make the vowel say its name!", 
      options: ["e", "y", "d"] 
    },
    { 
      type: "magic_e", 
      short: "tub", 
      long: "tube", 
      emoji: "🛁", 
      vowelIdx: 1, 
      prompt: "Add Magic E to make the vowel say its name!", 
      options: ["e", "b", "p"] 
    },
    { 
      type: "magic_e", 
      short: "mad", 
      long: "made", 
      emoji: "😠", 
      vowelIdx: 1, 
      prompt: "Add Magic E to make the vowel say its name!", 
      options: ["e", "s", "n"] 
    },

    // Phase 2: Long Vowel Teams - Rounds 6 to 10
    { 
      type: "team", 
      display: "b__t", 
      answer: "oa", 
      full: "boat", 
      emoji: "⛵", 
      prompt: "Choose the long vowel sound for this picture.", 
      options: ["oa", "a", "e"] 
    },
    { 
      type: "team", 
      display: "tr__", 
      answer: "ee", 
      full: "tree", 
      emoji: "🌳", 
      prompt: "Choose the long vowel sound for this picture.", 
      options: ["ee", "e", "i"] 
    },
    { 
      type: "team", 
      display: "r__n", 
      answer: "ai", 
      full: "rain", 
      emoji: "🌧️", 
      prompt: "Choose the long vowel sound for this picture.", 
      options: ["ai", "a", "o"] 
    },
    { 
      type: "team", 
      display: "sn__", 
      answer: "ow", 
      full: "snow", 
      emoji: "❄️", 
      prompt: "Choose the long vowel sound for this picture.", 
      options: ["ow", "o", "u"] 
    },
    { 
      type: "team", 
      display: "sh__p", 
      answer: "ee", 
      full: "sheep", 
      emoji: "🐑", 
      prompt: "Choose the long vowel sound for this picture.", 
      options: ["ee", "e", "i"] 
    }
  ];

  let idx = 0;

  function build() {
    const r = ROUNDS[idx];
    
    // بناء عرض الكلمة بناءً على النوع
    let wordHTML = "";
    if (r.type === "magic_e") {
      const letters = r.short.split("");
      wordHTML = letters.map((char, i) => {
        // إضافة فئة خاصة لحرف العلة ليتمكن من التوهج لاحقاً
        const glowClass = i === r.vowelIdx ? "vs-vowel" : "";
        return `<span class="vs-letter ${glowClass}" id="letter-${i}">${char}</span>`;
      }).join("") + `<span class="vs-blank" id="vs-blank">?</span>`;
    } else {
      const parts = r.display.split("__");
      wordHTML = `<span class="vs-letter">${parts[0]}</span><span class="vs-blank" id="vs-blank">__</span><span class="vs-letter">${parts[1] || ""}</span>`;
    }

    stage.innerHTML = `
      <style>
        .vs-wrap{display:flex;flex-direction:column;align-items:center;gap:22px;padding:20px;width:100%;}
        .vs-emoji{font-size:5rem;filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));}
        .vs-prompt{font-size:1.1rem;font-weight:700;color:var(--text-dark);text-align:center;max-width:400px;line-height:1.4;}
        .vs-word{font-size:3rem;font-weight:800;letter-spacing:6px;color:var(--text-dark);display:flex;align-items:center;gap:4px;}
        .vs-letter{transition: all 0.4s ease;}
        .vs-vowel{color:var(--primary-blue);}
        .vs-vowel.magic-glow{color:var(--primary-green);text-shadow: 0 0 15px rgba(72,187,120,0.6);transform: scale(1.3);}
        .vs-blank{display:inline-flex;align-items:center;justify-content:center;min-width:60px;height:60px;border-bottom:4px solid var(--primary-blue);color:var(--primary-blue);font-size:2rem;font-weight:800;transition: all 0.3s;}
        .vs-btn{padding:10px 20px;border-radius:50px;border:none;background:var(--primary-blue);color:white;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:1rem;box-shadow: 0 3px 0 #2b6cb0; transition: transform 0.1s;}
        .vs-btn:active{transform: translateY(2px); box-shadow: 0 1px 0 #2b6cb0;}
        .vs-options{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}
        .vs-opt{width:70px;height:70px;border-radius:14px;background:white;border:3px solid var(--primary-blue);font-size:1.6rem;font-weight:800;color:var(--primary-blue);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow: 0 4px 0 #2b6cb0;}
        .vs-opt:hover{background:#EBF8FF;transform:translateY(-2px);}
        .vs-opt:active{transform:translateY(2px);box-shadow: 0 1px 0 #2b6cb0;}
      </style>
      <div class="vs-wrap">
        <p style="color:var(--text-muted);font-weight:600;">Round ${idx + 1} / ${ROUNDS.length}</p>
        
        <div class="vs-emoji">${r.emoji}</div>
        
        <p class="vs-prompt">${r.prompt}</p>
        
        <button class="vs-btn" id="vs-listen">
          <span>🔊</span> Listen
        </button>
        
        <div class="vs-word" id="vs-word-display">
          ${wordHTML}
        </div>
        
        <div class="vs-options" id="vs-options"></div>
      </div>
    `;

    // زر الاستماع (ينطق الكلمة القصيرة في البداية، أو الكلمة الكاملة كفكرة عامة)
    document.getElementById("vs-listen").onclick = () => { 
      window.GameHub.playSound("click"); 
      const wordToSpeak = r.type === "magic_e" ? r.short : r.full;
      window.GameHub.speak(wordToSpeak); 
    };

    // نطق تلقائي عند بدء الجولة لتوجيه الطفل
    setTimeout(() => {
      const wordToSpeak = r.type === "magic_e" ? r.short : r.full;
      window.GameHub.speak(wordToSpeak);
    }, 500);

    const container = document.getElementById("vs-options");
    const shuffled = [...r.options].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "vs-opt";
      btn.innerText = opt;
      btn.onclick = (e) => {
        if (opt === (r.type === "magic_e" ? "e" : r.answer)) {
          // إجابة صحيحة
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          
          const blank = document.getElementById("vs-blank");
          blank.innerText = opt;
          blank.style.color = "var(--primary-green)";
          blank.style.borderBottomColor = "var(--primary-green)";
          
          // التأثير التعليمي البصري: إذا كان Magic E، نجعل حرف العلة يضيء
          if (r.type === "magic_e") {
            const vowelEl = document.getElementById(`letter-${r.vowelIdx}`);
            if (vowelEl) vowelEl.classList.add("magic-glow");
            window.GameHub.speak(r.long); // نطق الكلمة الطويلة الجديدة
          } else {
            window.GameHub.speak(r.full);
          }

          idx++;
          setTimeout(() => {
            if (idx >= ROUNDS.length) {
              window.GameHub.showComplete("Vowel Master!", "You mastered short sounds, long sounds, and the Magic E!");
            } else {
              build();
            }
          }, 1200); // وقت أطول قليلاً ليستوعب الطفل التغيير البصري والصوتي
        } else {
          // إجابة خاطئة
          window.GameHub.playSound("wrong");
          window.GameHub.speak("Try again");
          btn.style.borderColor = "#E53E3E";
          btn.style.color = "#E53E3E";
          btn.style.transform = "translateX(-5px)";
          setTimeout(() => { btn.style.transform = "translateX(5px)"; }, 50);
          setTimeout(() => { 
            btn.style.transform = "translateX(0)"; 
            btn.style.borderColor = "var(--primary-blue)";
            btn.style.color = "var(--primary-blue)";
          }, 100);
        }
      };
      container.appendChild(btn);
    });
  }

  build();
};