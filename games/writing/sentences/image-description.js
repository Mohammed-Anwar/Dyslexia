window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // قاعدة البيانات: 15 جولة مقسمة على 3 مراحل
  const ROUNDS = [
    // --- المرحلة الأولى: البناء الحركي للجملة (Kinesthetic Building) ---
    {
      stage: 1,
      scene: "👧🥛",
      words: ["drinks", "The", "girl", "milk.", "eats"], // تمت إضافة النقطة للكلمة الأخيرة لتسهيل البناء
      answer: "The girl drinks milk."
    },
    {
      stage: 1,
      scene: "🌱🟫",
      words: ["soil.", "under", "Roots", "the", "grow", "fly"],
      answer: "Roots grow under the soil."
    },
    {
      stage: 1,
      scene: "🦅☁️",
      words: ["eagle", "wings.", "The", "has", "reads"],
      answer: "The eagle has wings."
    },
    {
      stage: 1,
      scene: "🥭🌳",
      words: ["on", "Mangoes", "trees.", "grow", "sleep"],
      answer: "Mangoes grow on trees."
    },
    {
      stage: 1,
      scene: "❤️🩸",
      words: ["heart", "blood.", "pumps", "Our", "drinks"],
      answer: "Our heart pumps blood."
    },
    
    // --- المرحلة الثانية: الكتابة الموجهة (Guided Typing) ---
    {
      stage: 2,
      scene: "👦🚲",
      partialSentence: "The boy rides a ___",
      answer: "bike"
    },
    {
      stage: 2,
      scene: "👦🦷",
      partialSentence: "We chew food with our ___",
      answer: "teeth"
    },
    {
      stage: 2,
      scene: "🐎💨",
      partialSentence: "Horses are very ___",
      answer: "fast"
    },
    {
      stage: 2,
      scene: "🌻🚿",
      partialSentence: "The plant needs ___",
      answer: "water"
    },
    {
      stage: 2,
      scene: "🎣🐟",
      partialSentence: "Fishermen catch ___",
      answer: "fish"
    },

    // --- المرحلة الثالثة: الكتابة الحرة المدعومة (Supported Free Writing) ---
    {
      stage: 3,
      scene: "👧👦🌳",
      words: ["park.", "They", "sleep", "the", "play", "in"],
      answer: "They play in the park."
    },
    {
      stage: 3,
      scene: "👦🌬️",
      words: ["breathe", "water", "We", "air."],
      answer: "We breathe air."
    },
    {
      stage: 3,
      scene: "🦌✨",
      words: ["beautiful.", "gazelle", "looks", "The", "ugly"],
      answer: "The gazelle looks beautiful."
    },
    {
      stage: 3,
      scene: "👨🌾🎋",
      words: ["sugar", "grow", "read", "We", "cane."],
      answer: "We grow sugar cane."
    },
    {
      stage: 3,
      scene: "🐦🦜",
      words: ["has", "teeth", "bird", "a", "The", "beak."],
      answer: "The bird has a beak."
    }
  ];

  let levelIndex = 0;

  // دالة لخلط المصفوفات (للكلمات المشتتة وبنك الكلمات)
  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // دالة لتنظيف النص للمقارنة (تجاهل حالة الأحرف وإزالة المسافات الزائدة)
  function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function build() {
    const r = ROUNDS[levelIndex];
    const stageName = r.stage === 1 ? "Stage 1: Build the Sentence" : 
                      r.stage === 2 ? "Stage 2: Fill in the Blank" : 
                                      "Stage 3: Write the Sentence";

    let specificHTML = "";

    // --- بناء واجهة المرحلة الأولى ---
    if (r.stage === 1) {
      const shuffledWords = shuffle(r.words);
      specificHTML = `
        <p style="font-weight:700; color:var(--text-dark); font-size: 1.1rem;">Click words to build the sentence:</p>
        <div class="drop-zone" id="drop-zone"></div>
        <div class="word-bank" id="word-bank">
          ${shuffledWords.map((word, i) => `<div class="word-chip" data-word="${word}" data-id="w${i}">${word}</div>`).join('')}
        </div>
        <div style="display:flex; gap:10px;">
          <button class="game-btn secondary" id="clear-btn">Clear</button>
          <button class="game-btn success" id="check-btn">Check Answer</button>
        </div>
      `;
    } 
    // --- بناء واجهة المرحلة الثانية ---
    else if (r.stage === 2) {
      const parts = r.partialSentence.split("___");
      specificHTML = `
        <p style="font-weight:700; color:var(--text-dark); font-size: 1.1rem;">Type the missing word:</p>
        <div class="sentence-prompt">
          <span>${parts[0]}</span>
          <input type="text" class="typing-input" id="typing-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width: 120px; display: inline-block; margin: 0 5px;">
          <span>${parts[1]}</span>
        </div>
        <button class="game-btn success" id="check-btn" style="margin-top: 20px;">Check Answer</button>
      `;
    } 
    // --- بناء واجهة المرحلة الثالثة ---
    else if (r.stage === 3) {
      const shuffledWords = shuffle(r.words);
      specificHTML = `
        <p style="font-weight:700; color:var(--text-dark); font-size: 1.1rem;">Type the full sentence. Use the word bank for help:</p>
        <input type="text" class="typing-input" id="typing-input" placeholder="Type your sentence here..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <div style="margin-top: 15px;">
          <p style="font-size: 0.85rem; color:var(--text-muted); margin-bottom: 8px; font-weight:600;">Word Bank:</p>
          <div class="word-bank">
            ${shuffledWords.map(word => `<div class="word-chip" style="cursor: default; background: #F8FAFC; border-color: #CBD5E0;">${word}</div>`).join('')}
          </div>
        </div>
        <button class="game-btn success" id="check-btn" style="margin-top: 20px;">Check Answer</button>
      `;
    }

    // الهيكل العام للحقن
    stage.innerHTML = `
      <style>
        .cd-wrap { 
          display:flex; flex-direction:column; align-items:center; gap:20px; padding:30px; width:100%; height:100%; 
          user-select: none; -webkit-user-select: none; overflow-y: auto;
        }
        .scene-display { 
          font-size: 5rem; background: var(--card-bg); border: 2px solid #E2E8F0; 
          border-radius: 20px; padding: 20px 40px; margin-bottom: 10px;
        }
        .word-bank { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; min-height: 50px; width: 100%; }
        .word-chip { 
          padding: 10px 16px; background: white; border: 2px solid var(--primary-blue); 
          border-radius: 12px; font-weight: 600; cursor: pointer; user-select: none; 
          transition: var(--transition); font-size: 1.1rem;
        }
        .word-chip:hover { background: #EBF8FF; transform: translateY(-2px); }
        .word-chip.used { opacity: 0.4; pointer-events: none; background: #E2E8F0; border-color: #CBD5E0; transform: none; }
        .drop-zone { 
          min-height: 70px; width: 100%; max-width: 500px; border: 2px dashed var(--primary-blue); 
          border-radius: 12px; display: flex; flex-wrap: wrap; gap: 10px; padding: 15px; 
          align-items: center; justify-content: center; background: #F8FAFC; transition: var(--transition);
        }
        .drop-zone .word-chip { border-color: var(--primary-green); background: #F0FFF4; }
        .typing-input { 
          width: 100%; max-width: 400px; padding: 14px; font-size: 1.2rem; 
          border: 2px solid var(--primary-blue); border-radius: 12px; text-align: center; 
          font-weight: 600; outline: none; transition: var(--transition); user-select: text; -webkit-user-select: text;
        }
        .typing-input:focus { border-color: var(--primary-green); box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.2); }
        .sentence-prompt { font-size: 1.4rem; font-weight: 700; color: var(--text-dark); text-align: center; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 5px;}
        
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-8px); } 
          75% { transform: translateX(8px); } 
        }
        .shake-anim { animation: shake 0.4s ease-in-out; }
      </style>

      <div class="cd-wrap">
        <div style="display:flex; justify-content:space-between; width:100%; max-width:500px; color:var(--text-muted); font-weight:700; font-size:0.9rem;">
          <span>${stageName}</span>
          <span>Round ${levelIndex + 1} / ${ROUNDS.length}</span>
        </div>
        
        <div class="scene-display">${r.scene}</div>
        
        ${specificHTML}
      </div>
    `;

    // --- ربط الأحداث (Event Listeners) ---
    
    // منطق المرحلة الأولى: النقل بالنقر (أكثر موثوقية للأطفال من السحب)
    if (r.stage === 1) {
      const wordBank = document.getElementById("word-bank");
      const dropZone = document.getElementById("drop-zone");
      const clearBtn = document.getElementById("clear-btn");
      const checkBtn = document.getElementById("check-btn");

      // دالة لتحريك الكلمات
      function moveWord(chip, toDropZone) {
        if (toDropZone) {
          chip.classList.add("used"); // إخفاء من البنك
          const clone = chip.cloneNode(true);
          clone.classList.remove("used");
          clone.dataset.sourceId = chip.dataset.id;
          dropZone.appendChild(clone);
        } else {
          // إعادة للبنك
          const original = wordBank.querySelector(`[data-id="${chip.dataset.sourceId}"]`);
          if (original) original.classList.remove("used");
          chip.remove();
        }
      }

      wordBank.addEventListener("click", (e) => {
        const chip = e.target.closest(".word-chip");
        if (chip && !chip.classList.contains("used")) {
          moveWord(chip, true);
        }
      });

      dropZone.addEventListener("click", (e) => {
        const chip = e.target.closest(".word-chip");
        if (chip) {
          moveWord(chip, false);
        }
      });

      clearBtn.addEventListener("click", () => {
        dropZone.innerHTML = "";
        wordBank.querySelectorAll(".word-chip").forEach(c => c.classList.remove("used"));
      });

      checkBtn.addEventListener("click", () => handleCheck(r));
    } 
    // منطق المرحلتين الثانية والثالثة: التحقق من حقل الإدخال
    else {
      const checkBtn = document.getElementById("check-btn");
      const input = document.getElementById("typing-input");
      
      // السماح بالضغط على Enter للتحقق
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleCheck(r);
      });
      
      checkBtn.addEventListener("click", () => handleCheck(r));
      
      // تركيز تلقائي على حقل الإدخال
      setTimeout(() => input.focus(), 100);
    }
  }

  // دالة التحقق من الإجابة
  function handleCheck(r) {
    let isCorrect = false;
    let targetElement;

    if (r.stage === 1) {
      const dropZone = document.getElementById("drop-zone");
      const currentWords = Array.from(dropZone.children).map(chip => chip.innerText);
      const userSentence = currentWords.join(" ").trim();
      isCorrect = normalizeText(userSentence) === normalizeText(r.answer);
      targetElement = dropZone;
    } else {
      const input = document.getElementById("typing-input");
      isCorrect = normalizeText(input.value) === normalizeText(r.answer);
      targetElement = input;
    }

    if (isCorrect) {
      window.GameHub.playSound("correct");
      const btn = document.getElementById("check-btn");
      const rect = btn.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      levelIndex++;
      setTimeout(() => {
        if (levelIndex >= ROUNDS.length) {
          window.GameHub.showComplete("Amazing Writer!", "You successfully built and wrote all the sentences!");
        } else {
          build();
        }
      }, 800);
    } else {
      window.GameHub.playSound("wrong");
      targetElement.classList.add("shake-anim");
      setTimeout(() => targetElement.classList.remove("shake-anim"), 400);
      
      // مسح حقل الإدخال في المرحلة 2 و 3 عند الخطأ لتشجيع المحاولة مجدداً
      if (r.stage !== 1) {
        const input = document.getElementById("typing-input");
        input.value = "";
        input.focus();
      }
    }
  }

  // بدء اللعبة
  build();
};