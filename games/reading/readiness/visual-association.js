/**
 * Game 3: Visual & Logical Association
 * Filename: games/read_d1_g3.js
 * 15 Levels: 1-5 (Tools Match), 6-10 (Environment Context), 11-15 (Advanced Logic & Distractors)
 */

(function() {
    let score = 0;
    let currentRound = 0;
    const totalRounds = 15;

    // المرحلة الأولى: ارتباط الأدوات والأشياء (التكامل)
    const toolPairs = [
        { prompt: '🔒', match: '🗝️', others: ['🔨', '📱', '🚗'], label: "ابحث عن الأداة المناسبة لفتح هذا!" },
        { prompt: '🖌️', match: '🎨', others: ['📓', '🛒', '🧵'], label: "ماذا نحتاج أيضاً لنرسم؟" },
        { prompt: '✉️', match: '📮', others: ['🗑️', '📦', '🗄️'], label: "أين نضع هذه الرسالة؟" },
        { prompt: '🔌', match: '💡', others: ['🕯️', '🥽', '🚰'], label: "ماذا يكمل هذا؟" },
        { prompt: '🩺', match: '👂', others: ['👁️', '🦷', '🦶'], label: "بماذا نستخدم هذه الأداة؟" }
    ];

    // المرحلة الثانية: السياق والبيئة
    const contextPairs = [
        { prompt: '🌧️', match: '☂️', others: ['☀️', '🕶️', '🧢'], label: "سحابة ماطرة! ماذا نحتاج؟" },
        { prompt: '🐟', match: '🌊', others: ['🎪', '🕸️', '🌲'], label: "أين تعيش هذه السمكة؟" },
        { prompt: '🐦', match: '🌲', others: ['🌊', '🕸️', '🚗'], label: "أين يسكن هذا الطائر؟" },
        { prompt: '🐄', match: '🥛', others: ['🍯', '🥚', '🍞'], label: "ماذا يعطينا هذا الحيوان؟" },
        { prompt: '🐝', match: '🍯', others: ['🥛', '🥩', '🍟'], label: "ماذا تصنع لنا هذه النحلة؟" }
    ];

    // المرحلة الثالثة: الارتباط المنطقي المتقدم مع المشتتات البصرية والدلالية
    const advancedPairs = [
        { prompt: '🏸', match: '🎾', others: ['⚽', '🏀', '⚾'], label: "اختر الكرة المناسبة لهذا المضرب!" },
        { prompt: '🐇', match: '🥕', others: ['⚪', '🧀', '🦴'], label: "ماذا يأكل الأرنب؟" },
        { prompt: '🐭', match: '🧀', others: ['🥨', '🥕', '🐟'], label: "ماذا يأكل الفأر؟" },
        { prompt: '🐶', match: '🦴', others: ['🍡', '🥕', '🧀'], label: "ما هو طعام الكلب المفضل؟" },
        { prompt: '🐒', match: '🍌', others: ['🌙', '🦴', '🥩'], label: "ماذا يأكل القرد؟" }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        stage.innerHTML = ''; 
        currentRound = 0;
        score = 0;

        const gameWrapper = document.createElement('div');
        gameWrapper.style.cssText = `
            display: flex; flex-direction: column; align-items: center;
            width: 100%; max-width: 100%; animation: fadeIn 0.5s ease; user-select: none;
            padding: 10px; box-sizing: border-box; justify-content: flex-start;
            direction: rtl; font-family: 'Tajawal', sans-serif, Arial;
        `;

        const instruction = document.createElement('h2');
        instruction.id = "game-instruction";
        instruction.style.cssText = "margin-bottom: 15px; color: #2D3748; text-align: center; font-size: 1.3rem; width: 100%; min-height: 40px;";

        // منطقة الهدف (الدائرة)
        const promptContainer = document.createElement('div');
        promptContainer.id = "prompt-container";
        promptContainer.style.cssText = `
            background: #F7FAFC; padding: 20px; border-radius: 50%;
            border: 5px solid #4A90E2; margin-bottom: 20px;
            width: 120px; height: 120px; display: flex;
            align-items: center; justify-content: center;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
        `;
        
        const promptIcon = document.createElement('div');
        promptIcon.id = "prompt-icon";
        promptIcon.style.fontSize = "70px";

        promptContainer.appendChild(promptIcon);

        const grid = document.createElement('div');
        grid.id = "game-grid";
        grid.style.cssText = `display: grid; gap: 15px; margin-bottom: 20px; min-height: 220px; align-items: center; justify-content: center; width: 100%; grid-template-columns: repeat(2, 120px);`;

        const stats = document.createElement('div');
        stats.id = "game-stats";
        stats.style.cssText = `
            font-weight: bold; color: #718096; font-size: 1rem; 
            background: #EDF2F7; padding: 10px 25px; border-radius: 50px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 10px;
        `;

        gameWrapper.appendChild(instruction);
        gameWrapper.appendChild(promptContainer);
        gameWrapper.appendChild(grid);
        gameWrapper.appendChild(stats);
        stage.appendChild(gameWrapper);

        nextRound(grid, stats, instruction, promptIcon);
    };

    function nextRound(grid, stats, instruction, promptIcon) {
        if (currentRound >= totalRounds) {
            if (window.GameHub?.showComplete) {
                window.GameHub.showComplete("بطل الربط المنطقي!", `لقد أنهيت جميع المراحل بذكاء! النتيجة: ${score} / ${totalRounds}`);
            }
            return;
        }

        currentRound++;
        grid.innerHTML = '';
        stats.innerText = `المستوى: ${currentRound} / ${totalRounds} | النتيجة: ${score}`;

        let currentPair;
        if (currentRound <= 5) {
            currentPair = toolPairs[currentRound - 1];
        } else if (currentRound <= 10) {
            currentPair = contextPairs[currentRound - 6];
        } else {
            currentPair = advancedPairs[currentRound - 11];
        }

        instruction.innerText = currentPair.label;
        promptIcon.innerText = currentPair.prompt;
        
        // إعادة تفعيل الأنيمشن
        promptIcon.style.animation = 'none';
        promptIcon.offsetHeight; /* trigger reflow */
        promptIcon.style.animation = "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

        const matchVal = currentPair.match;
        let options = [
            { text: matchVal, isCorrect: true },
            ...currentPair.others.slice(0, 3).map(o => ({ text: o, isCorrect: false }))
        ];
        
        // خلط الخيارات
        options = options.sort(() => 0.5 - Math.random());

        options.forEach((opt) => {
            const card = createCard(opt.text);
            card.onclick = (e) => {
                if (opt.isCorrect) onCorrect(e, card, grid);
                else onWrong(card);
            };
            grid.appendChild(card);
        });
    }

    function createCard(symbol) {
        const card = document.createElement('button');
        card.innerText = symbol;
        card.style.cssText = `
            font-size: 45px; width: 110px; height: 110px;
            border: 3px solid #E2E8F0; border-radius: 24px;
            background: white; cursor: pointer; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); outline: none; margin: auto;
        `;
        card.onmouseenter = () => card.style.transform = "scale(1.05)";
        card.onmouseleave = () => card.style.transform = "scale(1)";
        return card;
    }

    function onCorrect(e, card, grid) {
        score++;
        if (window.GameHub) {
            window.GameHub.triggerVFX(e.clientX, e.clientY);
            window.GameHub.playSound('correct');
        }
        card.style.background = "#C6F6D5";
        card.style.borderColor = "#48BB78";
        card.style.transform = "scale(1.1)";
        
        // تعطيل الأزرار لمنع النقر المتعدد
        grid.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
        
        setTimeout(() => {
            nextRound(
                document.getElementById('game-grid'), 
                document.getElementById('game-stats'), 
                document.getElementById('game-instruction'),
                document.getElementById('prompt-icon')
            );
        }, 1000);
    }

    function onWrong(card) {
        if (window.GameHub) window.GameHub.playSound('wrong');
        card.style.animation = "shake 0.4s";
        card.style.background = "#FFF5F5";
        card.style.borderColor = "#F56565";
        
        setTimeout(() => {
            card.style.animation = "";
            card.style.background = "white";
            card.style.borderColor = "#E2E8F0";
        }, 400);
    }

    // إضافة التنسيقات الخاصة بالحركة إذا لم تكن موجودة
    if (!document.getElementById('game-vfx-styles')) {
        const style = document.createElement('style');
        style.id = 'game-vfx-styles';
        style.innerHTML = `
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); opacity: 1; }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
})();