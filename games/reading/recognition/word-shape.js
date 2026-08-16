/**
 * Game 7: Word Silhouette & Letter Boxes
 * Filename: games/read_d1_g7.js
 * Logic: Levels 1-7 use Silhouette style (from different lengths to similar shapes).
 *        Levels 8-15 use Letter Boxes style with baseline reference.
 * Dyslexia Focus: Orthographic mapping and visual shape discrimination.
 */

(function() {
    let currentLevel = 1;
    const totalLevels = 15;
    let score = 0;

    // Structured game data for 15 levels
    const gameData = [
        // --- PHASE 1: Silhouette Style (Levels 1 - 7) ---
        // Levels 1-3: Completely different in length and shape
        { type: 'silhouette', word: "cat", distractor: "elephant" },
        { type: 'silhouette', word: "sun", distractor: "butterfly" },
        { type: 'silhouette', word: "dog", distractor: "mountain" },
        // Levels 4-5: Closer lengths
        { type: 'silhouette', word: "ship", distractor: "apple" },
        { type: 'silhouette', word: "jump", distractor: "bridge" },
        // Levels 6-7: Very similar silhouette shapes
        { type: 'silhouette', word: "boat", distractor: "boot" },
        { type: 'silhouette', word: "book", distractor: "look" },

        // --- PHASE 2: Letter Boxes Style with Baseline (Levels 8 - 15) ---
        // Levels 8-10: Different lengths and clear ascenders/descenders
        { type: 'boxes', word: "fish", distractor: "cat" },
        { type: 'boxes', word: "ball", distractor: "sun" },
        { type: 'boxes', word: "jump", distractor: "dog" },
        // Levels 11-13: Same length, clear difference in long/short letters
        { type: 'boxes', word: "tall", distractor: "bill" },
        { type: 'boxes', word: "cold", distractor: "hold" },
        { type: 'boxes', word: "band", distractor: "hand" },
        // Levels 14-15: Advanced geometric template differentiation (ascender/descender shift)
        { type: 'boxes', word: "bad", distractor: "red" },
        { type: 'boxes', word: "pen", distractor: "ped" }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        
        currentLevel = 1;
        score = 0;
        loadLevel(stage);
    };

    function renderSilhouette(word, isRevealed) {
        return `
            <div class="word-silhouette ${isRevealed ? 'revealed' : 'hidden'}" id="silhouetteTarget">
                ${word}
            </div>
        `;
    }

    function renderLetterBoxes(word, isRevealed) {
        const ascenders = ['b', 'd', 'h', 'k', 'l', 't', 'f'];
        const descenders = ['g', 'j', 'p', 'q', 'y'];
        
        const boxesHtml = word.split('').map(char => {
            let type = 'normal';
            if (ascenders.includes(char)) type = 'ascender';
            else if (descenders.includes(char)) type = 'descender';
            
            return `
                <div class="letter-box ${type} ${isRevealed ? 'revealed' : ''}">
                    <span class="letter-content">${isRevealed ? char : ''}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="letter-boxes-wrapper" id="silhouetteTarget">
                <div class="baseline"></div>
                <div class="letter-boxes-container">
                    ${boxesHtml}
                </div>
            </div>
        `;
    }

    function loadLevel(stage) {
        const data = gameData[currentLevel - 1];
        const choices = [data.word, data.distractor].sort(() => Math.random() - 0.5);
        const isBoxMode = data.type === 'boxes';

        stage.innerHTML = `
            <style>
                .game-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
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
                    padding: 30px;
                    background: #F7FAFC;
                    border-radius: 30px;
                    border: 4px solid #E2E8F0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 180px;
                    width: 100%;
                    position: relative;
                }

                /* Silhouette style */
                .word-silhouette {
                    font-size: 4.5rem;
                    font-weight: 900;
                    letter-spacing: 4px;
                    color: #2D3748;
                    text-shadow: 0 0 12px #2D3748, 0 0 12px #2D3748, 0 0 12px #2D3748;
                    user-select: none;
                    transition: all 0.5s ease;
                }

                .word-silhouette.revealed {
                    color: white;
                    text-shadow: none;
                    background: #48BB78;
                    padding: 5px 25px;
                    border-radius: 15px;
                    font-size: 3.5rem;
                }

                /* Letter Boxes with Baseline style */
                .letter-boxes-wrapper {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 15px 0;
                }

                .baseline {
                    position: absolute;
                    width: 85%;
                    height: 0;
                    border-bottom: 3px dashed #CBD5E0;
                    top: 55%;
                    z-index: 1;
                }

                .letter-boxes-container {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                }

                .letter-box {
                    width: 45px;
                    height: 45px;
                    border: 4px solid #2D3748;
                    background: #EDF2F7;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.4s ease;
                }

                .letter-box.ascender {
                    height: 75px;
                    transform: translateY(-12px);
                }

                .letter-box.descender {
                    height: 75px;
                    transform: translateY(12px);
                }

                .letter-content {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: #2D3748;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .letter-box.revealed {
                    background: #48BB78;
                    border-color: #2F855A;
                }

                .letter-box.revealed .letter-content {
                    opacity: 1;
                    color: white;
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
            </style>

            <div class="game-wrapper">
                <div class="level-indicator">Level ${currentLevel} / ${totalLevels} (${isBoxMode ? 'Letter Boxes' : 'Silhouette'})</div>
                <div class="instruction-text">${isBoxMode ? 'Which word fits these letter boxes?' : 'Which word fits this shape?'}</div>
                
                <div class="silhouette-container">
                    ${isBoxMode ? renderLetterBoxes(data.word, false) : renderSilhouette(data.word, false)}
                </div>

                <div class="choices-container">
                    ${choices.map(choice => `
                        <div class="word-choice" data-word="${choice}">${choice}</div>
                    `).join('')}
                </div>
            </div>
        `;

        const buttons = stage.querySelectorAll('.word-choice');
        const targetElement = document.getElementById('silhouetteTarget');

        buttons.forEach(btn => {
            btn.onclick = (e) => {
                const selected = btn.dataset.word;

                if (selected === data.word) {
                    if (isBoxMode) {
                        stage.querySelector('.silhouette-container').innerHTML = renderLetterBoxes(data.word, true);
                    } else {
                        targetElement.classList.remove('hidden');
                        targetElement.classList.add('revealed');
                    }
                    
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
                                window.GameHub.showComplete("Shape Master!", `You mastered silhouettes and letter boxes! Score: ${score}/${totalLevels}`);
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