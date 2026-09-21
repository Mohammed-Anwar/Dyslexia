window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // قاعدة البيانات: 15 جولة مقسمة على 3 مراحل حسب التدرج المطلوب
  const gameData = [
    // --- المرحلة الأولى: فقرات قصيرة (3 جمل) مع روابط لفظية ---
    {
      stage: 1, icon: "🧼",
      labels: ["First,", "Then,", "Finally,"],
      sentences: ["I turn on the water.", "I wash my hands.", "I dry my hands."]
    },
    {
      stage: 1, icon: "🥪",
      labels: ["First,", "Then,", "Finally,"],
      sentences: ["I get some bread.", "I put cheese.", "I eat it."]
    },
    {
      stage: 1, icon: "🛏️",
      labels: ["First,", "Then,", "Finally,"],
      sentences: ["I put on my pajamas.", "I brush my teeth.", "I go to sleep."]
    },
    {
      stage: 1, icon: "🎨",
      labels: ["First,", "Then,", "Finally,"],
      sentences: ["I get a paper.", "I draw a cat.", "I color it."]
    },
    {
      stage: 1, icon: "☀️",
      labels: ["First,", "Then,", "Finally,"],
      sentences: ["I wake up.", "I wash my face.", "I go to school."]
    },

    // --- المرحلة الثانية: فقرات متوسطة (4 جمل) مع روابط لفظية ---
    {
      stage: 2, icon: "🌱",
      labels: ["First,", "Next,", "After that,", "Finally,"],
      sentences: ["we dig a hole.", "we put the seed.", "we water it.", "a plant grows."]
    },
    {
      stage: 2, icon: "🎂",
      labels: ["First,", "Next,", "After that,", "Finally,"],
      sentences: ["we get flour and eggs.", "we mix them.", "we bake it.", "we eat the cake."]
    },
    {
      stage: 2, icon: "🐦",
      labels: ["First,", "Next,", "After that,", "Finally,"],
      sentences: ["the bird wakes up.", "it looks for food.", "it finds a worm.", "it feeds its babies."]
    },
    {
      stage: 2, icon: "🌊",
      labels: ["First,", "Next,", "After that,", "Finally,"],
      sentences: ["we pack our bags.", "we drive to the beach.", "we swim in the sea.", "we build a sandcastle."]
    },
    {
      stage: 2, icon: "🚗",
      labels: ["First,", "Next,", "After that,", "Finally,"],
      sentences: ["I save my money.", "I go to the shop.", "I choose a car.", "I play with it."]
    },

    // --- المرحلة الثالثة: التسلسل المنطقي المستقل (4 جمل بدون روابط لفظية) ---
    {
      stage: 3, icon: "🐈",
      labels: ["", "", "", ""],
      sentences: ["I have a small cat.", "It is black and white.", "It likes to play.", "It sleeps on my bed."]
    },
    {
      stage: 3, icon: "☀️",
      labels: ["", "", "", ""],
      sentences: ["The sun is a big star.", "It is very hot.", "It gives us light.", "It helps plants grow."]
    },
    {
      stage: 3, icon: "👫",
      labels: ["", "", "", ""],
      sentences: ["Ali is my best friend.", "He is ten years old.", "We play football together.", "We are very happy."]
    },
    {
      stage: 3, icon: "🐘",
      labels: ["", "", "", ""],
      sentences: ["The elephant is very big.", "It has a long nose.", "It uses it to drink.", "It likes water."]
    },
    {
      stage: 3, icon: "🌧️",
      labels: ["", "", "", ""],
      sentences: ["The sky is dark.", "It starts to rain.", "I open my umbrella.", "I jump in the water."]
    }
  ];

  let levelIndex = 0;

  function nextRound() {
    if (levelIndex >= gameData.length - 1) {
      window.GameHub.showComplete("Paragraph Master!", "You perfectly sequenced all the paragraphs!");
    } else {
      levelIndex++;
      renderLevel();
    }
  }

  function previousRound() {
    if (levelIndex > 0) {
      levelIndex--;
      renderLevel();
    }
  }

  // دالة نطق النص (Text-to-Speech)
  function speakText(text, event) {
    event.stopPropagation(); // منع تفعيل حدث النقر على البطاقة نفسها
    if (window.GameHub && typeof window.GameHub.speak === 'function') {
      window.GameHub.speak(text, 'en-US');
    }
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function renderLevel() {
    const r = gameData[levelIndex];
    const shuffledSentences = shuffle(r.sentences.map((text, i) => ({ text, originalIndex: i })));
    
    let slotsHTML = "";
    r.labels.forEach((label, i) => {
      const labelText = label ? `<span class="pg-label">${label}</span>` : `<span class="pg-label pg-label-empty">${i + 1}.</span>`;
      slotsHTML += `
        <div class="pg-slot" data-index="${i}">
          ${labelText}
          <div class="pg-slot-content" id="slot-content-${i}"></div>
        </div>
      `;
    });

    stage.innerHTML = `
      <style>
        .pg-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px; width: 100%;
          user-select: none; -webkit-user-select: none;
        }
        .pg-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
        }
        .pg-icon { font-size: 2.5rem; }
        .pg-title { font-weight: 700; color: var(--text-dark); font-size: 1.1rem; }
        
        .pg-paragraph {
          width: min(550px, 95%); background: #F8FAFC; border: 2px solid #E2E8F0;
          border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
        }
        .pg-slot {
          display: flex; align-items: center; gap: 12px; background: white;
          border: 2px dashed #CBD5E0; border-radius: 12px; padding: 12px; min-height: 56px;
          transition: all 0.3s ease;
        }
        .pg-slot.filled { border-style: solid; border-color: var(--primary-green); background: #F0FFF4; }
        .pg-label { 
          font-weight: 800; color: var(--primary-blue); min-width: 90px; text-align: right; font-size: 1rem; 
        }
        .pg-label-empty { color: var(--text-muted); min-width: 30px; }
        .pg-slot-content { flex: 1; font-weight: 600; color: var(--text-dark); display: flex; justify-content: space-between; align-items: center; }
        
        .pg-pool {
          display: flex; flex-direction: column; gap: 12px; width: min(550px, 95%); margin-top: 10px;
        }
        .pg-card {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 16px; border-radius: 12px; background: white;
          border: 2px solid var(--primary-blue); color: var(--text-dark);
          font-weight: 600; cursor: pointer; text-align: left;
          transition: all 0.2s ease; position: relative;
        }
        .pg-card:hover { background: #EBF8FF; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15); }
        .pg-card.used { visibility: hidden; pointer-events: none; opacity: 0; height: 0; padding: 0; margin: 0; border: 0; }
        
        .speak-btn {
          background: var(--card-bg); border: 1px solid #CBD5E0; border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.1rem; flex-shrink: 0; transition: all 0.2s;
        }
        .speak-btn:hover { background: var(--primary-blue); color: white; border-color: var(--primary-blue); }
        .speak-btn:active { transform: scale(0.9); }

        /* Gentle Bounce Back Animation (بدون أحمر مزعج) */
        @keyframes gentleBounce {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        .bounce-anim {
          animation: gentleBounce 0.4s ease-in-out;
          border-color: #ED8936 !important; /* برتقالي هادئ بدلاً من الأحمر */
          background: #FFFAF0 !important;
        }
      </style>

      <div class="pg-wrap">
        <div class="pg-header">
          <span class="pg-icon">${r.icon}</span>
          <span class="pg-title">Round ${levelIndex + 1} / ${gameData.length} — Build the paragraph</span>
        </div>
        
        <div class="pg-paragraph" id="pg-paragraph">
          ${slotsHTML}
        </div>

        <div class="pg-pool" id="pg-pool"></div>
      </div>
    `;

    const pool = document.getElementById("pg-pool");
    let builtCount = 0;

    shuffledSentences.forEach(item => {
      const card = document.createElement("div");
      card.className = "pg-card";
      card.dataset.text = item.text;
      card.dataset.index = item.originalIndex;
      
      card.innerHTML = `
        <span style="flex: 1; padding-right: 10px;">${item.text}</span>
        <button class="speak-btn" title="Listen">🔊</button>
      `;

      // 1. حدث النقر على زر السماعة (نطق فقط)
      const speakBtn = card.querySelector(".speak-btn");
      speakBtn.addEventListener("click", (e) => speakText(item.text, e));

      // 2. حدث النقر على البطاقة (محاولة النقل)
      card.addEventListener("click", (e) => {
        // منع التنفيذ إذا تم النقر على زر السماعة
        if (e.target.closest(".speak-btn")) return;

        const expectedIndex = builtCount;
        const isCorrect = item.originalIndex === expectedIndex;

        if (isCorrect) {
          // إجابة صحيحة
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          
          // نقل البطاقة بصرياً إلى الخانة
          const slotContent = document.getElementById(`slot-content-${expectedIndex}`);
          const slot = slotContent.parentElement;
          
          // إنشاء نسخة نظيفة للخانة
          const placedCard = document.createElement("div");
          placedCard.style.display = "flex";
          placedCard.style.justifyContent = "space-between";
          placedCard.style.alignItems = "center";
          placedCard.style.width = "100%";
          placedCard.innerHTML = `<span>${item.text}</span><button class="speak-btn" style="width:32px;height:32px;font-size:0.9rem;">🔊</button>`;
          
          // إعادة ربط حدث النطق للنسخة الجديدة
          placedCard.querySelector(".speak-btn").addEventListener("click", (ev) => speakText(item.text, ev));
          
          slotContent.appendChild(placedCard);
          slot.classList.add("filled");
          
          // إخفاء البطاقة من الأسفل
          card.classList.add("used");
          builtCount++;

          // التحقق من اكتمال الفقرة
          if (builtCount === r.sentences.length) {
            setTimeout(() => nextRound(), 1000);
          }
        } else {
          // إجابة خاطئة: تغذية راجعة هادئة (Bounce Back)
          window.GameHub.playSound("wrong");
          card.classList.add("bounce-anim");
          setTimeout(() => {
            card.classList.remove("bounce-anim");
          }, 400);
        }
      });

      pool.appendChild(card);
    });
  }

  renderLevel();
  window.nextRound = nextRound;
  window.previousRound = previousRound;
};