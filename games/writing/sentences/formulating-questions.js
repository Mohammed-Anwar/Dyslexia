window.initGame = function (stageId) {
  const stage = document.getElementById(stageId);

  // قاعدة البيانات: 15 جولة مقسمة على 3 مراحل مع المشتتات
  const ROUNDS = [
    // --- المرحلة الأولى: أفعال الكينونة الواضحة (المستويات 1 إلى 5) ---
    {
      stage: 1, icon: "🌳",
      answer: "The boy is in the park.",
      correct: ["Where", "is", "the", "boy", "?"],
      blocks: ["Where", "is", "the", "boy", "?", "Who"]
    },
    {
      stage: 1, icon: "🍎",
      answer: "The apple is red.",
      correct: ["What", "color", "is", "the", "apple", "?"],
      blocks: ["What", "color", "is", "the", "apple", "?", "When"]
    },
    {
      stage: 1, icon: "👫",
      answer: "Ali is my friend.",
      correct: ["Who", "is", "Ali", "?"],
      blocks: ["Who", "is", "Ali", "?", "Where"]
    },
    {
      stage: 1, icon: "🐈",
      answer: "The cat is sleeping.",
      correct: ["What", "is", "the", "cat", "doing", "?"],
      blocks: ["What", "is", "the", "cat", "doing", "?"]
    },
    {
      stage: 1, icon: "👩‍🍳",
      answer: "My mom is cooking dinner.",
      correct: ["Who", "is", "cooking", "dinner", "?"],
      blocks: ["Who", "is", "cooking", "dinner", "?", "Where"]
    },

    // --- المرحلة الثانية: المضارع المستمر ودمج المنهج (المستويات 6 إلى 10) ---
    {
      stage: 2, icon: "👨‍🌾",
      answer: "The farmer is growing rice.",
      correct: ["What", "is", "the", "farmer", "growing", "?"],
      blocks: ["What", "is", "the", "farmer", "growing", "?"]
    },
    {
      stage: 2, icon: "🦢",
      answer: "The pelican is eating a fish.",
      correct: ["What", "is", "the", "pelican", "eating", "?"],
      blocks: ["What", "is", "the", "pelican", "eating", "?"]
    },
    {
      stage: 2, icon: "⚽",
      answer: "The children are playing football.",
      correct: ["What", "are", "the", "children", "playing", "?"],
      blocks: ["What", "are", "the", "children", "playing", "?"]
    },
    {
      stage: 2, icon: "🐪",
      answer: "The camel is walking in the desert.",
      correct: ["Where", "is", "the", "camel", "walking", "?"],
      blocks: ["Where", "is", "the", "camel", "walking", "?"]
    },
    {
      stage: 2, icon: "🏥",
      answer: "The doctor is working in the hospital.",
      correct: ["Where", "is", "the", "doctor", "working", "?"],
      blocks: ["Where", "is", "the", "doctor", "working", "?"]
    },

    // --- المرحلة الثالثة: الأفعال المساعدة الخفية والتحدي النحوي (المستويات 11 إلى 15) ---
    {
      stage: 3, icon: "🏫",
      answer: "Ahmed went to school.",
      correct: ["Where", "did", "Ahmed", "go", "?"],
      blocks: ["Where", "did", "Ahmed", "go", "?", "does"]
    },
    {
      stage: 3, icon: "🕖",
      answer: "The movie starts at 7 PM.",
      correct: ["When", "does", "the", "movie", "start", "?"],
      blocks: ["When", "does", "the", "movie", "start", "?"]
    },
    {
      stage: 3, icon: "🦊",
      answer: "Foxes live in the desert.",
      correct: ["Where", "do", "foxes", "live", "?"],
      blocks: ["Where", "do", "foxes", "live", "?", "did"]
    },
    {
      stage: 3, icon: "🌬️",
      answer: "We breathe air.",
      correct: ["What", "do", "we", "breathe", "?"],
      blocks: ["What", "do", "we", "breathe", "?", "is"]
    },
    {
      stage: 3, icon: "🦅",
      answer: "The eagle has strong wings.",
      correct: ["What", "does", "the", "eagle", "have", "?"],
      blocks: ["What", "does", "the", "eagle", "have", "?", "has"]
    }
  ];

  let idx = 0;

  // دالة نطق النص (Text-to-Speech)
  function speakText(text, event) {
    if (event) event.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // أبطأ قليلاً للوضوح
      utterance.pitch = 1.1; // نبرة ودية
      window.speechSynthesis.speak(utterance);
    }
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function build() {
    const r = ROUNDS[idx];
    const shuffledBlocks = shuffle(r.blocks);
    let builtCount = 0;

    const stageName = r.stage === 1 ? "Stage 1: Basic 'To Be' Questions" : 
                      r.stage === 2 ? "Stage 2: Present Continuous" : 
                                      "Stage 3: Auxiliary Verbs Challenge";

    stage.innerHTML = `
      <style>
        .fq-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px; width: 100%;
          user-select: none; -webkit-user-select: none;
        }
        .fq-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 5px;
        }
        .fq-icon { font-size: 2.5rem; }
        .fq-title { font-weight: 700; color: var(--text-muted); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .fq-answer-box {
          display: flex; align-items: center; gap: 12px;
          background: var(--card-bg); border: 2px solid #E2E8F0; border-radius: 14px;
          padding: 16px 24px; width: min(550px, 95%);
        }
        .fq-answer-text { font-size: 1.15rem; font-weight: 700; color: var(--text-dark); flex: 1; }
        .fq-speak-btn {
          background: white; border: 2px solid var(--primary-blue); border-radius: 50%;
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.2rem; flex-shrink: 0; transition: var(--transition);
        }
        .fq-speak-btn:hover { background: var(--primary-blue); color: white; transform: scale(1.05); }
        .fq-speak-btn:active { transform: scale(0.95); }

        .fq-line {
          width: min(550px, 95%); min-height: 65px; background: #F8FAFC;
          border: 2px dashed #CBD5E0; border-radius: 14px;
          display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
          padding: 12px; transition: var(--transition);
        }
        .fq-line.filled-correctly { border-color: var(--primary-green); background: #F0FFF4; }

        .fq-pool {
          display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
          width: min(550px, 95%); min-height: 60px;
        }

        .fq-chip {
          padding: 12px 18px; border-radius: 10px; background: white;
          border: 2px solid var(--primary-blue); color: var(--primary-blue);
          font-weight: 700; font-size: 1.05rem; cursor: pointer;
          transition: all 0.2s ease; box-shadow: 0 2px 0 #2b6cb0;
        }
        .fq-chip:hover { background: #EBF8FF; transform: translateY(-2px); }
        .fq-chip:active { transform: translateY(0); box-shadow: 0 0 0 #2b6cb0; }
        .fq-chip.used { visibility: hidden; pointer-events: none; opacity: 0; width: 0; padding: 0; margin: 0; border: 0; box-shadow: none; }

        .fq-placed {
          padding: 10px 16px; background: var(--primary-green); color: white;
          border-radius: 8px; font-weight: 700; font-size: 1.05rem;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* Gentle Bounce Back Animation (تغذية راجعة هادئة) */
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
          color: #C05621 !important;
          box-shadow: 0 2px 0 #C05621 !important;
        }
      </style>

      <div class="fq-wrap">
        <div class="fq-header">
          <span class="fq-icon">${r.icon}</span>
          <span class="fq-title">${stageName} &nbsp;|&nbsp; Round ${idx + 1} / ${ROUNDS.length}</span>
        </div>
        
        <p style="color:var(--text-muted); font-weight:600; margin-top: -10px;">Build the QUESTION for this answer:</p>
        
        <div class="fq-answer-box">
          <span class="fq-answer-text">${r.answer}</span>
          <button class="fq-speak-btn" title="Listen to the answer">🔊</button>
        </div>

        <div class="fq-line" id="fq-line"></div>
        <div class="fq-pool" id="fq-pool"></div>
      </div>
    `;

    const line = document.getElementById("fq-line");
    const pool = document.getElementById("fq-pool");

    // ربط حدث النطق الصوتي للإجابة
    const speakBtn = stage.querySelector(".fq-speak-btn");
    speakBtn.addEventListener("click", (e) => speakText(r.answer, e));

    // إنشاء المكعبات (Chips)
    shuffledBlocks.forEach((blockText, i) => {
      const chip = document.createElement("div");
      chip.className = "fq-chip";
      chip.innerText = blockText;
      chip.dataset.text = blockText;
      chip.dataset.id = `chip-${i}`; // معرف فريد لتجنب مشاكل الكلمات المكررة

      chip.addEventListener("click", (e) => {
        // التحقق مما إذا كانت الكلمة المختارة هي الكلمة الصحيحة التالية في التسلسل
        const nextExpectedWord = r.correct[builtCount];
        
        if (blockText === nextExpectedWord) {
          // إجابة صحيحة
          window.GameHub.playSound("correct");
          window.GameHub.triggerVFX(e.clientX, e.clientY);
          
          // إنشاء نسخة من المكعب لوضعها في خط البناء
          const placedChip = document.createElement("span");
          placedChip.className = "fq-placed";
          placedChip.innerText = blockText;
          line.appendChild(placedChip);
          
          // إخفاء المكعب الأصلي من الأسفل
          chip.classList.add("used");
          builtCount++;

          // تحديث شكل خط البناء
          if (builtCount === 1) line.classList.add("filled-correctly");

          // التحقق من اكتمال السؤال
          if (builtCount === r.correct.length) {
            setTimeout(() => {
              idx++;
              if (idx >= ROUNDS.length) {
                window.GameHub.showComplete("Question Master!", "You perfectly formulated every question!");
              } else {
                build();
              }
            }, 1000);
          }
        } else {
          // إجابة خاطئة: تغذية راجعة هادئة (Bounce Back)
          window.GameHub.playSound("wrong");
          chip.classList.add("bounce-anim");
          
          // إزالة تأثير الاهتزاز بعد انتهائه للسماح بتكراره عند الخطأ التالي
          setTimeout(() => {
            chip.classList.remove("bounce-anim");
          }, 400);
        }
      });

      pool.appendChild(chip);
    });
  }

  build();
};