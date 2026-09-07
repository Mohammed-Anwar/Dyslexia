window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  const ROUNDS = [
    // --- المرحلة الأولى: بطاقتي الشخصية (I / My) ---
    {
      stage: 1, icon: "🪪", title: "My Explorer ID",
      instruction: "Arrange the words, then type your name.",
      targetPrefix: ["My", "name", "is"],
      inputType: "text", inputPlaceholder: "Your name...",
      speakText: "My name is..."
    },
    {
      stage: 1, icon: "🎂", title: "My Explorer ID",
      instruction: "Arrange the words, then type your age.",
      targetPrefix: ["I", "am", "years", "old"],
      inputType: "text", inputPlaceholder: "e.g., 8",
      speakText: "I am ... years old."
    },
    {
      stage: 1, icon: "🎨", title: "My Explorer ID",
      instruction: "Arrange the words, then choose your hobby.",
      targetPrefix: ["My", "favorite", "hobby", "is"],
      inputType: "bank", wordBank: ["reading", "drawing", "swimming"],
      speakText: "My favorite hobby is..."
    },
    {
      stage: 1, icon: "🌈", title: "My Explorer ID",
      instruction: "Arrange the words, then choose your color.",
      targetPrefix: ["My", "favorite", "color", "is"],
      inputType: "bank", wordBank: ["red", "blue", "green", "yellow"],
      speakText: "My favorite color is..."
    },
    {
      stage: 1, icon: "🍕", title: "My Explorer ID",
      instruction: "Arrange the words, then choose your food.",
      targetPrefix: ["I", "like", "to", "eat"],
      inputType: "bank", wordBank: ["pizza", "apples", "rice", "chicken"],
      speakText: "I like to eat..."
    },

    // --- المرحلة الثانية: بطاقة صديقي (He / His) ---
    {
      stage: 2, icon: "👦", title: "Friend's ID: Ali",
      instruction: "Tap the words in order to build the sentence.",
      targetSentence: "His name is Ali",
      wordPool: ["name", "His", "Ali", "is"],
      speakText: "His name is Ali."
    },
    {
      stage: 2, icon: "👦", title: "Friend's ID: Ali",
      instruction: "Tap the words in order to build the sentence.",
      targetSentence: "He is ten years old",
      wordPool: ["ten", "is", "He", "old", "years"],
      speakText: "He is ten years old."
    },
    {
      stage: 2, icon: "👦", title: "Friend's ID: Ali",
      instruction: "Tap the words in order to build the sentence.",
      targetSentence: "He likes playing football",
      wordPool: ["playing", "likes", "He", "football"],
      speakText: "He likes playing football."
    },
    {
      stage: 2, icon: "👦", title: "Friend's ID: Ali",
      instruction: "Tap the words in order to build the sentence.",
      targetSentence: "His favorite subject is math",
      wordPool: ["subject", "favorite", "His", "is", "math"],
      speakText: "His favorite subject is math."
    },
    {
      stage: 2, icon: "👦", title: "Friend's ID: Ali",
      instruction: "Tap the words in order to build the sentence.",
      targetSentence: "He is very smart",
      wordPool: ["is", "very", "He", "smart"],
      speakText: "He is very smart."
    },

    // --- المرحلة الثالثة: بطاقة صديقتي (She / Her) + كتابة حرة ---
    {
      stage: 3, icon: "👧", title: "Friend's ID: Sara",
      factFile: { name: "Sara", age: "9", hobby: "Drawing", color: "Pink", pet: "Cat" },
      activeField: "name",
      instruction: "Look at the Fact File. Type the full sentence using the word bank.",
      targetSentence: "Her name is Sara",
      wordBank: ["Sara", "name", "His", "Her", "is"],
      speakText: "Her name is Sara."
    },
    {
      stage: 3, icon: "👧", title: "Friend's ID: Sara",
      factFile: { name: "Sara", age: "9", hobby: "Drawing", color: "Pink", pet: "Cat" },
      activeField: "age",
      instruction: "Look at the Fact File. Type the full sentence using the word bank.",
      targetSentence: "She is nine years old",
      wordBank: ["nine", "He", "years", "She", "old", "is"],
      speakText: "She is nine years old."
    },
    {
      stage: 3, icon: "👧", title: "Friend's ID: Sara",
      factFile: { name: "Sara", age: "9", hobby: "Drawing", color: "Pink", pet: "Cat" },
      activeField: "hobby",
      instruction: "Look at the Fact File. Type the full sentence using the word bank.",
      targetSentence: "She likes drawing",
      wordBank: ["drawing", "likes", "She", "His"],
      speakText: "She likes drawing."
    },
    {
      stage: 3, icon: "👧", title: "Friend's ID: Sara",
      factFile: { name: "Sara", age: "9", hobby: "Drawing", color: "Pink", pet: "Cat" },
      activeField: "color",
      instruction: "Look at the Fact File. Type the full sentence using the word bank.",
      targetSentence: "Her favorite color is pink",
      wordBank: ["favorite", "Her", "He", "color", "pink", "is"],
      speakText: "Her favorite color is pink."
    },
    {
      stage: 3, icon: "👧", title: "Friend's ID: Sara",
      factFile: { name: "Sara", age: "9", hobby: "Drawing", color: "Pink", pet: "Cat" },
      activeField: "pet",
      instruction: "Look at the Fact File. Type the full sentence using the word bank.",
      targetSentence: "She has a small cat",
      wordBank: ["a cat", "has", "She", "His", "small"],
      speakText: "She has a small cat."
    }
  ];

  let idx = 0;
  let builtWords = []; 
  let hasPlayedIntro = false;

  function speakText(text, lang = 'en-US') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = lang === 'ar-SA' ? 0.9 : 0.85;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  }

  function build() {
    const r = ROUNDS[idx];
    
    if (idx === 0 && !hasPlayedIntro) {
      setTimeout(() => {
        speakText("أهلاً بك أيها المستكشف! هيا نصدر بطاقتك.", "ar-SA");
        hasPlayedIntro = true;
      }, 500);
    }

    let specificHTML = "";

    if (r.stage === 1) {
      builtWords = [];
      const shuffledPrefix = shuffle(r.targetPrefix);
      // تم إصلاح مشكلة الـ display هنا: إزالة التعارض وجعلها none بشكل قاطع
      specificHTML = `
        <p class="as-instruction">${r.instruction} 
          <button class="as-speak-btn" onclick="event.stopPropagation(); window.currentGameSpeak()">🔊</button>
        </p>
        <div class="as-build-zone" id="as-build-zone">
          <span class="as-placeholder">Tap words below to build the start of your sentence...</span>
        </div>
        <div class="as-pool" id="as-pool">
          ${shuffledPrefix.map((w, i) => `<div class="as-chip" data-word="${w}" data-id="p${i}">${w}</div>`).join('')}
        </div>
        <div id="as-input-area" style="display: none; width: 100%; flex-direction: column; align-items: center; gap: 10px; margin-top: 15px;">
          ${r.inputType === 'text' 
            ? `<input type="text" class="as-text-input" id="as-text-input" placeholder="${r.inputPlaceholder}" autocomplete="off" autocapitalize="words">`
            : `<div class="as-pool" id="as-end-pool">${shuffle(r.wordBank).map(w => `<div class="as-chip as-end-chip" data-word="${w}">${w}</div>`).join('')}</div>`
          }
          <button class="game-btn success" id="as-check-btn" style="margin-top:10px;">Check Answer</button>
        </div>
      `;
    } 
    else if (r.stage === 2) {
      builtWords = [];
      const shuffledPool = shuffle(r.wordPool);
      specificHTML = `
        <p class="as-instruction">${r.instruction} 
          <button class="as-speak-btn" onclick="event.stopPropagation(); window.currentGameSpeak()">🔊</button>
        </p>
        <div class="as-build-zone" id="as-build-zone">
          <span class="as-placeholder">Tap words to build the full sentence...</span>
        </div>
        <div class="as-pool" id="as-pool">
          ${shuffledPool.map((w, i) => `<div class="as-chip" data-word="${w}" data-id="p${i}">${w}</div>`).join('')}
        </div>
        <button class="game-btn success" id="as-check-btn" style="margin-top:20px; display:none;">Check Answer</button>
      `;
    } 
    else if (r.stage === 3) {
      const fields = [
        { key: "name", label: "Name", val: r.factFile.name },
        { key: "age", label: "Age", val: r.factFile.age },
        { key: "hobby", label: "Hobby", val: r.factFile.hobby },
        { key: "color", label: "Color", val: r.factFile.color },
        { key: "pet", label: "Pet", val: r.factFile.pet }
      ];

      specificHTML = `
        <p class="as-instruction">${r.instruction} 
          <button class="as-speak-btn" onclick="event.stopPropagation(); window.currentGameSpeak()">🔊</button>
        </p>
        <div class="as-fact-file">
          ${fields.map(f => `
            <div class="as-fact-row ${f.key === r.activeField ? 'active-highlight' : ''}">
              <span class="as-fact-label">${f.label}:</span>
              <span class="as-fact-value">${f.val}</span>
            </div>
          `).join('')}
        </div>
        <input type="text" class="as-text-input as-large-input" id="as-text-input" placeholder="Type the full sentence here..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <div class="as-pool" id="as-end-pool">
          ${shuffle(r.wordBank).map(w => `<div class="as-chip as-end-chip" data-word="${w}">${w}</div>`).join('')}
        </div>
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="game-btn secondary" id="as-clear-btn">Clear</button>
          <button class="game-btn success" id="as-check-btn">Check Answer</button>
        </div>
      `;
    }

    stage.innerHTML = `
      <style>
        .as-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px; width: 100%;
          user-select: none; -webkit-user-select: none;
        }
        .as-header {
          display: flex; align-items: center; gap: 12px; width: 100%; max-width: 500px;
          justify-content: space-between;
        }
        .as-title-box { display: flex; align-items: center; gap: 10px; }
        .as-icon { font-size: 2.2rem; }
        .as-title { font-weight: 800; color: var(--primary-blue); font-size: 1.1rem; }
        .as-round { font-weight: 700; color: var(--text-muted); font-size: 0.9rem; }

        .as-card {
          width: 100%; max-width: 500px; background: white; border: 3px solid var(--primary-blue);
          border-radius: 20px; padding: 24px; box-shadow: 0 8px 20px rgba(74, 144, 226, 0.1);
          display: flex; flex-direction: column; align-items: center;
        }
        .as-instruction {
          font-weight: 600; color: var(--text-dark); text-align: center; display: flex; align-items: center; gap: 8px;
        }
        .as-speak-btn {
          background: var(--card-bg); border: 2px solid var(--primary-blue); border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.1rem; transition: var(--transition); flex-shrink: 0;
        }
        .as-speak-btn:hover { background: var(--primary-blue); color: white; transform: scale(1.1); }

        .as-build-zone {
          width: 100%; min-height: 60px; background: #F8FAFC; border: 2px dashed #CBD5E0;
          border-radius: 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
          justify-content: center; padding: 12px; margin: 15px 0; transition: var(--transition);
        }
        .as-build-zone.has-words { border-style: solid; border-color: var(--primary-green); background: #F0FFF4; }
        .as-placeholder { color: #A0AEC0; font-size: 0.9rem; font-weight: 600; }

        .as-pool { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%; }
        .as-chip {
          padding: 10px 16px; border-radius: 10px; background: white;
          border: 2px solid var(--primary-blue); color: var(--primary-blue);
          font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 3px 0 #2b6cb0; font-size: 1.05rem;
        }
        .as-chip:hover { background: #EBF8FF; transform: translateY(-2px); }
        .as-chip:active { transform: translateY(1px); box-shadow: 0 1px 0 #2b6cb0; }
        .as-chip.used { visibility: hidden; pointer-events: none; opacity: 0; width: 0; padding: 0; margin: 0; border: 0; box-shadow: none; }
        
        .as-built-word {
          padding: 8px 14px; background: var(--primary-green); color: white;
          border-radius: 8px; font-weight: 700; font-size: 1.05rem; cursor: pointer;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .as-text-input {
          width: 100%; max-width: 400px; padding: 14px; font-size: 1.1rem;
          border: 2px solid var(--primary-blue); border-radius: 12px; text-align: center;
          font-weight: 600; outline: none; transition: var(--transition); user-select: text; -webkit-user-select: text;
        }
        .as-text-input:focus { border-color: var(--primary-green); box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.2); }
        .as-large-input { max-width: 100%; font-size: 1.2rem; }

        .as-fact-file {
          width: 100%; max-width: 350px; background: white; border: 2px solid #E2E8F0;
          border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px;
        }
        .as-fact-row {
          display: flex; justify-content: space-between; padding: 8px 12px; border-radius: 8px;
          font-weight: 600; color: var(--text-muted); transition: var(--transition);
        }
        .as-fact-row.active-highlight {
          background: #EBF8FF; color: var(--primary-blue); font-weight: 800;
          border: 2px solid var(--primary-blue); transform: scale(1.02);
        }
        .as-fact-value { color: var(--text-dark); }

        @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @keyframes gentleBounce {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .bounce-anim {
          animation: gentleBounce 0.4s ease-in-out;
          border-color: #ED8936 !important; background: #FFFAF0 !important; color: #C05621 !important;
        }
      </style>

      <div class="as-wrap">
        <div class="as-header">
          <div class="as-title-box">
            <span class="as-icon">${r.icon}</span>
            <span class="as-title">${r.title}</span>
          </div>
          <span class="as-round">Round ${idx + 1} / ${ROUNDS.length}</span>
        </div>

        <div class="as-card">
          ${specificHTML}
        </div>
      </div>
    `;

    window.currentGameSpeak = () => speakText(r.speakText || r.targetSentence);

    if (r.stage === 1 || r.stage === 2) {
      const pool = document.getElementById("as-pool");
      const buildZone = document.getElementById("as-build-zone");
      const checkBtn = document.getElementById("as-check-btn");
      const placeholder = buildZone.querySelector(".as-placeholder");

      pool.addEventListener("click", (e) => {
        const chip = e.target.closest(".as-chip");
        if (chip && !chip.classList.contains("used")) {
          if (placeholder) placeholder.style.display = "none";
          buildZone.classList.add("has-words");
          
          chip.classList.add("used");
          const builtChip = document.createElement("div");
          builtChip.className = "as-built-word";
          builtChip.innerText = chip.dataset.word;
          builtChip.dataset.sourceId = chip.dataset.id;
          
          builtChip.onclick = () => {
            const original = pool.querySelector(`[data-id="${builtChip.dataset.sourceId}"]`);
            if (original) original.classList.remove("used");
            builtChip.remove();
            
            // إصلاح: استخدام builtChip.dataset.word بدلاً من chip.dataset.word
            builtWords = builtWords.filter(w => w !== builtChip.dataset.word);
            
            if (buildZone.querySelectorAll('.as-built-word').length === 0) {
              buildZone.classList.remove("has-words");
              if (placeholder) placeholder.style.display = "block";
            }
            
            // إصلاح: إخفاء منطقة الإدخال إذا لم تكتمل البادئة
            if (r.stage === 1 && builtWords.length < r.targetPrefix.length) {
              document.getElementById("as-input-area").style.display = "none";
            }
            if (r.stage === 2) {
              checkBtn.style.display = "none";
            }
          };
          
          buildZone.appendChild(builtChip);
          builtWords.push(chip.dataset.word);

          if (r.stage === 2 && builtWords.length === r.wordPool.length) {
            checkBtn.style.display = "flex";
          }
          
          // إظهار منطقة الإدخال فقط عند اكتمال البادئة
          if (r.stage === 1 && builtWords.length === r.targetPrefix.length) {
            document.getElementById("as-input-area").style.display = "flex";
            if (r.inputType === 'text') {
              setTimeout(() => document.getElementById("as-text-input").focus(), 100);
            }
          }
        }
      });

      if (r.stage === 1 && r.inputType === "bank") {
        const endPool = document.getElementById("as-end-pool");
        endPool.addEventListener("click", (e) => {
          const chip = e.target.closest(".as-end-chip");
          if (chip) {
             validateStage1End(chip.dataset.word, chip);
          }
        });
      }

      checkBtn.addEventListener("click", () => {
        if (r.stage === 1) {
          const inputVal = document.getElementById("as-text-input")?.value;
          validateStage1End(inputVal, document.getElementById("as-text-input"));
        } else if (r.stage === 2) {
          const userSentence = builtWords.join(" ");
          validateStage2(userSentence, checkBtn);
        }
      });

      const textInput = document.getElementById("as-text-input");
      if (textInput) {
        textInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") validateStage1End(textInput.value, textInput);
        });
      }
    }

    if (r.stage === 3) {
      const textInput = document.getElementById("as-text-input");
      const endPool = document.getElementById("as-end-pool");
      const checkBtn = document.getElementById("as-check-btn");
      const clearBtn = document.getElementById("as-clear-btn");

      endPool.addEventListener("click", (e) => {
        const chip = e.target.closest(".as-end-chip");
        if (chip) {
          const currentVal = textInput.value;
          textInput.value = currentVal ? currentVal + " " + chip.dataset.word : chip.dataset.word;
          textInput.focus();
        }
      });

      clearBtn.addEventListener("click", () => {
        textInput.value = "";
        textInput.focus();
      });

      checkBtn.addEventListener("click", () => validateStage3(textInput.value, textInput));
      
      textInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") validateStage3(textInput.value, textInput);
      });

      setTimeout(() => textInput.focus(), 100);
    }
  }

  // --- دوال التحقق (مع إضافة الحارس المنطقي) ---

  function validateStage1End(value, element) {
    const r = ROUNDS[idx];
    
    // الحارس المنطقي الجديد: التأكد من أن الطفل قد بنى بداية الجملة أولاً
    if (builtWords.length < r.targetPrefix.length) {
      triggerBounce(document.getElementById("as-build-zone"));
      return;
    }

    if (!value || value.trim() === "") {
      triggerBounce(element);
      return;
    }
    
    window.GameHub.playSound("correct");
    const rect = element.getBoundingClientRect();
    window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    advanceRound();
  }

  function validateStage2(userSentence, element) {
    const r = ROUNDS[idx];
    if (normalizeText(userSentence) === normalizeText(r.targetSentence)) {
      window.GameHub.playSound("correct");
      const rect = element.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
      advanceRound();
    } else {
      window.GameHub.playSound("wrong");
      triggerBounce(document.getElementById("as-build-zone"));
      setTimeout(() => {
        builtWords = [];
        const buildZone = document.getElementById("as-build-zone");
        buildZone.innerHTML = '<span class="as-placeholder">Tap words to build the full sentence...</span>';
        buildZone.classList.remove("has-words");
        document.querySelectorAll("#as-pool .as-chip").forEach(c => c.classList.remove("used"));
        element.style.display = "none";
      }, 500);
    }
  }

  function validateStage3(userSentence, element) {
    const r = ROUNDS[idx];
    if (normalizeText(userSentence) === normalizeText(r.targetSentence)) {
      window.GameHub.playSound("correct");
      const rect = element.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
      advanceRound();
    } else {
      window.GameHub.playSound("wrong");
      triggerBounce(element);
      setTimeout(() => {
        element.value = ""; 
        element.focus();
      }, 400);
    }
  }

  function triggerBounce(element) {
    if (!element) return;
    element.classList.add("bounce-anim");
    setTimeout(() => element.classList.remove("bounce-anim"), 400);
  }

  function advanceRound() {
    idx++;
    setTimeout(() => {
      if (idx >= ROUNDS.length) {
        window.GameHub.showComplete("Explorer Master!", "You successfully created all the ID cards with perfect grammar!");
      } else {
        build();
      }
    }, 800);
  }

  build();
};