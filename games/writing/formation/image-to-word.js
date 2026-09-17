// Writing > Formation > Image to word
window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // بنك كلمات ضخم (100 كلمة) مقسمة لفئات مألوفة للأطفال
  const WORD_BANK = [
    // Animals
    { emoji: "🐱", word: "CAT" }, { emoji: "🐶", word: "DOG" }, { emoji: "🐷", word: "PIG" },
    { emoji: "🐄", word: "COW" }, { emoji: "🐦", word: "BIRD" }, { emoji: "🐟", word: "FISH" },
    { emoji: "🐸", word: "FROG" }, { emoji: "🐻", word: "BEAR" }, { emoji: "🦆", word: "DUCK" },
    { emoji: "🦁", word: "LION" }, { emoji: "🐒", word: "MONKEY" }, { emoji: "🐴", word: "HORSE" },
    { emoji: "🐑", word: "SHEEP" }, { emoji: "🐭", word: "MOUSE" }, { emoji: "🐍", word: "SNAKE" },
    { emoji: "🐯", word: "TIGER" }, { emoji: "🦓", word: "ZEBRA" }, { emoji: "🐺", word: "WOLF" },
    { emoji: "🦊", word: "FOX" }, { emoji: "🐞", word: "BUG" },
    // Nature
    { emoji: "☀️", word: "SUN" }, { emoji: "🌙", word: "MOON" }, { emoji: "⭐", word: "STAR" },
    { emoji: "🌳", word: "TREE" }, { emoji: "🍃", word: "LEAF" }, { emoji: "🌸", word: "FLOWER" },
    { emoji: "🌧️", word: "RAIN" }, { emoji: "❄️", word: "SNOW" }, { emoji: "💨", word: "WIND" },
    { emoji: "🪨", word: "ROCK" }, { emoji: "⛰️", word: "HILL" }, { emoji: "🏞️", word: "LAKE" },
    { emoji: "🌊", word: "SEA" }, { emoji: "🏖️", word: "SAND" }, { emoji: "🌿", word: "GRASS" },
    { emoji: "🌵", word: "BUSH" }, { emoji: "💧", word: "MUD" }, { emoji: "☁️", word: "CLOUD" },
    { emoji: "🌈", word: "RAINBOW" }, { emoji: "🌍", word: "EARTH" },
    // Food & Drink
    { emoji: "🍎", word: "APPLE" }, { emoji: "🍌", word: "BANANA" }, { emoji: "🍇", word: "GRAPE" },
    { emoji: "🍋", word: "LEMON" }, { emoji: "🍉", word: "MELON" }, { emoji: "🍓", word: "BERRY" },
    { emoji: "🌽", word: "CORN" }, { emoji: "🍚", word: "RICE" }, { emoji: "🍞", word: "BREAD" },
    { emoji: "🎂", word: "CAKE" }, { emoji: "🥛", word: "MILK" }, { emoji: "🧃", word: "JUICE" },
    { emoji: "💧", word: "WATER" }, { emoji: "🥚", word: "EGG" }, { emoji: "🧀", word: "CHEESE" },
    { emoji: "🍕", word: "PIZZA" }, { emoji: "🍬", word: "CANDY" }, { emoji: "🍪", word: "COOKIE" },
    { emoji: "🥜", word: "NUT" }, { emoji: "🍗", word: "MEAT" },
    // Body Parts
    { emoji: "👤", word: "HEAD" }, { emoji: "👁️", word: "EYE" }, { emoji: "👂", word: "EAR" },
    { emoji: "👃", word: "NOSE" }, { emoji: "👄", word: "MOUTH" }, { emoji: "🦷", word: "TOOTH" },
    { emoji: "✋", word: "HAND" }, { emoji: "💪", word: "ARM" }, { emoji: "🦵", word: "LEG" },
    { emoji: "🦶", word: "FOOT" }, { emoji: "💇", word: "HAIR" }, { emoji: "😊", word: "FACE" },
    { emoji: "🧣", word: "NECK" }, { emoji: "🔙", word: "BACK" }, { emoji: "🦵", word: "KNEE" },
    { emoji: "🦶", word: "TOE" }, { emoji: "👆", word: "FINGER" }, { emoji: "💅", word: "NAIL" },
    { emoji: "👄", word: "LIP" }, { emoji: "😊", word: "CHEEK" },
    // Objects & Home
    { emoji: "🛏️", word: "BED" }, { emoji: "🪑", word: "CHAIR" }, { emoji: "🪑", word: "TABLE" },
    { emoji: "🚪", word: "DOOR" }, { emoji: "💻", word: "LAPTOP" }, { emoji: "💡", word: "LAMP" },
    { emoji: "⏰", word: "CLOCK" }, { emoji: "📚", word: "BOOK" }, { emoji: "🖊️", word: "PEN" },
    { emoji: "🎒", word: "BAG" }, { emoji: "📦", word: "BOX" }, { emoji: "🧸", word: "TOY" },
    { emoji: "⚽", word: "BALL" }, { emoji: "🚗", word: "CAR" }, { emoji: "🚌", word: "BUS" },
    { emoji: "🚲", word: "BIKE" }, { emoji: "🔑", word: "KEY" }, { emoji: "🧢", word: "HAT" },
    { emoji: "👟", word: "SHOE" }, { emoji: "👕", word: "SHIRT" },
    // Colors & Actions
    { emoji: "🔴", word: "RED" }, { emoji: "🔵", word: "BLUE" }, { emoji: "🟢", word: "GREEN" },
    { emoji: "🟡", word: "YELLOW" }, { emoji: "🩷", word: "PINK" }, { emoji: "⚫", word: "BLACK" },
    { emoji: "⚪", word: "WHITE" }, { emoji: "🟤", word: "BROWN" }, { emoji: "🏃", word: "RUN" },
    { emoji: "🦘", word: "JUMP" }, { emoji: "🎮", word: "PLAY" }, { emoji: "🎤", word: "SING" },
    { emoji: "💃", word: "DANCE" }, { emoji: "📖", word: "READ" }, { emoji: "✍️", word: "WRITE" },
    { emoji: "🎨", word: "DRAW" }, { emoji: "😴", word: "SLEEP" }, { emoji: "🌅", word: "WAKE" },
    { emoji: "🍽️", word: "EAT" }, { emoji: "🥤", word: "DRINK" }
  ];

  let isEndless = false;
  let levelIndexs = [];
  let levelIndex = 0;
  let built = "";

  // دالة لخلط المصفوفات عشوائياً
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // بدء جلسة جديدة (15 كلمة عشوائية)
  function startSession() {
    levelIndexs = shuffle([...WORD_BANK]).slice(0, 15);
    levelIndex = 0;
    renderLevel();
  }

  function renderLevel() {
    const r = levelIndexs[levelIndex];
    built = "";
    const letters = r.word.split("");
    
    // تحسين منطق المشتتات: اختيار حروف عشوائية من الأبجدية غير موجودة في الكلمة الأصلية
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const availableDistractors = alphabet.filter(l => !letters.includes(l));
    const distractors = shuffle(availableDistractors).slice(0, 3);
    const pool = shuffle([...letters, ...distractors]);

    const roundInfo = isEndless ? "Endless Mode" : `Round ${levelIndex + 1} / 15`;

    stage.innerHTML = `
      <style>
        .iw-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;}
        .iw-header{width:100%;display:flex;justify-content:space-between;align-items:center;padding:0 10px;}
        .iw-toggle{font-size:0.85rem;font-weight:700;color:var(--text-muted);background:var(--card-bg);padding:6px 14px;border-radius:20px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;}
        .iw-toggle.active{background:var(--primary-green);color:white;border-color:var(--primary-green);}
        .iw-emoji{font-size:5rem;filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));}
        .iw-slots{display:flex;gap:8px;}
        .iw-slot{width:52px;height:60px;border-bottom:4px solid var(--primary-blue);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:var(--text-dark);transition:all 0.3s;}
        .iw-pool{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:420px;}
        .iw-key{width:52px;height:52px;border-radius:12px;background:white;border:2px solid var(--primary-blue);color:var(--primary-blue);font-size:1.4rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow:0 3px 0 #2b6cb0;}
        .iw-key:hover{background:#EBF8FF;transform:translateY(-2px);}
        .iw-key:active{transform:translateY(1px);box-shadow:0 1px 0 #2b6cb0;}
        .iw-key.used{visibility:hidden;pointer-events:none;}
      </style>
      <div class="iw-wrap">
        <div class="iw-header">
          <span style="font-weight:700; color:var(--primary-blue); font-size: 1.1rem;">${roundInfo}</span>
          <div class="iw-toggle ${isEndless ? 'active' : ''}" id="endless-toggle">
            ♾️ Endless Mode
          </div>
        </div>
        
        <div class="iw-emoji">${r.emoji}</div>
        <div class="iw-slots" id="iw-slots"></div>
        <div class="iw-pool" id="iw-pool"></div>
      </div>
    `;

    // ربط زر التبديل
    document.getElementById("endless-toggle").onclick = () => {
      isEndless = !isEndless;
      window.GameHub.playSound("click");
      startSession();
    };

    const slotsEl = document.getElementById("iw-slots");
    letters.forEach(() => {
      const s = document.createElement("div");
      s.className = "iw-slot";
      slotsEl.appendChild(s);
    });

    const poolEl = document.getElementById("iw-pool");
    pool.forEach((ch) => {
      const key = document.createElement("div");
      key.className = "iw-key";
      key.innerText = ch;
      key.onclick = (e) => handlePick(ch, key, r.word, e);
      poolEl.appendChild(key);
    });
  }

  function handlePick(ch, keyEl, word, event) {
    const expected = word[built.length];
    if (ch === expected) {
      window.GameHub.playSound("correct");
      const rect = keyEl.getBoundingClientRect();
      window.GameHub.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      keyEl.classList.add("used");
      built += ch;
      
      const slots = document.querySelectorAll("#iw-slots .iw-slot");
      const currentSlot = slots[built.length - 1];
      currentSlot.innerText = ch;
      currentSlot.style.color = "var(--primary-green)";
      currentSlot.style.borderBottomColor = "var(--primary-green)";
      currentSlot.style.transform = "scale(1.1)";
      setTimeout(() => { currentSlot.style.transform = "scale(1)"; }, 200);

      if (built.length === word.length) {
        // نطق الكلمة عند اكتمالها بنجاح (اختياري ومفيد جداً للأطفال)
        if (window.GameHub.speak) {
          window.GameHub.speak(word);
        }

        levelIndex++;
        setTimeout(() => {
          if (!isEndless && levelIndex >= 15) {
            window.GameHub.showComplete("Word Builder!", "You spelled every picture word correctly.");
          } else if (isEndless && levelIndex >= 15) {
            // في الوضع الحر، نعيد توليد 15 كلمة جديدة بسلاسة دون إظهار شاشة النهاية
            startSession();
          } else {
            renderLevel();
          }
        }, 800);
      }
    } else {
      window.GameHub.playSound("wrong");
      keyEl.style.borderColor = "#E53E3E";
      keyEl.style.color = "#E53E3E";
      keyEl.style.transform = "translateX(-4px)";
      setTimeout(() => { keyEl.style.transform = "translateX(4px)"; }, 50);
      setTimeout(() => { 
        keyEl.style.transform = "translateX(0)"; 
        keyEl.style.borderColor = "var(--primary-blue)";
        keyEl.style.color = "var(--primary-blue)";
      }, 100);
    }
  }

  // بدء اللعبة لأول مرة
  startSession();
};