/**
 * Game 6: Spotlight (التعرف على شكل الحرف في الكلمة)
 * Filename: games/read_d1_g6.js
 * Logic: Highlight a specific target letter within a word.
 * Dyslexia Focus: Letter-in-string identification (preventing crowding/blurring).
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // Word list with target letters
    const gameData = [
        // المستويات 1-5: أحرف كبيرة، تباين بصري واضح، كلمات سهلة
        { word: "BREAD", target: "R" },
        { word: "PLANT", target: "A" },
        { word: "CLOCK", target: "O" },
        { word: "LEMON", target: "M" },
        { word: "JUMP", target: "U" },
        
        // المستويات 6-10: أحرف صغيرة، بداية التداخل البصري
        { word: "banana", target: "b" }, // البحث عن b وسط a, n
        { word: "pepper", target: "r" }, // البحث عن r وسط p, e
        { word: "queue", target: "q" },  // البحث عن q وسط u, e
        { word: "assess", target: "a" }, // البحث عن a وسط s, e
        { word: "scissors", target: "o" }, // البحث عن o وسط s, c, i, r
        
        // المستويات 11-15: الصعوبة القصوى (التفريق بين الأحرف المتشابهة جداً داخل كلمات حقيقية)
        { word: "minimum", target: "n" },     // تحدي m & n: حرف n وحيد وسط ثلاثة m
        { word: "bedbound", target: "d" },    // تحدي b & d: حرف d وحيد وسط حرفي b
        { word: "pipsqueak", target: "q" },   // تحدي p & q: حرف q وحيد وسط حرفي p
        { word: "assassins", target: "n" },   // تحدي التشتت: حرف n وحيد وسط أربعة s
        { word: "illuminate", target: "u" }   // تحدي الخطوط المتوازية: i, l, m, n, u
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];
        const wordArr = data.word.split('');

        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    animation: fadeIn 0.5s ease;
                }

                .instruction-text {
                    font-size: 1.5rem;
                    color: #2D3748;
                    font-weight: 700;
                    text-align: center;
                }

                .target-display {
                    background: #FFF5F5;
                    border: 3px solid #F56565;
                    color: #C53030;
                    font-size: 3rem;
                    font-weight: 900;
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .word-container {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .letter-box {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #4A5568;
                    background: #EDF2F7;
                    width: 65px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                    border: 2px solid transparent;
                }

                .letter-box:hover {
                    background: #E2E8F0;
                    transform: translateY(-2px);
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                .spotlight-active {
                    background: #F56565 !important;
                    color: white !important;
                    border-color: #C53030 !important;
                    box-shadow: 0 0 15px rgba(245, 101, 101, 0.6);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div class="instruction-text">Find the target letter in the word!</div>
                
                <div class="target-display">${data.target}</div>

                <div class="word-container" id="word-container">
                    ${wordArr.map((char, index) => `
                        <div class="letter-box" data-char="${char}" data-index="${index}">${char}</div>
                    `).join('')}
                </div>
            </div>
        `;

        const letterBoxes = stage.querySelectorAll('.letter-box');
        let foundCount = 0;
        const totalTargets = wordArr.filter(c => c === data.target).length;

        letterBoxes.forEach(box => {
            box.onclick = (e) => {
                if (box.classList.contains('spotlight-active')) return;

                if (box.dataset.char === data.target) {
                    box.classList.add('spotlight-active');
                    foundCount++;
                    
                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }

                    if (foundCount === totalTargets) {
                        score++;
                        setTimeout(() => {
                            if (currentLevel < totalLevels) {
                                currentLevel++;
                                loadLevel(stage);
                            } else {
                                if (window.GameHub?.showComplete) {
                                    window.GameHub.showComplete("Letter Detective!", `You found all the letters! Score: ${score}/15`);
                                }
                            }
                        }, 1000);
                    }
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    box.style.background = "#FFF5F5";
                    box.style.borderColor = "#F56565";
                    setTimeout(() => {
                        box.style.background = "#EDF2F7";
                        box.style.borderColor = "transparent";
                    }, 400);
                }
            };
        });
    }
})();