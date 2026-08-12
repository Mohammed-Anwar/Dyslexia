/**
 * Game 14: Punctuation Roadblocks (Sentence Traffic)
 * Logic: Drag punctuation signs into missing gaps along a sentence road.
 * Dyslexia Focus: Understanding syntactic boundaries and structural pause markers.
 */

(function() {
    let currentLevel = 0;
    let score = 0;

    const THEME_COLOR = "#FF4500";

    const gameData = [
        {
            parts: ["The dog ran away", ""],
            targetSign: ".",
            options: [".", "?", ","],
            image: "🛑",
            hint: "This sentence tells you something. It needs a full stop."
        },
        {
            parts: ["Where is the cat", ""],
            targetSign: "?",
            options: ["!", "?", "."],
            image: "🚦",
            hint: "This sentence is asking a question."
        },
        {
            parts: ["I like apples", " bananas", " and grapes."],
            targetSign: ",",
            options: [".", "?", ","],
            image: "⚠️",
            hint: "Use a sign to make a short pause between items in a list."
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
        
        stage.innerHTML = `
            <style>
                .traffic-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    font-weight: bold;
                    color: #4A5568;
                }
                
                .road-background {
                    background: #4A5568;
                    width: 100%;
                    padding: 40px 20px;
                    border-radius: 10px;
                    position: relative;
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border-top: 8px solid #A0AEC0;
                    border-bottom: 8px solid #A0AEC0;
                }
                
                /* Dashed line effect */
                .road-background::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: repeating-linear-gradient(90deg, transparent, transparent 20px, #ECC94B 20px, #ECC94B 60px);
                    transform: translateY(-50%);
                    z-index: 0;
                }

                .text-chunk {
                    font-size: 2.5rem;
                    color: white;
                    font-weight: 600;
                    z-index: 1;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    white-space: pre;
                }
                
                .roadblock-gap {
                    width: 60px;
                    height: 60px;
                    background: rgba(0,0,0,0.3);
                    border: 3px dashed #CBD5E0;
                    border-radius: 10px;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .roadblock-gap.filled {
                    border: none;
                    background: transparent;
                }
                
                .sign-tray {
                    display: flex;
                    gap: 30px;
                    margin-top: 40px;
                }
                
                .traffic-sign {
                    width: 70px;
                    height: 70px;
                    background: #E53E3E;
                    border: 4px solid white;
                    border-radius: 50%; /* Default circle */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: bold;
                    color: white;
                    cursor: grab;
                    box-shadow: 0 6px 10px rgba(0,0,0,0.2);
                    touch-action: none;
                    z-index: 10;
                }
                .traffic-sign[data-sign=","] {
                    background: #DD6B20; /* Yield color for comma */
                    border-radius: 10px;
                    transform: rotate(45deg);
                }
                .traffic-sign[data-sign=","] span {
                    transform: rotate(-45deg);
                }
                .traffic-sign:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }

                .hint-box {
                    font-size: 1.2rem;
                    color: #718096;
                    background: #EDF2F7;
                    padding: 10px 20px;
                    border-radius: 8px;
                }
            </style>

            <div class="traffic-container">
                <div class="header">
                    <span>Sentence: ${currentLevel + 1} / ${gameData.length}</span>
                    <span style="color: ${THEME_COLOR}">Score: ${score}</span>
                </div>
                
                <div class="hint-box">${data.image} ${data.hint}</div>
                
                <div class="road-background" id="road">
                    ${data.parts.map((part, i) => `
                        <span class="text-chunk">${part}</span>
                        ${i < data.parts.length - 1 ? `<div class="roadblock-gap" id="gap-${i}"></div>` : ''}
                    `).join('')}
                </div>

                <div class="sign-tray" id="tray">
                    ${data.options.sort(() => Math.random() - 0.5).map((sign, i) => `
                        <div class="traffic-sign" id="sign-${i}" data-sign="${sign}">
                            <span>${sign}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        setupTrafficDrag(stage, data);
    }

    function setupTrafficDrag(stage, data) {
        const signs = stage.querySelectorAll('.traffic-sign');
        const gaps = stage.querySelectorAll('.roadblock-gap');
        let filledGaps = 0;
        const totalGaps = gaps.length;

        signs.forEach(sign => {
            if (window.GameHub?.utils?.makeDraggable) {
                window.GameHub.utils.makeDraggable(sign, (x, y, el) => {
                    let placed = false;
                    
                    gaps.forEach(gap => {
                        const rect = gap.getBoundingClientRect();
                        if (x > rect.left - 20 && x < rect.right + 20 && y > rect.top - 20 && y < rect.bottom + 20) {
                            if (!gap.classList.contains('filled')) {
                                if (el.dataset.sign === data.targetSign) {
                                    handleSuccessPlacement(el, gap);
                                    placed = true;
                                    filledGaps++;
                                } else {
                                    handleCrash(el);
                                    placed = true; // Was dropped here, but wrong
                                }
                            }
                        }
                    });

                    if (!placed && el.resetPosition) el.resetPosition();
                });
            }
        });

        function handleSuccessPlacement(sign, gap) {
            score += 20;
            if (window.GameHub) window.GameHub.playSound('correct');
            
            sign.style.position = 'static';
            sign.style.transform = 'none';
            sign.style.boxShadow = 'none';
            sign.style.width = 'auto';
            sign.style.height = 'auto';
            sign.style.background = 'transparent';
            sign.style.border = 'none';
            sign.style.color = '#ECC94B'; // Turn gold to match road line
            sign.querySelector('span').style.transform = 'none';
            
            gap.appendChild(sign);
            gap.classList.add('filled');
            
            // Re-flow text logic
            gap.style.width = 'auto';

            if (filledGaps === totalGaps) {
                if (window.GameHub) {
                    const rect = document.getElementById('road').getBoundingClientRect();
                    window.GameHub.triggerVFX(rect.left + rect.width/2, rect.top + rect.height/2);
                }
                
                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        currentLevel++;
                        loadLevel(document.querySelector('.traffic-container').parentElement);
                    } else {
                        if (window.GameHub?.showComplete) {
                            window.GameHub.showComplete("Traffic Controller!", `Sentences flow perfectly now. Final Score: ${score}`);
                        }
                    }
                }, 1500);
            }
        }

        function handleCrash(sign) {
            if (window.GameHub) window.GameHub.playSound('wrong');
            sign.style.animation = "shake 0.3s";
            setTimeout(() => {
                sign.style.animation = "none";
                if (sign.resetPosition) sign.resetPosition();
            }, 400);
        }
    }
})();