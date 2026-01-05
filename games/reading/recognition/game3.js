/**
 * Game 7: Word Silhouette (التعرف على شكل الكلمة ككل)
 * Filename: games/read_d1_g7.js
 * Logic: Match a word to its physical shape (outline). 
 * Dyslexia Focus: Orthographic mapping and whole-word recognition.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // Word list chosen for distinct shapes (ascenders like 't, l, b' and descenders like 'g, p, y')
    const gameData = [
        { word: "apple", distractor: "ball" },
        { word: "dog", distractor: "cat" },
        { word: "elephant", distractor: "ant" },
        { word: "giraffe", distractor: "lion" },
        { word: "ship", distractor: "car" },
        { word: "butterfly", distractor: "flower" },
        { word: "house", distractor: "home" },
        { word: "mountain", distractor: "hill" },
        { word: "sky", distractor: "sun" },
        { word: "yellow", distractor: "green" },
        { word: "jump", distractor: "run" },
        { word: "balloon", distractor: "ball" },
        { word: "bridge", distractor: "road" },
        { word: "purple", distractor: "blue" },
        { word: "queen", distractor: "king" }
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
        const choices = [data.word, data.distractor].sort(() => Math.random() - 0.5);

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
                    font-size: 1.4rem;
                    color: #2D3748;
                    font-weight: 700;
                    text-align: center;
                }

                .silhouette-container {
                    padding: 40px;
                    background: #F7FAFC;
                    border-radius: 30px;
                    border: 4px solid #E2E8F0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 180px;
                    width: 100%;
                }

                /* This creates a more precise "blocky" outline effect using heavy text-shadow */
                .word-silhouette {
                    font-size: 5rem;
                    font-weight: 900;
                    letter-spacing: 4px;
                    color: #2D3748;
                    /* The shadow "bloats" the letters into a solid shape */
                    text-shadow: 
                        0 0 10px #2D3748,
                        0 0 10px #2D3748,
                        0 0 10px #2D3748;
                    user-select: none;
                    position: relative;
                    transition: all 0.5s ease;
                }

                .word-silhouette.hidden {
                    color: #2D3748;
                }

                .word-silhouette.revealed {
                    color: white;
                    text-shadow: none;
                    background: #48BB78;
                    padding: 5px 25px;
                    border-radius: 15px;
                    font-size: 4rem;
                }

                .choices-container {
                    display: flex;
                    gap: 20px;
                    width: 100%;
                    justify-content: center;
                }

                .word-choice {
                    padding: 15px 30px;
                    font-size: 1.8rem;
                    font-weight: 600;
                    background: white;
                    border: 3px solid #E2E8F0;
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #4A5568;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }

                .word-choice:hover {
                    transform: translateY(-3px);
                    border-color: #4A90E2;
                    color: #4A90E2;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                }

                .level-indicator {
                    font-size: 14px;
                    font-weight: bold;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes correctPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels}</div>
                <div class="instruction-text">Which word fits this shape?</div>
                
                <div class="silhouette-container">
                    <div class="word-silhouette hidden" id="silhouette">${data.word}</div>
                </div>

                <div class="choices-container">
                    ${choices.map(choice => `
                        <div class="word-choice" data-word="${choice}">${choice}</div>
                    `).join('')}
                </div>
            </div>
        `;

        const buttons = stage.querySelectorAll('.word-choice');
        const silhouette = document.getElementById('silhouette');

        buttons.forEach(btn => {
            btn.onclick = (e) => {
                const selected = btn.dataset.word;

                if (selected === data.word) {
                    // Reveal the word in the silhouette
                    silhouette.classList.remove('hidden');
                    silhouette.classList.add('revealed');
                    
                    btn.style.background = "#48BB78";
                    btn.style.color = "white";
                    btn.style.borderColor = "#2F855A";
                    
                    score++;
                    if (window.GameHub) {
                        window.GameHub.triggerVFX(e.clientX, e.clientY);
                        window.GameHub.playSound('correct');
                    }

                    setTimeout(() => {
                        if (currentLevel < totalLevels) {
                            currentLevel++;
                            loadLevel(stage);
                        } else {
                            if (window.GameHub?.showComplete) {
                                window.GameHub.showComplete("Shape Master!", `You recognized all word silhouettes! Score: ${score}/15`);
                            }
                        }
                    }, 1200);
                } else {
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    btn.style.background = "#FFF5F5";
                    btn.style.borderColor = "#F56565";
                    btn.style.transform = "translateX(5px)";
                    setTimeout(() => {
                        btn.style.background = "white";
                        btn.style.borderColor = "#E2E8F0";
                        btn.style.transform = "translateX(0)";
                    }, 400);
                }
            };
        });
    }
})();