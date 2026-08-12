/**
 * Game 12: Irregular Word Spotting (Patterns)
 * Logic: Tap the non-phonetic "rule-breaker" letter inside sight words.
 * Dyslexia Focus: Memorizing orthographic exceptions and visual sight words.
 */

(function() {
    let currentLevel = 0;
    let score = 0;
    let foundExceptions = 0;

    const THEME_COLOR = "#FF4500";

    const gameData = [
        {
            word: "SAID",
            trickyIndices: [1, 2], // A and I
            hint: "Which letters sound like 'E' but look different?",
            explanation: "In 'SAID', the 'AI' makes the short 'e' sound!"
        },
        {
            word: "WAS",
            trickyIndices: [1], // A
            hint: "Which letter sounds like a short 'U' or 'O'?",
            explanation: "In 'WAS', the 'A' makes an 'uh' or 'ah' sound!"
        },
        {
            word: "THEY",
            trickyIndices: [2, 3], // E and Y
            hint: "Which letters make the long 'A' sound together?",
            explanation: "In 'THEY', the 'EY' team says 'A'!"
        }
    ];

    window.initGame = function(containerId) {
        const stage = document.getElementById(containerId);
        if (!stage) return;
        currentLevel = 0;
        score = 0;
        loadLevel(stage);
    };

    function loadLevel(stage) {
        const data = gameData[currentLevel];
        foundExceptions = 0;
        
        stage.innerHTML = `
            <style>
                .inspector-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                
                .magnifying-hud {
                    background: #2D3748;
                    width: 100%;
                    padding: 40px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    position: relative;
                    overflow: hidden;
                }
                
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: rgba(255, 69, 0, 0.5);
                    box-shadow: 0 0 15px ${THEME_COLOR};
                    animation: scan 3s linear infinite;
                    pointer-events: none;
                }
                
                .word-display {
                    display: flex;
                    gap: 10px;
                    z-index: 2;
                }
                
                .letter-block {
                    background: #4A5568;
                    color: white;
                    font-size: 5rem;
                    font-weight: 800;
                    width: 80px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    border: 2px solid #718096;
                    cursor: pointer;
                    transition: all 0.3s;
                    user-select: none;
                }
                
                .letter-block:hover {
                    background: #718096;
                    transform: translateY(-5px);
                }
                
                .letter-block.glow-correct {
                    background: ${THEME_COLOR};
                    border-color: #FFA07A;
                    box-shadow: 0 0 20px ${THEME_COLOR};
                    color: white;
                    transform: scale(1.05);
                }
                
                .letter-block.glow-wrong {
                    background: #E53E3E;
                    border-color: #FEB2B2;
                    animation: shake 0.3s;
                }

                .instruction-plate {
                    background: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-weight: bold;
                    color: #2D3748;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    margin-top: -20px;
                    z-index: 10;
                }
                
                .explanation-card {
                    margin-top: 10px;
                    background: #FFF5F5;
                    border-left: 5px solid ${THEME_COLOR};
                    padding: 15px;
                    border-radius: 8px;
                    color: #C05621;
                    font-weight: 600;
                    opacity: 0;
                    transition: opacity 0.5s;
                    text-align: center;
                }

                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            </style>

            <div class="inspector-container">
                <div class="header">
                    <span>Target: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="instruction-plate">🔍 ${data.hint}</div>

                <div class="magnifying-hud">
                    <div class="scan-line"></div>
                    <div class="word-display" id="word-display">
                        ${data.word.split('').map((char, i) => `
                            <div class="letter-block" id="letter-${i}" data-idx="${i}">${char}</div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="explanation-card" id="explanation">${data.explanation}</div>
            </div>
        `;

        setupInteractions(stage, data);
    }

    function setupInteractions(stage, data) {
        const blocks = stage.querySelectorAll('.letter-block');
        const explanation = document.getElementById('explanation');
        let locked = false;

        blocks.forEach(block => {
            block.addEventListener('click', (e) => {
                if (locked || block.classList.contains('glow-correct')) return;
                
                const idx = parseInt(block.dataset.idx);
                
                if (data.trickyIndices.includes(idx)) {
                    block.classList.add('glow-correct');
                    foundExceptions++;
                    score += 15;
                    
                    if (window.GameHub) window.GameHub.playSound('correct');

                    if (foundExceptions === data.trickyIndices.length) {
                        locked = true;
                        explanation.style.opacity = "1";
                        
                        if (window.GameHub) {
                            window.GameHub.playSound('success');
                            const rect = document.getElementById('word-display').getBoundingClientRect();
                            window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
                        }

                        setTimeout(() => {
                            if (currentLevel < gameData.length - 1) {
                                currentLevel++;
                                loadLevel(document.querySelector('.inspector-container').parentElement);
                            } else {
                                if (window.GameHub?.showComplete) {
                                    window.GameHub.showComplete("Rule Breaker Detective!", `You spotted the tricky letters! Final Score: ${score}`);
                                }
                            }
                        }, 3000); // Wait longer so they can read the explanation
                    }
                } else {
                    block.classList.add('glow-wrong');
                    if (window.GameHub) window.GameHub.playSound('wrong');
                    setTimeout(() => block.classList.remove('glow-wrong'), 500);
                }
            });
        });
    }
})();