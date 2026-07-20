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
        { word: "APPLE", target: "P" },
        { word: "BANANA", target: "N" },
        { word: "CAT", target: "C" },
        { word: "DOG", target: "G" },
        { word: "FISH", target: "S" },
        { word: "GRAPES", target: "R" },
        { word: "HOUSE", target: "O" },
        { word: "IGLOO", target: "L" },
        { word: "JOKER", target: "K" },
        { word: "KITE", target: "T" },
        { word: "LEMON", target: "M" },
        { word: "MOUSE", target: "U" },
        { word: "NIGHT", target: "H" },
        { word: "ORANGE", target: "A" },
        { word: "PIZZA", target: "Z" }
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